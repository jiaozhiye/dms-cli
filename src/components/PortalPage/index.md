## API

### PortalPage

| 参数           | 说明                             | 类型        | 默认值 |
| -------------- | -------------------------------- | ----------- | ------ |
| loginUrl       | 登录外部系统的接口地址，必要参数 | string      | -      |
| loginParams    | 登录外部系统携带的参数，必要参数 | object      | -      |
| method         | 登录外部系统的请求提交方式       | POST \| GET | POST   |
| pageUrl        | 打开外部系统的页面地址，必要参数 | string      | -      |
| containerStyle | 外部容器的 css 样式              | object      | -      |

### 事件

| 事件名称 | 说明                       | 回调参数 |
| -------- | -------------------------- | -------- |
| success  | 成功打开外部系统页面后触发 | -        |

### 示例

```bash
# template
<template>
  <portal-page loginUrl="https://portal.faw-vw.com/pkmslogin.form" :loginParams="params" pageUrl="https://portal.faw-vw.com/EP/topicSource/toInsert.do" @success="successHandle" />
</template>

export default {
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
