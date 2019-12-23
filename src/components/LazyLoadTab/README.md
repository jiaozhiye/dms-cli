<h1 align="center">
  A Vue LazyLoadTab Component by jzy
</h1>

#### LazyLoadTab 组件调用

`组件的引用`

```bash
# main.js
import LazyLoadTab from '@/components/LazyLoadTab';
Vue.use(LazyLoadTab);
```

`组件参数API`

- initialValue{String|当前选中卡的标题}
- tabMenus{Array|选项卡的菜单}
  - 菜单数据的每一项：
  - {
  - &emsp;title: {String|选项卡的标题}
  - &emsp;path: {String|内容组件的路径，'tabs/user' -> '@/views/tabs/user.vue'},
  - &emsp;disabled: {Boolean|是否禁用该选项卡}
  - &emsp;params: {Object|对按需加载的组件传参}
  - &emsp;on: {Object|对按需加载的组件传递自定义事件}
  - }
- type{String|选项卡风格类型，card/border-card，默认是基本类型}
- position{String|选项卡所在位置，top/right/bottom/left，默认值是 top}
- destroyOnClose{Boolean|切换选项卡并处于隐藏状态时，是否销毁子组件，默认是 false}
- change{Function|自定义事件，tab 切换时触发，参数是选中的标签标题}

`示例代码`

```bash
# template
<template>
  <LazyLoadTab :initial-value="activeName" :tabMenus="menus" />
</template>

# js
export default {
  data() {
    return {
      activeName: '用户管理',
      menus: [
        {
          title: '用户管理',
          path: 'tabs/user',
          params: {
            type: 1
          }
        },
        {
          title: '配置管理',
          path: 'tabs/setting',
          disabled: true,
          params: {
            type: 2
          }
        },
        {
          title: '角色管理',
          path: 'tabs/role',
          params: {
            type: 3
          },
          on: {
            myClallback: this.eventHandle
          }
        }
      ]
    };
  }
};
```
