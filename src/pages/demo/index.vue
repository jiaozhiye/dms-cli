<template>
  <div>
    <TopFilter ref="filter" :list="topFilterList" :initial-value="filterValue" :cols="4" @filterChange="changeHandle" @onCollapse="collapseHandle" />
    <button-area :container-style="{ paddingLeft: '80px' }">
      <JsonToExcel size="small" type="primary" :initialValue="json_data" :fields="json_fields" fileName="filename.xlsx">导出</JsonToExcel>
      <el-button size="small" type="primary">到货确认</el-button>
      <el-button size="small">明细</el-button>
      <el-button size="small">发货单</el-button>
      <el-button size="small" @click="zxczxc">销售发票</el-button>
      <multiuse-button size="small" :auth-list="auths" auth-mark="/api/aaa">出库</multiuse-button>
    </button-area>
    <FilterTable
      ref="table"
      columns-ref="myTable"
      :columns="columns"
      :fetchapi="() => {}"
      :params="params"
      :uidkey="'id'"
      :defaultSelections="selectes"
      :on-columns-change="columns => (this.columns = columns)"
      :onRowSelectChange="selectionHandle"
      :on-sync-table-data="tableDateChange"
    >
      <template slot="moreActions">
        <span>批量删除</span>
        <span>任务分配</span>
      </template>
      <template slot="controls">
        <web-print size="small" type="primary" :click="printHandle">pdf 打印</web-print>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="visible = true">新建</el-button>
        <el-button size="small" icon="el-icon-printer" @click="printHandler">打印</el-button>
      </template>
    </FilterTable>
    <Drawer :visible.sync="visible" title="标题名称" destroy-on-close :container-style="{ height: 'calc(100% - 60px)', overflow: 'auto', paddingBottom: '60px' }">
      <Panel @close="closeHandler" />
    </Drawer>
    <BasePrint ref="print" :data="printList" printerType="stylus" :alwaysPrint="true" :isPreview="false" template="demo/template" />
  </div>
</template>

<script>
import { authority } from '@/mixins/authMixin';
import { dictionary } from '@/mixins/dictMixin';
import { sleep } from '@/utils';
import res from '@/mock/tableData';
import printData from '@/mock/printData';
import Panel from './Panel';
import JsonToExcel from '@/components/JsonToExcel/JsonToExcel.vue';

import pinyin, { STYLE_FIRST_LETTER } from '@/components/Pinyin/index';

