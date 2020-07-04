<template>
  <div
    class="virtual-scroll"
    :class="{
      ready,
      'page-mode': pageMode,
      [`direction-${direction}`]: true
    }"
    @scroll.passive="handleScroll"
  >
    <div v-if="$slots.before" class="virtual-scroll__slot">
      <slot name="before" />
    </div>

    <div
      ref="wrapper"
      :style="{
        [direction === 'vertical' ? 'minHeight' : 'minWidth']: totalSize + 'px'
      }"
      class="virtual-scroll__item-wrapper"
    >
      <div
        v-for="view of pool"
        :key="view.nr.id"
        :style="
          ready
            ? {
                transform: `translate${direction === 'vertical' ? 'Y' : 'X'}(${view.position}px)`
              }
            : null
        "
        class="virtual-scroll__item-view"
        :class="{ hover: hoverKey === view.nr.key }"
        @mouseenter="hoverKey = view.nr.key"
        @mouseleave="hoverKey = null"
      >
        <slot :item="view.item" :index="view.nr.index" :active="view.nr.used" />
      </div>
    </div>

    <div v-if="$slots.after" class="virtual-scroll__slot">
      <slot name="after" />
    </div>
  </div>
</template>

<script>
/*
 * @Author: 焦质晔
 * @Date: 2020-02-25 20:12:30
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-23 16:46:17
 */
import { scrollParent } from './utils';

let uid = 0;

