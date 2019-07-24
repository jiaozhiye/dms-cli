<script>
import { mapActions } from 'vuex';
import GlobalLayout from './GlobalLayout';
import RouteView from './RouteView';

export default {
  name: 'BasicLayout',
  methods: {
    ...mapActions('app', ['createDictData', 'createStarMenuList', 'createCommonMenuList'])
  },
  mounted() {
    // 登录后，获取所有的数据字典值
    this.createDictData();
    // 获取收藏导航
    this.createStarMenuList();
    // 获取常用导航
    this.createCommonMenuList();
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
