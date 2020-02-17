<h1 align="center">
  A Vue Spin Component by jzy
</h1>

#### Spin 组件调用

`组件的引用`

```bash
# main.js
import BreakSpace from '@/Spin/Spin';
Vue.use(Spin);
```

`组件参数API`

- spinning{Boolean|是否为加载中状态，必选参数}
- tip{String|自定义描述文案}
- containerStyle{Object|外层容器的 style 样式，此样式会再加载过后被移除}

`示例代码`

```bash
# template
<template>
  <Spin :spinning="loading" tip="Loading...">
    <div>需要 Loading 的元素</div>
  </Spin>
</template>

# js
export default {
  data() {
    return {
      loading: true
    }
  }
}
```
