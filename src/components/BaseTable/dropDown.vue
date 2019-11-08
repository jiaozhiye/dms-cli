<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 10:00:00
 **/
export default {
  name: 'DropDown',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    placement: {
      type: String,
      default: 'right'
    },
    boundaries: {
      type: Number
    },
    offsetLeft: {
      type: Number,
      default: 0
    },
    boundariesElement: {
      type: null
    },
    containerStyle: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      offsetX: 0
    };
  },
  watch: {
    visible(val) {
      if (!val) return;
      this.$nextTick(() => this.calcPanelOffset());
    }
  },
  methods: {
    getElementWidth(el) {
      return el ? el.offsetWidth : 0;
    },
    calcPanelOffset() {
      const res = this.offsetLeft + this.getElementWidth(this.$refs['panel']) - this.getElementWidth(this.boundariesElement);
      if (res > 0) {
        this.offsetX = res + 2;
      } else {
        this.offsetX = 0;
      }
    }
  },
  render() {
    const { $slots, visible, offsetX, placement, containerStyle } = this;
    const boxStyle = {
      ...containerStyle,
      [placement]: 0,
      marginLeft: `${-1 * offsetX}px`
    };
    return (
      <div class="wrapper">
        {$slots['default']}
        <transition name="el-zoom-in-top">
          <div ref="panel" v-show={visible} class="content" style={boxStyle} onClick={ev => ev.stopPropagation()} onMousedown={ev => ev.stopPropagation()}>
            {$slots['content']}
          </div>
        </transition>
      </div>
    );
  }
};
</script>

<style lang="less" scoped>
.wrapper {
  display: inline-block;
  padding: 0;
  position: relative;
  overflow: visible;
  .content {
    position: absolute;
    background-color: #fff;
    border-radius: @borderRadius;
    box-shadow: @boxShadow;
    cursor: default;
    z-index: 9;
  }
}
</style>