export default {
  name: 'VirtualScroll',

  props: {
    // 显示的数据列表
    items: {
      type: Array,
      required: true
    },
    // 标识和优化渲染视图的字段
    keyField: {
      type: String,
      default: 'id'
    },
    // 滚动方向
    direction: {
      type: String,
      default: 'vertical',
      validator: value => ['vertical', 'horizontal'].includes(value)
    },
    // 行项的元素高度（水平模式下为宽度），用于计算滚动尺寸和位置
    itemSize: {
      type: Number,
      default: null
    },
    // 如果行项的高度（或水平模式下的宽度）未知，则使用的最小尺寸
    minItemSize: {
      type: [Number, String],
      default: null
    },
    // 用于在可变尺寸模式下获取行项尺寸的字段
    sizeField: {
      type: String,
      default: 'size'
    },
    //
    typeField: {
      type: String,
      default: 'type'
    },
    // 添加到滚动可见区域边缘的像素值，以开始在更远的位置渲染项目
    buffer: {
      type: Number,
      default: 200
    },
    // 是否启用页面模式
    pageMode: {
      type: Boolean,
      default: false
    },
    // 服务器端渲染（SSR）渲染固定数量的项目
    prerender: {
      type: Number,
      default: 0
    },
    // 每次更新虚拟滚动条内容时都会发出一个事件（可能会影响性能）
    emitUpdate: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      pool: [],
      totalSize: 0,
      ready: false,
      hoverKey: null
    };
  },

  computed: {
    sizes() {
      if (this.itemSize === null) {
        const sizes = {
          '-1': { accumulator: 0 }
        };
        const items = this.items;
        const field = this.sizeField;
        const minItemSize = this.minItemSize;
        let accumulator = 0;
        let current;
        for (let i = 0, l = items.length; i < l; i++) {
          current = items[i][field] || minItemSize;
          accumulator += current;
          sizes[i] = { accumulator, size: current };
        }
        return sizes;
      }
      return [];
    },

    simpleArray() {
      return this.items.length && typeof this.items[0] !== 'object';
    }
  },

  watch: {
    items() {
      this.updateVisibleItems(true);
    },

    pageMode() {
      this.applyPageMode();
      this.updateVisibleItems(false);
    },

    sizes: {
      handler() {
        this.updateVisibleItems(false);
      },
      deep: true
    }
  },

  created() {
    this.$_startIndex = 0;
    this.$_endIndex = 0;
    this.$_views = new Map();
    this.$_unusedViews = new Map();
    this.$_scrollDirty = false;

    if (this.$isServer) {
      this.updateVisibleItems(false);
    }
  },

  mounted() {
    this.applyPageMode();
    this.$nextTick(() => {
      this.updateVisibleItems(true);
      this.ready = true;
    });
  },

  destroyed() {
    this.removeListeners();
  },

  methods: {
    addView(pool, index, item, key, type) {
      const view = {
        item,
        position: 0
      };
      const nonReactive = {
        id: uid++,
        index,
        used: true,
        key,
        type
      };
      Object.defineProperty(view, 'nr', {
        configurable: false,
        value: nonReactive
      });
      pool.push(view);
      return view;
    },

    unuseView(view, fake = false) {
      const unusedViews = this.$_unusedViews;
      const type = view.nr.type;
      let unusedPool = unusedViews.get(type);
      if (!unusedPool) {
        unusedPool = [];
        unusedViews.set(type, unusedPool);
      }
      unusedPool.push(view);
      if (!fake) {
        view.nr.used = false;
        view.position = -9999;
        this.$_views.delete(view.nr.key);
      }
    },

    handleResize() {
      this.$emit('resize');
      if (this.ready) this.updateVisibleItems(false);
    },

    handleScroll(event) {
      if (!this.$_scrollDirty) {
        this.$_scrollDirty = true;
        requestAnimationFrame(() => {
          this.$_scrollDirty = false;
          const { continuous } = this.updateVisibleItems(false);

          // It seems sometimes chrome doesn't fire scroll event :/
          // When non continous scrolling is ending, we force a refresh
          if (!continuous) {
            clearTimeout(this.$_refreshTimout);
            this.$_refreshTimout = setTimeout(this.handleScroll, 100);
          }
        });
      }
    },

    handleVisibilityChange(isVisible, entry) {
      if (this.ready) {
        if (isVisible || entry.boundingClientRect.width !== 0 || entry.boundingClientRect.height !== 0) {
          this.$emit('visible');
          requestAnimationFrame(() => {
            this.updateVisibleItems(false);
          });
        } else {
          this.$emit('hidden');
        }
      }
    },

    updateVisibleItems(checkItem) {
      const itemSize = this.itemSize;
      const typeField = this.typeField;
      const keyField = this.simpleArray ? null : this.keyField;
      const items = this.items;
      const count = items.length;
      const sizes = this.sizes;
      const views = this.$_views;
      let unusedViews = this.$_unusedViews;
      const pool = this.pool;
      let startIndex, endIndex;
      let totalSize;

      if (!count) {
        startIndex = endIndex = totalSize = 0;
      } else if (this.$isServer) {
        startIndex = 0;
        endIndex = this.prerender;
        totalSize = null;
      } else {
        const scroll = this.getScroll();
        const buffer = this.buffer;
        scroll.start -= buffer;
        scroll.end += buffer;

        // Variable size mode
        if (itemSize === null) {
          let h;
          let a = 0;
          let b = count - 1;
          let i = ~~(count / 2);
          let oldI;

          // Searching for startIndex
          do {
            oldI = i;
            h = sizes[i].accumulator;
            if (h < scroll.start) {
              a = i;
            } else if (i < count - 1 && sizes[i + 1].accumulator > scroll.start) {
              b = i;
            }
            i = ~~((a + b) / 2);
          } while (i !== oldI);
          i < 0 && (i = 0);
          startIndex = i;

          // For container style
          totalSize = sizes[count - 1].accumulator;

          // Searching for endIndex
          for (endIndex = i; endIndex < count && sizes[endIndex].accumulator < scroll.end; endIndex++);
          if (endIndex === -1) {
            endIndex = items.length - 1;
          } else {
            endIndex++;
            // Bounds
            endIndex > count && (endIndex = count);
          }
        } else {
          // Fixed size mode
          startIndex = ~~(scroll.start / itemSize);
          endIndex = Math.ceil(scroll.end / itemSize);

          // Bounds
          startIndex < 0 && (startIndex = 0);
          endIndex > count && (endIndex = count);

          totalSize = count * itemSize;
        }
      }

      if (endIndex - startIndex > 1000) {
        this.itemsLimitError();
      }

      this.totalSize = totalSize;

      let view;

      const continuous = startIndex <= this.$_endIndex && endIndex >= this.$_startIndex;
      let unusedIndex;

      if (this.$_continuous !== continuous) {
        if (continuous) {
          views.clear();
          unusedViews.clear();
          for (let i = 0, l = pool.length; i < l; i++) {
            view = pool[i];
            this.unuseView(view);
          }
        }
        this.$_continuous = continuous;
      } else if (continuous) {
        for (let i = 0, l = pool.length; i < l; i++) {
          view = pool[i];
          if (view.nr.used) {
            // Update view item index
            if (checkItem) {
              view.nr.index = items.findIndex(item => (keyField ? item[keyField] === view.item[keyField] : item === view.item));
            }

            // Check if index is still in visible range
            if (view.nr.index === -1 || view.nr.index < startIndex || view.nr.index >= endIndex) {
              this.unuseView(view);
            }
          }
        }
      }

      if (!continuous) {
        unusedIndex = new Map();
      }

      let item, type, unusedPool;
      let v;
      for (let i = startIndex; i < endIndex; i++) {
        item = items[i];
        const key = keyField ? item[keyField] : item;
        if (key == null) {
          throw new Error(`Key is ${key} on item (keyField is '${keyField}')`);
        }
        view = views.get(key);

        if (!itemSize && !sizes[i].size) {
          if (view) this.unuseView(view);
          continue;
        }

        // No view assigned to item
        if (!view) {
          type = item[typeField];

          if (continuous) {
            unusedPool = unusedViews.get(type);
            // Reuse existing view
            if (unusedPool && unusedPool.length) {
              view = unusedPool.pop();
              view.item = item;
              view.nr.used = true;
              view.nr.index = i;
              view.nr.key = key;
              view.nr.type = type;
            } else {
              view = this.addView(pool, i, item, key, type);
            }
          } else {
            unusedPool = unusedViews.get(type);
            v = unusedIndex.get(type) || 0;
            // Use existing view
            // We don't care if they are already used
            // because we are not in continous scrolling
            if (unusedPool && v < unusedPool.length) {
              view = unusedPool[v];
              view.item = item;
              view.nr.used = true;
              view.nr.index = i;
              view.nr.key = key;
              view.nr.type = type;
              unusedIndex.set(type, v + 1);
            } else {
              view = this.addView(pool, i, item, key, type);
              this.unuseView(view, true);
            }
            v++;
          }
          views.set(key, view);
        } else {
          view.nr.used = true;
          view.item = item;
        }

        // Update position
        if (itemSize === null) {
          view.position = sizes[i - 1].accumulator;
        } else {
          view.position = i * itemSize;
        }
      }

      this.$_startIndex = startIndex;
      this.$_endIndex = endIndex;

      if (this.emitUpdate) this.$emit('update', startIndex, endIndex);

      return {
        continuous
      };
    },

    getListenerTarget() {
      let target = scrollParent(this.$el);
      // Fix global scroll target for Chrome and Safari
      if (window.document && (target === window.document.documentElement || target === window.document.body)) {
        target = window;
      }
      return target;
    },

    getScroll() {
      const { $el: el, direction } = this;
      const isVertical = direction === 'vertical';
      let scrollState;

      if (this.pageMode) {
        const bounds = el.getBoundingClientRect();
        const boundsSize = isVertical ? bounds.height : bounds.width;
        let start = -(isVertical ? bounds.top : bounds.left);
        let size = isVertical ? window.innerHeight : window.innerWidth;
        if (start < 0) {
          size += start;
          start = 0;
        }
        if (start + size > boundsSize) {
          size = boundsSize - start;
        }
        scrollState = {
          start,
          end: start + size
        };
      } else if (isVertical) {
        scrollState = {
          start: el.scrollTop,
          end: el.scrollTop + el.clientHeight
        };
      } else {
        scrollState = {
          start: el.scrollLeft,
          end: el.scrollLeft + el.clientWidth
        };
      }

      return scrollState;
    },

    applyPageMode() {
      if (this.pageMode) {
        this.addListeners();
      } else {
        this.removeListeners();
      }
    },

    addListeners() {
      this.listenerTarget = this.getListenerTarget();
      this.listenerTarget.addEventListener('scroll', this.handleScroll, false);
      this.listenerTarget.addEventListener('resize', this.handleResize);
    },

    removeListeners() {
      if (!this.listenerTarget) {
        return;
      }

      this.listenerTarget.removeEventListener('scroll', this.handleScroll);
      this.listenerTarget.removeEventListener('resize', this.handleResize);

      this.listenerTarget = null;
    },

    scrollToItem(index) {
      let scroll;
      if (this.itemSize === null) {
        scroll = index > 0 ? this.sizes[index - 1].accumulator : 0;
      } else {
        scroll = index * this.itemSize;
      }
      this.scrollToPosition(scroll);
    },

    scrollToPosition(position) {
      if (this.direction === 'vertical') {
        this.$el.scrollTop = position;
      } else {
        this.$el.scrollLeft = position;
      }
    },

    itemsLimitError() {
      setTimeout(() => {
        console.log(`It seems the scroller element isn't scrolling, so it tries to render all the items at once.`, 'Scroller:', this.$el);
        console.log(
          `Make sure the scroller has a fixed height (or width) and 'overflow-y' (or 'overflow-x') set to 'auto' so it can scroll correctly and only render the items visible in the scroll viewport.`
        );
      });
      throw new Error('Rendered items limit reached');
    }
  }
};
</script>
