## 说明

- DMS 管理系统，基于 Vue 的前端集成解决方案。

## 前序准备

- 本地安装 nodejs 请使用 v12.16.0 及以上版本，建议使用 nvm 管理。
- 建议使用 yarn 管理 npm 依赖。
- 编译器统一使用 VScode，必要的插件列表：
  - Vetur
  - Prettier
  - EditorConfig
  - ESLint

## 安装

### 使用 yarn 或 npm 安装

```bash
# 安装依赖
$ yarn install 或 npm install

# 启动本地服务
$ npm run start 或 npm run dev

# 发布，构建生产环境代码
$ npm run build
```

## 微前端拆分，允许修改的公共文件

```
- config/index.js 请求代理文件

注意：npm 依赖需要统一管理，不允许私自安装；公共的表单校验规则统一管理
```

## 组件列表

```
- Anchor 锚点组件
- BaseDialog 模态框组件，支持子组件的销毁
- BasePrint 基于 Lodop 插件的打印组件
- BaseTable 表格组件
- BreakSpace 功能模块的分隔符组件
- ButtonArea 功能按钮区的容器组件
- CountUp 数字计数动画组件
- DownloadFile 文件导出及下载组件
- Drawer 抽屉组件，支持子组件的销毁
- FormPanel 表单操作的功能组件
- JsonToExcel 导出 excel/csv 组件
- LazyLoadTab 选项卡的按需/动态加载
- MultiuseButton 多功能按钮的组件，可实现权限控制及 ajax 防止重复提交
- Pinyin 中文字符转换成拼音插件
- PortalPage 对接大众 portal 系统组件
- Spin 加载中组件
- SuperTabs 选项卡组件，支持动画切换及顶部插槽扩展功能
- Tinymce 富文本编辑器组件
- TopFilter 页面头部筛选组件
- UploadCropper 图片上传组件，支持图片的裁剪和压缩
- UploadFile 附件上传组件
- VirtualScroll 虚拟滚动组件
- VirtualTable 新的表格组件
- WebPrint 浏览器的 pdf 打印组件
```

## 目录结构

```
├── build                      # webpack 构建相关
├── config                     # webpack 参数配置
├── static                     # 资源文件
├── public                     # 公共资源
│   ├── index.html             # 所有请求
│   ├── favicon.ico            # favicon 图标
├── src                        # 源代码
│   ├── api                    # 所有请求
│   ├── assets                 # 静态资源
│   ├── charts                 # 图表组件
│   ├── components             # 全局公用组件
│   ├── config                 # 全局配置
│   ├── directive              # 全局指令
│   ├── filters                # 全局 filter
│   ├── layout                 # 全局 layout
│   ├── mixins                 # 全局混入
│   ├── mock                   # 项目 mock 模拟数据
│   ├── pages                  # 所有页面
│   ├── routes                 # 路由
│   ├── store                  # 全局 store 管理
│   ├── utils                  # 全局公用方法
│   ├── app.js                 # 根组件
│   └── main.js                # 入口文件
├── .babelrc                   # babel-loader 配置
├── .editorconfig              # EditorConfig 配置
├── .env                       # 开发环境环境常量
├── .eslintignore              # Eslint 忽略清单
├── .eslintrc.js               # Eslint 校验规则
├── .gitignore                 # git 忽略清单
├── .npmrc                     # npm 配置
├── .postcssrc.js              # postcss 配置
├── .prettierrc                # Prettier 配置
├── README.md                  # README.md
└── package.json               # package.json
```

欢迎访问个人 [github](https://github.com/jiaozhiye) 主页.
