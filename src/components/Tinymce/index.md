## API

### Tinymce

| 参数            | 说明                                   | 类型    | 默认值 |
| --------------- | -------------------------------------- | ------- | ------ |
| value / v-model | 文本内容，必选参数                     | string  | -      |
| height          | 富文本编辑器高度                       | number  | 450    |
| upload          | 图片/附件上传的配置，[配置项](#upload) | object  | -      |
| disabled        | 是否为禁用状态                         | boolean | false  |

### 事件

| 事件名称 | 说明           | 回调参数               |
| -------- | -------------- | ---------------------- |
| change   | 文本变化时触发 | Function(value:string) |

### upload

| 参数      | 说明                                 | 类型   | 默认值 |
| --------- | ------------------------------------ | ------ | ------ |
| actionUrl | 上传的地址，必要参数                 | string | -      |
| headers   | 接口请求的 header 头参数             | object | -      |
| fixedSize | 裁剪框的宽高比，只对 UPLOAD_IMG 有效 | array  | [5, 4] |

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
