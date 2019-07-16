/**
 * @Author: 焦质晔
 * @Date: 2019/6/20
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 15:45:00
 */
import router from '@/routes';
import store from '@/store';
import config from '@/config';
import { getToken } from '@/assets/js/auth';
import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css'; // Progress 进度条样式
import { MessageBox, Notification } from 'element-ui';

// 访问白名单
const whiteList = ['/login'];
// 权限白名单
const whiteAuth = ['/login', '/home', '/404'];

// 阻止跳转
const noJump = next => {
  next(false);
  NProgress.done();
};

// 页面离开提醒
const messageConfirm = next => {
  MessageBox.confirm('您有未保存的数据，确认离开此页面吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      next();
    })
    .catch(() => {
      noJump(next);
    });
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
      next({ path: '/' });
    } else {
      if (store.state.app.navList.length == 0) {
        // 通过 vuex 管理导航数据
        await store.dispatch('app/createNavList');
        next({ ...to, replace: true });
      } else {
        let { tabMenuList } = store.state.app;
        if (tabMenuList.length >= config.maxCacheNum && !tabMenuList.some(x => x.key === to.path)) {
          Notification.warning({
            title: '提示信息',
            message: `最多支持 ${config.maxCacheNum} 个菜单项！`
          });
          return noJump(next);
        }
        let isAuth = await store.dispatch('app/checkAuthority', to.path);
        // 权限校验
        if (isAuth || whiteAuth.includes(to.path)) {
          // 离开页面的校验
          if (!store.state.app.isLeaveRemind) {
            next();
          } else {
            messageConfirm(next);
          }
        } else {
          next({ path: '/404' });
        }
      }
    }
  } else {
    // 白名单，直接进入
    if (whiteList.includes(to.path)) {
      next();
    } else {
      next({ path: '/login' });
    }
  }
});

router.afterEach(to => {
  if (to.meta && typeof to.meta.title !== 'undefined') {
    document.title = `${config.systemName}-${to.meta.title}`;
  }
  store.dispatch('app/setLeaveRemind', !1);
  NProgress.done(); // 结束Progress
});
