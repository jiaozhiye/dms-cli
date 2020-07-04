/*
 * @Author: 焦质晔
 * @Date: 2020-05-23 22:04:32
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-02 16:04:30
 */
import tableZhLocale from '../../VirtualTable/packages/locale/lang/zh';

export default {
  ...tableZhLocale,
  baseDialog: {
    fullScreen: '全屏',
    cancelFullScreen: '取消全屏'
  },
  baseTable: {
    search: '搜索',
    reset: '重置',
    inputPlaceholder: '搜索{title}',
    startValue: '开始值',
    endValue: '结束值',
    startDate: '开始日期',
    endDate: '结束日期',
    noData: '暂无数据...',
    columnFilterText: '列筛选排序',
    export: '导出',
    total: '共 {total} 条数据',
    selected: '已选择 {total} 项',
    clear: '清空',
    moreAction: '更多操作',
    selectPlaceholder: '请选择',
    datePlaceholder: '选择日期',
    datetimePlaceholder: '选择时间',
    summaryText: '合计'
  },
  downLoadFile: {
    error: '文件下载失败！'
  },
  drawer: {
    close: '关闭'
  },
  jsonToExcel: {
    noData: '数据为空，无法导出！'
  },
  searchHelper: {
    close: '关 闭',
    confirm: '确 定'
  },
  tinymce: {
    wordsLimit: '文字数量已达上限！',
    uploadImg: '上传图片'
  },
  confirm: {
    title: '提示信息',
    message: '此操作将永久删除该文件, 是否继续?',
    success: '操作成功！'
  },
  uploadCropper: {
    tooltip: '只能上传 {type} 格式的图片',
    preview: '图片预览',
    cropper: '图片裁剪',
    uploadError: '图片上传失败！',
    downError: '图片下载失败！'
  },
  uploadFile: {
    tooltip: '只能上传 {type} 格式',
    sizeLimit: '大小不能超过 {size}M',
    uploadError: '文件上传失败！',
    downError: '文件下载失败！',
    text: '点击上传'
  },
  webPrint: {
    noData: 'pdf 文件未载入，无法打印！',
    error: '文件格式有误，无法打印！',
    preview: '打印预览'
  },
  form: {
    inputPlaceholder: '请输入...',
    selectPlaceholder: '请选择...',
    startValue: '开始值',
    endValue: '结束值',
    treePlaceholder: '树节点过滤',
    datePlaceholder: '选择日期',
    datetimePlaceholder: '选择时间',
    monthPlaceholder: '选择月份',
    yearPlaceholder: '选择年份',
    daterangePlaceholder: ['开始日期', '结束日期'],
    datetimerangePlaceholder: ['开始时间', '结束时间'],
    monthrangePlaceholder: ['开始月份', '结束月份'],
    datePickers: ['今天', '昨天', '一周前', '一个月前'],
    dateRangePickers: ['最近一周', '最近一个月', '最近三个月', '最近六个月'],
    search: '搜 索',
    reset: '重 置',
    save: '保 存',
    spread: '展开',
    collect: '收起',
    breakSpace: '分割线',
    searchHelper: '搜索帮助'
  }
};
