## API

### IDNmber 实例的方法

| 方法名称         | 说明                           | 参数 | 返回值                         |
| ---------------- | ------------------------------ | ---- | ------------------------------ |
| createConnect    | 异步方法，创建硬件设备链接     | -    | 返回错误前置的数组 [err, data] |
| getConnectStatus | 异步方法，获取设备链接状态     | -    | 返回错误前置的数组 [err, data] |
| disConnect       | 异步方法，断开硬件设备链接     | -    | 返回错误前置的数组 [err, data] |
| readCardInfo     | 异步方法，读取身份证卡信息     | -    | 返回错误前置的数组 [err, data] |
| destroye         | 实例销毁方法，在组件卸载时调用 | -    | -                              |

### 示例

注意：在 Vue 组件卸载时，需要调用销毁方法，防止内存泄漏。

```bash
# template
<template>
  <el-button @click="clickHandle">获取身份证信息</el-button>
</template>

# js
import IDNumber from '@/components/IDNumber';

export default {
  data(){
    this.IDNumber = null;
    return {}
  },
  mounted() {
    // 实例化读卡类信息
    this.IDNumber = new IDNumber();
  },
  destroyed() {
    this.IDNumber.destroye();
  },
  methods: {
    async clickHandle() {
      const res = await this.IDNumber.readCardInfo();
      console.log(res);
    }
  }
};
```
