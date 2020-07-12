/*
 * @Author: 焦质晔
 * @Date: 2020-03-17 10:29:47
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-12 16:41:31
 */
import Popper from '../popper';
import Draggable from '../draggable';
import Checkbox from '../checkbox';

import config from '../config';
import Locale from '../locale/mixin';

const noop = () => {};

export default {
  name: 'ColumnFilter',
  mixins: [Locale],
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
    popperVisibleHandle(showPopper) {
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
          <i class={cls} title={this.t('table.columnFilter.draggable')} />
          <span>{column.title}</span>
          {type === 'main' ? (
            <span class="fixed">
              <i class="iconfont icon-step-backward" title={this.t('table.columnFilter.fixedLeft')} onClick={() => this.fixedChangeHandle(column, 'left')} />
              <i class="iconfont icon-step-forward" title={this.t('table.columnFilter.fixedRight')} onClick={() => this.fixedChangeHandle(column, 'right')} />
            </span>
          ) : (
            <span class="fixed">
              <i class="iconfont icon-close-circle" title={this.t('table.columnFilter.cancelFixed')} onClick={() => this.cancelFixedHandle(column)} />
            </span>
          )}
        </li>
      );
    },
    renderColumnFilter() {
      const { leftFixedColumns, mainColumns, rightFixedColumns, dragOptions } = this;
      const cls = [`v-column-filter--wrap`, `size--${this.$$table.tableSize}`];
      return (
        <div class={cls}>
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
    const wrapProps = {
      ref: 'vPopper',
      props: {
        trigger: 'clickToToggle',
        rootClass: 'v-popper--wrapper',
        transition: 'v-zoom-in-top',
        options: { placement: 'bottom-end' },
        containerStyle: { zIndex: 9999 },
        appendToBody: true
      },
      on: {
        show: this.popperVisibleHandle,
        hide: this.popperVisibleHandle
      }
    };
    const cls = [`v-column-filter`, `size--${this.$$table.tableSize}`];
    return (
      <div class={cls}>
        <Popper {...wrapProps}>
          <span slot="reference" class={{ [`text`]: !0, [`selected`]: this.showPopper }}>
            <i class="iconfont icon-unorderedlist" />
            {this.t('table.columnFilter.text')}
          </span>
          <div class="v-popper">{this.renderColumnFilter()}</div>
        </Popper>
      </div>
    );
  }
};
