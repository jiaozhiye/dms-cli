## API

### ButtonArea

| 参数           | 说明                      | 类型          | 默认值 |
| -------------- | ------------------------- | ------------- | ------ |
| containerStyle | 承载按钮层容器的 css 样式 | object        | -      |
| align          | 按钮的对齐方式            | left \| right | left   |

### 示例

```bash
# template
<template>
  <button-area :containerStyle="{ paddingLeft: '80px' }">
    <el-button type="primary">按钮1</el-button>
    <el-button>按钮2</el-button>
    <el-button>按钮3</el-button>
  </button-area>
</template>
```
