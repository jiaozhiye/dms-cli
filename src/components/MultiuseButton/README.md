<h1 align="center">
  A Vue MultiuseButton Component by jzy
</h1>

#### MultiuseButton 组件调用

`组件的引用`

```bash
# main.js
import MultiuseButton from '@/components/MultiuseButton';
Vue.use(MultiuseButton);
```

`组件参数API`

- click{Function|点击按钮触发的事件方法，用于实现 ajax 的防止重复提交，注意：是参数而不是事件}
- divider{String|按钮前/后的分隔符，值为 before/after}
- auth-list{Array|权限数组，通过 authority 的混入，使用 this.auths 即可}
- auth-mark{String|控制该按钮权限的标识符，业务的 ajax 接口地址}
- containerStyle{Object|按钮自定义的 css 样式}
- 其他参数同 el-button 组件

`组件插槽`

- default{Button 里的文本内容}

`示例代码`

```bash
# template
<template>
  <multiuse-button size="small" @click="closeHandle">关闭</multiuse-button>
  <multiuse-button size="small" :click="saveHandle" :auth-list="auths" auth-mark="/api/aaa">保存<multiuse-button>
  <multiuse-button type="warning" :click="saveHandle.bind(this, 1)">保存</multiuse-button>
</template>

# js
import { authority } from '@/utils/authMixin';
import { saveApi } from '@/api/xxx/xxx';

export default {
  mixins: [authority],
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
    },
    closeHandle() {}
  }
};
```
