## API

### Drawer

| 参数           | 说明                                            | 类型                           | 默认值 |
| -------------- | ----------------------------------------------- | ------------------------------ | ------ |
| visible        | 是否显示 Drawer 组件，支持 .sync 修饰符         | boolean                        | false  |
| closable       | 是否显示右上角的关闭按钮                        | boolean                        | true   |
| destroyOnClose | 关闭时销毁 Drawer 里的子元素                    | boolean                        | false  |
| title          | 标题名称                                        | string                         | -      |
| position       | Drawer 弹出的方向                               | top \| right \| bottom \| left | right  |
| lockScroll     | 是否在 Drawer 出现时将 body 滚动锁定            | boolean                        | true   |
| maskClosable   | 是否可以通过点击 modal 关闭 Drawer              | boolean                        | false  |
| width          | Drawer 的宽度，单位是 % \| px                   | string \| number               | 72%    |
| height         | Drawer 的高度，单位是 % \| px                   | string \| number               | 300px  |
| level          | Drawer 组件的层级，通常在嵌套 Drawer 组件时使用 | number                         | 1      |
| containerStyle | 对话框外层容器的 css 样式                       | object                         | -      |

### 事件

| 事件名称           | 说明                             | 回调参数                  |
| ------------------ | -------------------------------- | ------------------------- |
| open               | 打开时触发                       | -                         |
| close              | 关闭时触发                       | Function(reload:boolean)  |
| afterVisibleChange | 切换 Drawer 时，动画结束后的事件 | Function(visible:boolean) |

### 插槽

| 插槽名称 | 说明                |
| -------- | ------------------- |
| default  | Dialog 中的内容     |
| title    | Dialog 标题区的内容 |

### 示例

```bash
# template
<template>
  <drawer :visible.sync="visible" title="标题" destroyOnClose>
    <子组件 />
  </drawer>
</template>

# js
export default {
  data() {
    return {
      visible: false
    };
  }
};
```
