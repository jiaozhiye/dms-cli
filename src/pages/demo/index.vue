<template>
  <div>
    <top-filter ref="topFilter" :cols="4" :list="filterList" :initial-value="filterValue" @change="filterChangeHandle" @collapseChange="collapseChangeHandle" />
    <button-area :container-style="{ paddingLeft: '80px' }">
      <el-button type="primary">按钮1</el-button>
      <el-button>按钮2</el-button>
      <el-button>按钮3</el-button>
      <el-button>按钮4</el-button>
      <el-button>按钮5</el-button>
    </button-area>
    <VirtualTable
      ref="table"
      cacheColumnsKey="jzyDemoTable"
      height="auto"
      :columns="columns"
      :fetch="fetch"
      :rowKey="record => record.id"
      :rowSelection="selection"
      :exportExcel="exportExcel"
      :tablePrint="tablePrint"
      :columnsChange="columns => (this.columns = columns)"
      @dataChange="dataChangeHandle"
    >
      <template slot="default">
        <el-button type="primary" icon="el-icon-plus" @click="addInfoHandle">新建</el-button>
        <web-print :click="printHandle">pdf 打印</web-print>
        <el-button icon="el-icon-printer" @click="printHandle2">插件打印</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="removeHandle">删除</el-button>
      </template>
    </VirtualTable>
    <base-dialog :visible.sync="visible_filter" title="表单搜索帮助" destroy-on-close :container-style="{ height: 'calc(100% - 52px)', paddingBottom: '52px' }">
      <search-helper @close="closeDialogHandle" />
    </base-dialog>
    <drawer :visible.sync="visible_panel" title="标题名称" destroy-on-close :container-style="{ height: 'calc(100% - 52px)', paddingBottom: '52px' }">
      <add-info @close="closeDrawerHandle" />
    </drawer>
    <base-dialog :visible.sync="visible_table" title="表格的搜索帮助" destroy-on-close :container-style="{ height: 'calc(100% - 52px)', paddingBottom: '52px' }">
      <table-search-helper :row="tableShProps.row" :dataIndex="tableShProps.dataIndex" :callback="tableShProps.callback" @close="val => (this.visible_table = val)" />
    </base-dialog>
    <base-print ref="print" :data="printList" :isPreview="false" template="demo/template" />
  </div>
</template>

<script>
import { dictionary } from '@/mixins/dictMixin';

import { notifyAction, confirmAction, sleep } from '@/utils';

import SearchHelper from './searchHelper';
import AddInfo from './addInfo';
import TableSearchHelper from './tableSearchHelper';

import printData from '@/mock/printData';

