<h1 align="center">
  A Vue PortalPage Component by jzy
</h1>

#### PortalPage 组件调用

`组件的引用`

```bash
# main.js
import PortalPage from '@/components/PortalPage';
Vue.use(PortalPage);
```

`组件参数API`

- method{String|登录外部系统的请求提交方式, POST/GET}
- loginUrl{String|登录外部系统的接口地址，必选}
- loginParams{Object|登录外部系统携带的参数，必选}
- pageUrl{String|登录之后，要打开外部系统的页面地址，登录外部系统携带的参数，必选}
- height{String/Number|承载外部系统容器的高度，默认 400px}
- onSuccess{Function|成功打开外部系统页面的事件，没有参数}

`示例代码`

```bash
# template
<template>
  <PortalPage loginUrl="https://portal.faw-vw.com/pkmslogin.form" :loginParams="params" pageUrl="https://portal.faw-vw.com/EP/topicSource/toInsert.do" @onSuccess="successHandle" />
</template>

export default {
  components: {
    PortalPage
  },
  data() {
    return {
      params: {
        username: 'Liu00001',
        password: 'b6agrdFb',
        'login-form-type': 'pwd'
      }
    };
  },
  methods: {
    successHandle() {
      console.log('外部系统页面打开成功！');
    }
  }
};
```
