/*
 * @Author: 焦质晔
 * @Date: 2020-05-19 16:19:58
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-06-28 08:36:39
 */
import { getCellValue, setCellValue, createUidKey } from '../utils';
import localforage from 'localforage';
import config from '../config';
import Locale from '../locale/mixin';

import VTable from '../table';
import EmptyEle from '../empty/element';
import GroupSummaryResult from './result';
import BaseDialog from '../../../BaseDialog';

export default {
  name: 'GroupSummarySetting',
  mixins: [Locale],
  props: ['columns'],
  inject: ['$$table'],
  data() {
    return {
      savedItems: [], // 已经保存的汇总配置项(本地存储)
      currentKey: '', // 当前的汇总配置项
      form: { name: '' }, // 要保存的配置项名称
      groupList: [],
      groupColumns: this.createGroupColumns(), // 分组项表格列
      summaryList: [],
      summaryColumns: this.createSummaryColumns(), // 汇总表格列
      groupTableData: [], // 分组项表格数据
      summaryTableData: [], // 汇总表格数据
      // 分组项 -> 下拉别表
      groupItems: this.columns.filter(x => !x.groupSummary).map(x => ({ text: x.title, value: x.dataIndex })),
      // 汇总列 -> 下拉别表
      summaryItems: [config.groupSummary.total, ...this.columns.filter(x => !!x.groupSummary).map(x => ({ text: x.title, value: x.dataIndex }))],
      // 汇总结果 状态
      visible: false
    };
  },
  computed: {
    $tableGroup() {
      return this.$refs.group;
    },
    $tableSummary() {
      return this.$refs.summary;
    },
    cacheUniqKey() {
      return this.$$table.cacheColumnsKey;
    },
    // 显示汇总 按钮的状态
    confirmDisabled() {
      const { groupTableData, summaryTableData } = this;
      const isGroup = groupTableData.length && groupTableData.every(x => Object.values(x).every(k => k !== ''));
      const isSummary = summaryTableData.length && summaryTableData.every(x => Object.values(x).every(k => k !== ''));
      return !(isGroup && isSummary);
    }
  },
  watch: {
    currentKey(next) {
      if (next) {
        const { group, summary } = this.savedItems.find(x => x.value === next).list;
        this.groupList = group;
        this.summaryList = summary;
      } else {
        this.groupList = [];
        this.summaryList = [];
      }
    }
  },
  async created() {
    try {
      const res = await localforage.getItem(this.cacheUniqKey);
      if (Array.isArray(res) && res.length) {
        this.savedItems = res;
        this.currentKey = res[0].value;
      }
    } catch (err) {}
  },
  methods: {
    createGroupColumns() {
      return [
        {
          title: '操作',
          dataIndex: '__action__',
          fixed: 'left',
          width: 80,
          render: (text, row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => {
                    this.setGroupDisabled(row.group, false);
                    this.$tableGroup.REMOVE_RECORDS(row);
                  }}
                >
                  {this.t('table.groupSummary.removeText')}
                </el-button>
              </div>
            );
          }
        },
        {
          dataIndex: 'group',
          title: '分组项',
          width: 200,
          render: (text, row, column) => {
            const prevValue = getCellValue(row, column.dataIndex);
            return (
              <el-select
                size="small"
                value={prevValue}
                onInput={val => {
                  setCellValue(row, column.dataIndex, val);
                }}
                clearable={!0}
                onChange={val => {
                  prevValue && this.setGroupDisabled(prevValue, false);
                  val && this.setGroupDisabled(val, true);
                }}
              >
                {this.groupItems.map(x => (
                  <el-option key={x.value} label={x.text} value={x.value} disabled={x.disabled} />
                ))}
              </el-select>
            );
          }
        }
      ];
    },
    createSummaryColumns() {
      return [
        {
          title: '操作',
          dataIndex: '__action__',
          fixed: 'left',
          width: 80,
          render: (text, row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => {
                    this.setSummaryDisabled(row.summary, false);
                    this.$tableSummary.REMOVE_RECORDS(row);
                  }}
                >
                  {this.t('table.groupSummary.removeText')}
                </el-button>
              </div>
            );
          }
        },
        {
          dataIndex: 'summary',
          title: '汇总列',
          width: 200,
          render: (text, row, column) => {
            const prevValue = getCellValue(row, column.dataIndex);
            return (
              <el-select
                size="small"
                value={prevValue}
                onInput={val => {
                  setCellValue(row, column.dataIndex, val);
                }}
                clearable={!0}
                onChange={val => {
                  prevValue && this.setSummaryDisabled(prevValue, false);
                  val && this.setSummaryDisabled(val, true);
                }}
              >
                {this.summaryItems.map(x => (
                  <el-option key={x.value} label={x.text} value={x.value} disabled={x.disabled} />
                ))}
              </el-select>
            );
          }
        },
        {
          dataIndex: 'formula',
          title: '计算公式',
          width: 150,
          render: (text, row, column) => {
            const prevValue = getCellValue(row, column.dataIndex);
            const itemList = row.summary === '__total__' ? config.groupSummary.calcItems.slice(0, 1) : [...config.groupSummary.calcItems];
            return (
              <el-select
                size="small"
                value={prevValue}
                onInput={val => {
                  setCellValue(row, column.dataIndex, val);
                }}
                clearable={!0}
              >
                {itemList.map(x => (
                  <el-option key={x.value} label={x.text} value={x.value} />
                ))}
              </el-select>
            );
          }
        }
      ];
    },
    setGroupDisabled(val, bool) {
      if (!val) return;
      this.groupItems.find(x => x.value === val).disabled = bool;
    },
    setSummaryDisabled(val, bool) {
      if (!val) return;
      this.summaryItems.find(x => x.value === val).disabled = bool;
    },
    // 保存配置
    async saveConfigHandle() {
      const title = this.form.name;
      const uuid = createUidKey();
      this.savedItems.push({
        text: title,
        value: uuid,
        list: {
          group: this.groupTableData,
          summary: this.summaryTableData
        }
      });
      try {
        await localforage.setItem(this.cacheUniqKey, this.savedItems);
        this.currentKey = uuid;
      } catch (err) {}
    },
    // 切换配置信息
    toggleHandle(key) {
      this.currentKey = key !== this.currentKey ? key : '';
    },
    // 移除保存的 汇总配置项
    async removeSavedHandle(ev, key) {
      ev.stopPropagation();
      if (!key) return;
      const index = this.savedItems.findIndex(x => x.value === key);
      this.savedItems.splice(index, 1);
      try {
        await localforage.setItem(this.cacheUniqKey, this.savedItems);
        if (key === this.currentKey) {
          this.currentKey = '';
        }
      } catch (err) {}
    },
    // 关闭
    cancelHandle() {
      this.$emit('close', false);
    },
    // 显示汇总
    confirmHandle() {
      this.visible = true;
    }
  },
  render() {
    const { columns, groupList, groupColumns, summaryList, summaryColumns, form, savedItems, currentKey, confirmDisabled, visible, groupTableData, summaryTableData } = this;
    const wrapProps = {
      props: {
        visible,
        title: this.t('table.groupSummary.resultText'),
        showFullScreen: false,
        width: '1000px',
        destroyOnClose: true
      },
      on: {
        'update:visible': val => (this.visible = val)
      }
    };
    return (
      <div class="v-group-summary--setting">
        <div class="main">
          <div class="container" style={{ width: '280px' }}>
            <VTable
              ref="group"
              height={300}
              dataSource={groupList}
              columns={groupColumns}
              showFullScreen={false}
              showColumnDefine={false}
              rowKey={record => record.index}
              columnsChange={columns => (this.groupColumns = columns)}
              onDataChange={tableData => (this.groupTableData = [...tableData])}
            >
              <template slot="default">
                <el-button type="primary" icon="el-icon-plus" onClick={() => this.$tableGroup.INSERT_RECORDS({})} style={{ marginLeft: '10px' }} />
              </template>
            </VTable>
          </div>
          <div class="container line" style={{ width: '430px' }}>
            <VTable
              ref="summary"
              height={300}
              dataSource={summaryList}
              columns={summaryColumns}
              showFullScreen={false}
              showColumnDefine={false}
              rowKey={record => record.index}
              columnsChange={columns => (this.summaryColumns = columns)}
              onDataChange={tableData => (this.summaryTableData = [...tableData])}
            >
              <template slot="default">
                <el-button type="primary" icon="el-icon-plus" onClick={() => this.$tableSummary.INSERT_RECORDS({})} />
              </template>
            </VTable>
          </div>
          <div class="saved line">
            <div class="form-wrap">
              <el-input class="form-item" size="small" placeholder={this.t('table.groupSummary.configText')} value={form.name} onInput={val => (this.form.name = val)} disabled={confirmDisabled} />
              <el-button type="primary" disabled={!form.name} style={{ marginLeft: '10px' }} onClick={() => this.saveConfigHandle()}>
                {this.t('table.groupSummary.saveButton')}
              </el-button>
            </div>
            <div class="card-wrap">
              <h5 style={{ height: `${config.rowHeightMaps[this.$$table.size]}px` }}>
                <span>保存的汇总配置</span>
              </h5>
              <ul>
                {savedItems.map(x => (
                  <li class={x.value === currentKey && 'selected'} onClick={() => this.toggleHandle(x.value)}>
                    <span class="title">
                      <i class={['iconfont', x.value === currentKey ? 'icon-check' : 'icon-file']} />
                      <span>{x.text}</span>
                    </span>
                    <i class="iconfont icon-close-circle close" title={this.t('table.groupSummary.removeText')} onClick={ev => this.removeSavedHandle(ev, x.value)} />
                  </li>
                ))}
                {!savedItems.length && (
                  <div style={{ padding: '10px' }}>
                    <EmptyEle />
                  </div>
                )}
              </ul>
            </div>
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            right: 0,
            zIndex: 9,
            borderTop: '1px solid #d9d9d9',
            padding: '10px 15px',
            background: '#fff',
            textAlign: 'right'
          }}
        >
          <el-button onClick={() => this.cancelHandle()}>{this.t('table.groupSummary.closeButton')}</el-button>
          <el-button type="primary" onClick={() => this.confirmHandle()} disabled={confirmDisabled}>
            {this.t('table.groupSummary.confirmButton')}
          </el-button>
        </div>
        <BaseDialog {...wrapProps}>
          <GroupSummaryResult columns={columns} group={groupTableData} summary={summaryTableData} />
        </BaseDialog>
      </div>
    );
  }
};
