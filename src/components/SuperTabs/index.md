## API

### SuperTabs

| 参数           | 说明                                       | 类型           | 默认值 |
| -------------- | ------------------------------------------ | -------------- | ------ |
| initialValue   | 当前激活选项卡的标题，必要参数             | string         | -      |
| tabBarGutter   | tabs 之间的间隙，单位 px                   | number         | 0      |
| size           | 尺寸                                       | small \| large | small  |
| animated       | 是否开启选项卡切换时动画                   | boolean        | true   |
| lazyLoad       | 是否延迟加载选项卡组件                     | boolean        | true   |
| destroyOnClose | 切换选项卡并处于隐藏状态时，是否销毁子组件 | boolean        | false  |

### 事件

| 事件名称 | 说明                 | 回调参数                     |
| -------- | -------------------- | ---------------------------- |
| change   | 选项卡切换选中时触发 | Function(activeTitle:string) |

### TabPanel

| 参数     | 说明               | 类型    | 默认值 |
| -------- | ------------------ | ------- | ------ |
| label    | 选项卡标题名称     | string  | -      |
| disabled | 是否禁用当前选项卡 | boolean | false  |

### 插槽

| 插槽名称     | 说明                   |
| ------------ | ---------------------- |
| extraContent | 对选项卡顶部区域的扩展 |

### 示例

```bash
# template
<template>
  <super-tabs>
    <div slot="extraContent">
      <el-radio-group v-model="fetchParams.radioValue" size="small" @change="changeHandle">
        <el-radio-button label="1001">今日</el-radio-button>
        <el-radio-button label="1002">本周</el-radio-button>
        <el-radio-button label="1003">本月</el-radio-button>
        <el-radio-button label="1004">本年</el-radio-button>
      </el-radio-group>
    </div>
    <tab-panel label="选项卡1">
      <Chart1 :fetchapi="() => {}" :params="fetchParams" />
    </tab-panel>
    <tab-panel label="选项卡2">
      <Chart2 :fetchapi="() => {}" :params="fetchParams" />
    </tab-panel>
  </super-tabs>
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
      defaultTabLabel: '选项卡1'
    };
  }
};
```