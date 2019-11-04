<template>
  <div class="wrapper">
    <SuperTabs :initialValue="defaultTabLabel" :tabBarGutter="15">
      <tab-panel label="通知">
        <div class="list">
          <ul>
            <li>通知1</li>
            <li>通知2</li>
            <li>通知3</li>
            <li>通知4</li>
            <li>通知5</li>
          </ul>
        </div>
      </tab-panel>
      <tab-panel label="消息">
        <div class="list">消息</div>
      </tab-panel>
      <tab-panel label="待办">
        <div class="list">待办</div>
      </tab-panel>
    </SuperTabs>
  </div>
</template>

<script>
export default {
  name: 'Notice',
  data() {
    return {
      defaultTabLabel: '通知',
      noticeList: [],
      messageList: [],
      needList: []
    };
  }
};
</script>

<style lang="less" scoped>
.wrapper {
  margin: -12px;
  width: 340px;
  .list {
    margin: -10px;
    ul > li {
      line-height: 20px;
      padding: 10px 15px;
      border-bottom: 1px solid @borderColorSecondary;
    }
  }
}
</style>
