<h1 align="center">
  A Vue AjaxButton Component by jzy
</h1>

#### AjaxButton 组件调用

`组件的引用`

```bash
# main.js
import AjaxButton from '@/components/AjaxButton';
Vue.use(AjaxButton);
```

`组件参数API`

- click{Function|点击按钮触发的事件，是参数而不是事件}
- 其他参数同 el-button 组件

`组件插槽`

- default{Button 里的文本内容}

`示例代码`

```bash
# template
<template>
  <AjaxButton size="small" :click="saveHandle">保存</AjaxButton>
  <AjaxButton type="warning" :click="saveHandle.bind(this, 1)">退回</AjaxButton>
</template>

# js
import { saveApi } from '@/api/xxx/xxx';

export default {
  data() {
    return {
      formData: {}
    };
  },
  methods: {
    async saveHandle(type) {
      // if (type === 1) {
      //   业务逻辑判断
      // }
      const res = await saveApi(this.formData);
    }
  }
};
```
