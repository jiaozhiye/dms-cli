<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 10:00:00
 **/
export default {
  name: 'Spin',
  props: {
    delay: {
      type: Number,
      default: 100
    },
    spinning: {
      type: Boolean,
      required: true,
      default: false
    },
    tip: {
      type: String,
      default: ''
    },
    containerStyle: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    this.timer = null;
    return {
      sSpinning: false
    };
  },
  watch: {
    spinning: {
      handler(val) {
        this.stopHandle();
        if (!val) {
          this.sSpinning = false;
        } else {
          this.timer = setTimeout(() => (this.sSpinning = true), this.delay);
        }
      },
      immediate: true
    }
  },
  methods: {
    stopHandle() {
      this.timer && clearTimeout(this.timer);
    },
    renderIndicator() {
      return (
        <span class="spin-dot spin-dot-spin">
          <i />
          <i />
          <i />
          <i />
        </span>
      );
    }
  },
  beforeDestroy() {
    this.stopHandle();
  },
  render() {
    const { sSpinning, tip, containerStyle, $slots } = this;
    const spinClassName = {
      'spin-spinning': sSpinning,
      'spin-show-text': !!tip
    };
    const spinElement = (
      <div key="loading" class={spinClassName}>
        {this.renderIndicator()}
        {tip ? <div class="spin-text">{tip}</div> : null}
      </div>
    );
    const containerClassName = {
      'spin-container': true,
      'spin-blur': sSpinning
    };
    // 外层容器 style 样式
    const wrapperStyle = sSpinning ? containerStyle : null;
    return (
      <div class="spin-nested-loading" style={wrapperStyle}>
        {sSpinning && spinElement}
        {Object.keys($slots).map(name => (
          <div key={name} class={containerClassName}>
            {$slots[name]}
          </div>
        ))}
      </div>
    );
  }
};
</script>

<style lang="less" scoped>
.spin-nested-loading {
  position: relative;
  .spin-spinning {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    max-height: 400px;
    z-index: 9;
    .spin-dot {
      position: absolute;
      top: 50%;
      left: 50%;
      font-size: 20px;
      width: 20px;
      height: 20px;
      margin: -10px;
      i {
        width: 9px;
        height: 9px;
        border-radius: 100%;
        background-color: @primaryColor;
        transform: scale(0.75);
        display: block;
        position: absolute;
        opacity: 0.3;
        animation: antSpinMove 1s infinite linear alternate;
        transform-origin: 50% 50%;
        &:nth-child(1) {
          left: 0;
          top: 0;
        }
        &:nth-child(2) {
          right: 0;
          top: 0;
          animation-delay: 0.4s;
        }
        &:nth-child(3) {
          right: 0;
          bottom: 0;
          animation-delay: 0.8s;
        }
        &:nth-child(4) {
          left: 0;
          bottom: 0;
          animation-delay: 1.2s;
        }
      }
    }
    .spin-dot-spin {
      transform: rotate(45deg);
      animation: antRotate 1.2s infinite linear;
    }
  }
  .spin-show-text {
    .spin-dot {
      margin-top: -20px;
    }
    .spin-text {
      display: block;
      position: absolute;
      top: 50%;
      width: 100%;
      font-size: @textSize;
      color: @primaryColor;
      line-height: 20px;
      text-align: center;
      padding-top: 5px;
    }
  }
  .spin-container {
    opacity: 1;
    transition: opacity 0.3s ease;
    &.spin-blur {
      pointer-events: none;
      user-select: none;
      overflow: hidden;
      opacity: 0.5;
    }
  }
}
@keyframes antSpinMove {
  to {
    opacity: 1;
  }
}
@keyframes antRotate {
  to {
    transform: rotate(405deg);
  }
}
</style>
