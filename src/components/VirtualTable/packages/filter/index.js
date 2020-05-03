/*
 * @Author: 焦质晔
 * @Date: 2020-03-09 13:18:43
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-03 16:26:42
 */
import Popper from '../popper';

import { isEmpty, validateNumber } from '../utils';
import i18n from '../lang';

import Radio from '../radio';
import Checkbox from '../checkbox';
// element-ui Popup -> zIndex
import { PopupManager } from 'element-ui/lib/utils/popup';

export default {
  name: 'THeadFilter',
  props: ['column', 'filters'],
  inject: ['$$header'],
  data() {
    this.arrayTypes = ['checkbox', 'range-number', 'range-date'];
    return {
      showPopper: false,
      filterValues: this.initialFilterValue()
    };
  },
  computed: {
    dataKey() {
      const { dataIndex, filter } = this.column;
      return Object.keys(this.filterValues)[0] || `${filter.type}|${dataIndex}`;
    },
    isValueEmpty() {
      return isEmpty(this.filterValues[this.dataKey]);
    },
    isActived() {
      return !isEmpty(this.filters[this.dataKey]);
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
    popperVisibleHandle({ showPopper }) {
      this.showPopper = showPopper;
    },
    initialFilterValue() {
      const { dataIndex, filter } = this.column;
      return { [`${filter.type}|${dataIndex}`]: this.arrayTypes.includes(filter.type) ? [] : undefined };
    },
    doFinish() {
      const cloneFilters = { ...this.filters };
      const cloneFilterValues = { ...this.filterValues };
      // 筛选值为空，移除该筛选属性
      if (this.isValueEmpty) {
        delete cloneFilters[this.dataKey];
        delete cloneFilterValues[this.dataKey];
      }
      // 设置父组件 filters 值
      this.$$header.filters = Object.assign({}, cloneFilters, cloneFilterValues);
      this.$refs[`vPopper`].doClose();
    },
    doReset() {
      if (this.isValueEmpty && !this.isActived) {
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
            {i18n.t('filter.search')}
          </el-button>
          <el-button size="mini" onClick={this.doReset}>
            {i18n.t('filter.reset')}
          </el-button>
        </div>
      );
    },
    textHandle(column) {
      const { title } = column;
      return (
        <div style="padding-top: 6px">
          <el-input
            size="small"
            v-model={this.filterValues[this.dataKey]}
            placeholder={i18n.t('filter.searchText', { text: title })}
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
      const { title } = column;
      return (
        <div style="padding-top: 6px">
          <el-input
            size="small"
            value={this.filterValues[this.dataKey]}
            onInput={val => {
              if (!validateNumber(val)) return;
              this.filterValues[this.dataKey] = val;
            }}
            placeholder={i18n.t('filter.searchText', { text: title })}
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
    [`range-numberHandle`](column) {
      const [startVal, endVal] = this.filterValues[this.dataKey];
      const setValue = arr => {
        this.filterValues[this.dataKey] = arr.every(x => isEmpty(x)) ? [] : arr.map(x => (x !== '' ? x : undefined));
      };
      return (
        <div style="padding-top: 6px; width: 200px;">
          <el-input
            size="small"
            value={this.filterValues[this.dataKey][0]}
            onInput={val => {
              if (!validateNumber(val)) return;
              setValue([val, this.filterValues[this.dataKey][1]]);
            }}
            style={{ width: '93px' }}
            placeholder={i18n.t('filter.startValuePlaceholder')}
            onChange={val => {
              if (val !== '' && val - endVal > 0) {
                setValue([endVal, this.filterValues[this.dataKey][1]]);
              }
            }}
            nativeOnKeydown={ev => {
              if (ev.keyCode === 13) {
                this.doFinish();
              }
            }}
          />
          <span style="display: inline-block; text-align: center; width: 14px;">-</span>
          <el-input
            size="small"
            value={this.filterValues[this.dataKey][1]}
            onInput={val => {
              if (!validateNumber(val)) return;
              setValue([this.filterValues[this.dataKey][0], val]);
            }}
            min={startVal}
            style={{ width: '93px' }}
            placeholder={i18n.t('filter.endValuePlaceholder')}
            onChange={val => {
              if (val !== '' && val - startVal < 0) {
                setValue([this.filterValues[this.dataKey][0], startVal]);
              }
            }}
            nativeOnKeydown={ev => {
              if (ev.keyCode === 13) {
                this.doFinish();
              }
            }}
          />
        </div>
      );
    },
    radioHandle(column) {
      const { filter } = column;
      return (
        <div>
          <ul>
            {filter.items.map(x => (
              <li style="marginTop: 8px">
                <Radio v-model={this.filterValues[this.dataKey]} trueValue={x.value} falseValue={null} label={x.text} disabled={x.disabled} />
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
      const results = this.filterValues[this.dataKey];
      return (
        <div>
          <ul>
            {items.map(x => {
              const prevValue = results.includes(x.value) ? x.value : null;
              return (
                <li style="marginTop: 8px">
                  <Checkbox
                    value={prevValue}
                    onInput={val => {
                      if (val !== null) {
                        this.filterValues[this.dataKey] = [...new Set([...results, val])];
                      } else {
                        this.filterValues[this.dataKey] = results.filter(x => x !== prevValue);
                      }
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
      return (
        <div style="padding-top: 6px">
          <el-date-picker size="small" type="date" v-model={this.filterValues[this.dataKey]} style={{ width: '180px' }} value-format="yyyy-MM-dd" placeholder={i18n.t('filter.datePlaceholder')} />
        </div>
      );
    },
    [`range-dateHandle`](column) {
      return (
        <div style="padding-top: 6px">
          <el-date-picker
            size="small"
            type="daterange"
            v-model={this.filterValues[this.dataKey]}
            unlink-panels={true}
            style={{ width: '230px' }}
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder={i18n.t('filter.startDatePlaceholder')}
            end-placeholder={i18n.t('filter.endDatePlaceholder')}
          />
        </div>
      );
    }
  },
  render() {
    const { showPopper, isActived } = this;
    const filterBtnCls = [
      `v-filter-btn`,
      {
        [`selected`]: showPopper,
        [`actived`]: isActived
      }
    ];
    return (
      <span class="v-cell--filter" title={i18n.t('filter.text')} onMousedown={ev => ev.stopPropagation()}>
        <Popper
          ref="vPopper"
          trigger="clickToToggle"
          root-class="v-popper--wrapper"
          containerStyle={{ zIndex: PopupManager.nextZIndex() || 1000 }}
          transition="v-zoom-in-top"
          options={{ placement: 'bottom-end' }}
          visible-arrow={false}
          append-to-body={true}
          onShow={this.popperVisibleHandle}
          onHide={this.popperVisibleHandle}
        >
          <div class={filterBtnCls} slot="reference">
            <i class="iconfont icon-filter-fill" />
          </div>
          <div class="v-popper">{this.renderContent()}</div>
        </Popper>
      </span>
    );
  }
};
