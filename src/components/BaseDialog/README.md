<h1 align="center">
  A Vue BaseDialog Component by jzy
</h1>

#### BaseDialog 组件调用

`组件的引用`

```bash
# main.js
import BaseDialog from '@/components/BaseDialog';
Vue.use(BaseDialog);
```

`组件参数API`

- visible{Boolean|是否显示 Dialog，支持 .sync 修饰符}
- closable{Boolean|是否显示右上角的关闭按钮，默认值是 true}
- destroyOnClose{Boolean|关闭时销毁 Dialog 里的子元素，默认值是 false}
- title{String/slot|标题}
- width{String|Dialog 的宽度，默认值 50%}
- modal{Boolean|是否需要遮罩层，默认值 true}
- lockScroll{Boolean|是否在 Dialog 出现时将 body 滚动锁定，默认值 true}
- customClass{String|Dialog 的自定义类名}
- containerStyle{Object|对话框外层容器的 style}
- maskClosable{Boolean|是否可以通过点击 modal 关闭 Dialog，默认值 false}
- open{Function|打开事件，没有参数}
- opened{Function|打开动画结束时的事件，没有参数}
- close{Function|关闭事件，没有参数}
- closed{Function|Dialog 关闭动画结束时的事件，参数是 visible}
- heightChange{Function|组件内容容器高度变化时的事件，参数是内容容器的高度}

`组件插槽`

- default{Dialog 的内容}
- title{Dialog 标题区的内容}

`示例代码`

```bash
# template
<template>
  <BaseDialog :visible.sync="visible" destroyOnClose>
    <子组件 />
  </BaseDialog>
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
