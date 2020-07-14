/*
 * @Author: 焦质晔
 * @Date: 2020-03-01 15:20:02
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-14 10:12:38
 */
import { throttle, browse, difference, sleep, getCellValue, setCellValue } from '../utils';
import config from '../config';
import { get, cloneDeep } from 'lodash';

const $browse = browse();
const isWebkit = $browse['webkit'];
const throttleScrollYDuration = $browse['msie'] ? 20 : 10;

export default {
  // 创建表格数据
  createTableData(list, callback) {
    const { currentPage, pageSize } = this.pagination;
    const resetRowData = arr => {
      return arr.map((record, index) => {
        if (Array.isArray(record.children) && record.children.length) {
          record.children = resetRowData(record.children);
        }
        // 数据索引
        record.index = index;
        // 分页索引
        record.pageIndex = (currentPage - 1) * pageSize + index;
        // 初始化数据
        this.flattenColumns.forEach(column => {
          const { dataIndex, precision } = column;
          if (['__expandable__', '__selection__', config.operationColumn].includes(dataIndex)) return;
          // 回调方法
          callback?.(record, dataIndex);
          const cellVal = getCellValue(record, dataIndex);
          if (precision >= 0 && !Number.isNaN(Number.parseFloat(cellVal))) {
            setCellValue(record, dataIndex, Number(cellVal).toFixed(precision));
          }
        });
        return record;
      });
    };
    const results = resetRowData(list);
    // 设置表格数据
    this.tableFullData = [...results];
    this.tableOriginData = [...results];
  },
  // ajax 获取数据
  async getTableData() {
    const { fetch, fetchParams } = this;
    if (!fetch || fetch.xhrAbort) return;
    // console.log(`ajax 请求参数：`, fetchParams);
    this.showLoading = true;
    if (process.env.MOCK_DATA === 'true') {
      await sleep(500);
      const { data } = cloneDeep(require('@/mock/tableData').default);
      // 模拟分页
      const { currentPage, pageSize } = fetchParams;
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      // 处理数据
      this.createTableData(data.items.slice(start, end));
      this.setRecordsTotal(data.total);
      // 设置展开行
      this.rowExpandedKeys = this.createRowExpandedKeys();
    } else {
      try {
        const res = await fetch.api(fetchParams);
        if (res.code === 200) {
          const datakey = fetch.dataKey ?? config.dataKey;
          const items = get(res.data, datakey) ?? [];
          const total = get(res.data, datakey.replace(/[^\.]+$/, config.totalKey)) || items.length || 0;
          // 服务端合计
          if (this.showFooter) {
            this.flattenColumns
              .filter(x => x.summation && x.summation.dataIndex)
              .forEach(x => {
                setCellValue(this.summaries, x.dataIndex, Number(res.data[x.summation.dataIndex]) || 0);
              });
          }
          // 处理数据
          this.createTableData(items);
          this.setRecordsTotal(total);
        } else {
          // 处理数据
          this.createTableData([]);
          this.setRecordsTotal(0);
        }
        // 设置展开行
        this.rowExpandedKeys = this.createRowExpandedKeys();
      } catch (e) {}
    }
    this.showLoading = false;
  },
  // 加载表格数据
  loadTableData() {
    const { height, maxHeight, ellipsis } = this;

    // 是否开启虚拟滚动
    this.scrollYLoad = this.createScrollYLoad();

    if (this.scrollYLoad) {
      if (!(height || maxHeight)) {
        console.error('[Table]: 必须设置组件参数 `height` 或 `maxHeight`');
      }
      if (!ellipsis) {
        console.error('[Table]: 必须设置组件参数 `ellipsis`');
      }
    }

    this.handleTableData();
    !this.isFetch && this.setRecordsTotal();

    return this.computeScrollLoad();
  },
  // 设置是否开启虚拟滚动
  createScrollYLoad() {
    let dataList = !this.webPagination ? this.tableFullData : this.pageTableData;
    return dataList.length > config.virtualScrollY;
  },
  // 设置数据总数
  setRecordsTotal(total) {
    this.total = typeof total === 'undefined' ? this.tableFullData.length : total;
  },
  // 处理渲染数据
  handleTableData() {
    const { scrollYLoad, scrollYStore, webPagination, tableFullData, pageTableData } = this;
    let dataList = !webPagination ? tableFullData : pageTableData;
    // 处理显示数据
    this.tableData = scrollYLoad ? dataList.slice(scrollYStore.startIndex, scrollYStore.startIndex + scrollYStore.renderSize) : dataList;
  },
  // 纵向 Y 可视渲染事件处理
  triggerScrollYEvent(ev) {
    // webkit 浏览器使用最佳的渲染方式
    if (isWebkit) {
      this.loadScrollYData(ev.target.scrollTop);
    } else {
      throttle(this.loadScrollYData, throttleScrollYDuration)(ev.target.scrollTop);
    }
  },
  // 纵向 Y 可视渲染处理
  loadScrollYData(scrollTop = 0) {
    const { tableFullData, scrollYStore } = this;
    const { startIndex, renderSize, offsetSize, visibleSize, rowHeight } = scrollYStore;
    const toVisibleIndex = Math.ceil(scrollTop / rowHeight);

    let preload = false;

    if (scrollYStore.visibleIndex !== toVisibleIndex) {
      const marginSize = Math.min(Math.floor((renderSize - visibleSize) / 2), visibleSize);

      if (scrollYStore.visibleIndex > toVisibleIndex) {
        // 向上
        preload = toVisibleIndex - offsetSize <= startIndex;
        if (preload) {
          scrollYStore.startIndex = Math.max(0, toVisibleIndex - Math.max(marginSize, renderSize - visibleSize));
        }
      } else {
        // 向下
        preload = toVisibleIndex + visibleSize + offsetSize >= startIndex + renderSize;
        if (preload) {
          scrollYStore.startIndex = Math.max(0, Math.min(tableFullData.length - renderSize, toVisibleIndex - marginSize));
        }
      }

      if (preload) {
        this.updateScrollYData();
      }

      scrollYStore.visibleIndex = toVisibleIndex;
    }
  },
  // 更新纵向 Y 可视渲染上下剩余空间大小
  updateScrollYSpace(isReset) {
    const { scrollYStore, tableFullData, $$tableBody } = this;

    const $tableBody = $$tableBody.$el.querySelector('.v-table--body');
    const $tableYSpaceElem = $$tableBody.$el.querySelector('.v-body--y-space');

    if (!isReset) {
      // 计算高度
      let bodyHeight = tableFullData.length * scrollYStore.rowHeight;
      let topSpaceHeight = Math.max(scrollYStore.startIndex * scrollYStore.rowHeight, 0);

      $tableBody.style.transform = `translateY(${topSpaceHeight}px)`;
      $tableYSpaceElem.style.height = `${bodyHeight}px`;
    } else {
      $tableBody.style.transform = '';
      $tableYSpaceElem.style.height = '';
    }
  },
  // 更新 Y 方向数据
  updateScrollYData() {
    this.handleTableData();
    this.updateScrollYSpace();
  },
  // 计算可视渲染相关数据
  computeScrollLoad() {
    return new Promise((resolve, reject) => {
      if (!this.scrollYLoad) {
        // 不是虚拟滚动
        resolve();
      } else if (this.scrollYStore.visibleSize) {
        resolve();
        this.updateScrollYData();
      } else {
        this.$nextTick(() => {
          resolve();
          this.updateScrollYData();
        });
      }
    });
  },
  // 数据变化事件
  dataChangeHandle() {
    this.$emit('dataChange', [...this.tableFullData]);
  },
  // 分页事件
  pagerChangeHandle({ currentPage, pageSize }) {
    this.pagination.currentPage = currentPage;
    this.pagination.pageSize = pageSize;
    if (!this.webPagination) return;
    // 处理内存分页
    this.createLimitData();
    // 在内存分页模式下，分页改变时，加载数据
    this.loadTableData();
  },
  // 创建内存分页的列表数据
  createLimitData() {
    if (!this.webPagination) return;
    const { currentPage, pageSize } = this.pagination;
    this.pageTableData = this.tableFullData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  },
  // 设置高级检索的条件
  createSuperSearch(val = '') {
    this.superSearchQuery = val;
  },
  // 是否仅有分页参数产生变化
  onlyPaginationChange(next, prev) {
    const diff = Object.keys(difference(next, prev));
    return diff.length === 1 && (diff.includes('currentPage') || diff.includes('pageSize'));
  },
  // 返回到第一页
  toFirstPage() {
    this.pagination.currentPage = 1;
  },
  // 清空列选中
  clearRowSelection() {
    this.selectionKeys = [];
  },
  // 清空表头排序
  clearTableSorter() {
    this.$refs[`tableHeader`]?.clearTheadSorter();
  },
  // 清空表头筛选
  clearTableFilter() {
    this.$refs[`tableHeader`]?.clearTheadFilter();
  },
  // 清空高级检索的条件
  clearSuperSearch() {
    this.createSuperSearch('');
  },
  // 清空表格各种操作记录
  clearTableLog() {
    this.store.clearAllLog();
  },
  // 移除选择列数据
  removeSelectionKey(rowKey) {
    this.selectionKeys = this.selectionKeys.filter(x => x !== rowKey);
  },
  // 移除展开行数据
  removeExpandableKey(rowKey) {
    this.rowExpandedKeys = this.rowExpandedKeys.filter(x => x !== rowKey);
  },
  // 析构方法
  destroy() {
    this.removeEvents();
    this.resetColumns();
    this.store.destroye();
  }
};
