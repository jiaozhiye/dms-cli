/*
 * @Author: 焦质晔
 * @Date: 2020-03-09 13:18:43
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-13 21:38:22
 */
import SvgIcon from '../../../SvgIcon';
import Popper from '../popper';

import { isEmpty, validateNumber } from '../utils';
import { cloneDeep } from 'lodash';
import Locale from '../locale/mixin';

import Radio from '../radio';
import Checkbox from '../checkbox';
// element-ui -> zIndex
import { PopupManager } from 'element-ui/lib/utils/popup';

export default {
  name: 'THeadFilter',
  mixins: [Locale],
  props: ['column', 'filters'],
  inject: ['$$table', '$$header'],
  data() {
    return {
      showPopper: false,
      filterValues: this.initialFilterValue()
    };
  },
  computed: {
    size() {
      return this.$$table.tableSize !== 'mini' ? 'small' : 'mini';
    },
    dataKey() {
      const { dataIndex, filter } = this.column;
      return Object.keys(this.filterValues)[0] || `${filter.type}|${dataIndex}`;
    },
    isFilterEmpty() {
      let res = !0; // 假设是空
      for (let key in this.filterValues[this.dataKey]) {
        if (!isEmpty(this.filterValues[this.dataKey][key])) {
          res = !1;
          break;
        }
      }
      return res;
    },
    isActived() {
      let res = !1; // 假设非激活状态
      for (let key in this.filters[this.dataKey]) {
        if (!isEmpty(this.filters[this.dataKey][key])) {
          res = !0;
          break;
        }
      }
      return res;
    }
  },
  watch: {
    filters() {
      // 非激活状态(此筛选项数据为空) -> 恢复初始值
      if (!this.isActived) {
        this.filterValues = this.initialFilterValue();
      }
    }
  },
  methods: {
    initialFilterValue() {
      const { dataIndex, filter } = this.column;
      return { [`${filter.type}|${dataIndex}`]: undefined };
    },
    popperVisibleHandle(showPopper) {
      const { dataKey } = this;
      if (showPopper && this.filters[dataKey]) {
        this.filterValues[dataKey] = cloneDeep(this.filters[dataKey]);
      }
      this.showPopper = showPopper;
    },
    doFinish() {
      const { dataKey } = this;
      // 筛选值为空，移除该筛选属性
      if (this.isFilterEmpty) {
        delete this.filters[dataKey];
        delete this.filterValues[dataKey];
      } else {
        for (let key in this.filterValues[dataKey]) {
          if (isEmpty(this.filterValues[dataKey][key])) {
            delete this.filterValues[dataKey][key];
          }
        }
      }
      // 清空高级检索
      this.$$table.clearSuperSearch();
      // 设置父组件 filters 值
      this.$$header.filters = Object.assign({}, cloneDeep(this.filters), cloneDeep(this.filterValues));
      this.$refs[`vPopper`].doClose();
    },
    doReset() {
      if (this.isFilterEmpty && !this.isActived) {
        return this.$refs[`vPopper`].doClose();
      }
      // 恢复初始值
      this.filterValues = this.initialFilterValue();
      this.doFinish();
    },
    renderContent() {
      const { type } = this.column.filter;
      const renderFormItem = this[`${type}Handle`];
      if (!renderFormItem) {
        console.error('[Table]: 表头筛选的类型 `type` 配置不正确');
        return null;
      }
      return (
        <div class="v-filter--wrap">
          {renderFormItem(this.column)}
          {this.renderFormButton()}
        </div>
      );
    },
    renderFormButton() {
      return (
        <div style="padding: 10px 0 6px">
          <el-button type="primary" size="mini" onClick={this.doFinish}>
            {this.t('table.filter.search')}
          </el-button>
          <el-button size="mini" onClick={this.doReset}>
            {this.t('table.filter.reset')}
          </el-button>
        </div>
      );
    },
    textHandle(column) {
      const { title } = column;
      const { dataKey } = this;
      return (
        <div style="padding-top: 6px">
          <el-input
            size={this.size}
            value={this.filterValues[dataKey]?.[`like`]}
            onInput={val => {
              this.filterValues[dataKey] = Object.assign({}, this.filterValues[dataKey], { [`like`]: val });
            }}
            placeholder={this.t('table.filter.searchText', { text: title })}
            style={{ width: '180px' }}
            nativeOnKeydown={ev => {
              if (ev.keyCode === 13) {
                this.doFinish();
              }
            }}
          />
        </div>
      );
    },
    numberHandle(column) {
      const { dataKey } = this;
      return (
        <div>
          <ul class="v-filter-list">
            <li>
              <span>&gt;&nbsp;</span>
              <el-input
                size={this.size}
                value={this.filterValues[dataKey]?.[`>`]}
                onInput={val => {
                  if (!validateNumber(val)) return;
                  this.filterValues[dataKey] = Object.assign({}, this.filterValues[dataKey], { [`>`]: val !== '' ? Number(val) : '' });
                }}
                placeholder={this.t('table.filter.gtPlaceholder')}
                style={{ width: '120px' }}
                nativeOnKeydown={ev => {
                  if (ev.keyCode === 13) {
                    this.doFinish();
                  }
                }}
              />
            </li>
            <li>
              <span>&lt;&nbsp;</span>
              <el-input
                size={this.size}
                value={this.filterValues[dataKey]?.[`<`]}
                onInput={val => {
                  if (!validateNumber(val)) return;
                  this.filterValues[dataKey] = Object.assign({}, this.filterValues[dataKey], { [`<`]: val !== '' ? Number(val) : '' });
                }}
                placeholder={this.t('table.filter.ltPlaceholder')}
                style={{ width: '120px' }}
                nativeOnKeydown={ev => {
                  if (ev.keyCode === 13) {
                    this.doFinish();
                  }
                }}
              />
            </li>
            <li>
              <span>=&nbsp;</span>
              <el-input
                size={this.size}
                value={this.filterValues[dataKey]?.[`==`]}
                onInput={val => {
                  if (!validateNumber(val)) return;
                  this.filterValues[dataKey] = Object.assign({}, this.filterValues[dataKey], { [`==`]: val !== '' ? Number(val) : '' });
                }}
                placeholder={this.t('table.filter.eqPlaceholder')}
                style={{ width: '120px' }}
                nativeOnKeydown={ev => {
                  if (ev.keyCode === 13) {
                    this.doFinish();
                  }
                }}
              />
            </li>
            <li>
              <span>!=</span>
              <el-input
                size={this.size}
                value={this.filterValues[dataKey]?.[`!=`]}
                onInput={val => {
                  if (!validateNumber(val)) return;
                  this.filterValues[dataKey] = Object.assign({}, this.filterValues[dataKey], { [`!=`]: val !== '' ? Number(val) : '' });
                }}
                placeholder={this.t('table.filter.neqPlaceholder')}
                style={{ width: '120px' }}
                nativeOnKeydown={ev => {
                  if (ev.keyCode === 13) {
                    this.doFinish();
                  }
                }}
              />
            </li>
          </ul>
        </div>
      );
    },
    // 处理兼容
    [`range-numberHandle`](column) {
      return this.numberHandle(column);
    },
    radioHandle(column) {
      const { filter } = column;
      const { dataKey } = this;
      return (
        <div>
          <ul class="v-filter-list">
            {filter.items.map(x => (
              <li>
                <Radio
                  value={this.filterValues[dataKey]?.[`==`] ?? null}
                  onInput={val => {
                    this.filterValues[dataKey] = Object.assign({}, this.filterValues[dataKey], { [`==`]: val });
                  }}
                  trueValue={x.value}
                  falseValue={null}
                  label={x.text}
                  disabled={x.disabled}
                />
              </li>
            ))}
          </ul>
        </div>
      );
    },
    checkboxHandle(column) {
      const {
        filter: { items = [] }
      } = column;
      const { dataKey } = this;
      const results = this.filterValues[dataKey]?.[`in`] ?? [];
      return (
        <div>
          <ul class="v-filter-list">
            {items.map(x => {
              const prevValue = results.includes(x.value) ? x.value : null;
              return (
                <li>
                  <Checkbox
                    value={prevValue}
                    onInput={val => {
                      const arr = val !== null ? [...new Set([...results, val])] : results.filter(x => x !== prevValue);
                      this.filterValues[dataKey] = Object.assign({}, this.filterValues[dataKey], { [`in`]: arr });
                    }}
                    trueValue={x.value}
                    falseValue={null}
                    label={x.text}
                    disabled={x.disabled}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      );
    },
    dateHandle(column) {
      const { dataKey } = this;
      return (
        <div>
          <ul class="v-filter-list">
            <li>
              <span>&gt;&nbsp;</span>
              <el-date-picker
                size={this.size}
                type="date"
                value={this.filterValues[dataKey]?.[`>`]}
                valueFormat="yyyy-MM-dd"
                onInput={val => {
                  this.filterValues[dataKey] = Object.assign({}, this.filterValues[dataKey], { [`>`]: val ?? '' });
                }}
                placeholder={this.t('table.filter.gtPlaceholder')}
                style={{ width: '150px' }}
              />
            </li>
            <li>
              <span>&lt;&nbsp;</span>
              <el-date-picker
                size={this.size}
                type="date"
                value={this.filterValues[dataKey]?.[`<`]}
                valueFormat="yyyy-MM-dd"
                onInput={val => {
                  this.filterValues[dataKey] = Object.assign({}, this.filterValues[dataKey], { [`<`]: val ?? '' });
                }}
                placeholder={this.t('table.filter.ltPlaceholder')}
                style={{ width: '150px' }}
              />
            </li>
            <li>
              <span>=&nbsp;</span>
              <el-date-picker
                size={this.size}
                type="date"
                value={this.filterValues[dataKey]?.[`==`]}
                valueFormat="yyyy-MM-dd"
                onInput={val => {
                  this.filterValues[dataKey] = Object.assign({}, this.filterValues[dataKey], { [`==`]: val ?? '' });
                }}
                placeholder={this.t('table.filter.eqPlaceholder')}
                style={{ width: '150px' }}
              />
            </li>
            <li>
              <span>!=</span>
              <el-date-picker
                size={this.size}
                type="date"
                value={this.filterValues[dataKey]?.[`!=`]}
                valueFormat="yyyy-MM-dd"
                onInput={val => {
                  this.filterValues[dataKey] = Object.assign({}, this.filterValues[dataKey], { [`!=`]: val ?? '' });
                }}
                placeholder={this.t('table.filter.neqPlaceholder')}
                style={{ width: '150px' }}
              />
            </li>
          </ul>
        </div>
      );
    },
    // 处理兼容
    [`range-dateHandle`](column) {
      return this.dateHandle(column);
    }
  },
  render() {
    const { showPopper, isActived } = this;
    const wrapProps = {
      ref: 'vPopper',
      props: {
        trigger: 'clickToToggle',
        rootClass: 'v-popper--wrapper',
        transition: 'v-zoom-in-top',
        options: { placement: 'bottom-end' },
        containerStyle: { zIndex: PopupManager.nextZIndex() || 1000 },
        appendToBody: true
      },
      on: {
        show: this.popperVisibleHandle,
        hide: this.popperVisibleHandle
      }
    };
    const filterBtnCls = [
      `v-filter-btn`,
      {
        [`selected`]: showPopper,
        [`actived`]: isActived
      }
    ];
    return (
      <span class="v-cell--filter" title={this.t('table.filter.text')}>
        <Popper {...wrapProps}>
          <div class={filterBtnCls} slot="reference">
            <SvgIcon class="icon-filter" icon-class="filter" />
          </div>
          <div class="v-popper">{this.renderContent()}</div>
        </Popper>
      </span>
    );
  }
};
