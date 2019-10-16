<h1 align="center">
  A Vue UploadFile Component by jzy
</h1>

#### UploadFile 组件调用

`组件的引用`

```bash
# main.js
import UploadFile from '@/components/UploadFile';
Vue.use(UploadFile);
```

`组件参数API`

- actionUrl{String|必选参数，上传的地址}
- initialValue{Array|默认显示图片的地址}
- fileTypes{Array|限制上传附件的类型}
- isOnlyButton{Boolean|是否仅显示上传按钮}
- limit{Number|支持上传附件的数量，默认是 1}
- params{Object|ajax 上传时附带的额外参数}
- disabled{Boolean|是否禁用}
- change{Function|上传服务端成功的回调事件，参数是上传附件的列表}
- error{Function|上传服务端失败的回调事件，参数是错误对象}

`示例代码`

```bash
# template
<template>
  <UploadFile
    action-url="/api/basedata/upload"
    :initial-value="form.fileList"
    @change="successHandler"
  />
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
