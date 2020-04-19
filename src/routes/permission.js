/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-19 08:34:39
 */
import router from '@/routes';
import store from '@/store';
import config from '@/config';
import { getToken } from '@/utils/cookies';
import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css'; // Progress 进度条样式
import { Notification } from 'element-ui';

NProgress.configure({ showSpinner: false });

// 访问白名单
const whiteList = ['/login'];

// 权限白名单
const whiteAuth = ['/login', '/home', '/redirect', '/404'];

// 路由重定向
const redirect = (next, path) => {
  path ? next({ path }) : next(false);
  NProgress.done();
};

// 登录判断
const isLogin = () => {
  if (process.env.MOCK_DATA === 'true') {
    return true;
  } else {
    return getToken();
  }
};

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  if (isLogin()) {
    if (to.path === '/login') {
      redirect(next, '/');
    } else {
      if (!store.state.app.navList.length) {
        // 通过 vuex 管理导航数据
        const bool = await store.dispatch('app/createNavList');
        bool ? next({ ...to, replace: true }) : redirect(next, false);
      } else {
        let { tabMenuList } = store.state.app;
        if (tabMenuList.length >= config.maxCacheNum && !tabMenuList.some(x => x.key === to.path)) {
          Notification.warning({
            title: '提示信息',
            message: `最多支持 ${config.maxCacheNum} 个菜单项！`
          });
          return redirect(next, false);
        }
        let isAuth = await store.dispatch('app/checkAuthority', to.path);
        // 权限校验
        if (isAuth || whiteAuth.some(x => to.path.startsWith(x))) {
          next();
        } else {
          redirect(next, '/404');
        }
      }
    }
  } else {
    // 没有登录，清空菜单数据
    store.dispatch('app/clearNavList');
    // 白名单，直接进入
    if (whiteList.includes(to.path)) {
      next();
    } else {
      redirect(next, '/login');
    }
  }
});

router.afterEach(to => {
  const title = to.meta && to.meta.title ? to.meta.title : '';
  if (title) {
    document.title = `${config.systemName}-${title}`;
  }
  NProgress.done();
});
