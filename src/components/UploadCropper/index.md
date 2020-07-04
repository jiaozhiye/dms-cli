## API

### UploadCropper

| 参数         | 说明                                     | 类型    | 默认值 |
| ------------ | ---------------------------------------- | ------- | ------ |
| actionUrl    | 图片上传的地址，必要参数                 | string  | -      |
| headers      | 上传/下载请求，header 头携带的自定义参数 | object  | -      |
| params       | 上传接口的额外参数                       | object  | -      |
| initialValue | 默认显示的图片列表，[配置项](#item)      | array   | -      |
| remove       | 删除时请求后台接口，[配置项](#remove)    | object  | -      |
| fixedSize    | 裁剪框的宽高比                           | array   | [5, 4] |
| isCalcHeight | 是否根据裁剪图片宽高比自动计显示框高度   | boolean | false  |
| limit        | 限制上传图片的数量                       | number  | 1      |
| titles       | 上传图片对应的标题，个数与 limit 一致    | array   | -      |
| disabled     | 是否禁用图片上传                         | boolean | false  |

### 事件

| 事件名称 | 说明               | 回调参数                 |
| -------- | ------------------ | ------------------------ |
| change   | 图片上传成功后触发 | Function(fileList:array) |
| error    | 上传失败时触发     | Function(error)          |

### item

| 参数 | 说明     | 类型   | 默认值 |
| ---- | -------- | ------ | ------ |
| name | 文件名称 | string | -      |
| url  | 文件地址 | string | -      |

### remove

| 参数   | 说明           | 类型   | 默认值 |
| ------ | -------------- | ------ | ------ |
| api    | 接口，必要参数 | func   | -      |
| params | 接口额外参数   | object | -      |

### 示例

```bash
# template
<template>
  <upload-cropper action-url="/api/basedata/upload" :initial-value="form.imgPath" :fixed-size="[4, 5]" @change="successHandler" />
</template>

# js
export default {
  data() {
    return {
      form: {
        imgPaths: []
      }
    };
  },
  methods: {
    successHandler(val) {
      this.form.imgPaths = val;
    }
  }
};
```
