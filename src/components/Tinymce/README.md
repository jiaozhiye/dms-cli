<h1 align="center">
  A Vue Tinymce Component by jzy
</h1>

#### Tinymce 组件调用

`组件的引用`

```bash
# main.js
import Tinymce from '@/components/Tinymce';
Vue.use(Tinymce);
```

`组件参数API`

- v-model{String|富文本编辑器文本内容，双向绑定}
- height{Number|组件高度，默认 300}
- actionUrl{String|上传图片的路径，必选参数}
- fixedSize{Array|上传图片裁剪框的宽高比 [w, h]，默认是 5:4}
- wordsLimit{Number|富文本编辑器的字数限制，默认是 50000}
- isUploadImage{Boolean|是否显示上传图片按钮}
- disabled{Boolean|富文本编辑器是否禁用}
- change{Function|文本变化的回掉事件，参数是当前内容文本}

`示例代码`

```bash
# template
<template>
  <tinymce v-model="content" :height="300" actionUrl="/api/basedata/upload" />
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
