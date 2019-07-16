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
$ yarn run dev

# 发布，构建生产环境代码
$ yarn run build
```

## 主要功能

```
- 权限验证
  - 菜单/页面级权限
  - 页面按钮级权限

- 导航菜单
  - 支持导航快速检索/收藏和常用导航
  - 支持多级菜单，底层递归处理
  - 支持自适应收缩侧边栏
  - 支持同时开启多个路由页面，并支持页面缓存
  - 支持动态面包屑功能

- 提供的组件
  - dialog 模态框组件，支持子组件的销毁
  - baseTable 表格组件
  - drawer 抽屉组件，支持子组件的销毁
  - lazyLoadTab 选项卡的按需/动态加载
  - topFilter 页面头部筛选组件
  - uploadCropper 图片上传组件，支持图片的裁剪和压缩
```

欢迎访问个人 [github](https://github.com/jiaozhiye/) 主页.
