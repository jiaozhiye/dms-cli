## 说明

- DMS 管理系统，基于 Vue 的前端集成解决方案。

## 前序准备

- 本地安装 nodejs 请使用 v12.3.2 及以上版本，建议使用 nvm 管理。
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
$ yarn install

# 启动本地服务
$ npm run dev

# 发布，构建生产环境代码
$ npm run build
```

## 主要功能

```
- 权限验证
  - 菜单/页面级权限
  - 页面按钮级权限

- 导航菜单
  - 导航快速检索/收藏和常用导航
  - 多级菜单，底层递归处理
  - 自适应收缩侧边栏
  - 头部标签栏导航，并支持页面缓存
  - 动态面包屑

- 提供的组件
  - dialog 模态框组件，支持子组件的销毁
  - baseTable 表格组件
  - drawer 抽屉组件，支持子组件的销毁
  - lazyLoadTab 选项卡的按需/动态加载
  - topFilter 页面头部筛选组件
  - uploadCropper 图片上传组件，支持图片的裁剪和压缩
```

## 目录结构

```
├── build                      # webpack 构建相关
├── config                     # webpack 参数配置
├── static                     # 资源文件
├── src                        # 源代码
│   ├── api                    # 所有请求
│   ├── assets                 # 静态资源
│   ├── components             # 全局公用组件
│   ├── config                 # 全局配置
│   ├── directive              # 全局指令
│   ├── filters                # 全局 filter
│   ├── layout                 # 全局 layout
│   ├── mock                   # 项目 mock 模拟数据
│   ├── pages                  # 所有页面
│   ├── routes                 # 路由
│   ├── store                  # 全局 store 管理
│   ├── utils                  # 全局公用方法
│   ├── App.vue                # 入口页面
│   └── main.js                # 入口文件
├── .babelrc                   # babel-loader 配置
├── .editorconfig              # EditorConfig 配置
├── .env                       # 全局环境常量
├── .gitignore                 # git 忽略清单
├── favicon.ico                # favicon 图标
├── index.html                 # html模板
├── postcss.config.js          # postcss 配置
├── prettier.config.js         # Prettier 配置
├── README.md                  # README.md
└── package.json               # package.json
```

欢迎访问个人 [github](https://github.com/jiaozhiye/) 主页.
