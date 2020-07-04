<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-06-22 12:58:28
 */
import { mapState, mapActions } from 'vuex';
import GlobalLayout from './GlobalLayout';

import config from '@/config';

export default {
  name: 'BasicLayout',
  computed: {
    ...mapState('app', ['keepAliveList', 'iframeList']),
    key() {
      return this.$route.path;
    },
    cachedNames() {
      return this.keepAliveList.map(x => x.value);
    },
    isKeepAlive() {
      return this.$route.meta.keepAlive;
    }
  },
  mounted() {
    // 获取数据字典值
    this.createDictData();
    // 获取收藏导航
    this.createStarMenuList();
    // 获取常用导航
    this.createCommonMenuList();
    // 挂载刷新方法
    window.$$refresh = this.refreshView;
    // 子窗口
    // window.parent.$$refresh({ path: window.parent.location.pathname });
  },
  methods: {
    ...mapActions('app', ['createDictData', 'createStarMenuList', 'createCommonMenuList', 'refreshView']),
    createIframeView() {
      return this.iframeList.map(x => (
        <div key={x.key} class="iframe-wrapper" v-show={this.key === x.key}>
          <iframe id={x.key} src={x.value} width="100%" height="100%" frameborder="0" />
        </div>
      ));
    }
  },
  render() {
    return (
      <GlobalLayout>
        {/* <transition name="fade-transform" mode="out-in"> */}
        <keep-alive include={this.cachedNames} max={config.maxCacheNum}>
          <router-view key={this.key} />
        </keep-alive>
        {/* </transition> */}
        {this.createIframeView()}
      </GlobalLayout>
    );
  }
};
</script>

<style lang="scss" scoped>
/* iframe */
.iframe-wrapper {
  margin: -10px -10px 0;
  height: calc(100% + 10px);
}
/* fade-transition */
.fade-transition-enter-active {
  transition: all 0.3s ease-in;
}
.fade-transition-leave-active {
  transition: all 0.3s ease-out;
}
.fade-transition-enter,
.fade-transition-leave-to {
  opacity: 0;
}
/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.3s;
}
.fade-transform-enter {
  opacity: 0;
  transform: translateX(-10px);
}
.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>
