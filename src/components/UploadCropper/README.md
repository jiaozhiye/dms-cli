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
- initialValue{Array|默认显示的图片项，值的格式为 { name: '文件名', url: '地址' }}
- fixedSize{Array|裁剪框的宽高比，[w, h]}
- isCalcHeight{Boolean|是否根据裁剪图片宽高比自动计算上传组件容器高度，默认值 false}
- limit{Number|支持上传图片的数量，默认是 1}
- titles: {Array|图片对应的标题，元素的个数与 limit 一致}
- tipText{String|上传图片格式的提示文字}
- disabled{Boolean|是否禁用}
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
