<template>
  <div class="wrapper">
    <div class="topper">
      <span class="title">用户通知</span>
    </div>
    <div class="list">
      <li v-for="(item, index) in dataList" :key="item.id">
        <i :class="{ active: index < 3 }">{{ index + 1 }}</i>
        <span class="text_overflow_cut">{{ item.title }}</span>
        <em class="fr">{{ item.dateTime }}</em>
      </li>
    </div>
  </div>
</template>

<script>
import { language } from '@/mixins/langMixin';

export default {
  mixins: [language],
  data() {
    return {
      dataList: [
        { id: 1, title: '白鹭岛号店白鹭岛店白鹭岛号店白鹭岛号店', dateTime: '2012-12-12' },
        { id: 2, title: '白鹭岛号店白鹭岛店白鹭岛号店白鹭岛号店', dateTime: '2012-12-12' },
        { id: 3, title: '白鹭岛号店白鹭岛店白鹭岛号店白鹭岛号店', dateTime: '2012-12-12' },
        { id: 4, title: '白鹭岛号店白鹭岛店白鹭岛号店白鹭岛号店', dateTime: '2012-12-12' },
        { id: 5, title: '白鹭岛号店白鹭岛店白鹭岛号店白鹭岛号店', dateTime: '2012-12-12' }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 240px;
  background-color: #fff;
  border-radius: $borderRadius;
  box-shadow: $boxShadow;
  .topper {
    display: flex;
    height: 46px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid $borderColor;
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
        margin-right: $moduleMargin;
        background-color: $backgroundColorSecondary;
        color: $textColorSecondary;
        font-size: $textSizeSecondary;
        font-weight: 600;
        text-align: center;
        width: 20px;
        height: 20px;
        line-height: 20px;
        border-radius: 50%;
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