export default {
  name: 'Demo',
  components: {
    Panel,
    JsonToExcel
  },
  mixins: [authority, dictionary],
  data() {
    this.BaseTable = null;
    return {
      visible: false,
      topFilterList: this.createTopFilters(),
      columns: this.createTableColumns(),
      list: [],
      params: { a: 9 },
      selectes: [],
      printList: printData.data,
      filterValue: { qwe: '22', hello: '1,1-2,1-2-1' },
      json_fields: {
        'Complete name': 'name',
        City: 'city',
        Telephone: 'phone.mobile',
        'Telephone 2': {
          field: 'phone.landline',
          callback: value => {
            return `Landline Phone - ${value}`;
          }
        }
      },
      json_data: [
        {
          name: 'Tony Peña',
          city: '长春',
          country: 'United States',
          birthdate: '1978-03-15',
          phone: {
            mobile: 15417543010,
            landline: '(541) 754-3010'
          }
        },
        {
          name: 'Thessaloniki',
          city: '沈阳',
          country: 'Greece',
          birthdate: '1987-11-23',
          phone: {
            mobile: 18552755071,
            landline: '(2741) 2621-244'
          }
        }
      ]
    };
  },
  mounted() {
    this.BaseTable = this.$refs.table;
    // console.log('页面不具备的权限：', this.auths);
    // this.BaseTable.START_LOADING();
    setTimeout(() => {
      // this.BaseTable.STOP_LOADING();
      // this.list = [...res.data.items];
      // this.BaseTable.SET_DISABLE_SELECT([this.list[0], this.list[2]]);
      this.topFilterList[0].hidden = false;
      this.topFilterList[0].labelOptions.itemList = [
        { text: '搜索1', value: '11' },
        { text: '搜索2', value: '22' }
      ];
      this.$refs.filter.SET_FIELDS_VALUE({ 'startTime|endTime': ['2019-10-12', '2019-10-28'] });
    }, 3000);
  },
  methods: {
    selectionHandle(rows) {
      // console.log(rows);
    },
    zxczxc() {
      this.params = { ...this.params, a: 7 };
    },
    async printHandle() {
      await sleep(2000);
      return '/static/webPrint/111.pdf';
    },
    createTopFilters() {
      return [
        {
          type: 'INPUT',
          label: '搜索',
          fieldName: 'title',
          hidden: true,
          placeholder: '请输入标题名称...',
          labelOptions: {
            fieldName: 'qwe',
            itemList: []
          },
          onInput: val => {
            let res = pinyin(val, { style: STYLE_FIRST_LETTER })
              .flat()
              .join('')
              .toUpperCase();
            this.$refs.filter.SET_FIELDS_VALUE({ zxczxc: res });
          },
          rules: [
            { required: true, message: '请输入标题名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ]
        },
        {
          type: 'INPUT',
          label: '搜索2',
          fieldName: 'zxczxc',
          readonly: true,
          disabled: true
        },
        {
          type: 'MULTIPLE_SELECT',
          label: '所属分类',
          fieldName: 'cid',
          placeholder: '所属分类',
          filterable: true,
          rules: [{ required: true, message: '请选择所属分类', trigger: 'change' }],
          request: {
            fetchApi: () => {},
            params: {},
            datakey: 'items',
            valueKey: 'id',
            textKey: 'name'
          }
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
          fieldName: 'startTime|endTime',
          rules: [{ required: true, message: '请选择日期', trigger: 'change' }]
        },
        {
          type: 'MULTIPLE_SELECT',
          label: '兴趣爱好',
          fieldName: 'hobby',
          filterable: true,
          placeholder: '兴趣爱好',
          itemList: [
            { text: '篮球', value: '1' },
            { text: '足球', value: '2' },
            { text: '乒乓球', value: '3' }
          ],
          rules: [{ required: true, message: '请选择兴趣爱好', trigger: 'change' }]
        },
        {
          type: 'SEARCH_HELPER_WEB',
          label: '搜索帮助',
          fieldName: 'person',
          placeholder: '请输入员工名称...',
          itemList: [{ text: '中国' }, { text: '美国' }],
          rules: [{ required: true, message: '请输入员工名称', trigger: 'change' }]
        },
        {
          type: 'INPUT_CASCADER',
          label: '联机',
          fieldName: 'hello',
          placeholder: '请输入标题名称...',
          style: { minWidth: '300px' },
          options: {
            titles: ['品牌', '车型', '车系']
          },
          itemList: [
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
          ]
        }
      ];
    },
    createTableColumns() {
      return [
        {
          title: '操作',
          dataIndex: 'column-action',
          width: 100,
          render: (props, h) => {
            return (
              <div>
                <multiuse-button size="mini" type="text" divider="after" containerStyle={{ color: 'red' }} auth-list={this.auths} auth-mark={'/api/bbb/*'}>
                  编辑
                </multiuse-button>
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
          sorter: (data, order) => {
            // 升序
            if (order === 'ascending') {
              data.sort((a, b) => {
                return a.index - b.index;
              });
            }
            // 降序
            if (order === 'descending') {
              data.sort((a, b) => {
                return b.index - a.index;
              });
            }
          },
          render: props => {
            return <span>{props.row.index + 1}</span>;
          }
        },
        {
          title: '日期',
          dataIndex: 'date',
          width: 150,
          sorter: true,
          filter: true,
          filterType: 'date-range',
          editRequired: true,
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
          filterType: 'radio',
          filterItems: [
            { text: '男', value: 1 },
            { text: '女', value: 0 }
          ],
          dictItems: [
            { text: '男', value: 1 },
            { text: '女', value: 0 }
          ]
        },
        {
          title: '价格',
          dataIndex: 'price',
          width: 120,
          precision: 2,
          numberFormat: true,
          sorter: true,
          filter: true,
          filterType: 'number',
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
          filterItems: [
            { text: '未选择', value: '0' },
            { text: '已选择', value: '1' }
          ],
          editable: true,
          defaultEditable: true,
          editType: 'checkbox',
          editItems: [
            { text: '', falseValue: '0' },
            { text: '', trueValue: '1' }
          ],
          dictItems: [
            { text: '未选择', value: '0' },
            { text: '已选择', value: '1' }
          ]
        },
        {
          title: '状态',
          dataIndex: 'state',
          width: 150,
          sorter: true,
          filter: true,
          filterType: 'checkbox',
          editRequired: true,
          filterItems: [
            { text: '已完成', value: 1 },
            { text: '进行中', value: 2 },
            { text: '未完成', value: 3 }
          ],
          editable: true,
          defaultEditable: true,
          editType: 'select',
          editItems: [
            { text: '已完成', value: 1 },
            { text: '进行中', value: 2 },
            { text: '未完成', value: 3 }
          ]
        },
        {
          title: '业余爱好',
          dataIndex: 'hobby',
          width: 150,
          sorter: true,
          filter: true,
          filterType: 'checkbox',
          filterItems: [
            { text: '篮球', value: 1 },
            { text: '足球', value: 2 },
            { text: '乒乓球', value: 3 },
            { text: '游泳', value: 4 }
          ],
          editable: true,
          editType: 'select-multiple',
          editItems: [
            { text: '篮球', value: 1 },
            { text: '足球', value: 2 },
            { text: '乒乓球', value: 3 },
            { text: '游泳', value: 4 }
          ]
        },
        {
          title: '地址',
          dataIndex: 'address',
          showOverflowTooltip: true,
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
    // 表格的 onSyncTableData 事件
    tableDateChange(list, isFirst) {
      if (isFirst && list.length > 0) {
        !this.selectes.length && (this.selectes = [list[1], list[3]]);
        setTimeout(() => {
          // 让表格列对应的所有的单元格，可编辑状态禁用   true -> 禁用可编辑状态
          this.BaseTable.SET_CELL_UNEDITABLE(list, 'state', true);
          // 有权限的数据，设置成可编辑  false -> 可编辑状态
          this.BaseTable.SET_CELL_UNEDITABLE([list[0], list[2]], 'state', false);
        });
      }
    }
  }
};
</script>

<style lang="less"></style>
