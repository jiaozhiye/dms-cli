<h1 align="center">
  A Vue Anchor Component by jzy
</h1>

#### Anchor 组件调用

`组件的引用`

```bash
# main.js
import Anchor from '@/components/Anchor';
Vue.use(Anchor);
```

`组件参数API`

- labelList{Array|锚点选项卡的数据列表}
- labelWidth{Number|左侧 Label 标签的宽度}

`示例代码`

```bash
# template
<template>
  <Anchor :labelList="labels">
    <div class="line" id="row-01">
      第一行
    </div>
    <div class="line" id="row-02">
      第二行
    </div>
    <div class="line" id="row-03">
      第三行
    </div>
  </Anchor>
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
