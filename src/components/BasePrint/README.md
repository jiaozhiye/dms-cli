<h1 align="center">
  A Vue BasePrint Component by jzy
</h1>

## 说明文档

1. element-ui >= 2.8.0 版本
2. vue >= 2.5.0 版本
3. 组件依赖一些其他文件，在把组件整合到工程中时需要引入
4. 打印的模板文件不支持 css 样式表，只能书写内联样式
5. 打印模板要使用 table 布局，请参看组件中示例模板代码的书写规范

#### BasePrint 组件调用

`BasePrint 打印组件参数`

- data{Object|打印的数据}
- template{String|调用的打印模板路径，默认前缀为: @/pages/printTemplate/}
- direction{String|打印方向 vertical/horizontal，默认为纵向打印 vertical}
- alwaysPrint{Boolean|是否为连续无分页打印，默认 false}

`PrintTemplate 模板组件参数`

- data{Object|打印的数据}
- isPreview{Boolean|是否显示浏览器预览，开发模板时需要显示，生产环境打印不需要显示预览}

`打印模板 table 标签支持的 class`

- .bor: 全边框
- .bor-hor: 水平边框
- .bor-through: 贯穿边框（水平边框 - 上下边框）
- .fs12: 字体的大小为 12px
- .fs14: 字体的大小为 14px
- .fs16: 字体的大小为 16px
- .tc: 文本居中对齐
- .tr: 文本居右对齐

`处理打印分页`

```
在打印模板文件中，需要分页的位置插入分页符，示例：
<div style="page-break-after: always">&nbsp;</div>
```

`BasePrint 组件暴露的方法`

- EXCUTE_PRINT{Function|开始执行打印}

`示例代码`

```bash
# template
<template>
  <el-button @click="printHandler">打印</el-button>
  <BasePrint ref="print" :data="printList" template="template1" />
</template>

# js
export default {
  data() {
    return {
      printList: {}
    };
  },
  methods: {
    printHandler() {
      this.$refs.print.EXCUTE_PRINT();
    }
  }
};
```
