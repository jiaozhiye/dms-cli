## API

### Anchor

| 参数       | 说明                                   | 类型   | 默认值 |
| ---------- | -------------------------------------- | ------ | ------ |
| labelList  | 锚点选项卡的配置列表，[配置项](#label) | array  | -      |
| labelWidth | 左侧 Label 容器的宽度，单位 px         | number | -      |

### 方法

| 方法名称 | 说明                 | 参数 | 返回值 |
| -------- | -------------------- | ---- | ------ |
| REFRESH  | 重新计算 Scroll 组件 | -    | -      |

### label

| 参数  | 说明                          | 类型   | 默认值 |
| ----- | ----------------------------- | ------ | ------ |
| title | 选项卡名称                    | string | -      |
| id    | 组件子元素的 id，用于锚点定位 | string | -      |

### 示例

```bash
# template
<template>
  <anchor :labelList="labels">
    <div class="line" id="row-01">
      内容1
    </div>
    <div class="line" id="row-02">
      内容2
    </div>
    <div class="line" id="row-03">
      内容3
    </div>
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
