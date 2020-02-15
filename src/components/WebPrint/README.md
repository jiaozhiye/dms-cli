<h1 align="center">
  A Vue WebPrint Component by jzy
</h1>

#### WebPrint 组件调用

`组件的引用`

```bash
# main.js
import WebPrint from '@/components/WebPrint';
Vue.use(WebPrint);
```

`组件参数API`

- fileUrl{String|后台返回的打印文件，格式为 pdf 类型}
- click{Function|点击按钮触发的事件方法(异步方法)，用于调用打印接口，返回值是 pdf 文件地址}

`组件插槽`

- default{Button 里的文本内容，默认文字为 -> 打印}

`示例代码`

```bash
# template
<template>
  <web-print size="small" type="primary" fileUrl="/static/webPrint/222.pdf">pdf 打印</web-print>
</template>

# js
```
