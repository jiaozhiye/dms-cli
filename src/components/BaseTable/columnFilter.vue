<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-05-09 10:00:00
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-05-09 10:00:00
 **/
import _ from 'lodash';

export default {
  name: 'column-filter',
  props: {
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
    columnInfo: {
      type: Object
    },
    onColumnsChange: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      // 列筛选选中的 key
      checkedKeys: this.createCheckedKeys(this.columns),
      // 列筛选数据列表
      treeList: this.createTreeList(this.columns)
    };
  },
  watch: {
    columns(nextProps, prevProps) {
      if (_.isEqual(nextProps, prevProps)) return;
      this.checkedKeys = this.createCheckedKeys(nextProps);
      this.treeList = this.createTreeList(nextProps);
      this.setLocalColumns(nextProps);
    },
    columnInfo(nextProps) {
      const result = this.columns.map(column => {
        let [key] = Object.keys(nextProps);
        if (column.dataIndex === key) {
          column.width = nextProps[key];
        }
        return column;
      });
      this.setLocalColumns(result);
    }
  },
  methods: {
    // 创建树结构列表数据
    createTreeList(columns) {
      return columns.map(column => ({ dataIndex: column.dataIndex, label: column.title }));
    },
    // 创建树结构选中数组
    createCheckedKeys(columns) {
      return columns.filter(column => !column.hidden).map(x => x.dataIndex);
    },
    // 列排序拖拽相关方法
    allowDropHandler(draggingNode, dropNode, type) {
      return type !== 'inner';
    },
    // 列排序拖拽相关方法
    nodeDropHandler(draggingNode, dropNode, dropType, ev) {
      this.$refs.tree.setChecked(draggingNode.key, draggingNode.checked);
      const newColumns = this.treeList.map(item => this.columns.find(column => column.dataIndex === item.dataIndex));
      this.onColumnsChange(this.createChangedColumns(newColumns));
    },
    // 当树节点选中状态变化时
    handleCheckChange(data, checked, indeterminate) {
      this.onColumnsChange(this.createChangedColumns(this.columns));
    },
    // 列筛选的选中状态切换
    createChangedColumns(columns) {
      this.checkedKeys = this.$refs.tree.getCheckedKeys();
      return columns.map(column => {
        const target = { ...column };
        target.hidden = !this.checkedKeys.includes(target.dataIndex);
        return target;
      });
    },
    // 做 columns 本地存储
    setLocalColumns(columns) {
      if (!this.columnsRef) return;
      const result = columns.map(column => {
        const target = {};
        if (typeof column.width !== 'undefined') {
          target.width = column.width;
        }
        if (typeof column.minWidth !== 'undefined') {
          target.minWidth = column.minWidth;
        }
        return {
          dataIndex: column.dataIndex,
          hidden: Boolean(column.hidden),
          ...target
        };
      });
      // 本地存储
      localStorage.setItem(this.columnsRef, JSON.stringify(result));
    },
    // 获取本地存储 columns 信息
    getColumnsConfig() {
      if (!this.columnsRef) return;
      // 本地存储
      const res = localStorage.getItem(this.columnsRef);
      if (res === null) return;
      const columns = res ? JSON.parse(res) : [];
      if (!Array.isArray(columns)) return;
      // 清空本地存储
      if (columns.length !== this.columns.length) {
        localStorage.removeItem(this.columnsRef);
        return;
      }
      return columns.map(x => ({ ...this.columns.find(column => column.dataIndex === x.dataIndex), ...x }));
    },
    // 初始化
    initial() {
      const localColumns = this.getColumnsConfig();
      if (!localColumns) return;
      this.checkedKeys = this.createCheckedKeys(localColumns);
      this.treeList = this.createTreeList(localColumns);
      this.onColumnsChange(localColumns);
    }
  },
  created() {
    this.initial();
  },
  render() {
    const { treeList, checkedKeys } = this;
    return (
      <el-dropdown hide-on-click={false} trigger="click">
        <span class="columns-dropdown">
          <i class="icon el-icon-s-operation" />
          列筛选排序
        </span>
        <el-dropdown-menu style={{ minWidth: '120px', maxHeight: 'calc(100vh - 30px)', overflowY: 'auto' }} slot="dropdown">
          <el-tree
            ref="tree"
            class="columns-tree"
            node-key="dataIndex"
            data={treeList}
            check-on-click-node={true}
            show-checkbox
            draggable
            default-checked-keys={checkedKeys}
            allow-drop={this.allowDropHandler}
            on-node-drop={this.nodeDropHandler}
            on-check-change={this.handleCheckChange}
          />
        </el-dropdown-menu>
      </el-dropdown>
    );
  }
};
</script>

<style lang="less">
@primaryColor: #bb0a30;

.columns-dropdown {
  cursor: pointer;
  color: @primaryColor;
  .icon {
    margin-right: 4px;
    font-weight: 700;
  }
}
.columns-tree {
  .is-leaf {
    padding: 4px;
  }
  .el-tree-node__label {
    margin-left: 0px;
  }
}
</style>
