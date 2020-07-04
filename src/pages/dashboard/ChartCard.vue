<template>
  <div class="chart-wrap">
    <div class="chart-wrap--toper">
      <span class="title">
        <slot name="title" />
      </span>
      <span class="tooltip">
        <el-tooltip effect="dark" placement="top">
          <div slot="content"><slot name="title_desc" /></div>
          <i class="icon el-icon-warning-outline" />
        </el-tooltip>
      </span>
    </div>
    <div class="chart-wrap--total text_overflow_cut">
      <slot name="total" />
    </div>
    <div class="chart-wrap--content">
      <div class="content-fix">
        <slot />
      </div>
    </div>
    <div class="chart-wrap--footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChartCard'
};
</script>

<style lang="scss" scoped>
.chart-wrap {
  height: 100%;
  padding: 10px;
  background-color: #fff;
  border-radius: $borderRadius;
  box-shadow: $boxShadow;
  box-sizing: border-box;
  &--toper {
    position: relative;
    .tooltip {
      position: absolute;
      right: 0;
      top: 1px;
      line-height: 1;
      .icon {
        font-size: 18px;
      }
    }
  }
  &--total {
    font-size: 30px;
    line-height: 38px;
    padding-top: 4px;
  }
  &--content {
    position: relative;
    height: 46px;
    margin-bottom: 8px;
    .content-fix {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
    }
  }
  &--footer {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid $borderColorSecondary;
  }
}
</style>
