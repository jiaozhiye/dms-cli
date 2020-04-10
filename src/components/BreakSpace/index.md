## API

### BreakSpace

| 参数           | 说明                      | 类型   | 默认值 |
| -------------- | ------------------------- | ------ | ------ |
| label          | 分隔符的标题文本          | string | -      |
| containerStyle | 分隔符外层容器的 css 样式 | object | -      |
| labelStyle     | 分隔符中文本的 css 样式   | object | -      |

### 示例

```bash
# template
<template>
  <break-space label="分隔符标题" :containerStyle="{ marginBottom: '10px' }"></break-space>
</template>
```
