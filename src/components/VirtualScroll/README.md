<h1 align="center">
  A Vue VirtualScroll Component by jzy
</h1>

#### VirtualScroll 组件调用

`组件的引用`

```bash
# main.js
import VirtualScroll from '@/components/VirtualScroll';
Vue.use(VirtualScroll);
```

`组件参数API`

- items{Array|显示的数据列表，必要参数}
- keyField{String|标识和优化渲染视图的字段，默认 id}
- direction{String|滚动方向，vertical/horizontal}
- itemSize{Number|行项的元素高度（水平模式下为宽度），用于计算滚动尺寸和位置}
- minItemSize{Number|如果行项的高度（或水平模式下的宽度）未知，则使用的最小尺寸}
- sizeField{String|用于在可变尺寸模式下获取行项尺寸的字段}
- resize{Function|当组件容器的大小改变时触发}
- visible{Function|当组件显示时触发}
- hidden{Function|当滚组件隐藏时触发}

`组件作用域插槽`

- slot-scope：props{Object|插槽参数}
  - item{Object|行记录数据}
  - index{Number|当前行项的索引}
  - active{Boolean|视图是否处于活动状态}

`示例代码`

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
