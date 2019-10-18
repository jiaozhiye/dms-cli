<template>
  <div>
    <div class="wrapper">
      <Anchor :labelList="labels">
        <div class="line" id="row-01">
          <FormPanel :list="formList" labelWidth="100" formType="add" />
        </div>
        <div class="line" id="row-02">
          <el-button @click="visible = true">三级交互</el-button>
          <BreakSpace label="哈哈哈"></BreakSpace>
        </div>
        <div class="line" id="row-03">
          <tinymce v-model="content" :height="300" />
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
      <ajax-button
        size="small"
        type="primary"
        :auth-list="auths"
        auth-mark="/api/aaa"
        :click="closeDrawer"
      >提 交</ajax-button>
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
import { authority } from '@/utils/authMixin';

import Modal from './Modal';
import BreakSpace from '@/components/BreakSpace/BreakSpace';

export default {
  name: 'role',
  mixins: [authority],
  components: {
    Modal,
    BreakSpace
  },
  data() {
    return {
      visible: false,
      labels: [{ title: '选项卡1', id: 'row-01' }, { title: '选项卡2', id: 'row-02' }, { title: '选项卡3', id: 'row-03' }],
      formList: this.createFormList(),
      content: 'qwe'
    };
  },
  methods: {
    createFormList() {
      return [
        {
          type: 'INPUT',
          label: '搜索',
          labelOptions: {
            fieldName: 'qwe',
            itemList: []
          },
          fieldName: 'title',
          placeholder: '请输入标题名称...',
          maxlength: 5,
          rules: [{ required: true, message: '请输入标题名称', trigger: 'blur' }, { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }]
        },
        {
          type: 'SELECT',
          label: '所属分类',
          fieldName: 'cid',
          placeholder: '所属分类',
          filterable: true,
          itemList: [{ text: '热点', value: '1' }, { text: '资讯', value: '2' }],
          initialValue: '2',
          rules: [{ required: true, message: '请选择所属分类', trigger: 'change' }]
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
          itemList: [{ text: '篮球', value: '1' }, { text: '足球', value: '2' }, { text: '乒乓球', value: '3' }],
          rules: [{ required: true, message: '请选择兴趣爱好', trigger: 'change' }]
        },
        {
          type: 'SELECT',
          label: '搜索帮助',
          fieldName: 'person',
          placeholder: '请输入员工名称...',
          itemList: [{ text: '篮球', value: '1' }, { text: '足球', value: '2' }, { text: '乒乓球', value: '3' }],
          rules: [{ required: true, message: '请输入员工名称', trigger: 'change' }]
        },
        {
          type: 'INPUT_NUMBER',
          label: '数量',
          fieldName: 'number',
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
        }
      ];
    },
    closeDrawer() {
      this.$emit('close', false);
    },
    closeHandler(val) {
      this.visible = val;
    }
  },
  mounted() {
    setTimeout(() => {
      this.formList.find(x => x.fieldName === 'number').initialValue = 20;
      this.formList[0].labelOptions.initialValue = '22';
      this.formList[0].labelOptions.itemList = [{ text: '搜索1', value: '11' }, { text: '搜索2', value: '22' }];
      this.content = 'asd';
    }, 3000);
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
