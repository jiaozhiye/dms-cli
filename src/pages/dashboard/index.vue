<template>
  <div class="text">
    <FormPanel :list="formList" @formChange="asdasd" />
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      formList: this.createFormList()
    };
  },
  methods: {
    createFormList() {
      return [
        {
          type: 'RANGE_INPUT_NUMBER',
          label: '区间',
          fieldName: 'bbb',
          rules: [{ required: true, message: '请输入区间', trigger: 'blur' }]
        },
        {
          type: 'INPUT',
          label: '搜索',
          fieldName: 'title',
          placeholder: '请输入标题名称...',
          initialValue: '',
          rules: [{ required: true, message: '请输入标题名称', trigger: 'blur' }, { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }]
        },
        {
          type: 'INPUT_CASCADER',
          label: '联机',
          fieldName: 'aaa',
          placeholder: '请输入标题名称...',
          style: { minWidth: '300px' },
          options: {
            titles: ['品牌', '车型', '车系']
          },
          itemList: [],
          rules: [{ required: true, message: '请输入联机', trigger: 'change' }]
        }
      ];
    },
    asdasd(val) {
      console.log(val);
    }
  },
  mounted() {
    setTimeout(() => {
      this.formList[2].itemList = [
        {
          text: '一级分类1',
          value: '1',
          children: [
            {
              text: '二级分类一级分类1一级分类1一级分类11-1',
              value: '1-1',
              children: [
                {
                  text: '三级分类1-1',
                  value: '1-1-1'
                },
                {
                  text: '三级分类1-2',
                  value: '1-1-2'
                }
              ]
            },
            {
              text: '二级分类1-2',
              value: '1-2',
              children: [
                {
                  text: '三级分类2-1',
                  value: '1-2-1'
                },
                {
                  text: '三级分类2-2',
                  value: '1-2-2'
                }
              ]
            }
          ]
        },
        {
          text: '一级分类2',
          value: '2',
          children: [
            {
              text: '二级分类2-1',
              value: '2-1'
            }
          ]
        }
      ];
    }, 3000);
    setTimeout(() => {
      this.formList[2].initialValue = '1,1-2,1-2-1';
    }, 2000);
  }
};
</script>

<style scoped lang="less">
.text {
  text-align: center;
  font-size: 26px;
  padding-top: 30vh;
}
</style>
