<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-05-06 10:00:00
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-05-07 11:00:00
 **/
import Scroll from './scroll';

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
    init() {
      this.scroll = new Scroll(this.$refs.scroll, {
        click: true,
        scrollX: false,
        scrollY: true,
        mouseWheel: {
          speed: 2,
          invert: false,
          easeTime: 300
        },
        probeType: 3
      });
      this.scroll.on('scroll', ({ y }) => {
        if (this.state === 'stop') return;
        let index = this.findCurIndex(y);
        if (index === -1) return;
        this.syncLabelKey(index);
      });
      this.scroll.on('scrollEnd', ({ y }) => {
        this.state = 'ready';
      });
    },
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
      this.scroll.scrollToElement(document.getElementById(key), 300);
    },
    setPositionArr() {
      this.posArr = this.labelList.map(x => document.getElementById(x.id).offsetTop);
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
    }
  },
  mounted() {
    this.init();
    this.setPositionArr();
  },
  beforeDestroy() {
    // 移除事件监听
    this.scroll.off('scroll');
    this.scroll.off('scrollEnd');
    // 销毁滚动对象
    this.scroll.destroy();
  },
  render() {
    return (
      <div class="anchor-wrap">
        {this.createLabel()}
        <div class="scroll-wrapper" ref="scroll">
          <div class="scroll-content">{this.$slots['default']}</div>
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
    height: 100%;
    position: relative;
    overflow: hidden !important;
  }
}
</style>
