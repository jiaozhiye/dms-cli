<script>
import { mapState, mapActions } from 'vuex';
import config from '@/config';
import GlobalLayout from '@/layout/GlobalLayout';

export default {
  name: 'BasicLayout',
  computed: {
    ...mapState('app', ['keepAliveNames']),
    cachedViews() {
      return this.keepAliveNames.map(x => x.value);
    },
    key() {
      return this.$route.fullPath;
    }
  },
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
        <transition name="page-transition" mode="out-in">
          <keep-alive include={this.cachedViews}>
            <router-view key={this.key} />
          </keep-alive>
        </transition>
      </GlobalLayout>
    );
  }
};
</script>

<style lang="less" scoped>
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
