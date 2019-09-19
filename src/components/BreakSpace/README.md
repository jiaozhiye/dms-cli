<h1 align="center">
  A Vue BreakSpace Component by jzy
</h1>

#### BreakSpace 组件调用

`组件的引用`

```bash
# main.js
import BreakSpace from '@/components/BreakSpace';
Vue.use(BreakSpace);
```

`组件参数API`

- label{String|分隔符的标题文本}
- containerStyle{Object|分隔符外层容器的 css 样式}
- labelStyle{Object|分隔符中文本的 css 样式}

`示例代码`

```bash
# template
<template>
  <BreakSpace label="分隔符标题" :containerStyle="{ marginBottom: '10px' }"></BreakSpace>
</template>
```
