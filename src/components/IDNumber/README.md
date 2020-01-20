<h1 align="center">
  A reade IDCard info class by jzy
</h1>

#### IDNmber 类的使用

`组件的引用`

```bash
# main.js
import IDNumber from '@/components/IDNumber';
new IDNumber();
```

`IDNumber API`

- createConnect{function|异步方法，创建硬件设备链接，返回值 [err, data]}
- getConnectStatus{function|异步方法，获取设备链接状态，返回值 [err, data]}
- disConnect{function|异步方法，断开硬件设备链接，返回值 [err, data]}
- readCardInfo{function|异步方法，读取身份证卡信息，返回值 [err, data]}
- destroye{function|实例销毁方法，建议在组件卸载时调用}

`注意：`

- 在 Vue 组件卸载时，需要调用销毁方法，防止内存泄漏

`示例代码`

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
