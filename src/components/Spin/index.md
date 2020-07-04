## API

### Spin

| 参数           | 说明                     | 类型                      | 默认值  |
| -------------- | ------------------------ | ------------------------- | ------- |
| spinning       | 是否加载中状态，必选参数 | boolean                   | false   |
| size           | 尺寸                     | small \| default \| large | default |
| tip            | 自定义描述文字           | string                    |         |
| containerStyle | 外层容器的 style 样式    | object                    | -       |

### 示例

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
