<template>
  <div class="wrapper">
    <SuperTabs :initial-value="defaultTabLabel" :tab-bar-gutter="15" animated>
      <tab-panel :label="noticeList.title">
        <div class="list">
          <ul v-if="noticeList.list.length">
            <li v-for="item in noticeList.list" :key="item.id">{{ item.title }}</li>
          </ul>
          <dl v-else class="no-info">
            <i class="el-icon-warning-outline" />
            <span>暂无数据</span>
          </dl>
        </div>
      </tab-panel>
      <tab-panel :label="messageList.title">
        <div class="list">
          <ul v-if="messageList.list.length">
            <li v-for="item in messageList.list" :key="item.id">{{ item.title }}</li>
          </ul>
          <dl v-else class="no-info">
            <i class="el-icon-warning-outline" />
            <span>暂无数据</span>
          </dl>
        </div>
      </tab-panel>
      <tab-panel :label="todoList.title">
        <div class="list">
          <ul v-if="todoList.list.length">
            <li v-for="item in todoList.list" :key="item.id">{{ item.title }}</li>
          </ul>
          <dl v-else class="no-info">
            <i class="el-icon-warning-outline" />
            <span>暂无数据</span>
          </dl>
        </div>
      </tab-panel>
    </SuperTabs>
  </div>
</template>

<script>
const dataList = [
  { id: 1, title: '通知1' },
  { id: 2, title: '通知2' },
  { id: 3, title: '通知3' },
  { id: 4, title: '通知4' },
  { id: 5, title: '通知5' }
];

export default {
  name: 'InsideLetter',
  data() {
    return {
      defaultTabLabel: '通知',
      noticeList: {
        title: '通知',
        list: []
      },
      messageList: {
        title: '消息',
        list: []
      },
      todoList: {
        title: '待办',
        list: []
      }
    };
  },
  mounted() {
    const title = `通知(${dataList.length})`;
    this.noticeList.list = dataList;
    this.defaultTabLabel = title;
    this.noticeList.title = title;
  }
};
</script>

<style lang="less" scoped>
.wrapper {
  margin: -12px;
  width: 340px;
  .list {
    margin-top: -10px;
    ul > li {
      padding: 10px 15px;
      line-height: 20px;
      font-size: @textSize;
      border-bottom: 1px solid @borderColorSecondary;
    }
    .no-info {
      text-align: center;
      padding: 30px 0;
      color: @disabledColor;
      i {
        font-size: 26px;
      }
      span {
        display: inline-block;
        width: 100%;
        padding-top: 5px;
        font-size: @textSize;
      }
    }
  }
}
</style>
