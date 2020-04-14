<template>
  <div>
    <form-panel ref="formPanel" :initial-value="formValue" :list="formList" label-width="90" />
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
  name: '',
  data() {
    return {
      formList: this.createFormList(),
      formValue: {}
    };
  },
  computed: {
    $formPanel() {
      return this.$refs.formPanel;
    }
  },
  methods: {
    createFormList() {
      return [
        {
          type: 'INPUT',
          label: '表单项1',
          fieldName: 'a'
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
          type: 'UPLOAD_FILE',
          label: '上传文件',
          fieldName: 'wayFiles',
          rules: [{ required: true, message: '请上传文件', trigger: 'change' }],
          upload: {
            actionUrl: '/api/file/oss/upload',
            limit: 2,
            params: {},
            fileTypes: ['jpg', 'png']
          }
        },
        {
          type: 'UPLOAD_IMG',
          label: '上传身份证',
          fieldName: 'wayPicture',
          rules: [{ required: true, message: '请上传身份证', trigger: 'change' }],
          upload: {
            actionUrl: '/api/file/oss/upload',
            fixedSize: [5, 3],
            isCalcHeight: true,
            limit: 1,
            params: {}
          }
        }
      ];
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
