## API

### VirtualScroll

| 参数        | 说明                                                       | 类型                   | 默认值   |
| ----------- | ---------------------------------------------------------- | ---------------------- | -------- |
| items       | 显示的数据列表，必要参数                                   | array                  | -        |
| keyField    | 标识和优化渲染视图的字段                                   | string                 | id       |
| direction   | 滚动方向                                                   | vertical \| horizontal | vertical |
| itemSize    | 行项的元素高度（水平模式下为宽度），用于计算滚动尺寸和位置 | number                 | -        |
| minItemSize | 如果行项的高度（或水平模式下的宽度）未知，则使用的最小尺寸 | number                 | -        |
| sizeField   | 用于在可变尺寸模式下获取行项尺寸的字段                     | string                 | size     |

### 事件

| 事件名称 | 说明                       | 回调参数 |
| -------- | -------------------------- | -------- |
| resize   | 当组件容器的大小改变时触发 | -        |
| visible  | 当组件显示时触发           | -        |
| hidden   | 当滚组件隐藏时触发         | -        |

### 作用域插槽

| 参数   | 说明                 | 类型    | 默认值 |
| ------ | -------------------- | ------- | ------ |
| item   | 行记录数据           | object  | -      |
| index  | 当前行项的索引       | number  | -      |
| active | 视图是否处于活动状态 | boolean | -      |

### 示例

```bash
# template
<template>
  <VirtualScroll :items="list" key-field="id" :item-size="40" class="my-scroller">
    <template slot-scope="{ item, index }">
      <div class="text">
        {{ index + '|' + item.name }}
      </div>
    </template>
  </VirtualScroll>
</template>

# js
const arr = [];
for (let i = 0; i < 500; i++) {
  arr[i] = { id: i + 1, name: 'hello' };
}

export default {
  data() {
    return {
      list: arr
    };
  }
};
```