export default {
  name: 'DemoJzy',
  components: { SearchHelper, AddInfo, TableSearchHelper },
  mixins: [dictionary],
  data() {
    this.selectedKeys = [];
    return {
      filterList: this.createTopFilterList(),
      filterValue: { b: '2' },
      columns: this.createTableColumns(),
      fetch: {
        api: () => {},
        params: {},
        dataKey: 'items'
      },
      selection: {
        type: 'checkbox',
        selectedRowKeys: this.selectedKeys,
        rowSelectable: row => {
          return row.id === 3;
        },
        onChange: val => {
          this.selectedKeys = val;
        }
      },
      exportExcel: {
        fileName: '导出文件.xlsx'
      },
      tablePrint: {
        showLogo: true
      },
      printList: printData.data,
      visible_filter: false,
      visible_panel: false,
      visible_table: false,
      // 表格搜索帮助组件的参数
      tableShProps: {}
    };
  },
  computed: {
    $topFilter() {
      return this.$refs.topFilter;
    },
    $table() {
      return this.$refs.table;
    }
  },
  // beforeRouteLeave(to, from, next) {
  //   if (this.$vnode && this.$vnode.data.keepAlive) {
  //     var key = this.$vnode.key == null ? this.$vnode.componentOptions.Ctor.cid + (this.$vnode.componentOptions.tag ? `::${this.$vnode.componentOptions.tag}` : '') : this.$vnode.key;
  //     var cache = this.$vnode.parent.componentInstance.cache;
  //     var keys = this.$vnode.parent.componentInstance.keys;
  //     if (cache[key]) {
  //       if (keys.length) {
  //         var index = keys.indexOf(key);
  //         if (index > -1) {
  //           keys.splice(index, 1);
  //         }
  //       }
  //       delete cache[key];
  //     }
  //   }
  //   next();
  // },
  methods: {
    // 创建列表搜索配置项
    createTopFilterList() {
      return [
        {
          type: 'INPUT',
          label: '条件1',
          fieldName: 'a',
          readonly: true,
          options: {
            unitRender: () => {
              return (
                <el-button
                  icon="el-icon-search"
                  onClick={() => {
                    this.visible_filter = true;
                  }}
                />
              );
            }
          },
          rules: [
            { required: true, message: '请输入条件', trigger: 'change' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'change' }
          ]
        },
        {
          type: 'SELECT',
          label: '条件2',
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
          label: '条件3',
          fieldName: 'c',
          options: {
            dateType: 'exactdate'
          }
        },
        {
          type: 'CHECKBOX',
          label: '条件4',
          fieldName: 'd',
          options: {
            trueValue: '1',
            falseValue: '0'
          }
        },
        {
          type: 'RANGE_DATE',
          label: '条件5',
          style: { minWidth: '220px' },
          fieldName: 'startTime|endTime',
          options: {
            minDateTime: '2020-03-01',
            maxDateTime: '2020-05-30'
          },
          rules: [{ required: true, message: '请选择日期', trigger: 'change' }]
        },
        {
          type: 'SEARCH_HELPER',
          label: '条件6',
          fieldName: 'f',
          request: {
            fetchApi: () => {},
            params: {},
            datakey: 'items',
            valueKey: 'name'
          }
        }
      ];
    },
    // 创建表格列配置
    createTableColumns() {
      return [
        {
          title: '操作',
          dataIndex: '__action__', // 操作列的 dataIndex 的值不能改
          fixed: 'left',
          width: 100,
          render: () => {
            return (
              <div>
                <el-button type="text">编辑</el-button>
                <el-button type="text">查看</el-button>
              </div>
            );
          }
        },
        {
          title: '序号',
          dataIndex: 'index',
          width: 80,
          sorter: true,
          render: text => {
            return text + 1;
          }
        },
        {
          title: '创建时间',
          dataIndex: 'date',
          width: 220,
          sorter: true,
          filter: {
            type: 'range-date'
          },
          editRender: row => {
            return {
              type: 'datetime'
            };
          }
        },
        {
          title: '姓名',
          dataIndex: 'person.name',
          width: 200,
          required: true,
          sorter: true,
          filter: {
            type: 'text'
          },
          editRender: row => {
            return {
              type: 'search-helper',
              editable: true,
              extra: {
                maxlength: 10,
                disabled: row.id === 3
              },
              rules: [{ required: true, message: '姓名不能为空' }],
              onClick: (cell, row, column, cb, ev) => {
                this.tableShProps = { row, dataIndex: column.dataIndex, callback: cb };
                this.visible_table = true;
              }
            };
          }
        },
        {
          title: '性别',
          dataIndex: 'person.sex',
          width: 100,
          dictItems: [
            { text: '男', value: '1' },
            { text: '女', value: '0' }
          ]
        },
        {
          title: '年龄',
          dataIndex: 'person.age',
          width: 100,
          sorter: true,
          filter: {
            type: 'range-number'
          }
        },
        {
          title: '价格',
          dataIndex: 'price',
          width: 150,
          precision: 2,
          required: true,
          sorter: true,
          filter: {
            type: 'range-number'
          },
          editRender: row => {
            return {
              type: 'number',
              extra: {
                max: 1000
              },
              rules: [{ required: true, message: '价格不能为空' }]
            };
          }
        },
        {
          title: '数量',
          dataIndex: 'num',
          width: 150,
          required: true,
          sorter: true,
          filter: {
            type: 'range-number'
          },
          editRender: row => {
            return {
              type: 'number',
              extra: {
                max: 1000
              },
              rules: [{ required: true, message: '数量不能为空' }]
            };
          }
        },
        {
          title: '总价',
          dataIndex: 'total',
          width: 150,
          precision: 2,
          align: 'right',
          sorter: true,
          filter: {
            type: 'range-number'
          },
          summation: {
            unit: '元'
          },
          render: (text, row) => {
            row.total = row.price * row.num;
            return <span>{row.total.toFixed(2)}</span>;
          },
          extraRender: (text, row) => {
            return Number(row.price * row.num).toFixed(2);
          }
        },
        {
          title: '是否选择',
          dataIndex: 'choice',
          align: 'center',
          width: 150,
          editRender: row => {
            return {
              type: 'checkbox',
              editable: true,
              extra: {
                trueValue: 1,
                falseValue: 0,
                disabled: true
              }
            };
          },
          dictItems: [
            { text: '选中', value: 1 },
            { text: '非选中', value: 0 }
          ]
        },
        {
          title: '状态',
          dataIndex: 'state',
          width: 150,
          filter: {
            type: 'checkbox',
            items: [
              { text: '已完成', value: 1 },
              { text: '进行中', value: 2 },
              { text: '未完成', value: 3 }
            ]
          },
          editRender: row => {
            return {
              type: 'select',
              items: [
                { text: '已完成', value: 1 },
                { text: '进行中', value: 2 },
                { text: '未完成', value: 3 }
              ]
            };
          },
          dictItems: [
            { text: '已完成', value: 1 },
            { text: '进行中', value: 2 },
            { text: '未完成', value: 3 }
          ]
        },
        {
          title: '业余爱好',
          dataIndex: 'hobby',
          width: 150,
          filter: {
            type: 'checkbox',
            items: [
              { text: '篮球', value: 1 },
              { text: '足球', value: 2 },
              { text: '乒乓球', value: 3 },
              { text: '游泳', value: 4 }
            ]
          },
          editRender: row => {
            return {
              type: 'select-multiple',
              items: [
                { text: '篮球', value: 1 },
                { text: '足球', value: 2 },
                { text: '乒乓球', value: 3 },
                { text: '游泳', value: 4 }
              ]
            };
          },
          dictItems: [
            { text: '篮球', value: 1 },
            { text: '足球', value: 2 },
            { text: '乒乓球', value: 3 },
            { text: '游泳', value: 4 }
          ]
        },
        {
          title: '地址',
          dataIndex: 'address',
          width: 300
        }
      ];
    },
    filterChangeHandle(val) {
      this.fetch.params = Object.assign({}, this.fetch.params, val);
    },
    collapseChangeHandle(val) {
      this.$table.CALCULATE_HEIGHT();
    },
    dataChangeHandle(tableData) {
      // ...
    },
    // 关闭搜索帮助窗口
    closeDialogHandle(state, val) {
      if (typeof val !== 'undefined') {
        this.$topFilter.SET_FIELDS_VALUE({ a: val });
      }
      this.visible_filter = state;
    },
    // 新建按钮
    addInfoHandle() {
      this.visible_panel = true;
    },
    // 删除按钮
    async removeHandle() {
      if (!this.selectedKeys.length) {
        return notifyAction(`请选择数据！`, 'warning');
      }
      try {
        await confirmAction();
        // 点击确定后，执行下边代码
        // ...
      } catch (err) {}
    },
    // 关闭抽屉组件
    closeDrawerHandle(state, val) {
      this.visible_panel = state;
      if (val) {
        // 执行表格刷新
        this.fetch.params = Object.assign({}, this.fetch.params);
      }
    },
    // 打印方法
    async printHandle() {
      await sleep(1000);
      return '/static/webPrint/20200415.pdf';
    },
    printHandle2() {
      this.$refs.print.EXCUTE_PRINT();
    }
  }
};
</script>
