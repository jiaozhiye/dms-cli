<template>
  <div>
    <div id="wrapper" class="wrapper">
      <Anchor :label-list="labels">
        <div id="row-01" class="line">
          <FormPanel ref="form" :scrollContainer="outerWrap" :initial-value="val" :list="formList" label-width="100" />
        </div>
        <div id="row-02" class="line">
          <el-button @click="visible = true">三级交互</el-button>
          <BreakSpace label="哈哈哈" />
          <el-button @click="getFormData">获取数据</el-button>
        </div>
        <div id="row-03" class="line">
          <tinymce v-model="content" action-url="/api/file/oss/upload" :height="300" />
        </div>
      </Anchor>
    </div>
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
      <el-button @click="closeDrawer">取 消</el-button>
      <multiuse-button size="small" type="primary" :auth-list="auths" auth-mark="/api/aaa" :click="closeDrawer">提 交</multiuse-button>
    </div>
    <BaseDialog :visible.sync="visible" destroy-on-close :container-style="{ height: 'calc(100% - 52px)', overflow: 'auto', paddingBottom: '52px' }">
      <Modal @close="closeHandler" />
    </BaseDialog>
  </div>
</template>

<script>
import { authority } from '@/mixins/authMixin';

import Modal from './Modal';
import BreakSpace from '@/components/BreakSpace/BreakSpace';

