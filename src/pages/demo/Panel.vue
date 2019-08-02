<template>
  <div>
    <div style="height: 1000px">
      <el-button @click="visible = true">三级交互</el-button>
      <FormPanel :list="formList" formType="add" style="margin-top: 20px" />
    </div>
    <div
      :style="{
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
        borderTop: '1px solid #e9e9e9',
        padding: '10px 20px',
        background: '#fff',
        textAlign: 'right'
      }"
    >
      <el-button @click="onClose">取 消</el-button>
      <el-button @click="onClose" type="primary">提 交</el-button>
    </div>
    <BaseDialog
      :visible.sync="visible"
      destroyOnClose
      :containerStyle="{height: 'calc(100% - 60px)', overflow: 'auto', paddingBottom: '60px'}"
    >
      <Modal @close="closeHandler" />
    </BaseDialog>
  </div>
</template>

<script>
import Modal from './Modal';

export default {
  name: 'role',
  components: {
    Modal
  },
  data() {
    return {
      visible: false,
      formList: this.createFormList()
    };
  },
  methods: {
    createFormList() {
      return [
        {
          type: 'INPUT',
          label: '搜索',
          fieldName: 'title',
          placeholder: '请输入标题名称...',
          initialValue: '',
          rules: [{ required: true, message: '请输入标题名称', trigger: 'blur' }, { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }]
        },
        {
          type: 'SELECT',
          label: '所属分类',
          fieldName: 'cid',
          placeholder: '所属分类',
          itemList: [{ text: '热点', value: '1' }, { text: '资讯', value: '2' }],
          rules: [{ required: true, message: '请选择所属分类', trigger: 'change' }]
        },
        {
          type: 'DATE',
          label: '日期',
          fieldName: 'date',
          placeholder: '选择日期',
          rules: [{ required: true, message: '请选择日期', trigger: 'change' }]
        },
        {
          type: 'RANGE_DATE',
          label: '日期区间',
          style: { minWidth: '200px' },
          fieldName: 'startTime|endTime'
        },
        {
          type: 'MULTIPLE_SELECT',
          label: '兴趣爱好',
          fieldName: 'hobby',
          placeholder: '兴趣爱好',
          itemList: [{ text: '篮球', value: '1' }, { text: '足球', value: '2' }, { text: '乒乓球', value: '3' }],
          rules: [{ required: true, message: '请选择兴趣爱好', trigger: 'change' }]
        },
        {
          type: 'SEARCH_HELPER',
          label: '搜索帮助',
          fieldName: 'person',
          placeholder: '请输入员工名称...',
          initialValue: '',
          request: {
            fetchApi: () => {},
            fieldKey: 'name'
          },
          rules: [{ required: true, message: '请输入员工名称', trigger: 'change' }]
        },
        {
          type: 'INPUT_NUMBER',
          label: '数量',
          fieldName: 'number',
          placeholder: '请输入数量...',
          initialValue: undefined,
          rules: [{ required: true, message: '请输入数量', trigger: 'blur' }]
        }
      ];
    },
    onClose() {
      this.$emit('close', false);
    },
    closeHandler(val) {
      this.visible = val;
    }
  }
};
</script>
