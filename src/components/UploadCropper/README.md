<h1 align="center">
  A Vue UploadCropper Component by jzy
</h1>

#### UploadCropper 组件调用

`组件的引用`

```bash
# main.js
import UploadCropper from '@/components/UploadCropper';
Vue.use(UploadCropper);
```

`组件参数API`

- actionUrl{String|必选参数，上传的地址}
- initialValue{String|默认显示图片的地址}
- fixedSize{Array|裁剪框的宽高比，[w, h]}
- tipText{String|上传提示的文字}
- success{Function|上传服务端成功的回调事件，参数是图片地址}
- error{Function|上传服务端失败的回调事件，参数是错误对象}

`示例代码`

```bash
# template
<template>
  <UploadCropper
    action-url="/api/basedata/upload"
    :initial-value="form.imgPath"
    :fixed-size="[4, 5]"
    @success="successHandler"
  />
</template>

# js
export default {
  data() {
    return {
      form: {
        imgPath: ''
      }
    };
  },
  methods: {
    successHandler(val) {
      this.form.imgPath = val;
    }
  }
};
```
