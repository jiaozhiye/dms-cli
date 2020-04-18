## 菜单数据格式

```
[
  {
    title: '备件管理',
    key: '/bjgl',
    icon: 'icon-barchart',                  // 一级菜单的图标
    children: [
      {
        title: '采购管理',
        key: '/bjgl/cggl',
        children: [
          {
            title: '备件采购订单',           // 标题
            key: '/bjgl/cggl/dd',           // 路由路径
            permission: ['save', 'update']  // 按钮操作权限
          },
        ]
      }
    ]
  }
]
```
