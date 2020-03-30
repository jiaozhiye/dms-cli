/*
 * @Author: 焦质晔
 * @Date: 2020-03-17 10:29:47
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-30 12:52:01
 */
import Popper from '../popper';
import Draggable from '../draggable';
import Checkbox from '../checkbox';

import config from '../config';

const noop = () => {};

export default {
  name: 'ColumnFilter',
  props: ['columns'],
  inject: ['$$table'],
  data() {
    this.dragOptions = { animation: 200 };
    return {
      showPopper: false,
      leftFixedColumns: [],
      rightFixedColumns: [],
      mainColumns: []
    };
  },
  computed: {
    realColumns() {
      return [...this.leftFixedColumns, ...this.mainColumns, ...this.rightFixedColumns];
    }
  },
  watch: {
    columns() {
      this.createColumns();
    }
  },
  created() {
    this.createColumns();
  },
  methods: {
    popperVisibleHandle({ showPopper }) {
      this.showPopper = showPopper;
    },
    createColumns() {
      this.leftFixedColumns = this.columns.filter(column => column.fixed === 'left');
      this.rightFixedColumns = this.columns.filter(column => column.fixed === 'right');
      this.mainColumns = this.columns.filter(column => !column.fixed);
    },
    fixedChangeHandle(column, dir) {
      column.fixed = dir;
      this.createColumns();
      this.changeHandle();
    },
    cancelFixedHandle(column) {
      delete column.fixed;
      this.createColumns();
      this.changeHandle();
    },
    changeHandle() {
      const { columnsChange = noop } = this.$$table;
      columnsChange(this.realColumns);
    },
    renderListItem(column, type) {
      const cls = [`iconfont`, `icon-menu`, `v-handle`, [`${type}-handle`]];
      return (
        <li key={column.dataIndex} class="item">
          <Checkbox value={!column.hidden} onInput={val => (column.hidden = !val)} onChange={this.changeHandle} />
          <i class={cls} title="拖动排序" />
          <span>{column.title}</span>
          {type === 'main' ? (
            <span class="fixed">
              <i class="iconfont icon-step-backward" title="固定左侧" onClick={() => this.fixedChangeHandle(column, 'left')} />
              <i class="iconfont icon-step-forward" title="固定右侧" onClick={() => this.fixedChangeHandle(column, 'right')} />
            </span>
          ) : (
            <span class="fixed">
              <i class="iconfont icon-close-circle" title="取消固定" onClick={() => this.cancelFixedHandle(column)} />
            </span>
          )}
        </li>
      );
    },
    renderColumnFilter() {
      const { leftFixedColumns, mainColumns, rightFixedColumns, dragOptions } = this;
      return (
        <div class="v-column-filter--wrap">
          <div class="left">
            <Draggable
              value={leftFixedColumns}
              handle=".left-handle"
              options={dragOptions}
              onInput={list => {
                this.leftFixedColumns = list;
              }}
              onChange={this.changeHandle}
            >
              <transition-group type="transition">{leftFixedColumns.map(column => this.renderListItem(column, 'left'))}</transition-group>
            </Draggable>
          </div>
          <div class="divider"></div>
          <div class="main">
            <Draggable
              value={mainColumns}
              handle=".main-handle"
              options={dragOptions}
              onInput={list => {
                this.mainColumns = list;
              }}
              onChange={this.changeHandle}
            >
              <transition-group type="transition">{mainColumns.map(column => this.renderListItem(column, 'main'))}</transition-group>
            </Draggable>
          </div>
          <div class="divider"></div>
          <div class="right">
            <Draggable
              value={rightFixedColumns}
              handle=".right-handle"
              options={dragOptions}
              onInput={list => {
                this.rightFixedColumns = list;
              }}
              onChange={this.changeHandle}
            >
              <transition-group type="transition">{rightFixedColumns.map(column => this.renderListItem(column, 'right'))}</transition-group>
            </Draggable>
          </div>
        </div>
      );
    }
  },
  render() {
    const cls = [
      `text`,
      {
        selected: this.showPopper
      }
    ];
    return (
      <div class="v-column-filter">
        <Popper
          ref="vPopper"
          trigger="clickToToggle"
          root-class="v-popover--wrapper"
          transition="v-zoom-in-top"
          options={{ placement: 'bottom-end' }}
          visible-arrow={false}
          append-to-body={true}
          onShow={this.popperVisibleHandle}
          onHide={this.popperVisibleHandle}
        >
          <span slot="reference" class={cls}>
            <i class="iconfont icon-pic-right" />
            {config.columnFilterText}
          </span>
          <div class="v-popper">{this.renderColumnFilter()}</div>
        </Popper>
      </div>
    );
  }
};
