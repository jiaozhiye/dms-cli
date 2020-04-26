<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-26 14:09:09
 */
import { mapState, mapActions } from 'vuex';
import GlobalLayout from './GlobalLayout';

import config from '@/config';

export default {
  name: 'BasicLayout',
  computed: {
    ...mapState('app', ['keepAliveNames']),
    key() {
      return this.$route.path;
    },
    cachedNames() {
      return this.keepAliveNames.map(x => x.value);
    }
  },
  mounted() {
    // 登录后，获取所有的数据字典值
    this.createDictData();
    // 获取收藏导航
    this.createStarMenuList();
    // 获取常用导航
    this.createCommonMenuList();
  },
  methods: {
    ...mapActions('app', ['createDictData', 'createStarMenuList', 'createCommonMenuList']),
    createMainContainer() {
      return (
        <keep-alive include={this.cachedNames} max={config.maxCacheNum}>
          <router-view />
        </keep-alive>
      );
    }
  },
  render() {
    return (
      <GlobalLayout>
        {/* <transition name="fade-transform" mode="out-in"> */}
        {this.createMainContainer()}
        {/* </transition> */}
      </GlobalLayout>
    );
  }
};
</script>

<style lang="scss" scoped>
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
