## API

### Tinymce

| 参数            | 说明                     | 类型    | 默认值 |
| --------------- | ------------------------ | ------- | ------ |
| value / v-model | 文本内容，必选参数       | string  | -      |
| height          | 富文本编辑器高度         | number  | 450    |
| actionUrl       | 上传图片的路径，必选参数 | string  | -      |
| fixedSize       | 上传图片裁剪框的宽高比   | array   | [5, 4] |
| wordsLimit      | 字数限制                 | number  | 50000  |
| isUploadImage   | 是否显示上传图片按钮     | boolean | true   |
| disabled        | 是否为禁用状态           | boolean | false  |

### 事件

| 事件名称 | 说明           | 回调参数               |
| -------- | -------------- | ---------------------- |
| change   | 文本变化时触发 | Function(value:string) |

### 示例

```bash
# template
<template>
  <tinymce v-model="content" actionUrl="/api/basedata/upload" />
</template>

# js
export default {
  data() {
    return {
      content: 'hello world'
    };
  },
};
```
