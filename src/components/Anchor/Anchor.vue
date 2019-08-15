<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-05-06 10:00:00
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-05-07 11:00:00
 **/
export default {
  name: 'Anchor',
  props: {
    labelList: {
      type: Array,
      default() {
        return [];
      }
    },
    activeId: {
      type: String,
      default: ''
    },
    labelWidth: {
      type: [String, Number],
      default: 80
    }
  },
  data() {
    this.scroll = null;
    this.posArr = [];
    this.state = 'ready'; // 状态变量
    return {
      activeKey: this.createActiveKey()
    };
  },
  methods: {
    createActiveKey() {
      let key = this.activeId;
      if (!key && this.labelList.length) {
        key = this.labelList[0].id;
      }
      return key;
    },
    findCurIndex(t) {
      let top = Math.abs(t);
      let index = -1;
      for (let i = 0; i < this.posArr.length; i++) {
        let t1 = this.posArr[i];
        let t2 = this.posArr[i + 1] || 10000;
        if (top >= t1 && top < t2) {
          index = i;
        }
      }
      return index;
    },
    syncLabelKey(index) {
      this.activeKey = this.labelList[index].id;
    },
    clickHandle(e, key) {
      e.stopPropagation();
      this.state = 'stop';
      this.activeKey = key;
      if (this.isIE()) {
        this.scroll.scrollTop = document.getElementById(key).offsetTop;
      } else {
        this.scroll.scrollTo({ top: document.getElementById(key).offsetTop, behavior: 'smooth' });
        setTimeout(() => {
          this.state = 'ready';
        }, 400);
      }
    },
    setPositionArr() {
      this.posArr = this.labelList.map(x => document.getElementById(x.id).offsetTop);
    },
    // 函数防抖
    debounce(fn, delay) {
      return function(...args) {
        fn.timer && clearTimeout(fn.timer);
        fn.timer = setTimeout(() => fn.apply(this, args), delay);
      };
    },
    bindScrollEvent() {
      this.scroll.addEventListener('scroll', this.scrollEventHandle, false);
    },
    scrollEventHandle(e) {
      this.debounce(this.moveHandle, 20)(e);
    },
    createScrollDom() {
      this.scroll = this.$refs.scroll;
    },
    moveHandle(e) {
      if (this.state !== 'ready') return;
      let index = this.findCurIndex(e.target.scrollTop);
      if (index === -1) return;
      this.syncLabelKey(index);
    },
    createLabel() {
      if (!this.labelList.length) return null;
      const LabelItems = this.labelList.map(x => (
        <li key={x.id} href={`#/${x.id}`} class={{ selected: this.activeKey === x.id }} onClick={e => this.clickHandle(e, x.id)}>
          {x.title}
        </li>
      ));
      return (
        <div key="label" class="labels" style={{ width: `${this.labelWidth}px` }}>
          {LabelItems}
        </div>
      );
    },
    isIE() {
      return !!window.ActiveXObject || 'ActiveXObject' in window;
    },
    // 组件向外公开露的方法
    REFRESH() {
      this.setPositionArr();
    }
  },
  mounted() {
    this.createScrollDom();
    this.setPositionArr();
    this.bindScrollEvent();
  },
  beforeDestroy() {
    // 移除事件监听
    this.scroll.removeEventListener('scroll', this.scrollEventHandle);
  },
  render() {
    return (
      <div class="anchor-wrap">
        {this.createLabel()}
        <div class="scroll-wrapper" ref="scroll">
          {this.$slots['default']}
        </div>
      </div>
    );
  }
};
</script>

<style lang="less">
.anchor-wrap {
  height: 100%;
  display: flex;
  flex-direction: row;
  .labels {
    width: 80px;
    height: 100%;
    margin-right: 10px;
    border-right: 1px solid #d9d9d9;
    li {
      list-style: none;
      height: 40px;
      line-height: 40px;
      padding-right: 15px;
      text-align: right;
      position: relative;
      cursor: pointer;
      &.selected {
        color: #bb0a30;
        &::after {
          content: '';
          position: absolute;
          right: -2px;
          top: 0;
          width: 2px;
          height: 100%;
          background-color: #bb0a30;
        }
      }
    }
  }
  .scroll-wrapper {
    flex: 1;
    margin-right: -10px;
    padding-right: 10px;
    height: 100%;
    position: relative;
    overflow-x: hidden !important;
    overflow-y: auto;
  }
}
</style>
