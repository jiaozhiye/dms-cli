<h1 align="center">
  A Vue Drawer Component by jzy
</h1>

#### Drawer 组件调用

`组件的引用`

```bash
# main.js
import Drawer from '@/components/Drawer';
Vue.use(Drawer);
```

`组件参数API`

- visible{Boolean|是否显示抽屉组件，支持 .sync 修饰符}
- closable{Boolean|是否显示右上角的关闭按钮，默认值是 true}
- destroyOnClose{Boolean|关闭时销毁 Drawer 里的子元素，默认值是 false}
- title{String/slot|标题}
- position{String|抽屉弹出的方向，'top' | 'right' | 'bottom' | 'left'，默认是 right}
- lockScroll{Boolean|显示抽屉时是否禁用了主体滚动，默认值 true}
- maskClosable{Boolean|点击蒙层是否允许关闭，默认值 true}
- width{String/Number|宽度}
- height{String/Number|高度，在 position 为 top 或 bottom 时使用}
- zIndex{Number|设置 Drawer 的 z-index}
- maskStyle{Object|遮罩的 style}
- containerStyle{Object|对话框外层容器的 style}
- open{Function|打开事件，没有参数}
- close{Function|关闭事件，没有参数}
- afterVisibleChange{Function|切换抽屉时动画结束后的事件，参数是 visible}

`组件插槽`

- default{Drawer 的内容}
- title{Drawer 标题区的内容}

`示例代码`

```bash
# template
<template>
  <Drawer
    :visible.sync="visible"
    title="抽屉标题"
    :width="700"
    @afterVisibleChange="afterVisibleChangeHandle"
  >
    <子组件 @close="closeHandle"/>
  </Drawer>
</template>

# js
export default {
  data() {
    return {
      visible: false
    };
  },
  methods: {
    closeHandle(val) {
      this.visible = val;
    },
    afterVisibleChangeHandle(val) {
      console.log('当前显示状态：', val);
    }
  }
};
```
