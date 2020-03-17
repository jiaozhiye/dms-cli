/*
 * @Author: 焦质晔
 * @Date: 2020-03-17 10:29:47
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-17 15:23:19
 */
import Popper from '../popper';
import Draggable from '../draggable';
import Checkbox from '../checkbox';

export default {
  name: 'ColumnFilter',
  props: ['columns'],
  inject: ['$$table'],
  data() {
    return {
      leftFixedColumns: this.columns.filter(column => column.fixed === 'left'),
      rightFixedColumns: this.columns.filter(column => column.fixed === 'right'),
      mainColumns: this.columns.filter(column => !column.fixed)
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 200
      };
    },
    allColumns() {
      return [...this.leftFixedColumns, ...this.mainColumns, ...this.rightFixedColumns];
    }
  },
  methods: {
    fixedHandle(column, dir) {
      column.fixed = dir;
      this.sortChangeHandle();
    },
    cancelFixedHandle(dataIndex) {
      const columns = [...this.leftFixedColumns, ...this.rightFixedColumns];
      columns.find(column => column.dataIndex === dataIndex).fixed = undefined;
      this.sortChangeHandle();
    },
    sortChangeHandle() {
      this.$$table.$emit('columnsChange', this.allColumns);
    },
    renderListItem(x, type) {
      const cls = [`iconfont`, `icon-menu`, `v-handle`, [`${type}-handle`]];
      return (
        <li key={x.dataIndex} class="item">
          <Checkbox value={!x.hidden} onInput={val => (x.hidden = !val)} onChange={this.sortChangeHandle} />
          <i class={cls} />
          <span>{x.title}</span>
          {type === 'main' ? (
            <span class="fixed">
              <i class="iconfont icon-step-backward" title="固定左侧" onClick={() => this.fixedHandle(x, 'left')} />
              <i class="iconfont icon-step-forward" title="固定右侧" onClick={() => this.fixedHandle(x, 'right')} />
            </span>
          ) : (
            <span class="fixed">
              <i class="iconfont icon-close-circle" title="取消固定" onClick={() => this.cancelFixedHandle(x.dataIndex)} />
            </span>
          )}
        </li>
      );
    },
    renderFilterWrap() {
      const { leftFixedColumns, mainColumns, rightFixedColumns } = this;
      return (
        <div class="v-column-filter--wrap">
          <div class="left">
            <Draggable
              value={leftFixedColumns}
              handle=".left-handle"
              options={this.dragOptions}
              onInput={list => {
                this.leftFixedColumns = list;
              }}
              onChange={this.sortChangeHandle}
            >
              <transition-group type="transition">{leftFixedColumns.map(column => this.renderListItem(column, 'left'))}</transition-group>
            </Draggable>
          </div>
          <div class="divider"></div>
          <div class="main">
            <Draggable
              value={mainColumns}
              handle=".main-handle"
              options={this.dragOptions}
              onInput={list => {
                this.mainColumns = list;
              }}
              onChange={this.sortChangeHandle}
            >
              <transition-group type="transition">{mainColumns.map(column => this.renderListItem(column, 'main'))}</transition-group>
            </Draggable>
          </div>
          <div class="divider"></div>
          <div class="right">
            <Draggable
              value={rightFixedColumns}
              handle=".right-handle"
              options={this.dragOptions}
              onInput={list => {
                this.rightFixedColumns = list;
              }}
              onChange={this.sortChangeHandle}
            >
              <transition-group type="transition">{rightFixedColumns.map(column => this.renderListItem(column, 'right'))}</transition-group>
            </Draggable>
          </div>
        </div>
      );
    }
  },
  render() {
    return (
      <div class="v-column-filter">
        <Popper ref="vPopper" trigger="clickToToggle" root-class="v-popover--wrapper" transition="v-zoom-in-top" options={{ placement: 'bottom-end' }} visible-arrow={false} append-to-body={true}>
          <span slot="reference" class="text">
            <i class="iconfont icon-pic-right" />
            列筛选排序
          </span>
          <div class="v-popper">
            <div class="v-popper--content">{this.renderFilterWrap()}</div>
          </div>
        </Popper>
      </div>
    );
  }
};
