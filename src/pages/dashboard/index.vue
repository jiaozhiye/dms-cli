<template>
  <div class="text">
    <Spin :spinning="loading" tip="Loading...">
      <div>标题</div>
      <FormPanel :list="formList" @formChange="asdasd" />
    </Spin>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      loading: false,
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
        },
        {
          type: 'INPUT_CASCADER',
          label: '联机2',
          fieldName: 'ccc',
          placeholder: '请输入标题名称...',
          style: { minWidth: '300px' },
          options: {
            titles: ['品牌', '车型', '车系']
          },
          itemList: [],
          rules: [{ required: true, message: '请输入联机', trigger: 'change' }]
        },
        {
          type: 'UPLOAD_IMG',
          label: '上传身份证',
          fieldName: 'wayPicture',
          placeholder: '上传身份证...',
          upload: {
            actionUrl: '/api/file/oss/upload',
            fixedSize: [5, 3],
            limit: 2,
            isCalcHeight: true
          }
        },
        {
          type: 'UPLOAD_FILE',
          label: '上传文件',
          fieldName: 'wayFiles',
          placeholder: '上传文件...',
          rules: [{ required: true, message: '请上传文件', trigger: 'change' }],
          initialValue: [{ name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg' }],
          upload: {
            actionUrl: '/api/file/oss/upload',
            limit: 2
          }
        }
      ];
    },
    asdasd(val) {
      console.log(val);
    }
  },
  created() {
    this.formList[1].initialValue = 'asdas';
    this.formList[2].initialValue = '1,1-2,1-2-1';
  },
  mounted() {
    this.loading = true;
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
      this.formList[3].itemList = [
        {
          text: '一级分类1',
          value: '1',
          children: [
            {
              text: '二级分类一级1',
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
      this.loading = false;
    }, 3000);
  }
};
</script>

<style scoped lang="less">
.text {
  font-size: 26px;
  padding-top: 30vh;
}
</style>
