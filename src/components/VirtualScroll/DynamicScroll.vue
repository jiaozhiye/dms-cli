<template>
  <VirtualScroll
    ref="scroller"
    :items="itemsWithSize"
    :min-item-size="minItemSize"
    :direction="direction"
    key-field="id"
    v-bind="$attrs"
    @resize="onScrollerResize"
    @visible="onScrollerVisible"
    v-on="listeners"
  >
    <template slot-scope="{ item: itemWithSize, index, active }">
      <slot
        v-bind="{
          item: itemWithSize.item,
          index,
          active,
          itemWithSize
        }"
      />
    </template>
    <template slot="before">
      <slot name="before" />
    </template>
    <template slot="after">
      <slot name="after" />
    </template>
  </VirtualScroll>
</template>

<script>
/*
 * @Author: 焦质晔
 * @Date: 2020-02-25 20:12:30
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-02-26 01:20:51
 */
import VirtualScroll from './VirtualScroll.vue';

export default {
  name: 'DynamicScroll',

  components: {
    VirtualScroll
  },

  inheritAttrs: false,

  provide() {
    return {
      vscrollData: this.vscrollData,
      vscrollParent: this
    };
  },

  props: {
    items: {
      type: Array,
      required: true
    },

    keyField: {
      type: String,
      default: 'id'
    },

    direction: {
      type: String,
      default: 'vertical',
      validator: value => ['vertical', 'horizontal'].includes(value)
    },

    minItemSize: {
      type: [Number, String],
      required: true
    }
  },

  data() {
    return {
      vscrollData: {
        active: true,
        sizes: {},
        validSizes: {},
        keyField: this.keyField,
        simpleArray: false
      }
    };
  },

  computed: {
    simpleArray() {
      return this.items.length && typeof this.items[0] !== 'object';
    },

    itemsWithSize() {
      const result = [];
      const { items, keyField, simpleArray } = this;
      const sizes = this.vscrollData.sizes;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const id = simpleArray ? i : item[keyField];
        let size = sizes[id];
        if (typeof size === 'undefined' && !this.$_undefinedMap[id]) {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.$_undefinedSizes++;
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.$_undefinedMap[id] = true;
          size = 0;
        }
        result.push({ item, id, size });
      }
      return result;
    },

    listeners() {
      const listeners = {};
      for (const key in this.$listeners) {
        if (key !== 'resize' && key !== 'visible') {
          listeners[key] = this.$listeners[key];
        }
      }
      return listeners;
    }
  },

  watch: {
    items() {
      this.forceUpdate(false);
    },

    simpleArray: {
      handler(value) {
        this.vscrollData.simpleArray = value;
      },
      immediate: true
    },

    direction(value) {
      this.forceUpdate(true);
    }
  },

  created() {
    this.$_updates = [];
    this.$_undefinedSizes = 0;
    this.$_undefinedMap = {};
  },

  activated() {
    this.vscrollData.active = true;
  },

  deactivated() {
    this.vscrollData.active = false;
  },

  methods: {
    onScrollerResize() {
      const scroller = this.$refs.scroller;
      if (scroller) {
        this.forceUpdate();
      }
      this.$emit('resize');
    },

    onScrollerVisible() {
      this.$emit('vscroll:update', { force: false });
      this.$emit('visible');
    },

    forceUpdate(clear = true) {
      if (clear || this.simpleArray) {
        this.vscrollData.validSizes = {};
      }
      this.$emit('vscroll:update', { force: true });
    },

    scrollToItem(index) {
      const scroller = this.$refs.scroller;
      if (scroller) scroller.scrollToItem(index);
    },

    getItemSize(item, index = undefined) {
      const id = this.simpleArray ? (index != null ? index : this.items.indexOf(item)) : item[this.keyField];
      return this.vscrollData.sizes[id] || 0;
    },

    scrollToBottom() {
      if (this.$_scrollingToBottom) return;
      this.$_scrollingToBottom = true;
      const el = this.$el;
      // Item is inserted to the DOM
      this.$nextTick(() => {
        // Item sizes are computed
        const cb = () => {
          el.scrollTop = el.scrollHeight;
          if (this.$_undefinedSizes === 0) {
            this.$_scrollingToBottom = false;
          } else {
            requestAnimationFrame(cb);
          }
        };
        requestAnimationFrame(cb);
      });
    }
  }
};
</script>
