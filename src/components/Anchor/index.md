## API

### Anchor

| 参数       | 说明                                    | 类型   | 默认值 |
| ---------- | --------------------------------------- | ------ | ------ |
| labelList  | 锚点选项卡的配置列表，[配置项](#labels) | array  | -      |
| labelWidth | 左侧 Label 容器的宽度，单位 px          | number | -      |

### 方法

| 方法名称 | 说明                 | 参数 | 返回值 |
| -------- | -------------------- | ---- | ------ |
| REFRESH  | 重新计算 Scroll 组件 | -    | -      |

### labels

| 参数  | 说明                          | 类型   | 默认值 |
| ----- | ----------------------------- | ------ | ------ |
| title | 选项卡名称                    | string | -      |
| id    | 组件子元素的 id，用于锚点定位 | string | -      |

### 示例

说明：锚点组件的外层容器，需要有固定高度，否则锚点组件不会出现滚动条

```bash
# template
<template>
  <anchor :labelList="labels">
    <anchor-item id="row-01">
      内容1
    </anchor-item>
    <anchor-item id="row-02">
      内容2
    </anchor-item>
    <anchor-item id="row-03">
      内容3
    </anchor-item>
  </anchor>
</template>

# js
export default {
  data() {
    return {
      labels: [{ title: '选项卡1', id: 'row-01' }, { title: '选项卡2', id: 'row-02' }, { title: '选项卡3', id: 'row-03' }]
    };
  },
};
```
