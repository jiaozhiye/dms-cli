/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-06-24 09:27:09
 */
import router from '@/routes';
import store from '@/store';
import config from '@/config';
import { getToken } from '@/utils/cookies';
import { notifyAction } from '@/utils';
import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css'; // Progress 进度条样式
import i18n from '@/lang';

// 设置 NProgress 样式
NProgress.configure({ showSpinner: false });

// 访问白名单
const whiteList = ['/login'];

// 权限白名单
const whiteAuth = ['/login', '/home', '/iframe', '/redirect', '/404', '/test', '/cors'];

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

// iframe 判断
const isIframe = path => {
  return path.startsWith(whiteAuth[2]);
};

router.beforeEach(async (to, from, next) => {
  !isIframe(to.path) && NProgress.start();
  if (isLogin()) {
    if (to.path === '/login') {
      redirect(next, '/');
    } else {
      if (!isIframe(to.path) && !store.state.app.navList.length) {
        // 通过 vuex 管理导航数据
        const bool = await store.dispatch('app/createNavList');
        bool ? next({ ...to, replace: true }) : redirect(next, false);
      } else {
        let { tabNavList } = store.state.app;
        if (tabNavList.length >= config.maxCacheNum && !tabNavList.some(x => x.key === to.path)) {
          notifyAction(i18n.t('information.maxCache', { total: config.maxCacheNum }), 'warning');
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
  const title = to.meta?.title ?? '404';
  document.title = `${config.systemName}-${title}`;
  NProgress.done();
  if (whiteList.includes(to.path) || title === '404') return;
  // 菜单埋点
  store.dispatch('app/createMenuRecord', { path: to.path, title });
});
