/*
 * @Author: 焦质晔
 * @Date: 2020-03-09 13:18:43
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-15 17:11:08
 */
import Popper from '../popper';

import { isEmpty, validateNumber } from '../utils';

import Radio from '../radio';
import Checkbox from '../checkbox';

export default {
  name: 'THeadFilter',
  props: ['column'],
  inject: ['$$header'],
  data() {
    this.arrayTypes = ['checkbox', 'range-number', 'date-range'];
    return {
      showPopper: false,
      filterParams: this.initialFilterValue()
    };
  },
  computed: {
    dataKey() {
      const { dataIndex, filter } = this.column;
      return Object.keys(this.filterParams)[0] || `${filter.type}|${dataIndex}`;
    },
    isActived() {
      return !isEmpty(this.$$header.thFilter[this.dataKey]);
    }
  },
  methods: {
    initialFilterValue() {
      const { dataIndex, filter } = this.column;
      return { [`${filter.type}|${dataIndex}`]: this.arrayTypes.includes(filter.type) ? [] : undefined };
    },
    popperVisibleHandle({ showPopper }) {
      this.showPopper = showPopper;
    },
    doFinish() {
      const cloneFilter = { ...this.$$header.thFilter };
      if (isEmpty(this.filterParams[this.dataKey])) {
        this.filterParams = this.initialFilterValue();
        delete cloneFilter[this.dataKey];
      }
      this.$$header.thFilter = Object.assign({}, cloneFilter, this.filterParams);
      this.$refs[`vPopper`].doClose();
    },
    doReset() {
      if (!Object.keys(this.filterParams).length) {
        return this.$refs[`vPopper`].doClose();
      }
      this.filterParams = this.initialFilterValue();
      this.doFinish();
    },
    renderContent() {
      const { type } = this.column.filter;
      const renderFormItem = this[`${type}Handle`];
      if (!renderFormItem) {
        console.error('[Table]:表头筛选的类型 `type` 配置不正确');
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
            搜索
          </el-button>
          <el-button size="mini" onClick={this.doReset}>
            重置
          </el-button>
        </div>
      );
    },
    textHandle(column) {
      const { title } = column;
      return (
        <div style="padding-top: 6px">
          <el-input
            v-model={this.filterParams[this.dataKey]}
            placeholder={`搜索${title}`}
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
            value={this.filterParams[this.dataKey]}
            onInput={val => {
              if (!validateNumber(val)) return;
              this.filterParams[this.dataKey] = val;
            }}
            placeholder={`搜索${title}`}
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
      const [startVal, endVal] = this.filterParams[this.dataKey];
      const setValue = arr => {
        this.filterParams[this.dataKey] = arr.map(x => (x !== '' ? x : undefined));
      };
      return (
        <div style="padding-top: 6px">
          <el-input
            value={this.filterParams[this.dataKey][0]}
            onInput={val => {
              if (!validateNumber(val)) return;
              setValue([val, this.filterParams[this.dataKey][1]]);
            }}
            style={{ width: '100px' }}
            placeholder="开始值"
            onChange={val => {
              if (val !== '' && val - endVal > 0) {
                setValue([endVal, this.filterParams[this.dataKey][1]]);
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
            value={this.filterParams[this.dataKey][1]}
            onInput={val => {
              if (!validateNumber(val)) return;
              setValue([this.filterParams[this.dataKey][0], val]);
            }}
            min={startVal}
            style={{ width: '100px' }}
            placeholder="结束值"
            onChange={val => {
              if (val !== '' && val - startVal < 0) {
                setValue([this.filterParams[this.dataKey][0], startVal]);
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
              <li style="marginTop: 4px">
                <Radio v-model={this.filterParams[this.dataKey]} trueValue={x.value} falseValue={null} label={x.text} disabled={x.disabled} />
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
      const results = this.filterParams[this.dataKey];
      return (
        <div>
          <ul>
            {items.map(x => {
              const prevValue = results.includes(x.value) ? x.value : null;
              return (
                <li style="marginTop: 4px">
                  <Checkbox
                    value={prevValue}
                    onInput={val => {
                      if (val !== null) {
                        this.filterParams[this.dataKey] = [...new Set([...results, val])];
                      } else {
                        this.filterParams[this.dataKey] = results.filter(x => x !== prevValue);
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
          <el-date-picker size="small" type="date" v-model={this.filterParams[this.dataKey]} style={{ width: '180px' }} value-format="yyyy-MM-dd" clearable={false} placeholder="选择日期" />
        </div>
      );
    },
    [`range-dateHandle`](column) {
      return (
        <div style="padding-top: 6px">
          <el-date-picker
            size="small"
            type="daterange"
            v-model={this.filterParams[this.dataKey]}
            unlink-panels={true}
            style={{ width: '200px' }}
            value-format="yyyy-MM-dd"
            clearable={false}
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
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
      <span class="v-cell--filter" title="筛选" onClick={ev => ev.stopPropagation()}>
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
          <div class={filterBtnCls} slot="reference">
            <i class="v-icon--funnel" />
          </div>
          <div class="v-popper">
            <div class="v-popper--content">{this.renderContent()}</div>
          </div>
        </Popper>
      </span>
    );
  }
};
