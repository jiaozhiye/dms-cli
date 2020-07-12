## API

### WebPrint

| 参数    | 说明                                                        | 类型   | 默认值 |
| ------- | ----------------------------------------------------------- | ------ | ------ |
| fileUrl | 后台返回的打印文件地址，格式为 pdf 类型                     | string | -      |
| click   | 按钮单击事件(异步方法)，用于调用打印接口，返回 pdf 文件地址 | func   | -      |

### 插槽

| 插槽名称 | 说明           |
| -------- | -------------- |
| default  | 打印按钮的文本 |

### 示例

```bash
# template
<template>
  <web-print type="primary" fileUrl="/static/webPrint/222.pdf">pdf 打印</web-print>
</template>

# js
```
