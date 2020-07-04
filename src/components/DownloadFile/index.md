## API

### DownloadFile

| 参数      | 说明                                     | 类型    | 默认值 |
| --------- | ---------------------------------------- | ------- | ------ |
| actionUrl | 下载的地址，必要参数                     | string  | -      |
| headers   | 上传/下载请求，header 头携带的自定义参数 | object  | -      |
| fileName  | 下载后的文件名                           | string  | -      |
| params    | 下载接口的额外请求参数                   | object  | -      |
| disabled  | 是否禁用                                 | boolean | false  |

### 事件

| 事件名称 | 说明               | 回调参数        |
| -------- | ------------------ | --------------- |
| success  | 成功下载文件后触发 | -               |
| error    | 下载失败时触发     | Function(error) |

### 插槽

| 插槽名称 | 说明           |
| -------- | -------------- |
| default  | 下载按钮的文本 |

### 示例

```bash
# template
<template>
  <download-file action-url="/api/basedata/upload">附件下载</download-file>
</template>

# js
export default {};
```
