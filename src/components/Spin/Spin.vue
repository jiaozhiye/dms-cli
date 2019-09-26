<script>
export default {
  name: 'Spin',
  props: {
    delay: {
      type: Number,
      default: 200
    },
    spinning: {
      type: Boolean,
      default: false
    },
    tip: {
      type: String,
      default: 'Loading...'
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
        if (!val) {
          this.sSpinning = false;
        } else {
          this.stopHandle();
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
        <span class={`dot-spin`}>
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
      [`spinning`]: sSpinning,
      [`show-text`]: !!tip
    };
    const spinElement = (
      <div class={spinClassName}>
        {this.renderIndicator()}
        {tip ? <div class={`spin-text`}>{tip}</div> : null}
      </div>
    );
    const containerClassName = {
      [`container`]: true,
      [`blur`]: sSpinning
    };
    return (
      <div class={[`nested-loading`]} style={{ ...containerStyle }}>
        {sSpinning && <div key="loading">{spinElement}</div>}
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
</style>
