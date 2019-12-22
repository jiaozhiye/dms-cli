<h1 align="center">
  A Vue DownloadFile Component by jzy
</h1>

#### DownloadFile 组件调用

`组件的引用`

```bash
# main.js
import DownloadFile from '@/components/DownloadFile';
Vue.use(DownloadFile);
```

`组件参数API`

- actionUrl{String|必选参数，下载的地址}
- fileName{String|下载后的文件名}
- params{Object|ajax 下载接口附带的额外参数}
- disabled{Boolean|是否禁用}
- success{Function|下载成功的回调事件}
- error{Function|下载失败的回调事件，参数是错误对象}

`示例代码`

```bash
# template
<template>
  <DownloadFile action-url="/api/basedata/upload" />
</template>

# js
export default {};
```
