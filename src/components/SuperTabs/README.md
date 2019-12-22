<h1 align="center">
  A Vue SuperTabs Component by jzy
</h1>

#### SuperTabs 组件调用

`组件的引用`

```bash
# main.js
import SuperTabs from '@/components/SuperTabs';
Vue.use(SuperTabs);
```

`组件参数API`

- initialValue{String|当前选中卡的标题}
- tabBarGutter{Number|tabs 之间的间隙，单位是 px}
- size{String|选项卡大小 small/large，默认是 samll}
- animated{Boolean|是否开启选项卡切换时动画，默认 true}
- lazyLoad{Boolean|是否延迟加载选项卡组件，默认 true}
- destroyOnClose{Boolean|切换选项卡并处于隐藏状态时，是否销毁子组件，默认是 false}
- change{Function|自定义事件，tab 切换选中时触发，参数是选中标签的标题}

`子组件 tab-panel`

- label{String|选项卡标题名称}
- disabled{Boolean|是否禁用当前选项卡}

`组件扩展插槽`

- extraContent{String|槽口名称，对选项卡顶部的扩展}

`示例代码`

```bash
# template
<template>
  <div slot="extraContent">
    <el-radio-group v-model="fetchParams.radioValue" size="small" @change="changeHandle">
      <el-radio-button label="1001">今日</el-radio-button>
      <el-radio-button label="1002">本周</el-radio-button>
      <el-radio-button label="1003">本月</el-radio-button>
      <el-radio-button label="1004">本年</el-radio-button>
    </el-radio-group>
  </div>
  <tab-panel label="备件出库成本">
    <Chart1 :fetchapi="() => {}" :params="fetchParams" />
  </tab-panel>
  <tab-panel label="出库成本结构">
    <Chart2 :fetchapi="() => {}" :params="fetchParams" />
  </tab-panel>
</SuperTabs>
</template>

# js
import Chart1 from '@/charts/dashboard/chart1';
import Chart2 from '@/charts/dashboard/chart2';

export default {
  components: {
    Chart1,
    Chart2
  },
  data() {
    return {
      fetchParams: {
        radioValue: '1001'
      },
      defaultTabLabel: '备件出库成本'
    };
  }
};
```
