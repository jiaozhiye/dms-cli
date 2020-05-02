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
            <span>{{ $t('app.emptyText') }}</span>
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
            <span>{{ $t('app.emptyText') }}</span>
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
            <span>{{ $t('app.emptyText') }}</span>
          </dl>
        </div>
      </tab-panel>
    </SuperTabs>
  </div>
</template>

<script>
import dataList from '@/mock/noticeData';

export default {
  name: 'InsideLetter',
  data() {
    return {
      defaultTabLabel: this.$t('insideLetter.notice'),
      noticeList: {
        title: this.$t('insideLetter.notice'),
        list: []
      },
      messageList: {
        title: this.$t('insideLetter.message'),
        list: []
      },
      todoList: {
        title: this.$t('insideLetter.waiting'),
        list: []
      }
    };
  },
  mounted() {
    const title = `${this.$t('insideLetter.notice')}(${dataList.data.length})`;
    this.noticeList.list = dataList.data;
    this.defaultTabLabel = title;
    this.noticeList.title = title;
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  margin: -12px;
  width: 340px;
  .list {
    margin-top: -10px;
    ul > li {
      padding: 10px 15px;
      line-height: 20px;
      font-size: $textSize;
      border-bottom: 1px solid #e8e8e8;
    }
    .no-info {
      text-align: center;
      padding: 30px 0;
      color: $disabledColor;
      i {
        font-size: 26px;
      }
      span {
        display: inline-block;
        width: 100%;
        padding-top: 5px;
        font-size: $textSize;
      }
    }
  }
}
</style>
