<template>
  <div>
    <form-panel ref="formPanel" :initial-value="formValue" :list="formList" label-width="90" :scrollContainer="$scrollNode" />
    <VirtualTable
      ref="table"
      height="300"
      :columns="columns"
      :dataSource="list"
      :rowKey="record => record.id"
      :rowSelection="selection"
      :exportExcel="exportExcel"
      :tablePrint="tablePrint"
      :columnsChange="columns => (this.columns = columns)"
      @dataChange="dataChangeHandle"
    >
      <template slot="default">
        <el-button type="primary" icon="el-icon-plus" @click="insertHandle">新建</el-button>
      </template>
    </VirtualTable>
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
    this.selectedKeys = [];
    return {
      formList: this.createFormList(),
      formValue: { p: '1' },
      columns: this.createTableColumns(),
      list: [],
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
        onChange: (val, rows) => {
          this.selectedKeys = val;
        }
      },
      exportExcel: {
        fileName: '导出文件.xlsx'
      },
      tablePrint: {
        showLogo: true
      }
    };
  },
  computed: {
    $table() {
      return this.$refs.table;
    },
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
            valueKey: 'id',
            textKey: 'name'
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
        }
        // {
        //   type: 'TINYMCE',
        //   label: '表单项12',
        //   selfCols: 3,
        //   fieldName: 'z'
        // }
      ];
    },
    findFormItem(val) {
      return this.formList.find(x => x.fieldName === val);
    },
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
              editable: true,
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
    dataChangeHandle() {},
    async saveHandle() {
      const [err, res] = await this.$formPanel.GET_FORM_DATA();
      if (err) return;
      console.log(res);
      this.cancelHandle('refresh');
    },
    cancelHandle(val) {
      this.$emit('close', false, val);
    },
    insertHandle() {
      this.$table.INSERT_RECORDS({ id: Math.random() });
    }
  }
};
</script>
