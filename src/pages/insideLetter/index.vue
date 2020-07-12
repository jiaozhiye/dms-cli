<template>
  <div :class="noticeCls">
    <SuperTabs :initial-value="defaultTabLabel" :tab-bar-gutter="15" animated>
      <tab-panel key="1" :label="noticeList.title">
        <div class="list">
          <ul v-if="noticeList.list.length">
            <li v-for="item in noticeList.list" :key="item.id">{{ item.title }}</li>
          </ul>
          <dl v-else class="no-info">
            <span>{{ $t('app.emptyText') }}</span>
          </dl>
        </div>
      </tab-panel>
      <tab-panel key="2" :label="messageList.title">
        <div class="list">
          <ul v-if="messageList.list.length">
            <li v-for="item in messageList.list" :key="item.id">{{ item.title }}</li>
          </ul>
          <dl v-else class="no-info">
            <span>{{ $t('app.emptyText') }}</span>
          </dl>
        </div>
      </tab-panel>
      <tab-panel key="3" :label="todoList.title">
        <div class="list">
          <ul v-if="todoList.list.length">
            <li v-for="item in todoList.list" :key="item.id">{{ item.title }}</li>
          </ul>
          <dl v-else class="no-info">
            <span>{{ $t('app.emptyText') }}</span>
          </dl>
        </div>
      </tab-panel>
    </SuperTabs>
  </div>
</template>

<script>
import { size } from '@/mixins/sizeMixin';
import dataList from '@/mock/noticeData';

export default {
  name: 'InsideLetter',
  mixins: [size],
  data() {
    return {
      defaultTabLabel: '1',
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
  computed: {
    noticeCls() {
      return {
        [`notice-wrapper`]: !0,
        [`notice-wrapper-sm`]: this.currentSize === 'small',
        [`notice-wrapper-lg`]: this.currentSize === 'large'
      };
    }
  },
  mounted() {
    const title = `${this.$t('insideLetter.notice')}(${dataList.data.length})`;
    this.noticeList.list = dataList.data;
    this.noticeList.title = title;
  }
};
</script>

<style lang="scss" scoped>
.notice-wrapper {
  margin: -12px;
  width: 340px;
  .list {
    margin-top: -10px;
    ul > li {
      padding: 10px 15px;
      line-height: 20px;
      font-size: $textSize;
      border-bottom: 1px solid $borderColorSecondary;
    }
    .no-info {
      text-align: center;
      padding: 40px 0;
      color: $disabledColor;
      span {
        display: inline-block;
        width: 100%;
        font-size: $textSize;
      }
    }
  }
  &-sm {
    .list {
      ul > li {
        font-size: $textSizeSecondary;
      }
      .no-info {
        span {
          font-size: $textSizeSecondary;
        }
      }
    }
  }
}
</style>
