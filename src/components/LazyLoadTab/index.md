## API

### LazyLoadTab

| 参数           | 说明                                       | 类型                           | 默认值 |
| -------------- | ------------------------------------------ | ------------------------------ | ------ |
| initialValue   | 当前激活选项卡的标题，必要参数             | string                         | -      |
| tabMenus       | 选项卡配置项，[配置项](#tabMenu)           | array                          | -      |
| type           | 风格类型                                   | card \| border-card            | -      |
| position       | 所在位置                                   | top \| right \| bottom \| left | top    |
| destroyOnClose | 切换选项卡并处于隐藏状态时，是否销毁子组件 | boolean                        | false  |

### 事件

| 事件名称 | 说明             | 回调参数                     |
| -------- | ---------------- | ---------------------------- |
| change   | 选项卡切换时触发 | Function(activeTitle:string) |

### tabMenu

| 参数     | 说明                            | 类型    | 默认值 |
| -------- | ------------------------------- | ------- | ------ |
| title    | 选项卡的标题                    | string  | -      |
| path     | 子组件的路径，默认前缀 @/pages/ | string  | -      |
| params   | 传递给子组件的参数              | object  | -      |
| disabled | 是否禁用该选项卡                | boolean | false  |
| on       | 传递给子组件的自定义事件        | object  | -      |

### 示例

```bash
# template
<template>
  <lazy-load-tab :initial-value="activeName" :tab-menus="menus" />
</template>

# js
export default {
  data() {
    return {
      activeName: '选项卡1',
      menus: [
        {
          title: '选项卡1',
          path: 'tabs/a.vue',
          params: {
            type: 1
          }
        },
        {
          title: '选项卡2',
          path: 'tabs/b.vue',
          params: {
            type: 2
          },
          on: {
            customEvent: this.handler
          }
        }
      ]
    };
  },
  methods: {
    handler() {}
  }
};
```
