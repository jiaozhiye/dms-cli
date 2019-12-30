<template>
  <div>
    <div id="wrapper" class="wrapper">
      <Anchor :label-list="labels">
        <div id="row-01" class="line">
          <FormPanel ref="form" :scrollContainer="outerWrap" :list="formList" label-width="100" form-type="add" />
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
        borderTop: '1px solid #e9e9e9',
        padding: '10px 20px',
        background: '#fff',
        textAlign: 'right'
      }"
    >
      <el-button @click="closeDrawer">取 消</el-button>
      <ajax-button size="small" type="primary" :auth-list="auths" auth-mark="/api/aaa" :click="closeDrawer">提 交</ajax-button>
    </div>
    <BaseDialog :visible.sync="visible" destroy-on-close :container-style="{ height: 'calc(100% - 60px)', overflow: 'auto', paddingBottom: '60px' }" @heightChange="heightChangeHandle">
      <Modal :height="height" @close="closeHandler" />
    </BaseDialog>
  </div>
</template>

<script>
import { authority } from '@/utils/authMixin';

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
      height: ''
    };
  },
  mounted() {
    this.outerWrap = document.querySelector('.scroll-wrapper');
    setTimeout(() => {
      this.formList.find(x => x.fieldName === 'number').initialValue = 20;
      this.formList[0].labelOptions.initialValue = '22';
      this.formList[0].labelOptions.itemList = [
        { text: '搜索1', value: '11' },
        { text: '搜索2', value: '22' }
      ];
      this.formList[0].rules = [
        { required: true, message: '请输入标题名称', trigger: 'blur' },
        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
      ];
      this.content = 'asd';
      this.formList = [...this.formList];
    }, 3000);
  },
  methods: {
    async getFormData() {
      const res = await this.$refs.form.GET_FORM_DATA();
    },
    heightChangeHandle(height) {
      this.height = `${height.slice(0, -1)} - 60px)`;
    },
    createFormList() {
      return [
        {
          type: 'INPUT',
          labelOptions: {
            type: 'CHECKBOX',
            fieldName: 'zxczxc',
            label: '交强险',
            options: {
              trueValue: '1001',
              falseValue: '1002'
            }
          },
          fieldName: 'zxc'
        },
        {
          type: 'SELECT',
          label: '所属分类',
          fieldName: 'cid',
          placeholder: '所属分类',
          filterable: true,
          itemList: [
            { text: '热点', value: '1' },
            { text: '资讯', value: '2' }
          ],
          initialValue: '2',
          rules: [{ required: true, message: '请选择所属分类', trigger: 'change' }],
          change: val => {
            console.log(222, val);
          }
        },
        {
          type: 'DATE',
          dateType: 'month',
          label: '日期',
          fieldName: 'date',
          placeholder: '选择月份',
          rules: [{ required: true, message: '请选择日期', trigger: 'change' }]
        },
        {
          type: 'RANGE_DATE', // DATE_TIME
          label: '日期区间',
          style: { minWidth: '200px' },
          fieldName: 'startTime|endTime'
        },
        {
          type: 'MULTIPLE_SELECT',
          label: '兴趣爱好',
          fieldName: 'hobby',
          placeholder: '兴趣爱好',
          itemList: [
            { text: '篮球', value: '1' },
            { text: '足球', value: '2' },
            { text: '乒乓球', value: '3' }
          ],
          rules: [{ required: true, message: '请选择兴趣爱好', trigger: 'change' }]
        },
        {
          type: 'SELECT',
          label: '搜索帮助',
          fieldName: 'person',
          placeholder: '请输入员工名称...',
          itemList: [
            { text: '篮球', value: '1' },
            { text: '足球', value: '2' },
            { text: '乒乓球', value: '3' }
          ],
          rules: [{ required: true, message: '请输入员工名称', trigger: 'change' }]
        },
        {
          type: 'INPUT_NUMBER',
          label: '数量',
          fieldName: 'number',
          precision: 2,
          offsetRightCols: 1,
          placeholder: '请输入数量...',
          rules: [{ required: true, message: '请输入数量', trigger: 'blur' }]
        },
        {
          type: 'INPUT_TREE',
          label: '所属机构',
          fieldName: 'tid',
          placeholder: '所属机构',
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
          ],
          rules: [{ required: true, message: '请选择所属机构', trigger: 'change' }]
        },
        {
          type: 'BREAK_SPACE',
          label: '标题标题',
          style: {}
        },
        {
          type: 'TIME_SELECT',
          label: '时间',
          fieldName: 'time1',
          offsetRightCols: 2,
          placeholder: '选择时间',
          rules: [{ required: true, message: '请选择时间', trigger: 'change' }]
        },
        {
          type: 'TEXT_AREA',
          label: '时间',
          fieldName: 'aaa',
          placeholder: '选择时间',
          rows: 1,
          selfCols: 1,
          rules: [{ required: true, message: '请选择时间', trigger: 'change' }]
        },
        {
          type: 'TEXT_AREA',
          label: '时间',
          fieldName: 'bbb',
          placeholder: '选择时间',
          rows: 1,
          selfCols: 2,
          rules: [{ required: true, message: '请选择时间', trigger: 'change' }]
        },
        {
          type: 'INPUT',
          label: '时间',
          fieldName: 'xcv',
          initialValue: '13012345678',
          readonly: true,
          secretType: 'phone'
        },
        {
          type: 'UPLOAD_FILE',
          label: '上传文件',
          fieldName: 'wayFiles',
          placeholder: '上传文件...',
          rules: [
            { required: true, message: '请上传文件', trigger: 'change' },
            { limit: 2, validator: this.validateFn, message: '请上传两张图片', trigger: 'change' }
          ],
          upload: {
            actionUrl: '/api/file/oss/upload',
            limit: 2,
            params: { a: 9 },
            fileTypes: ['jpg', 'png']
          },
          change: val => {
            // console.log(111, val);
          }
        },
        {
          type: 'UPLOAD_IMG',
          label: '上传身份证',
          fieldName: 'wayPicture',
          placeholder: '上传身份证...',
          rules: [
            { required: true, message: '请上传身份证', trigger: 'change' },
            { limit: 2, validator: this.validateFn, message: '请上传两张图片', trigger: 'change' }
          ],
          upload: {
            actionUrl: '/api/file/oss/upload',
            fixedSize: [5, 3],
            limit: 2,
            params: { a: 9 },
            isCalcHeight: true
          },
          change: val => {
            console.log(111, val);
          }
        }
      ];
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
  height: calc(100vh - 135px);
  .line {
    height: 400px;
    margin-bottom: 20px;
    &:last-child {
      margin: 0;
    }
  }
}
</style>
