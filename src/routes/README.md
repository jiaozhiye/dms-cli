## 路由映射表

1. 建议每个一级菜单对应一个路由映射表文件，防止单文件体积过大难以维护
2. 路由组件必须要有 name 值，建议遵循组件名称首字母大写的规范
3. 路由配置项中的 keepAlive，表示在路由切换时是否缓存该组件
4. 菜单结构底层是递归构建，只要后台数据满足格式，前端无需处理

## 菜单数据格式

```
[
  {
    title: '备件管理',
    key: '/bjgl',
    pyt: 'bjgl',
    children: [
      {
        title: '采购管理',
        key: '/bjgl/cggl',
        pyt: 'cggl',
        children: [
          {
            title: '备件采购订单',           // 标题
            key: '/bjgl/cggl/dd',           // 路由路径
            pyt: 'bjcgdd',                  // 拼音头
            permission: ['save', 'update']  // 按钮操作权限
          },
        ]
      },
    ]
  }
]
```

1. 服务端的菜单数据项中的 permission 为页面组件中元素的操作权限，在组件里通过 mixin 导入。
   - 示例：permission: ['save', 'update'] -> 说明该用户拥有点击保存和编辑按钮的权限。
2. 具体需要权限控制的按钮，可以使用 MultiuseButton 组件，使用方式请参考对应的 README 文档。
