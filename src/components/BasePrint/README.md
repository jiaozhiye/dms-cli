<h1 align="center">
  A Vue BasePrint Component by jzy
</h1>

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:8080
$ npm run dev

# build for production with minification
$ npm run build

# 演示路由
http://localhost:8080/print
http://localhost:8080/template
```

## 说明文档

1. element-ui >= 2.8.0 版本
2. vue >= 2.5.0 版本
3. 组件依赖一些其他文件，在把组件整合到工程中时需要引入
4. 打印的模板文件不支持 css 样式表，只能书写内联样式
5. 打印模板要使用 table 布局，请参看组件中示例模板代码的书写规范

#### BasePrint 组件调用

`BasePrint 打印组件参数`

- data{Object|打印的数据}
- template{String|调用的打印模板名称}
- direction{String|打印方向 vertical/horizontal，默认为纵向打印 vertical}

`PrintTemplate 模板组件参数`

- data{Object|打印的数据}
- isPreview{Boolean|是否显示浏览器预览，开发模板时需要显示，生产环境打印不需要显示预览}

`处理打印分页`

```
在打印模板文件中，需要分页的位置插入分页符，示例：
<div style="page-break-after: always">&nbsp;</div>
```
