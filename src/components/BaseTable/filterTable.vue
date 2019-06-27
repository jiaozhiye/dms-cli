<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-05-06 10:00:00
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-05-07 11:00:00
 **/
import { mergeProps, getOptionProps } from '@/utils/props-util';
import PageTable from './pageTable.vue';

export default {
  name: 'filter-table',
  props: {
    height: {
      type: [Number, String]
    },
    columns: {
      type: Array,
      required: true,
      default() {
        return [];
      }
    },
    columnsRef: {
      type: String,
      default: ''
    },
    dataSource: {
      type: [Array, Object],
      default() {
        return [];
      }
    },
    fetchapi: Function,
    params: {
      type: Object,
      default() {
        return {};
      }
    },
    uidkey: {
      type: String,
      default: 'uid'
    },
    datakey: {
      type: String,
      default: 'items'
    },
    rowstyles: {
      type: Array,
      default() {
        return [];
      }
    },
    selectionType: {
      type: String,
      default: 'multiple'
    },
    isSelectColumn: {
      type: Boolean,
      default: true
    },
    defaultSelections: {
      type: Array,
      default() {
        return [];
      }
    },
    isToperInfo: {
      type: Boolean,
      default: true
    },
    isColumnFilter: {
      type: Boolean,
      default: true
    },
    isPagination: {
      type: Boolean,
      default: true
    },
    mergeCellMethod: {
      type: Function,
      default: () => {}
    },
    onColumnsChange: {
      type: Function,
      required: true
    },
    onRowSelectChange: {
      type: Function,
      default: () => {}
    },
    onCellChange: {
      type: Function,
      default: () => {}
    },
    onPageChange: {
      type: Function,
      default: () => {}
    },
    onEnterEvent: {
      type: Function,
      default: () => {}
    },
    onSyncTableData: {
      type: Function,
      default: () => {}
    }
  },
  components: {
    PageTable
  },
  data() {
    this.isColumnChange = false;
    this.tableBodyWrapper = null;
    return {
      visible: this.createVisibleData(this.columns),
      search: this.createSearchData(this.columns),
      filters: {}
    };
  },
  watch: {
    columns() {
      this.isColumnChange = true;
    }
  },
  methods: {
    createVisibleData(columns) {
      let target = {};
      columns.forEach(x => {
        if (Array.isArray(x.children)) {
          Object.assign(target, this.createVisibleData(x.children));
        }
        if (x.filter) {
          target[x.dataIndex] = false;
        }
      });
      return target;
    },
    createSearchData(columns) {
      let target = {};
      columns.forEach(x => {
        let { filter, filterType } = x;
        if (Array.isArray(x.children)) {
          Object.assign(target, this.createSearchData(x.children));
        }
        if (filter && (filterType === 'checkbox' || filterType === 'date-range')) {
          target[`${x.dataIndex}Val`] = [];
        }
      });
      return target;
    },
    createFilterColumns(columns) {
      const filterColumns = columns.map(column => {
        let target = { ...column };
        if (Array.isArray(column.children) && column.children.length > 0) {
          // 递归
          target.children = this.createFilterColumns(column.children);
        }
        // 设置 column hideen 属性
        if (typeof column.hidden === 'undefined') {
          target.hidden = false;
        }
        // 没有开启筛选
        if (!column.filter) {
          return target;
        }
        // 合并对象
        const filterProps = this.getColumnSearchProps();
        return { ...target, ...filterProps };
      });
      // 筛选 展示/隐藏 字段
      return filterColumns;
    },
    getColumnSearchProps() {
      return {
        renderHeader: this.renderHeaderHandle
      };
    },
    // 自定义实现过滤
    filterHandler(property, type, val) {
      if (typeof val !== 'undefined') {
        this.search[`${property}Val`] = val;
      }
      this.filters = Object.assign({}, this.filters, {
        [`${type}|${property}`]: this.search[`${property}Val`]
      });
      this.closeAllPopover();
    },
    // 关闭所有筛选面板
    closeAllPopover(property) {
      for (let attr in this.$refs) {
        if (attr === property) continue;
        if (this.$refs[attr] && this.$refs[attr].doClose) {
          this.visible[attr] = false;
          this.$refs[attr].doClose();
        }
      }
    },
    // 打开当前的筛选面板
    showCurrentPopover(property) {
      if (this.visible[property]) return;
      this.visible[property] = true;
      this.$refs[property].doShow();
      setTimeout(() => {
        // 诡异的问题！
        if (this.isColumnChange) {
          this.resetPopoverPos(this.$refs[property].$el);
        }
      }, 0);
    },
    // 重置筛选面板的位置
    resetPopoverPos(el) {
      const popoverId = el.querySelector('.el-popover__reference').getAttribute('aria-describedby');
      const popoverDom = document.getElementById(popoverId);
      popoverDom.style.left = popoverDom.offsetLeft - this.tableBodyWrapper.scrollLeft + 'px';
    },
    // 参数值是否是假，假 -> 返回 ture
    isValueFalse(val) {
      if (Array.isArray(val)) {
        return !val.length;
      }
      return !val;
    },
    // 创建头部筛选节点
    createToperNode(column, property) {
      return (
        <span
          slot="reference"
          style={{
            padding: '12px 2px 6px 10px',
            marginLeft: '-10px',
            color: this.isValueFalse(this.search[`${property}Val`]) ? '' : '#409EFF'
          }}
          onClick={e => {
            e.stopPropagation();
            this.closeAllPopover(property);
            this.showCurrentPopover(property);
          }}
        >
          {column.label} <i class="el-icon-arrow-down" />
        </span>
      );
    },
    // 创建底部按钮节点
    createButtonNode(type, property, val = []) {
      return (
        <div style={{ paddingBottom: 0, marginTop: '10px' }}>
          <el-button type="primary" size="mini" disabled={this.isValueFalse(this.search[`${property}Val`])} onClick={e => this.filterHandler(property, type)}>
            搜索
          </el-button>
          <el-button size="mini" onClick={e => this.filterHandler(property, type, val)}>
            重置
          </el-button>
        </div>
      );
    },
    // 表格头部渲染
    renderHeaderHandle({ column, $index }, type) {
      const { property, label } = column;
      const orginColumn = this.deepFind(this.columns, property);
      if (orginColumn.filterType !== type) {
        return null;
      }
      return (
        <el-popover
          ref={property}
          popper-class="popper-wrap"
          trigger="manual"
          placement="bottom-start"
          // value={this.visible[property]}
        >
          {this.createToperNode(column, property)}
          <div class="el-table-filter__content">
            {type === 'input' && (
              <el-input
                size="small"
                v-model={this.search[`${property}Val`]}
                placeholder={`搜索${label}`}
                nativeOnKeydown={e => {
                  e.stopPropagation();
                  if (e.keyCode === 13) {
                    this.filterHandler(property, type);
                  }
                }}
              />
            )}
            {type === 'checkbox' && (
              <el-checkbox-group v-model={this.search[`${property}Val`]}>
                {orginColumn.filterItems.map(x => (
                  <li key={x.value} style={{ marginBottom: '7px' }}>
                    <el-checkbox label={x.value}>{x.text}</el-checkbox>
                  </li>
                ))}
              </el-checkbox-group>
            )}
            {type === 'date-range' && (
              <el-date-picker
                size="small"
                v-model={this.search[`${property}Val`]}
                style={{ width: '240px' }}
                type="daterange"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            )}
          </div>
          {this.createButtonNode(type, property, type === 'input' ? '' : [])}
        </el-popover>
      );
    },
    // 数组的深度查找
    deepFind(arr, mark) {
      let res = null;
      for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i].children)) {
          res = this.deepFind(arr[i].children, mark);
        }
        if (res !== null) {
          return res;
        }
        if (arr[i].dataIndex === mark) {
          res = arr[i];
          break;
        }
      }
      return res;
    },
    documentEventHandle(e) {
      this.closeAllPopover();
    },
    // 外部通过组件实例调用的方法
    CLEAR_SEARCH_PARAMS() {
      this.search = this.createSearchData(this.columns);
    }
  },
  mounted() {
    this.tableBodyWrapper = this.$refs.pageTable.$el.querySelector('.el-table__body-wrapper');
    document.addEventListener('click', this.documentEventHandle, false);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.documentEventHandle);
  },
  render() {
    const { $listeners, $slots, $attrs, $scopedSlots } = this;
    const props = getOptionProps(this);
    const wrapProps = mergeProps({
      props: {
        ...props,
        filters: this.filters,
        columns: this.createFilterColumns(this.columns)
      },
      on: $listeners,
      attrs: $attrs,
      scopedSlots: $scopedSlots
    });
    return (
      <PageTable ref="pageTable" {...wrapProps}>
        {Object.keys($slots).map(name => (
          <template key={name} slot={name}>
            {$slots[name]}
          </template>
        ))}
      </PageTable>
    );
  }
};
</script>

<style lang="less">
.popper-wrap {
  min-width: auto;
  .el-checkbox {
    width: 100%;
  }
  .el-table-filter__content {
    .el-date-editor--daterange.el-input__inner {
      width: auto;
    }
  }
}
</style>