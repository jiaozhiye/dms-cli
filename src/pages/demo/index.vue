<template>
  <div>
    <TopFilter
      :list="topFilterList"
      :cols="4"
      @filterChange="changeHandle"
      @onCollapse="collapseHandle"
    ></TopFilter>
    <button-area :style="{ paddingLeft: '80px' }">
      <el-button size="small" type="primary">到货确认</el-button>
      <el-button size="small">明细</el-button>
      <el-button size="small">发货单</el-button>
      <el-button size="small">销售发票</el-button>
      <el-button size="small">欠货单</el-button>
      <el-button size="small">出库</el-button>
    </button-area>
    <FilterTable
      ref="table"
      columnsRef="demo-table"
      :columns="columns"
      :dataSource="list"
      :isMemoryPagination="true"
      :onColumnsChange="columns => this.columns = columns"
      :onSyncTableData="tableDateChange"
    >
      <template slot="moreActions">
        <span>批量删除</span>
        <span>任务分配</span>
      </template>
      <template slot="controls" slot-scope="props">
        <el-button size="small" type="primary" icon="el-icon-plus" @click="visible = true">新建</el-button>
        <el-button size="small" icon="el-icon-printer" @click="printHandler">打印</el-button>
      </template>
    </FilterTable>
    <Drawer
      :visible.sync="visible"
      title="标题名称"
      :width="960"
      destroyOnClose
      :containerStyle="{height: 'calc(100% - 60px)', overflow: 'auto', paddingBottom: '60px'}"
    >
      <Panel @close="closeHandler" />
    </Drawer>
    <BasePrint ref="print" :data="printList" template="template1" />
  </div>
</template>

<script>
import { authority } from '@/utils/authMixin';
import res from '@/mock/tableData';
import printData from '@/mock/printData';
import Panel from './Panel';

