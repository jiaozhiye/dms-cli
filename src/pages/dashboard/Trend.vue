<template>
  <div class="v-trend--wrapper">
    <span>
      <slot name="term" />
      <span class="item-text">
        <slot />
      </span>
    </span>
    <span :class="[flag]"><i :class="config[flag]"/></span>
  </div>
</template>

<script>
export default {
  name: 'Trend',
  props: {
    // 上升下降标识：up | down
    flag: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      config: {
        up: 'el-icon-caret-top',
        down: 'el-icon-caret-bottom'
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.v-trend--wrapper {
  display: inline-block;

  .up,
  .down {
    position: relative;
    top: 1px;

    i {
      font-size: 12px;
      transform: scale(0.83);
    }
  }

  .item-text {
    display: inline-block;
    margin-left: 4px;
  }

  .up {
    color: $errorColor;
  }
  .down {
    color: $successColor;
    top: -2px;
  }

  &.reverse-color .up {
    color: $successColor;
  }
  &.reverse-color .down {
    color: $errorColor;
  }
}
</style>
