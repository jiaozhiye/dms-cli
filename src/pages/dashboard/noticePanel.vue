<template>
  <div class="wrapper">
    <div class="topper">
      <span class="title">用户通知</span>
    </div>
    <div class="list">
      <li>
        <i class="active">1</i>
        <span class="text_overflow_cut">白鹭岛号店白鹭岛店白鹭岛号店白鹭岛号店</span>
        <em class="fr">2012-12-12</em>
      </li>
      <li>
        <i class="active">2</i>
        <span>白鹭岛 1 号店</span>
        <em class="fr">2012-12-12</em>
      </li>
      <li>
        <i class="active">3</i>
        <span>白鹭岛 1 号店</span>
        <em class="fr">2012-12-12</em>
      </li>
      <li>
        <i>4</i>
        <span>白鹭岛 1 号店</span>
        <em class="fr">2012-12-12</em>
      </li>
      <li>
        <i>5</i>
        <span>白鹭岛 1 号店</span>
        <em class="fr">2012-12-12</em>
      </li>
    </div>
  </div>
</template>

<script>
export default {
  name: ''
};
</script>

<style lang="less" scoped>
.wrapper {
  width: 100%;
  height: 240px;
  background-color: #fff;
  border-radius: @borderRadius;
  box-shadow: @boxShadow;
  .topper {
    display: flex;
    height: 46px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid @borderColor;
    .title {
      padding-left: 15px;
    }
  }
  .list {
    padding: 5px 15px;
    overflow: hidden;
    li {
      height: 36px;
      display: flex;
      justify-content: space-between;
      list-style: none;
      align-items: center;
      i {
        margin-right: 10px;
        background-color: #f5f5f5;
        color: @textColorSecondary;
        font-size: 12px;
        font-weight: 600;
        text-align: center;
        width: 20px;
        height: 20px;
        line-height: 20px;
        border-radius: 20px;
        &.active {
          background-color: #314659;
          color: #fff;
        }
      }
      span {
        flex: 1;
        /* 防止父元素宽度被撑开 */
        width: 0;
      }
      em {
        width: 80px;
        text-align: right;
      }
    }
  }
}
</style>