export default {
  name: 'Demo',
  mixins: [authority],
  components: {
    Panel
  },
  data() {
    this.BaseTable = null;
    return {
      visible: false,
      topFilterList: this.createTopFilters(),
      columns: this.createTableColumns(),
      list: [...res.data.items],
      printList: printData.data
    };
  },
  methods: {
    createTopFilters() {
      return [
        {
          type: 'INPUT',
          label: '搜索',
          fieldName: 'title',
          placeholder: '请输入标题名称...',
          initialValue: '',
          focus: () => {
            // this.topFilterList[0].initialValue = '刘德华';
            // this.topFilterList = [...this.topFilterList];
          },
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
          rules: [{ required: true, message: '请输入数量', trigger: 'change' }]
        }
      ];
    },
    createTableColumns() {
      return [
        {
          title: '操作',
          dataIndex: 'column-action',
          width: 100,
          fixed: 'left',
          render: (props, h) => {
            return (
              <div>
                <el-button size="mini" type="text">
                  编辑
                </el-button>
                <el-divider direction="vertical" />
                <el-button size="mini" type="text">
                  查看
                </el-button>
              </div>
            );
          }
        },
        {
          title: '序号',
          dataIndex: 'index',
          width: 70,
          sorter: true,
          render: props => {
            return <span>{props.row.index + 1}</span>;
          }
        },
        {
          title: '日期',
          dataIndex: 'date',
          width: 150,
          dateFormat: 'yyyy-MM-dd',
          sorter: true,
          filter: true,
          filterType: 'date-range',
          editable: true,
          editType: 'date-picker'
        },
        {
          title: '姓名',
          dataIndex: 'person.name',
          width: 120,
          sorter: true,
          filter: true,
          filterType: 'input',
          editable: true,
          editType: 'text',
          editRequired: true,
          searchHelper: {
            fetchApi: () => {},
            params: {},
            // key -> 数据字段名
            // value -> json 对象，dataIndex 的值就是 column 的 dataIndex
            aliasKey: {
              name: {
                // 注意：当前列（column）的 dataIndex 必须配置在 aliasKey 中，最好放在一项
                dataIndex: 'person.name'
              },
              number: {
                dataIndex: 'num'
              },
              price: {
                dataIndex: 'price'
              }
            }
          }
        },
        {
          title: '性别',
          dataIndex: 'person.sex',
          width: 100,
          sorter: true,
          filter: true,
          filterType: 'checkbox',
          filterItems: [{ text: '男', value: 1 }, { text: '女', value: 0 }],
          render: props => {
            return <span>{props.row.person.sex === 1 ? '男' : '女'}</span>;
          }
        },
        {
          title: '价格',
          dataIndex: 'price',
          width: 120,
          numberFormat: true,
          sorter: true,
          filter: true,
          filterType: 'input',
          summation: true,
          summationUnit: '元',
          editable: true,
          editType: 'number',
          editRequired: true,
          // 可编辑的单元格在强制不可编辑状态下的渲染函数，可以绑定事件
          editDisableRender: props => {
            return <div onClick={() => alert('强制不可编辑单元格自定义的单击事件')}>{props.row.price}</div>;
          }
        },
        {
          title: '数量',
          dataIndex: 'num',
          width: 120,
          sorter: true,
          editable: true,
          editType: 'number',
          precision: 0,
          editRequired: true,
          max: 300,
          min: 0
        },
        {
          title: '总价',
          dataIndex: 'total',
          width: 120,
          sorter: true,
          summation: true,
          summationUnit: '元',
          render: props => {
            // 计算规则
            props.row.total = props.row.price * props.row.num;
            const domStyle = props.row.total > 1000 ? {} : null;
            return <div style={domStyle}>{props.row.total}</div>;
          }
        },
        {
          title: '是否选择',
          dataIndex: 'choice',
          align: 'center',
          sorter: true,
          filter: true,
          filterType: 'radio',
          filterItems: [{ text: '未选择', value: '0' }, { text: '已选择', value: '1' }],
          editable: true,
          defaultEditable: true,
          editType: 'checkbox',
          editItems: [{ text: '', falseValue: '0' }, { text: '', trueValue: '1' }]
        },
        {
          title: '状态',
          dataIndex: 'state',
          width: 150,
          sorter: true,
          filter: true,
          filterType: 'checkbox',
          filterItems: [{ text: '已完成', value: 1 }, { text: '进行中', value: 2 }, { text: '未完成', value: 3 }],
          editable: true,
          editType: 'select',
          editItems: [{ text: '已完成', value: 1 }, { text: '进行中', value: 2 }, { text: '未完成', value: 3 }]
        },
        {
          title: '业余爱好',
          dataIndex: 'hobby',
          width: 150,
          sorter: true,
          filter: true,
          filterType: 'checkbox',
          filterItems: [{ text: '篮球', value: 1 }, { text: '足球', value: 2 }, { text: '乒乓球', value: 3 }, { text: '游泳', value: 4 }],
          editable: true,
          editType: 'select-multiple',
          editItems: [{ text: '篮球', value: 1 }, { text: '足球', value: 2 }, { text: '乒乓球', value: 3 }, { text: '游泳', value: 4 }]
        },
        {
          title: '地址',
          dataIndex: 'address',
          width: 300,
          editable: true,
          editType: 'text',
          editPattern: /^[0-9a-zA-Z ]+$/
        }
      ];
    },
    changeHandle(val) {
      console.log('搜索的参数：', val);
    },
    collapseHandle() {
      this.$nextTick(() => {
        this.BaseTable.EXECUTE_RESET_HEIGHT();
      });
    },
    closeHandler(val) {
      this.visible = val;
    },
    printHandler() {
      this.$refs.print.EXCUTE_PRINT();
    },
    tableDateChange(list) {
      console.log(list);
    }
  },
  mounted() {
    this.BaseTable = this.$refs.table.$refs.pageTable;
    console.log('页面不具备的权限：', this.auths);
  }
};
</script>

<style lang="less">
</style>
