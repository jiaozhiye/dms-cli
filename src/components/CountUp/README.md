<h1 align="center">
  A Vue CountUp Component by jzy
</h1>

#### CountUp 组件调用

`组件的引用`

```bash
# main.js
import CountUp from '@/components/CountUp';
Vue.use(CountUp);
```

`组件参数API`

- endVal{Number|计数结束时的数值}
- delay{Number|动画延迟时间，毫秒}
- class{String|标签的 class 选择器}

`示例代码`

```bash
# template
<template>
  <CountUp :endVal="215" />
</template>
```
