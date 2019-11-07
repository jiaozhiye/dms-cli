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
    containerStyle: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {};
  },
  render() {
    const { $slots, visible, placement, containerStyle } = this;
    const boxStyle = {
      ...containerStyle,
      [placement]: 0
    };
    return (
      <div class="wrapper">
        {$slots['default']}
        <transition name="el-zoom-in-top">
          <div v-show={visible} class="content" style={boxStyle} onClick={ev => ev.stopPropagation()} onMousedown={ev => ev.stopPropagation()}>
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
