## API

### MultiuseButton

| 参数     | 说明                                             | 类型                                                    | 默认值 |
| -------- | ------------------------------------------------ | ------------------------------------------------------- | ------ |
| click    | 点击事件(异步方法)，用于实现 ajax 的防止重复提交 | func                                                    | -      |
| size     | 尺寸                                             | medium \| small \| mini                                 | small  |
| type     | 类型                                             | primary \| success \| warning \| danger \| info \| text | -      |
| plain    | 是否朴素按钮                                     | boolean                                                 | false  |
| disabled | 是否禁用                                         | boolean                                                 | false  |
| loading  | 是否加载中状态                                   | boolean                                                 | false  |
| icon     | 图标类名                                         | string                                                  | -      |
| authList | 权限数组，通过 authority 混入                    | array                                                   | -      |
| authMark | 控制该按钮权限的标识符                           | string                                                  | -      |

| divider | 按钮前、后的分隔符 | before \| after | |

### 插槽

| 插槽名称 | 说明       |
| -------- | ---------- |
| default  | 按钮的文本 |

### 示例

```bash
# template
<template>
  <multiuse-button @click="closeHandle">关闭</multiuse-button>
  <multiuse-button :click="saveHandle" :auth-list="auths" auth-mark="/api/aaa">保存<multiuse-button>
  <multiuse-button type="warning" :click="saveHandle.bind(this, 1)">保存</multiuse-button>
</template>

# js
import { authority } from '@/mixins/authMixin';

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
      const res = await api(this.formData);
    },
    closeHandle() {}
  }
};
```
