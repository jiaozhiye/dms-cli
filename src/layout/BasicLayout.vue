<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-02-01 19:22:47
 */
import { mapActions } from 'vuex';
import GlobalLayout from './GlobalLayout';
import RouteView from './RouteView';

export default {
  name: 'BasicLayout',
  mounted() {
    // 登录后，获取所有的数据字典值
    this.createDictData();
    // 获取收藏导航
    this.createStarMenuList();
    // 获取常用导航
    this.createCommonMenuList();
  },
  methods: {
    ...mapActions('app', ['createDictData', 'createStarMenuList', 'createCommonMenuList'])
  },
  render() {
    return (
      <GlobalLayout>
        <transition name="page-transition" mode="out-in">
          <RouteView />
        </transition>
      </GlobalLayout>
    );
  }
};
</script>

<style lang="less" scoped>
.page-transition-enter-active {
  transition: all 0.3s ease-in;
}
.page-transition-leave-active {
  transition: all 0.3s ease-out;
}
.page-transition-enter,
.page-transition-leave-to {
  opacity: 0;
}
</style>
