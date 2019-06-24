## 路由映射表

1. 建议每个一级分类对应一个路由映射表文件，防止单文件体积过大难以维护。
2. 路由组件必须要有 name 值，建议遵循组件名称首字母大写的规范。
3. 路由配置项中的 keepAlive，表示在路由切换时是否缓存该组件。

## 菜单数据格式

```
[
  {
    title: '备件管理',
    key: '/bjgl',
    pyt: 'bjgl',
    icon: 'el-icon-data-analysis',
    children: [
      {
        title: '采购管理',
        key: '/bjgl/cggl',
        pyt: 'cggl',
        icon: 'el-icon-folder-opened',
        children: [
          {
            title: '备件采购订单',                // 标题
            key: '/bjgl/cggl/dd',                // 路由路径
            pyt: 'bjcgdd',                       // 拼音头
            icon: '',                            // 图标
            permission: ['saveBtn', 'updateBtn'] // 不具备的操作权限
          },
        ]
      },
    ]
  }
]
```

1. 服务端的菜单数据项中的 permission 为页面组件中元素的操作权限，在组件里通过 mixin 导入。
   - 示例：permission: ['saveBtn', 'updateBtn'] -> 说明该用户没有点击保存和编辑按钮的权限。
