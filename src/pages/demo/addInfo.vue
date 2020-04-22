<template>
  <div>
    <form-panel ref="formPanel" :initial-value="formValue" :list="formList" label-width="90" :scrollContainer="$scrollNode" />
    <div
      :style="{
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 9,
        borderTop: '1px solid #d9d9d9',
        padding: '10px 15px',
        background: '#fff',
        textAlign: 'right'
      }"
    >
      <el-button @click="cancelHandle()">取 消</el-button>
      <multiuse-button type="primary" :click="saveHandle">提 交</multiuse-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formList: this.createFormList(),
      formValue: { p: '1' }
    };
  },
  computed: {
    $formPanel() {
      return this.$refs.formPanel;
    },
    // 滚动条容器
    $scrollNode() {
      return this.$parent.$el.querySelector('.container');
    }
  },
  methods: {
    createFormList() {
      return [
        {
          type: 'INPUT',
          label: '表单项1',
          fieldName: 'a',
          labelOptions: {
            fieldName: 'p',
            options: {
              itemList: [
                { text: '选项1', value: '1' },
                { text: '选项2', value: '2' }
              ]
            }
          },
          rules: [{ required: true, message: '请输入', trigger: 'blur' }]
        },
        {
          type: 'SELECT',
          label: '表单项2',
          fieldName: 'b',
          options: {
            itemList: [
              { text: '列表1', value: '1' },
              { text: '列表2', value: '2' }
            ],
            filterable: true
          }
        },
        {
          type: 'DATE',
          label: '表单项3',
          fieldName: 'c',
          options: {
            dateType: 'date'
          }
        },
        {
          type: 'INPUT',
          label: '表单项4',
          fieldName: 'd',
          style: { width: `calc(100% - 30px)` },
          descOptions: {
            isTooltip: true,
            content: `说明文字`
          }
        },
        {
          type: 'INPUT_NUMBER',
          label: '表单项5',
          fieldName: 'e',
          style: { width: `calc(100% - 30px)` },
          descOptions: {
            content: '元'
          }
        },
        {
          type: 'CHECKBOX',
          label: '表单项6',
          fieldName: 'f',
          options: {
            trueValue: '1',
            falseValue: '0'
          },
          onChange: val => {
            this.findFormItem('g').disabled = val === '1';
          }
        },
        {
          type: 'DATE',
          label: '表单项7',
          fieldName: 'g',
          options: {
            dateType: 'exactdate'
          }
        },
        {
          type: 'RANGE_INPUT_NUMBER',
          label: '表单项8',
          fieldName: 'h|i',
          options: {
            min: 1,
            max: 100
          }
        },
        {
          type: 'INPUT',
          label: '表单项9',
          fieldName: 'j'
        },
        {
          type: 'INPUT_TREE',
          label: '表单项10',
          fieldName: 'k',
          options: {
            itemList: [
              {
                value: 1,
                text: '一级 1',
                children: [
                  {
                    value: 4,
                    text: '二级 1-1',
                    children: [
                      {
                        value: 9,
                        text: '三级 1-1-1'
                      },
                      {
                        value: 10,
                        text: '三级 1-1-2'
                      }
                    ]
                  }
                ]
              },
              {
                value: 2,
                text: '一级 2',
                children: [
                  {
                    value: 5,
                    text: '二级 2-1'
                  },
                  {
                    value: 6,
                    text: '二级 2-2'
                  }
                ]
              },
              {
                value: 3,
                text: '一级 3',
                children: [
                  {
                    value: 7,
                    text: '二级 3-1'
                  },
                  {
                    value: 8,
                    text: '二级 3-2'
                  }
                ]
              }
            ]
          },
          rules: [{ required: true, message: '请选择所属机构', trigger: 'change' }]
        },
        {
          type: 'SELECT',
          label: '表单项11',
          fieldName: 'l',
          options: {
            filterable: true
          },
          request: {
            fetchApi: () => {},
            params: {},
            datakey: 'items',
            valueKey: 'name'
          }
        },
        {
          type: 'MULTIPLE_SELECT',
          label: '表单项12',
          fieldName: 'm',
          options: {
            itemList: [
              { text: '篮球', value: '1' },
              { text: '足球', value: '2' },
              { text: '乒乓球', value: '3' }
            ]
          }
        },
        {
          type: 'UPLOAD_FILE',
          label: '上传文件',
          fieldName: 'n',
          upload: {
            actionUrl: '/api/file/oss/upload',
            limit: 2,
            params: {},
            fileTypes: ['jpg', 'png']
          }
        },
        {
          type: 'UPLOAD_IMG',
          label: '上传图片',
          fieldName: 'o',
          upload: {
            actionUrl: '/api/file/oss/upload',
            fixedSize: [5, 3],
            isCalcHeight: true,
            limit: 1,
            params: {}
          }
        },
        {
          type: 'TINYMCE',
          label: '表单项12',
          selfCols: 3,
          fieldName: 'z'
        }
      ];
    },
    findFormItem(val) {
      return this.formList.find(x => x.fieldName === val);
    },
    async saveHandle() {
      const [err, res] = await this.$formPanel.GET_FORM_DATA();
      if (err) return;
      console.log(res);
      this.cancelHandle('refresh');
    },
    cancelHandle(val) {
      this.$emit('close', false, val);
    }
  }
};
</script>
