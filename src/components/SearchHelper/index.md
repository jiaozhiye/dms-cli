## API

### SearchHelper

| 参数            | 说明                                                      | 类型                   | 默认值 |
| --------------- | --------------------------------------------------------- | ---------------------- | ------ |
| filters         | 顶部筛选条件配置，参考 TopFilter 组件，必要参数           | array                  | -      |
| initialValue    | 筛选条件的初始值                                          | object                 | -      |
| table           | 列表组件配置，[配置项](#table)，必要参数                  | array                  | -      |
| fieldAliasMap   | 表单字段与回传数据字段的映射，[配置项](#alias)， 必要参数 | func                   | -      |
| beforeFetch     | 在执行查询接口之前，处理请求参数，返回处理后的数据        | Function(form):newForm | -      |
| dataIndex       | 当前搜索帮助列的 dataIndex - 只对表格的搜索帮助有效       | string                 | -      |
| callback        | 回传数据的回调函数 - 只对表格的搜索帮助有效               | func                   | -      |
| name            | 搜索帮助名称 for TDS                                      | string                 | -      |
| fieldsDefine    | 表单字段的定义，[配置项](#define) for TDS                 | object                 | -      |
| getServerConfig | 从服务端获取搜索帮助定义信息 for TDS                      | func                   | -      |

### 事件

| 事件名称 | 说明                                  | 回调参数                          |
| -------- | ------------------------------------- | --------------------------------- |
| close    | 在行双击或者点击 确定/关闭 按钮时触发 | Function(boolean, rowData:object) |

### table

| 参数    | 说明                      | 类型           | 默认值 |
| ------- | ------------------------- | -------------- | ------ |
| columns | 参考 Table 组件，必要参数 | array          | -      |
| rowKey  | 参考 Table 组件，必要参数 | string \| func | -      |
| fetch   | 参考 Table 组件，必要参数 | object         | -      |

### alias

注意：key 为 extra 时，对应的数据会显示成表单元素的描述信息

| 参数  | 说明                             | 类型   | 默认值 |
| ----- | -------------------------------- | ------ | ------ |
| key   | 表格列的 dataIndex 或 表单字段名 | string | -      |
| value | 搜索帮助接口数据对应的字段名     | string | -      |

### define

| key             | value                         | 说明                                                 |
| --------------- | ----------------------------- | ---------------------------------------------------- |
| valueName       | -                             | 搜索帮助的 id                                        |
| displayName     | 表单组件配置项 fieldName 的值 | 搜索帮助的 name                                      |
| descriptionName | extra                         | 固定值，只是搜索帮助的描述信息，不作为表单数据的 key |

### 示例

注意：搜索帮助组件已经与表单组件(TopFilter、FormPanel)集成

说明：双击行记录 或者 选中数据后点击确定按钮，会触发 close 事件

```bash
# template
<template>
  <div>
    <top-filter ref="topFilter" :cols="4" :list="filterList" />
    <base-dialog :visible.sync="visible" title="表单搜索帮助" destroy-on-close :container-style="{ height: 'calc(100% - 52px)', paddingBottom: '52px' }">
      <search-helper :filters="searchHelper.filters" :table="searchHelper.table" @close="closeHandle" />
    </base-dialog>
  </div>

</template>

# js
export default {
  data() {
    return {
      visible: false,
      filterList: [
        {
          type: 'INPUT',
          label: '条件',
          fieldName: 'a',
          readonly: true,
          options: {
            unitRender: () => {
              return (
                <el-button
                  icon="el-icon-search"
                  onClick={() => {
                    this.visible = true;
                  }}
                />
              );
            }
          }
        },
      ],
      searchHelper: {
        filters: [
          {
            type: 'INPUT',
            label: '条件',
            fieldName: 'b'
          }
        ],
        table: {
          columns: [
            {
              title: '产品名称',
              dataIndex: 'name'
            },
            {
              title: '产品编码',
              dataIndex: 'code'
            }
          ],
          rowKey: record => record.id,
          fetch: {
            api: () => {},
            dataKey: 'items'
          }
        }
      }
    };
  },
  computed: {
    $topFilter() {
      return this.$refs.topFilter;
    }
  },
  methods: {
    // 关闭搜索帮助窗口
    closeHandle(visible, record) {
      if (!!record) {
        this.$topFilter.SET_FIELDS_VALUE({ a: record.code });
      }
      this.visible = visible;
    },
  }
};
```
