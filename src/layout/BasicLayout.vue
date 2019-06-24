<script>
import { mapActions } from 'vuex';
import GlobalLayout from '@/layout/GlobalLayout';
import RouteView from '@/layout/RouteView';

export default {
  name: 'BasicLayout',
  methods: {
    ...mapActions('app', ['createDictData', 'createStarMenuList'])
  },
  mounted() {
    // 登录后，获取所有的数据字典值
    this.createDictData();
    // 获取收藏导航
    this.createStarMenuList();
  },
  render() {
    return (
      <GlobalLayout>
        <transition name="page-transition">
          <RouteView />
        </transition>
      </GlobalLayout>
    );
  }
};
</script>

<style lang="less" scoped>
/*
 * The following styles are auto-applied to elements with
 * transition="page-transition" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the page transition by editing
 * these styles.
 */
.page-transition-enter-active {
  transition: all 0.3s ease-in 0.2s;
}
.page-transition-leave-active {
  transition: all 0.3s ease-out;
}
.page-transition-enter,
.page-transition-leave-to {
  opacity: 0;
}
</style>