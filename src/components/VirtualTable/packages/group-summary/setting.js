/*
 * @Author: 焦质晔
 * @Date: 2020-05-19 16:19:58
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-14 14:03:00
 */
import localforage from 'localforage';
import { createUidKey } from '../utils';
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
    // 分组项 字典
    this.groupItems = this.columns.filter(x => !x.groupSummary).map(x => ({ text: x.title, value: x.dataIndex }));
    // 汇总列 字典
    this.summaryItems = [config.groupSummary.total, ...this.columns.filter(x => !!x.groupSummary).map(x => ({ text: x.title, value: x.dataIndex }))];
    // 计算公式 字典
    this.formulaItems = [
      { text: this.t('table.groupSummary.sumText'), value: 'sum' },
      { text: this.t('table.groupSummary.maxText'), value: 'max' },
      { text: this.t('table.groupSummary.minText'), value: 'min' },
      { text: this.t('table.groupSummary.avgText'), value: 'avg' },
      { text: this.t('table.groupSummary.countText'), value: 'count' }
    ];
    return {
      savedItems: [],
      currentKey: '',
      form: { name: '' },
      groupList: [],
      groupColumns: this.createGroupColumns(),
      summaryList: [],
      summaryColumns: this.createSummaryColumns(),
      groupTableData: [], // 分组项表格数据
      summaryTableData: [], // 汇总表格数据
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
    groupSummaryKey() {
      return this.$$table.uniqueKey ? `summary_${this.$$table.uniqueKey}` : '';
    },
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
    if (!this.groupSummaryKey) return;
    try {
      const res = await localforage.getItem(this.groupSummaryKey);
      if (Array.isArray(res) && res.length) {
        this.savedItems = res;
        this.currentKey = res[0].value;
      }
    } catch (err) {}
  },
  methods: {
    findColumn(columns, dataIndex) {
      return columns.find(x => x.dataIndex === dataIndex);
    },
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
          editRender: row => {
            return {
              type: 'select',
              editable: true,
              items: this.setGroupDisabled(),
              extra: {
                clearable: false
              }
            };
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
          editRender: row => {
            return {
              type: 'select',
              editable: true,
              items: this.setSummaryDisabled(),
              extra: {
                clearable: false
              },
              onChange: (cell, row) => {
                row[`formula`] = '';
              }
            };
          }
        },
        {
          dataIndex: 'formula',
          title: '计算公式',
          width: 150,
          editRender: row => {
            return {
              type: 'select',
              editable: true,
              items: row.summary === config.groupSummary.total.value ? this.formulaItems.slice(this.formulaItems.length - 1) : this.formulaItems,
              extra: {
                clearable: false
              }
            };
          }
        }
      ];
    },
    setGroupDisabled() {
      return this.groupItems.map(x => ({
        ...x,
        disabled: this.groupTableData.findIndex(k => k.group === x.value) > -1
      }));
    },
    setSummaryDisabled() {
      return this.summaryItems.map(x => ({
        ...x,
        disabled: this.summaryTableData.findIndex(k => k.summary === x.value) > -1
      }));
    },
    // 保存配置
    async saveConfigHandle() {
      if (!this.groupSummaryKey) {
        return console.error('[Table]: 必须设置组件参数 `uniqueKey` 才能保存');
      }
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
        await localforage.setItem(this.groupSummaryKey, this.savedItems);
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
        await localforage.setItem(this.groupSummaryKey, this.savedItems);
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
              onDataChange={tableData => {
                this.groupTableData = tableData;
              }}
            >
              <template slot="default">
                <el-button type="primary" icon="el-icon-plus" onClick={() => this.$tableGroup.INSERT_RECORDS({})} style={{ marginLeft: '10px', marginRight: '-10px' }} />
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
              onDataChange={tableData => {
                this.summaryTableData = tableData;
              }}
            >
              <template slot="default">
                <el-button type="primary" icon="el-icon-plus" style={{ marginRight: '-10px' }} onClick={() => this.$tableSummary.INSERT_RECORDS({})} />
              </template>
            </VTable>
          </div>
          <div class="saved line">
            <div class="form-wrap">
              <el-input class="form-item" placeholder={this.t('table.groupSummary.configText')} value={form.name} disabled={confirmDisabled} onInput={val => (this.form.name = val)} />
              <el-button type="primary" disabled={!form.name} style={{ marginLeft: '10px' }} onClick={() => this.saveConfigHandle()}>
                {this.t('table.groupSummary.saveButton')}
              </el-button>
            </div>
            <div class="card-wrap">
              <h5 style={{ height: `${config.rowHeightMaps[this.$$table.tableSize]}px` }}>
                <span>{this.t('table.groupSummary.savedSetting')}</span>
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
          <el-button type="primary" disabled={confirmDisabled} onClick={() => this.confirmHandle()}>
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
