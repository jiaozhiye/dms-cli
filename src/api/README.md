## ajax 防重复提交

1. 在接口方法中传入配置参数 mark，表明该接口对应的按钮需要加 loading 效果，防止重复提交
2. 在组件中通过计算属性获取 Vuex 中的 btnLoading
3. 通过计算属性获取当前按钮的状态值
4. 在按钮组件上设置 loading 参数

`代码示例`

```
import * as types from './types';
export const doLogin = params => axios.post('/login/do', params, { mark: types.LOGIN });

<template>
  <el-button :loading="loginBtnState">登 录</el-button>
</template>

import * as types from './types';
computed: {
  ...mapState('app', ['btnLoading']),
  loginBtnState() {
    return this.btnLoading[types.LOGIN];
  }
}
```
