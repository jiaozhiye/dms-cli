<h1 align="center">
  A Vue ButtonArea Component by jzy
</h1>

#### ButtonArea 组件调用

`组件的引用`

```bash
# main.js
import BreakSpace from '@/ButtonArea/ButtonArea';
Vue.use(ButtonArea);
```

`组件参数API`

- containerStyle{Object|承载按钮层容器的 css 样式}

`示例代码`

```bash
# template
<template>
  <ButtonArea :containerStyle="{ paddingLeft: '80px' }">
    <el-button size="small" type="primary">到货确认</el-button>
    <el-button size="small">明细</el-button>
    <el-button size="small">发货单</el-button>
  </ButtonArea>
</template>
```