export default {
  name: 'role',
  components: {
    Modal,
    BreakSpace
  },
  mixins: [authority],
  data() {
    return {
      outerWrap: null,
      visible: false,
      labels: [
        { title: '选项卡1', id: 'row-01' },
        { title: '选项卡2', id: 'row-02' },
        { title: '选项卡3', id: 'row-03' }
      ],
      formList: this.createFormList(),
      content: 'qwe',
      val: { zxc: 'aaa' }
    };
  },
  mounted() {
    this.outerWrap = document.querySelector('.scroll-wrapper');
    setTimeout(() => {
      this.formList[0].rules = [
        { required: true, message: '请输入标题名称', trigger: 'blur' },
        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
      ];
      this.content = 'asd';
      this.$refs.form.SET_FIELDS_VALUE({ zxczxc: '1001', date: '2012-12-12' });
      this.formList = [...this.formList];
    }, 3000);
  },
  methods: {
    async getFormData() {
      const res = await this.$refs.form.GET_FORM_DATA();
      console.log(res);
    },
    createFormList() {
      return [
        {
          type: 'INPUT',
          labelOptions: {
            type: 'CHECKBOX',
            fieldName: 'zxczxc',
            label: '交强险',
            trueValue: '1001',
            falseValue: '1002'
          },
          fieldName: 'zxc'
        },
        {
          type: 'SELECT',
          label: '所属分类',
          fieldName: 'cid',
          placeholder: '所属分类',
          options: {
            filterable: true,
            itemList: [
              { text: '热点', value: '1' },
              { text: '资讯', value: '2' }
            ]
          },
          rules: [{ required: true, message: '请选择所属分类', trigger: 'change' }]
        },
        {
          type: 'DATE',
          dateType: 'datetime',
          label: '日期',
          fieldName: 'date',
          placeholder: '选择月份',
          rules: [{ required: true, message: '请选择日期', trigger: 'change' }],
          onChange: val => {
            console.log(111, val);
            this.$refs.form.SET_FIELDS_VALUE({ number: 200 });
          }
        },
        {
          type: 'RANGE_DATE', // DATE_TIME
          fieldName: 'startTime|endTime',
          label: '日期区间',
          style: { minWidth: '200px' },
          options: {
            minDateTime: '2020-03-01',
            maxDateTime: '2020-05-30'
          }
        },
        {
          type: 'MULTIPLE_SELECT',
          label: '兴趣爱好',
          fieldName: 'hobby',
          placeholder: '兴趣爱好',
          options: {
            filterable: true,
            itemList: [
              { text: '篮球', value: '1' },
              { text: '足球', value: '2' },
              { text: '乒乓球', value: '3' }
            ]
          },
          rules: [{ required: true, message: '请选择兴趣爱好', trigger: 'change' }]
        },
        {
          type: 'SELECT',
          label: '搜索帮助',
          fieldName: 'person',
          placeholder: '请输入员工名称...',
          options: {
            itemList: [
              { text: '篮球', value: '1' },
              { text: '足球', value: '2' },
              { text: '乒乓球', value: '3' }
            ]
          },
          rules: [{ required: true, message: '请输入员工名称', trigger: 'change' }]
        },
        {
          type: 'INPUT_NUMBER',
          label: '数量',
          fieldName: 'number',
          options: {
            precision: 2,
            maxlength: 3,
            max: 999
          },
          offsetRightCols: 1,
          placeholder: '请输入数量...',
          rules: [{ required: true, message: '请输入数量', trigger: 'blur' }]
        },
        {
          type: 'INPUT_TREE',
          label: '所属机构',
          fieldName: 'tid',
          placeholder: '所属机构',
          options: {
            itemList: [
              {
                value: 1,
                text: '一级 1',
                children: [
                  {
                    value: 4,
                    text: '二级 1-1',
                    disabled: true,
                    children: [
                      {
                        value: 9,
                        text: '三级 1-1-1',
                        disabled: true
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
          type: 'BREAK_SPACE',
          label: '标题标题',
          style: {}
        },
        {
          type: 'DATE',
          dateType: 'datetime',
          label: '时间',
          fieldName: 'time1',
          options: {
            defaultTime: '09:00:00',
            offsetRightCols: 2,
            placeholder: '选择时间'
          },
          rules: [{ required: true, message: '请选择时间', trigger: 'change' }]
        },
        {
          type: 'TEXT_AREA',
          label: '时间',
          fieldName: 'aaa',
          placeholder: '选择时间',
          // rows: 1,
          selfCols: 1,
          rules: [{ required: true, message: '请选择时间', trigger: 'change' }]
        },
        {
          type: 'TEXT_AREA',
          label: '时间',
          fieldName: 'bbb',
          placeholder: '选择时间',
          // rows: 1,
          selfCols: 2,
          rules: [{ required: true, message: '请选择时间', trigger: 'change' }]
        },
        {
          type: 'INPUT',
          label: '时间',
          fieldName: 'xcv',
          readonly: true,
          options: {
            secretType: 'phone'
          }
        },
        {
          type: 'UPLOAD_FILE',
          label: '上传文件',
          fieldName: 'wayFiles',
          placeholder: '上传文件...',
          rules: [{ required: true, message: '请上传文件', trigger: 'change' }],
          upload: {
            actionUrl: '/api/file/oss/upload',
            limit: 2,
            params: { a: 9 },
            fileTypes: ['jpg', 'png']
          },
          onChange: val => {
            // console.log(111, val);
          }
        },
        {
          type: 'UPLOAD_IMG',
          label: '上传身份证',
          fieldName: 'wayPicture',
          placeholder: '上传身份证...',
          rules: [{ required: true, message: '请上传身份证', trigger: 'change' }],
          upload: {
            actionUrl: '/api/file/oss/upload',
            fixedSize: [5, 3],
            limit: 1,
            params: { a: 9 },
            isCalcHeight: true
          },
          onChange: val => {
            // console.log(111, val);
          }
        }
      ];
    },
    validateFn(rule, value, callback) {
      if (value.length < rule.limit) {
        return callback(new Error(rule.message));
      }
      callback();
    },
    closeDrawer() {
      this.$emit('close', false);
    },
    closeHandler(val) {
      this.visible = val;
    }
  }
};
</script>

<style lang="less" scoped>
.wrapper {
  height: calc(100vh - 120px);
  .line {
    height: 500px;
    margin-bottom: 20px;
    &:last-child {
      margin: 0;
    }
  }
}
</style>
