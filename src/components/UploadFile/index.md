## API

### UploadFile

| 参数           | 说明                                     | 类型    | 默认值                               |
| -------------- | ---------------------------------------- | ------- | ------------------------------------ |
| actionUrl      | 文件上传的地址，必要参数                 | string  | -                                    |
| headers        | 上传/下载请求，header 头携带的自定义参数 | object  | -                                    |
| params         | 上传接口的额外参数                       | object  | -                                    |
| initialValue   | 默认显示的文件列表，[配置项](#item)      | array   | -                                    |
| fileTypes      | 限制上传附件的类型                       | array   | ['jpg', 'png', 'pdf', 'xls', 'xlsx'] |
| isOnlyButton   | 是否仅显示上传按钮                       | boolean | false                                |
| limit          | 限制上传图片的数量                       | number  | 1                                    |
| fileSize       | 限制上传文件的大小，单位是 M             | number  | 5                                    |
| disabled       | 是否禁用图片上传                         | boolean | false                                |
| containerStyle | 按钮所在外层容器的 css 样式              | object  | -                                    |

### 事件

| 事件名称 | 说明               | 回调参数                 |
| -------- | ------------------ | ------------------------ |
| change   | 文件上传成功后触发 | Function(fileList:array) |
| error    | 上传失败时触发     | Function(error)          |

### item

| 参数 | 说明     | 类型   | 默认值 |
| ---- | -------- | ------ | ------ |
| name | 文件名称 | string | -      |
| url  | 文件地址 | string | -      |

### 示例

```bash
# template
<template>
  <upload-file action-url="/api/basedata/upload" :initial-value="form.fileList" @change="successHandler" />
</template>

# js
export default {
  data() {
    return {
      form: {
        fileList: []
      }
    };
  },
  methods: {
    successHandler(val) {
      this.form.fileList = val;
    }
  }
};
```
