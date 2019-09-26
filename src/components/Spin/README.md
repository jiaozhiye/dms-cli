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

`示例代码`

```bash
# template
<template>
  <Spin :containerStyle="{ height: 200px' }">
    <div>需要 Loading 的元素</div>
  </Spin>
</template>
```
