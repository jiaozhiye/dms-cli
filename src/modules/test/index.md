## 目录结构

```
├─ api                    # ajax 接口管理文件夹
│  ├─ 用例名称             # 用例菜单名称(与 pages 下的一致)
|  |  ├─ index.js         # 用例接口文件
│  ├─ server.js           # 微服务前缀管理文件
├─ pages                  # 用例页面管理文件夹
│  ├─ 用例名称             # 用例菜单名称(与 api 下的一致)
│  |  ├─ assets           # 用例的静态资源(定制化页面等特殊功能，否则不建议使用)
│  |  ├─ lang             # 用例多语言(mep 没有此功能)
│  |  ├─ index.vue        # 用例主页面
│  |  ├─ xxx.vue          # 用例交互页面
│  ├─ printTemplate       # 打印模板管理文件夹
│  |  ├─ xxx.vue          # 打印模板名称
├─ routes                 # 路由管理文件夹
│  ├─ index.route.js      # 路由表配置文件
├─ index.md               # 说明文档(可以省略)
```
