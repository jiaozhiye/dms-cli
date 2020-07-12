/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-09 10:46:19
 */
export default {
  sex: [
    {
      cnText: '男',
      enText: 'man',
      value: '1'
    },
    {
      cnText: '女',
      enText: 'woman',
      value: '0'
    }
  ],
  // 电池回收单状态
  CLMBatteryRecyclingState: [
    { value: '00', cnText: '录入' },
    { value: '01', cnText: '回收' },
    { value: '90', cnText: '退役' }
  ],
  // 索赔单查询日期类型结算送修建单
  CLMBillQDataType: [
    { value: '01', cnText: '结算日期' },
    { value: '02', cnText: '送修日期' },
    { value: '03', cnText: '建单日期' }
  ],
  // 索赔日期类型
  CLMDateType1: [
    { value: '01', cnText: '送修日期' },
    { value: '02', cnText: '提交日期' },
    { value: '03', cnText: '审核日期' }
  ],
  // 索赔转储操作类型
  CLMDumpOprType: [
    { value: '01', cnText: '数据转储' },
    { value: '02', cnText: '数据反转储' }
  ],
  // 索赔单据类型
  CLMDumpType: [
    { value: '01', cnText: '索赔申请单' },
    { value: '02', cnText: '首保申请单' },
    { value: '03', cnText: '全部' }
  ],
  // 车辆故障信息报告上传状态
  CLMFaultReporUpLoadState: [
    { value: '0', cnText: '未上传' },
    { value: '1', cnText: '已上传' },
    { value: 'E', cnText: '错误' },
    { value: 'S', cnText: '成功' }
  ],
  // 日期类型
  CLMMtnBillDateType: [
    { value: '01', cnText: '保养日期' },
    { value: '02', cnText: '结算日期' }
  ],
  // 保养单状态
  CLMMtnBillStatus: [
    { value: '0', cnText: '录入' },
    { value: '1', cnText: '提交' },
    { value: '2', cnText: '审核' },
    { value: '9', cnText: '返回' }
  ],
  // 保养单单据类型
  CLMMtnBillType: [
    { value: '01', cnText: '首保单' },
    { value: '02', cnText: '其他免费保养' }
  ],
  // 返件方式
  CLMPostType: [
    { value: '01', cnText: '快返' },
    { value: '02', cnText: '常规' }
  ],
  // 日期类型
  CLMQueryDateType: [
    { value: '01', cnText: '送修日期' },
    { value: '02', cnText: '结算日期' },
    { value: '03', cnText: '出厂日期' },
    { value: '04', cnText: '确认日期' }
  ],
  // 保险单查询日期类型
  CLMQueryMtnBillDateType: [
    { value: '01', cnText: '保养日期' },
    { value: '02', cnText: '提交日期' },
    { value: '03', cnText: '审核日期' }
  ],
  // R/A标识
  CLMRA: [
    { value: '1', cnText: '1-无备件索赔' },
    { value: '2', cnText: '2-有备件索赔' }
  ],
  // 日期类型
  CLMSearchDateType: [
    { value: '01', cnText: '保养日期' },
    { value: '02', cnText: '结算日期' },
    { value: '03', cnText: '出厂日期' },
    { value: '04', cnText: '确认日期' }
  ],
  // 索赔单状态
  CLMStatus: [
    { value: '0', cnText: '录入' },
    { value: '1', cnText: '提交' },
    { value: '2', cnText: '审核' },
    { value: '9', cnText: '返回' }
  ],
  // 维护三包属性查询类型
  CLMThreePoliciesCondType: [
    { value: '01', cnText: '送修日期' },
    { value: '02', cnText: '结算日期' }
  ],
  // 索赔单上传状态
  CLMUpLoadStatus: [
    { value: 'E', cnText: '错误' },
    { value: 'S', cnText: '成功' }
  ],
  // 活动类别
  CRMActivitySort: [
    { value: '01', cnText: '经销商自建' },
    { value: '02', cnText: '厂家下发直接执行' },
    { value: '03', cnText: '厂家下发带客户邀约' }
  ],
  // 市场活动-状态
  CRMActivityStatus: [
    { value: '00', cnText: '初始' },
    { value: '10', cnText: '提交' }
  ],
  // 活动类型
  CRMActivityType: [
    { value: '01', cnText: '销售类' },
    { value: '02', cnText: '服务类' },
    { value: '03', cnText: '关怀类' }
  ],
  // 调整级别标识
  CRMAdjustLevel: [
    { value: '01', cnText: '升级' },
    { value: '02', cnText: '降级' }
  ],
  // 费率类型（就）
  CRMCRMRateTypeO: [
    { value: 'C', cnText: 'C' },
    { value: 'D', cnText: 'D' }
  ],
  // 交易类别
  CRMDealCategory: [
    { value: '1', cnText: '新车' },
    { value: '2', cnText: '二手车' }
  ],
  // 延修类型
  CRMDeferralType: [
    { value: '1', cnText: '金质' },
    { value: '2', cnText: '银质' }
  ],
  // 超额融资
  CRMExcessFinancing: [
    { value: '0', cnText: '否' },
    { value: '1', cnText: '是' }
  ],
  // 融资年限
  CRMFinancingLimit: [
    { value: '1', cnText: '1' },
    { value: '2', cnText: '2' },
    { value: '3', cnText: '3' },
    { value: '4', cnText: '4' },
    { value: '5', cnText: '5' }
  ],
  // 车主完善状态
  CRMImproveState: [
    { value: '00', cnText: '未处理' },
    { value: '10', cnText: '已处理' }
  ],
  // 车主完善查询方式
  CRMImproveType: [
    { value: '0', cnText: '按下发日期' },
    { value: '1', cnText: '按底盘号' }
  ],
  // 市场活动-费用项目
  CRMItem: [
    { value: '00', cnText: '展览广告费' },
    { value: '01', cnText: '业务宣传费' }
  ],
  // 租金支付方式
  CRMLeasePaymentWay: [
    { value: '1', cnText: '月' },
    { value: '2', cnText: '季' },
    { value: '3', cnText: '半年' },
    { value: '4', cnText: '年' },
    { value: '5', cnText: '其他' }
  ],
  // 租赁期限
  CRMLeaseTerm: [
    { value: '1', cnText: '9' },
    { value: '2', cnText: '12' },
    { value: '3', cnText: '18' },
    { value: '4', cnText: '24' },
    { value: '5', cnText: '36' },
    { value: '6', cnText: '48' },
    { value: '7', cnText: '60' }
  ],
  // 承租人类别
  CRMLesseeCategory: [
    { value: '1', cnText: '个人' },
    { value: '2', cnText: '机构' }
  ],
  // 合作伙伴
  CRMPartner: [
    { value: '1', cnText: '天安保险' },
    { value: '2', cnText: '其他' }
  ],
  // 费率类型（新）
  CRMRateTypeN: [
    { value: 'A', cnText: 'A' },
    { value: 'B', cnText: 'B' }
  ],
  // 租金支付时间
  CRMRentPaymentTime: [
    { value: '01', cnText: '期初支付' },
    { value: '02', cnText: '期末支付' }
  ],
  // 保修期月
  CRMRepairLimit: [
    { value: '1', cnText: '12' },
    { value: '2', cnText: '24' },
    { value: '3', cnText: '36' },
    { value: '4', cnText: '48' },
    { value: '5', cnText: '60' }
  ],
  // 保证金返还方式
  CRMReturnBondMode: [
    { value: '1', cnText: '证金折入租金' },
    { value: '2', cnText: '期末返还承租人' }
  ],
  // 残值归属人
  CRMSalvageValueAttribution: [
    { value: '1', cnText: '承租人' },
    { value: '2', cnText: '承租人指定第三方' },
    { value: '3', cnText: '租赁公司' },
    { value: '4', cnText: '经销商' }
  ],
  // 结算方式
  CRMSettlement: [
    { value: '1', cnText: '现金' },
    { value: '2', cnText: '刷卡' },
    { value: '3', cnText: '在线支付' }
  ],
  // 上传类型
  CRMUPType: [
    { value: '01', cnText: '已上传' },
    { value: '02', cnText: '未上传' }
  ],
  // 礼品入出库状态
  GFTAdditionalStatus: [
    { value: '00', cnText: '未出库' },
    { value: '10', cnText: '已出库' }
  ],
  // 往来类型
  MDABusinessContactType: [
    { value: '0', cnText: '外部往来' },
    { value: '1', cnText: '内部往来' }
  ],
  // 供应商客户分类
  MDAMergeVendorCustomeType: [
    { value: '0', cnText: '供应商' },
    { value: '1', cnText: '客户' }
  ],
  // 供应商类型
  MDAVSupplyType: [
    { value: '0', cnText: '一级' },
    { value: '1', cnText: '临时' }
  ],
  // 审核状态
  PUCStatusCheck: [
    { value: '20', cnText: '同意' },
    { value: '30', cnText: '拒绝' }
  ],
  // 运输方式
  PUCTransportway: [
    { value: '01', cnText: '特快专递' },
    { value: '02', cnText: '航空运输' },
    { value: '03', cnText: '铁路集装箱' },
    { value: '04', cnText: '自提' },
    { value: '05', cnText: '铁路快件' },
    { value: '06', cnText: '零售' },
    { value: '07', cnText: '补货' },
    { value: '08', cnText: '公路发货' },
    { value: '09', cnText: '送货上门' }
    // { value: 'W1: cnText: '文化公司本部' },//精品业务，捷达不涉及精品业务
  ],
  // 维修属性
  QIMRepairProp: [
    { value: 'BJ', cnText: '钣金' },
    { value: 'JX', cnText: '机修' },
    { value: 'PQ', cnText: '喷漆' },
    { value: 'QT', cnText: '其他' }
  ],
  // 维修状态
  QIMRepairStatus: [
    { value: '00', cnText: '在修' },
    { value: '01', cnText: '审核' },
    { value: '02', cnText: '结清' },
    { value: '03', cnText: '欠账' }
  ],
  // 变速形式
  QIMUSCCBSXS: [
    { value: '01', cnText: '自动' },
    { value: '02', cnText: '手动' },
    { value: '03', cnText: '手自一体' }
  ],
  // 车辆类型
  QIMUSCCCLLX: [
    { value: '01', cnText: '小型轿车' },
    { value: '02', cnText: '中型轿车' },
    { value: '03', cnText: '大型轿车' },
    { value: '04', cnText: '微型车' }
  ],
  // 产地
  QIMUSCCESCCD: [
    { value: '01', cnText: '国产' },
    { value: '02', cnText: '进口' }
  ],
  // 车辆状况
  QIMUSCCESCCLZK: [
    { value: '01', cnText: '极好' },
    { value: '02', cnText: '好' },
    { value: '03', cnText: '一般' },
    { value: '04', cnText: '差' },
    { value: '05', cnText: '极差' }
  ],
  // 二手车库存状态
  QIMUSCCESCKCZT: [
    { value: '01', cnText: '正常' },
    { value: '02', cnText: '销售出库' },
    { value: '03', cnText: '整备' },
    { value: '04', cnText: '报废出库' },
    { value: '05', cnText: '盘亏出库' },
    { value: '06', cnText: '收购退库' },
    { value: '99', cnText: '锁定' }
  ],
  // 内饰颜色
  QIMUSCCESCNSYS: [
    { value: '01', cnText: '深' },
    { value: '02', cnText: '浅' }
  ],
  // 驱动方式
  QIMUSCCESCQDFS: [
    { value: '01', cnText: '前驱' },
    { value: '02', cnText: '后驱' },
    { value: '03', cnText: '四驱' }
  ],
  // 燃料种类
  QIMUSCCESCRLZL: [
    { value: '01', cnText: '汽油' },
    { value: '02', cnText: '柴油' },
    { value: '03', cnText: '新能源' },
    { value: '04', cnText: '天然气' },
    { value: '05', cnText: '其他' }
  ],
  // 收购渠道
  QIMUSCCESCSGQD: [
    { value: '01', cnText: '收购' },
    { value: '02', cnText: '置换' },
    { value: '03', cnText: '厂家拍卖车辆' },
    { value: '04', cnText: '寄售' },
    { value: '10', cnText: '租赁回购' },
    { value: '11', cnText: '其他' },
    { value: '13', cnText: '经销商自有车辆' }
  ],
  // 销售途径
  QIMUSCCESCXSTJ: [
    { value: '01', cnText: '零售' },
    { value: '02', cnText: '批售' },
    { value: '03', cnText: '其他' }
  ],
  // 使用性质
  QIMUSCCSYXZ: [
    { value: '03', cnText: '营运' },
    { value: '05', cnText: '营转非' },
    { value: '06', cnText: '非营运' },
    { value: '07', cnText: '其他' }
  ],
  // 库存锁定类型
  QIMUSCSDLX: [
    { value: '01', cnText: '销售开单' },
    { value: '02', cnText: '报废申请' },
    { value: '03', cnText: '盘点' },
    { value: '04', cnText: '手工锁定' },
    { value: '05', cnText: '订单锁定' }
  ],
  // 奥迪报表类型
  RBMAUReportType: [
    { value: '01', cnText: '1资产负债表' },
    { value: '02', cnText: '2二手车金融保险-收入成本明细' },
    { value: '03', cnText: '3利润表' },
    { value: '04', cnText: '4数据收集模板—人工成本' },
    { value: '05', cnText: '5数据收集模板—折旧摊销费用' },
    { value: '06', cnText: '6数据收集模板—分摊动因' },
    { value: '07', cnText: '7人工成本分摊明细' },
    { value: '08', cnText: '8折旧摊销费用分摊明细' },
    { value: '09', cnText: '9现金流量' },
    { value: '10', cnText: '10相关业务信息表' }
  ],
  // 汇总规则
  RBMGatherRule: [
    { value: '1', cnText: '直接相加' },
    { value: '2', cnText: '第一个月数据' },
    { value: '3', cnText: '最后一个月数据' }
  ],
  // 上传状态
  RBMUploadStatus: [
    { value: '0', cnText: '初始' },
    { value: '1', cnText: '已传' }
  ],
  // 大众报表类型
  RBMVWReportType: [
    { value: '01', cnText: '1资产负债表' },
    { value: '02', cnText: '2利润表' },
    { value: '03', cnText: '3业务信息表' },
    { value: '04', cnText: '4分摊信息-人工成本' },
    { value: '05', cnText: '5分摊信息-折旧费用' },
    { value: '06', cnText: '6分摊信息-分摊动因' },
    { value: '07', cnText: '7人工成本分摊结果' },
    { value: '08', cnText: '8折旧费用分摊结果' },
    { value: '09', cnText: '9补充财务数据表-各业务单元销售成本' }
  ],
  // 结算状态
  SALBalanceStatus: [
    { value: '00', cnText: '未结' },
    { value: '01', cnText: '结清' },
    { value: '02', cnText: '欠账' }
  ],
  // 单据类型
  SALBillStatus: [
    { value: '00', cnText: '录入' },
    { value: '10', cnText: '提交' },
    { value: '20', cnText: '审核' },
    { value: '30', cnText: '驳回' },
    { value: '40', cnText: '部分完成' },
    { value: '50', cnText: '完成' }
  ],
  // 整车销售情况查询-业务类型
  SALBusType: [
    { value: '0', cnText: '全部' },
    { value: '1', cnText: '销售' },
    { value: '2', cnText: '退货' }
  ],
  // 仓库属性
  SALBWHType: [
    { value: '4', cnText: '整车' },
    { value: '5', cnText: '二手车' }
  ],
  // 周期类型
  SALCycleName: [
    { value: 'D', cnText: '天' },
    { value: 'M', cnText: '月' },
    { value: 'W', cnText: '周' }
  ],
  // 采购到货状态
  SALDealerVehicleStatus: [
    { value: '20', cnText: 'STD销售 ' },
    { value: '21', cnText: 'STD撤消' },
    { value: '25', cnText: '被换车' },
    { value: '26', cnText: '换车' },
    { value: '30', cnText: '运输配板' },
    { value: '31', cnText: '配板撤消' },
    { value: '40', cnText: '发运出库' },
    { value: '50', cnText: '经销商接收' },
    { value: '60', cnText: 'AAK销售' },
    { value: 'LK', cnText: '锁定' },
    { value: 'QA', cnText: '质损' },
    { value: 'UL', cnText: '锁定解除' },
    { value: 'UQ', cnText: '质损解除' }
  ],
  // 盘点状态
  SALInventoryFinishstate: [
    { value: '01', cnText: '录入' },
    { value: '02', cnText: '盘点形成' },
    { value: '03', cnText: '实盘登录' },
    { value: '04', cnText: '盘点批复' },
    { value: '05', cnText: '已批复' }
  ],
  // 盘点状态
  SALInventoryType: [
    { value: '01', cnText: '正常' },
    { value: '02', cnText: '盘盈' },
    { value: '03', cnText: '盘亏' }
  ],
  // 大客户交车状态
  SALLargeCustomersState: [
    { value: '1', cnText: '未入库' },
    { value: '2', cnText: '已入库未交付' },
    { value: '3', cnText: '已交付' }
  ],
  // 交车状态
  SALLeaveState: [
    { value: '1', cnText: '未交付' },
    { value: '2', cnText: '已交付' },
    { value: '3', cnText: '作废/取消' }
  ],
  // 锁定状态
  SALLockState: [
    { value: '01', cnText: '可用' },
    { value: '02', cnText: '锁定' }
  ],
  // 新车销售类型
  SALNewSALType: [
    { value: '01', cnText: '终端销售车辆' },
    { value: '02', cnText: '经销商自用车辆' },
    { value: '03', cnText: '试乘试驾车' }
  ],
  // 订单状态
  SALORDERSALSTATUS: [
    { value: '0', cnText: '订单' },
    { value: '1', cnText: '执行' },
    { value: '2', cnText: '终止' },
    { value: '3', cnText: '退库' },
    { value: '90', cnText: '删除' }
  ],
  // 销售出退库类型
  SALOutType: [
    { value: '0', cnText: '销售出库' },
    { value: '1', cnText: '销售退库' }
  ],
  // 预销售状态
  SALPreSaleState: [
    { value: '0', cnText: '预入库' },
    { value: '1', cnText: '已入库' },
    { value: '2', cnText: '作废' },
    { value: '3', cnText: '已出库' }
  ],
  // 采购入库类型
  SALPurchaseType: [
    { value: 'ICG', cnText: '采购入库' },
    { value: 'ITK', cnText: '采购退库' },
    { value: 'ITZ', cnText: '采购调差' }
  ],
  // 整车价格检查-当期/历史
  SALQueryPriceCheckP1: [
    { value: '0', cnText: '当前' },
    { value: '1', cnText: '历史' }
  ],
  // 整车价格检查-P2
  SALQueryPriceCheckP2: [
    { value: '0', cnText: '全部' },
    { value: '1', cnText: '超限价' },
    { value: '2', cnText: '低限价' }
  ],
  // 整车结算情况查询-日期控件数据源
  SALQuerySettlementDate: [
    { value: '0', cnText: '开单日期' },
    { value: '1', cnText: '首次结算日期' }
  ],
  // 整车前台查询-类型
  SALQueryStockAccountType: [
    { value: '0', cnText: 'O' },
    { value: '1', cnText: 'I' }
  ],
  // 超高储超低储查询
  SALQueryStockMaxMin: [
    { value: '0', cnText: '全部' },
    { value: '1', cnText: '超高储报警' },
    { value: '2', cnText: '超低储备报警' }
  ],
  // 销售单上传状态
  SALSaleMainState: [
    { value: '00', cnText: '未上传' },
    { value: '01', cnText: '已上传' },
    { value: '02', cnText: '上传失败' }
  ],
  // 结算类型
  SALSettlementType: [
    { value: '01', cnText: '销售结算' },
    { value: '02', cnText: '退库结算' }
  ],
  // 库存状态
  SALStockState: [
    { value: '00', cnText: '正常' },
    { value: '01', cnText: '展车' },
    { value: '02', cnText: '维修' },
    { value: '06', cnText: '实车已出库' },
    { value: '07', cnText: '替换车' },
    { value: '08', cnText: '救援车' },
    { value: '09', cnText: '试乘试驾车' }
  ],
  // 调拨类型
  SALTransferType: [
    { value: '1', cnText: '内部调拨' },
    { value: '2', cnText: '网点间调拨' }
  ],
  // 运输方式
  SALTransport: [
    { value: '01', cnText: '自提' },
    { value: '02', cnText: '铁路' },
    { value: '03', cnText: '公路' },
    { value: '04', cnText: '航空' }
  ],
  // 测试
  saltypetest: [{ value: '', cnText: '' }],
  // 价格显示导入
  SPA8007Excel: [{ value: 'SPAGetMasterDataPriceShowPRCM', cnText: '备件代码' }],
  // 全车线束查询线束类型
  SPA8028TYPE: [
    { value: 'F', cnText: 'F 发动机线束' },
    { value: 'N', cnText: 'N 内饰线束' },
    { value: 'Y', cnText: 'Y 仪表线束' }
  ],
  // 激活状态
  SPAActive: [
    { value: '0', cnText: '待激活' },
    { value: '1', cnText: '已激活' }
  ],
  // 调整入出库价格类型
  SPAAdjustPriceType: [
    { value: 'A', cnText: '平均' },
    { value: 'H', cnText: '高' },
    { value: 'L', cnText: '低' }
  ],
  // 调整入出库价格类型
  SPAAdjustPriceTypeB: [
    { value: 'A', cnText: '平均' },
    { value: 'H', cnText: '高' },
    { value: 'L', cnText: '低' },
    { value: 'O', cnText: '不变' }
  ],
  // 申请类型
  SPAApplyType: [
    { value: 'BF', cnText: '补发' },
    { value: 'FH', cnText: '实物返还' },
    { value: 'PF', cnText: '赔付' },
    { value: 'TH', cnText: '退换' },
    { value: 'TK', cnText: '退库' }
  ],
  // 兑奖出库单状态
  SPAAwardBillStatus: [
    { value: '00', cnText: '初始' },
    { value: '10', cnText: '出库' }
  ],
  // 经销商对账查询业务种类
  SPABalanceBillR3Type: [
    { value: 'BJ', cnText: '原账户' },
    { value: 'GF', cnText: '工服' },
    { value: 'GJ', cnText: '工具' },
    { value: 'JP', cnText: '精品' }
  ],
  // 对账单处理结果
  SPABalanceResult: [
    { value: '0', cnText: '记录相符' },
    { value: '1', cnText: '记录不符' }
  ],
  // 备件单据状态
  SPABillStatus: [
    { value: '00', cnText: '录入' },
    { value: '10', cnText: '提交' },
    { value: '20', cnText: '批准' },
    { value: '25', cnText: '厂家批准' },
    { value: '30', cnText: '拒绝' },
    // { value: '35: cnText: '总公司拒绝' },//迷你店业务，捷达没有迷你店
    { value: '40', cnText: '已出库' },
    { value: '41', cnText: '发货' },
    { value: '42', cnText: '部分发货' },
    { value: '50', cnText: '部分退库' },
    { value: '80', cnText: '全部退库' },
    { value: '90', cnText: '删除' }
  ],
  // 备件单据类型
  SPABillType: [
    { value: 'DEC10', cnText: '装饰单信息' },
    { value: 'SPA15', cnText: '委托书信息' },
    { value: 'SPA30', cnText: '销售单信息' }
  ],
  // 备件单据类型(激活)
  SPABillTypeForActive: [
    { value: 'SPA13', cnText: '兑奖单' },
    { value: 'SPA15', cnText: '委托书' },
    { value: 'SPA30', cnText: '备件销售单' }
  ],
  // 业务类型
  SPABizType: [
    { value: 'OXS', cnText: '销售' },
    { value: 'TXS', cnText: '退库' }
  ],
  // CCC件类型
  SPACCCType: [
    { value: 'CCC', cnText: 'CCC' },
    { value: 'MCC', cnText: 'CCC免办' }
  ],
  // 备件索赔申请导入excel
  SPAClaimApplyExcel: [{ value: 'SPAUploadClaimApply', cnText: '备件索赔申请' }],
  // 备件索赔类型
  SPAClaimType: [
    { value: 'C', cnText: '错' },
    { value: 'K', cnText: '亏' },
    { value: 'Q', cnText: '缺' },
    { value: 'S', cnText: '损' },
    { value: 'Y', cnText: '赢' }
  ],
  // 备件分类
  SPAClass: [
    { value: '00', cnText: '未分类' },
    { value: 'A', cnText: '工具' },
    { value: 'B', cnText: '发动机系统' },
    { value: 'B1', cnText: '发动机' },
    { value: 'B2', cnText: '机滤' },
    { value: 'B3', cnText: '空滤' },
    { value: 'B4', cnText: '汽滤' },
    { value: 'C', cnText: '燃油系统' },
    { value: 'D', cnText: '动力底盘' },
    { value: 'D1', cnText: '变速箱.离合器.差速器' },
    { value: 'D2', cnText: '底盘.转向.轴.制动' },
    { value: 'E', cnText: '车身系统' },
    { value: 'E1', cnText: '车身钣金' },
    { value: 'E2', cnText: '车身附件' },
    { value: 'F', cnText: '电气系统' },
    { value: 'F1', cnText: '灯具.电气.仪表.线束.开关.传感器' },
    { value: 'F2', cnText: '空调系统' },
    { value: 'G', cnText: '装具精品' },
    { value: 'H', cnText: '辅料' },
    { value: 'H1', cnText: '机油' },
    { value: 'H2', cnText: '油漆' },
    { value: 'H3', cnText: '辅助油、液' },
    { value: 'H4', cnText: '养护品' },
    { value: 'H5', cnText: '机油（大桶）' },
    { value: 'I', cnText: '资料' },
    { value: 'I1', cnText: '手册、说明书、资料' },
    { value: 'J', cnText: '双燃料附件' },
    { value: 'K', cnText: '其他' },
    { value: '未', cnText: '未分类' }
  ],
  // 公司代码
  SPACompanyCode: [
    { value: '0001', cnText: '一汽大众' },
    { value: '0009', cnText: '文化公司' }
  ],
  // 抱怨处理结果
  SPAComplainStatus: [
    { value: '0', cnText: '未完成' },
    { value: '1', cnText: '已完成' }
  ],
  // 发货单状态(接口使用)
  SPADeliveryBillStatus: [
    { value: 'C', cnText: '确认' },
    { value: 'D', cnText: '删除' },
    { value: 'N', cnText: '新建' },
    { value: 'P', cnText: '审核' },
    { value: 'Q', cnText: '作废' }
  ],
  // 平台需求信息单状态
  SPADemandPublishBillStatus: [
    { value: '00', cnText: '初始' },
    { value: '10', cnText: '发布' },
    { value: '80', cnText: '作废' },
    { value: '90', cnText: '删除' }
  ],
  // 订金状态
  SPADeposit: [
    { value: '0', cnText: '未交' },
    { value: '1', cnText: '已交' }
  ],
  // 备件内部领料单状态
  SPADrawBillStatus: [
    { value: '00', cnText: '录入' },
    { value: '20', cnText: '批准' },
    { value: '40', cnText: '出库' },
    { value: '50', cnText: '部分退库' },
    { value: '80', cnText: '完成' },
    { value: '90', cnText: '删除' }
  ],
  // 领料方式
  SPADRAWOUTMODE: [
    { value: '00', cnText: '一般领料' },
    { value: '01', cnText: '一进一出' },
    { value: '02', cnText: '领旧料' }
  ],
  // 领料方式
  SPADrawOutModeForDEC: [
    { value: '00', cnText: '一般领料' },
    { value: '01', cnText: '一进一出' },
    { value: '02', cnText: '领旧料' }
  ],
  // 没有一进一出的入出方式
  SPADRAWOUTMODENOIO: [
    { value: '00', cnText: '一般领料' },
    { value: '02', cnText: '领旧料' }
  ],
  // 紧急状态
  SPAEmery: [
    { value: '00', cnText: '正常' },
    { value: '10', cnText: '紧急' }
  ],
  // 导入全车线束
  SPAExcelLoom: [{ value: 'SPAQuery8028CM', cnText: '全车线束' }],
  // 手续费比率
  SPAFeeRate: [
    { value: '0', cnText: '手工' },
    { value: '0.5', cnText: '0.5%' },
    { value: '1.0', cnText: '1.0%' }
  ],
  // 零库存
  SPAIsZeroStock: [
    { value: '0', cnText: '非零库存' },
    { value: '1', cnText: '零库存' }
  ],
  // 备件借还处理单据状态
  SPALENDBORROWSTATUS: [
    { value: '00', cnText: '录入' },
    { value: '10', cnText: '执行' },
    { value: '20', cnText: '归还' },
    { value: '30', cnText: '完成' },
    { value: '90', cnText: '删除' }
  ],
  // 库位状态
  SPALocationStatus: [
    { value: '0', cnText: '空闲' },
    { value: '1', cnText: '占用' }
  ],
  // 线束类型
  SPALoomType: [
    { value: 'F', cnText: '发动机线束' },
    { value: 'N', cnText: '内饰线束' },
    { value: 'Y', cnText: '仪表线束' }
  ],
  // 备件物料标签
  SPAMODULE: [
    { value: 'DEC', cnText: '精品' },
    { value: 'SPA', cnText: '备件' }
  ],
  // 新能源级别
  SPANEVLevel: [
    { value: 'B', cnText: '动力电池内部' },
    { value: 'H', cnText: '高压相关非电池内部' }
  ],
  // 出库方式
  SPAOutMode: [
    { value: 'ALL', cnText: '全部' },
    { value: 'DEC', cnText: '装饰出库' },
    { value: 'DRW', cnText: '内部领用' },
    { value: 'SAL', cnText: '销售出库' },
    { value: 'SVC', cnText: '维修领料' }
  ],
  // 出库方式（对应领料方式）
  SPAOutType: [
    { value: '00', cnText: '正常' },
    { value: '01', cnText: '进出' },
    { value: '02', cnText: '旧料' }
  ],
  // 价格检查
  SPAPriceCheck: [
    { value: '0', cnText: '全部' },
    { value: '1', cnText: '超限价' },
    { value: '2', cnText: '低于成本价' }
  ],
  // 库存共享发布价格类型
  SPAPriceType: [
    { value: '00', cnText: '含税采购单价' },
    { value: '10', cnText: '含税销售单价' },
    { value: '20', cnText: '不含税成本单价' }
  ],
  // 平台发布信息单状态
  SPAPublishBillStatus: [
    { value: '00', cnText: '初始' },
    { value: '10', cnText: '发布' },
    { value: '20', cnText: '完成' },
    { value: '80', cnText: '关闭' }
  ],
  // 库存共享发布日期类型
  SPAPubShareStkDateType: [
    { value: '00', cnText: '距最后出库日期' },
    { value: '10', cnText: '距最后入库日期' }
  ],
  // 库存共享发布操作类型
  SPAPubShareStkOprType: [
    { value: '00', cnText: '大于' },
    { value: '10', cnText: '等于' },
    { value: '20', cnText: '小于' }
  ],
  // 库存共享发布数量类型
  SPAPubShareStkQtyType: [
    { value: '00', cnText: '可用数量' },
    { value: '10', cnText: '发布数量' },
    { value: '20', cnText: '剩余数量' }
  ],
  // 库存共享发布查询类型
  SPAPubShareStkQueryType: [
    { value: '00', cnText: '积压件查询' },
    { value: '10', cnText: '查询全部备件库存' }
  ],
  // 备件单据状态
  SPAPurBillStatus: [
    { value: '00', cnText: '录入' },
    { value: '90', cnText: '返回' }
  ],
  // 采购订单分类-精品
  SPAPurDECClass: [
    { value: '1', cnText: '精品' },
    { value: '2', cnText: '工作服' }
  ],
  // 采购发票认证状态
  SPAPurInvoiceStatus: [
    { value: '00', cnText: '录入' },
    { value: '10', cnText: '提交' }
  ],
  // 备件删除状态
  SPAPurOrderDelStatus: [
    { value: '0', cnText: '未删除' },
    { value: '1', cnText: '正在删除' },
    { value: '2', cnText: '正在处理' },
    { value: '3', cnText: '超时' },
    { value: '4', cnText: '失败' },
    { value: '5', cnText: '成功' }
  ],
  // 备件采购订单EXCEL
  SPAPurOrderDetailExcel: [{ value: 'SPAPurOrderDetailVO', cnText: '订单明细' }],
  // 备件采购订单性质
  SPAPurOrderProperties: [
    { value: '00', cnText: '正常' },
    { value: '10', cnText: '紧急' }
  ],
  // 备件采购订单状态
  SPAPurOrderStatus: [
    { value: '00', cnText: '订单' },
    { value: '10', cnText: '提交' },
    { value: '20', cnText: '执行' },
    { value: '30', cnText: '完成' },
    { value: '40', cnText: '上传' },
    { value: '50', cnText: '接收' },
    // { value: '60: cnText: '总公司拒绝' },//迷你店业务，捷达没有迷你店业务
    { value: '80', cnText: '失效' }
  ],
  // 备件采购订单类型
  SPAPurOrderType: [
    { value: 'QT', cnText: '正常订单' },
    { value: 'ZQSA', cnText: '备件订货申请-服务行动' },
    { value: 'ZWQT', cnText: '备件三包订货申请' },
    { value: 'ZQF', cnText: 'FIB正常订单' },
    { value: 'ZFWQ', cnText: 'FIB三包订单' },
    { value: 'ZSQT', cnText: '首批建储' },
    { value: 'ZTCT', cnText: '促销套餐订单' },
    // { value: 'ZRQT: cnText: '推式订单' },//有两年入出记录的经销商才能开通推式订单
    { value: 'Z3QT', cnText: '三方订单' },
    { value: 'ZZQT', cnText: '定向订单' }
    // { value: 'ZWHQ: cnText: '文化公司' },//精品业务，捷达不涉及精品业务
  ],
  // 备件采购计划状态
  SPAPurPlanStatus: [
    { value: '00', cnText: '录入' },
    { value: '10', cnText: '引用' }
  ],
  // 欠料单状态
  SPAPurReqStatus: [
    { value: '0', cnText: '欠料' },
    { value: '1', cnText: '到货' },
    { value: '2', cnText: '完成' },
    { value: '3', cnText: '关闭' },
    { value: '4', cnText: '全部' }
  ],
  // 欠料单性质
  SPAPurRequiePro: [
    { value: '0', cnText: '索赔' },
    { value: '1', cnText: '事故' },
    { value: '2', cnText: '小修' }
  ],
  // 欠料备件处理状态
  SPAPurRequieStatus: [
    { value: '0', cnText: '欠料' },
    { value: '1', cnText: '到货' },
    { value: '2', cnText: '完成' },
    { value: '3', cnText: '关闭' }
  ],
  // 欠料单查询结果日期类型
  SPAPurRequireDateQuery: [
    { value: '0', cnText: '建单日期' },
    { value: '1', cnText: '到货日期' }
  ],
  // 欠料单查询结果性质
  SPAPurRequireQT: [
    { value: '0', cnText: '备件代码' },
    { value: '1', cnText: '牌照号' },
    { value: '2', cnText: '底盘号' }
  ],
  // 欠料单上传状态
  SPAPurRequireUploadState: [
    { value: '0', cnText: '未上传' },
    { value: '1', cnText: '已上传' },
    { value: 'E', cnText: '失败' },
    { value: 'S', cnText: '成功' }
  ],
  // 备件采购类型
  SPAPurType: [
    { value: '01', cnText: '一汽 - 大众' },
    { value: '02', cnText: '经销商' },
    { value: '20', cnText: '外采' }
  ],
  // R3下发价格修改状态
  SPAR3PriceModifyStatus: [
    { value: 'EM', cnText: '厂家建议零售价调整' },
    { value: 'EN', cnText: '厂家建议零售价新作价' },
    { value: 'ME', cnText: '采购价调整' },
    { value: 'MM', cnText: '价格调整' },
    { value: 'NE', cnText: '采购价新作价' },
    { value: 'NN', cnText: '新作价' }
  ],
  // 备件销售明细导入
  SPASalContractDetailExcel: [{ value: 'SPASalContractDetailVO', cnText: '销售明细' }],
  // 备件销售类型
  SPASaleMode: [
    { value: '00', cnText: '店头销售' },
    { value: '10', cnText: '批量销售' },
    { value: '20', cnText: '平台销售' }
  ],
  // 备件销售订单状态
  SPASalOrderStatus: [
    { value: '00', cnText: '订单' },
    { value: '20', cnText: '完成' }
  ],
  // 备件销售价格方式
  SPASalPriceType: [
    { value: '00', cnText: '按销售价' },
    { value: '10', cnText: '按采购价' },
    { value: '20', cnText: '按批发价' },
    { value: '30', cnText: '按成本价' }
  ],
  // 备件销售方式
  SPASalType: [
    { value: '00', cnText: '正常销售' },
    { value: '01', cnText: '一进一出' }
  ],
  SPASettlementDateType: [
    { value: '01', cnText: '开单日期' },
    { value: '02', cnText: '结算日期' },
    { value: '03', cnText: '入出库日期' },
    { value: '04', cnText: '首次结算日期' }
  ],
  // 销售结算统计日期类型
  SPASettlementStatus: [
    { value: '0', cnText: '未结' },
    { value: '1', cnText: '结清' },
    { value: '2', cnText: '欠账' }
  ],
  // 备件类型
  SPASPAType: [
    { value: '01', cnText: '原厂件' },
    { value: '02', cnText: '外采件' },
    { value: '03', cnText: '正厂件' }
  ],
  // 是否零库存
  SPAStockQtyFlag: [
    { value: '0', cnText: '零库存' },
    { value: '1', cnText: '非零库存' }
  ],
  // 存储方式
  SPASTORAGEMODE: [
    { value: '0', cnText: '按件' },
    { value: '1', cnText: '按批号' }
  ],
  // 账龄统计方式
  SPAStorageTimeMode: [
    { value: '01', cnText: '最后入库日期' },
    { value: '02', cnText: '先进先出原则' }
  ],
  // 领料明细形成参考类型
  SPASvcDrawDetailCorType: [
    { value: 'OweLock', cnText: '按欠料锁定形成' },
    { value: 'Reqest', cnText: '按预估件形成' }
  ],
  // TSL目标水平
  SPATargetTSL: [
    { value: 'H', cnText: '高' },
    { value: 'L', cnText: '低' },
    { value: 'M', cnText: '中' }
  ],
  // 上传状态
  SPAUpload: [
    { value: '0', cnText: '未上传' },
    { value: '1', cnText: '已上传' }
  ],
  // 上报中转库
  SPAUploadZZK: [
    { value: '0', cnText: '否' },
    { value: '1', cnText: '是' }
  ],
  // 备件有效性
  SPAValidity: [
    { value: 'ND', cnText: '有效' },
    { value: 'ZP', cnText: '失效' }
  ],
  // 计价方式
  SPAVALUATIONMODE: [
    { value: '1', cnText: '加权平均' },
    { value: '2', cnText: '个别计价' }
  ],
  // 抱怨级别
  SPAVComplainClass: [
    { value: '1', cnText: '一级抱怨' },
    { value: '2', cnText: '二级抱怨' },
    { value: '3', cnText: '三级抱怨' },
    { value: '4', cnText: '四级抱怨' }
  ],
  // 备件情况查询-维修领料--查询时间方式
  SPAVCXSJ: [
    { value: 'CKRQ', cnText: '出库日期' },
    { value: 'JSRQ', cnText: '结算日期' }
  ],
  // 借还类型
  SPAVType: [
    { value: 'IJR', cnText: '借入入库' },
    { value: 'TJR', cnText: '还出出库' },
    { value: 'OJC', cnText: '借出出库' },
    { value: 'TJC', cnText: '还入入库' }
  ],
  // 报警方式
  SPAWarningMode: [
    { value: '00', cnText: '超高储备报警' },
    { value: '01', cnText: '超低储备报警' },
    { value: '10', cnText: '呆滞备件报警' }
  ],
  // 仓库属性
  SPAWHType: [
    { value: 'DEC', cnText: '精品' },
    { value: 'GFT', cnText: '礼品' },
    { value: 'SPA', cnText: '备件' },
    { value: 'SPT', cnText: '工具' }
  ],
  // 工具批复状态
  SPTApproval: [
    { value: '0', cnText: '未批复' },
    { value: '1', cnText: '已批复' }
  ],
  // 工具报废出库状态
  SPTBFStatusType: [
    { value: '00', cnText: '初始' },
    { value: '10', cnText: '提交' },
    { value: '20', cnText: '审核' },
    { value: '30', cnText: '拒绝' },
    { value: '80', cnText: '完成' }
  ],
  // 专用工具借出单状态
  SPTBorrowDocStatusType: [
    { value: '01', cnText: '录入' },
    { value: '02', cnText: '已出库' }
  ],
  // 奥迪专用工具借出还入状态
  SPTBorrowDocStatusTypeAU: [
    { value: '01', cnText: '未出库' },
    { value: '02', cnText: '已出库' },
    { value: '03', cnText: '部分还入' },
    { value: '04', cnText: '已还入' }
  ],
  // 奥迪专用工具借出还入单据行状态
  SPTBorrowDocStatusTypeAU02: [
    { value: '01', cnText: '未还入' },
    { value: '02', cnText: '部分还入' },
    { value: '03', cnText: '已还入' }
  ],
  // 使用类型
  SPTCLASSA: [
    { value: '01', cnText: '类型一' },
    { value: '02', cnText: '类型二' }
  ],
  // 工具分类
  SPTClassType: [
    { value: '01', cnText: '标配工具' },
    { value: '02', cnText: '选配工具' },
    { value: '03', cnText: '诊断工具' },
    { value: '04', cnText: '标配设备' }
  ],
  // 工具使用情况
  SPTCompareFlag: [
    { value: '0', cnText: '上年同期比' },
    { value: '1', cnText: '本年各期比' }
  ],
  // 工具入库方式
  SPTInStyle: [
    { value: '还入入库', cnText: '还入入库' },
    { value: '采购入库', cnText: '采购入库' },
    { value: '采购退库', cnText: '采购退库' }
  ],
  // 工具锁定类型
  SPTLockType: [
    { value: '1', cnText: '工具维修' },
    { value: '2', cnText: '同城调用' }
  ],
  // 专用工具采购入库导入excel
  SPTOrderExcel: [{ value: 'SPTOrderExcel', cnText: '专用工具采购入库' }],
  // 工具单据状态类型
  SPTOrderStatusType: [
    { value: '00', cnText: '录入' },
    { value: '40', cnText: '已入库' },
    { value: '60', cnText: '录入' },
    { value: '80', cnText: '已退库' }
  ],
  // 工具出库方式
  SPTOutStyle: [
    { value: '借出出库', cnText: '借出出库' },
    { value: '报废出库', cnText: '报废出库' }
  ],
  // 配备属性
  SPTPROPERTY: [
    { value: '01', cnText: '标准件' },
    { value: '02', cnText: '非标准件' }
  ],
  // 专用工具归还状态
  SPTReturnDocStatusType: [
    { value: '01', cnText: '录入' },
    { value: '02', cnText: '已入库' }
  ],
  // 是否零库存
  SPTStockQtyFlag: [
    { value: '0', cnText: '全部' },
    { value: '1', cnText: '零库存' },
    { value: '2', cnText: '非零库存' }
  ],
  // 系统
  SPTSYSTEM: [{ value: '00', cnText: '系统' }],
  // 类型
  SPTUSETYPE: [
    { value: '01', cnText: '未分类' },
    { value: '02', cnText: '已分类' }
  ],
  // 预收款状态
  STLPreAmtStatus: [
    { value: '00', cnText: '录入' },
    { value: '10', cnText: '上报' },
    { value: '20', cnText: '确认' },
    { value: '30', cnText: '转账' }
  ],
  // 预收款使用
  STLPreAmtUse: [
    { value: 'DEC', cnText: '精品结算' },
    { value: 'DEC10', cnText: '装饰结算' },
    { value: 'SAL', cnText: '整车结算' },
    { value: 'SPA', cnText: '备件结算' },
    { value: 'SVC', cnText: '服务结算' }
  ],
  // 结算方式类别
  STLsettletype: [
    { value: '1', cnText: '应收结算' },
    { value: '2', cnText: '使用预付' }
  ],
  // 预收款转账预收款类型
  STLTransferPreType: [
    { value: '1', cnText: '预收款客户' },
    { value: '2', cnText: '非预收款客户' }
  ],
  // 转账类型
  STLTransferType: [
    { value: '1', cnText: '转入非会员账户' },
    { value: '2', cnText: '转入会员账户' }
  ],
  // 人员DTMS状态
  STMDTMSStatus: [
    { value: '10011001', cnText: '在岗' },
    { value: '10011002', cnText: '离岗' }
  ],
  // 打印_模块
  STMModule: [
    { value: 'CLB', cnText: '经销商俱乐部' },
    { value: 'CLM', cnText: '索赔' },
    { value: 'DEC', cnText: '精品' },
    { value: 'SAL', cnText: '整车' },
    { value: 'SPA', cnText: '备件' },
    { value: 'SPT', cnText: '工具' },
    { value: 'SVC', cnText: '服务' }
  ],
  // 打印选项
  STMPrintMode: [
    { value: '00', cnText: '直接打印' },
    { value: '10', cnText: '先预览' }
  ],
  // 打印_走纸类型
  STMPrintPageType: [
    { value: '0', cnText: '整张' },
    { value: '1', cnText: '按内容走纸' }
  ],
  // 打印_打印机类型
  STMPrintType: [
    { value: '0', cnText: '针式' },
    { value: '1', cnText: '激光' }
  ],
  // 平台授权类型
  STMRightQAFType: [
    { value: 'B', cnText: '按钮' },
    { value: 'C', cnText: '控件' },
    { value: 'E', cnText: '导出' },
    { value: 'P', cnText: '打印' }
  ],
  // 性别
  STMSex: [
    { value: '0', cnText: '男' },
    { value: '1', cnText: '女' }
  ],
  // 是否
  STMYesOrNo: [
    { value: '0', cnText: '否' },
    { value: '1', cnText: '是' }
  ],
  // 替换车使用情况查询日期类型
  SVC0412QueryDateType: [
    { value: '01', cnText: '借出日期' },
    { value: '02', cnText: '归还日期' },
    { value: '03', cnText: '结算日期' }
  ],
  // 替换车使用情况车辆状态类型
  SVC0412ServiceCarQueryType: [
    { value: '01', cnText: '正常使用' },
    { value: '02', cnText: '暂停使用' },
    { value: '03', cnText: '停用处理' },
    { value: '04', cnText: '申请停用' },
    { value: '05', cnText: '转卖' },
    { value: '06', cnText: '全部' }
  ],
  // 救援车使用情况查询时间类型
  SVC0413QueryDateType: [
    { value: '01', cnText: '外出日期' },
    { value: '02', cnText: '结算日期' },
    { value: '03', cnText: '返回日期' }
  ],
  // 查询委托书类别
  SVC0416QueryCls: [
    { value: '01', cnText: '全部' },
    { value: '02', cnText: '保险类委托书' },
    { value: '03', cnText: '首保类委托书' },
    { value: '04', cnText: '索赔类委托书' },
    { value: '05', cnText: '其他类委托书' }
  ],
  // 替换车使用天数统计
  SVC411ServiceCarQueryType: [
    { value: '01', cnText: '正常' },
    { value: '03', cnText: '全部' },
    { value: '05', cnText: '转卖' }
  ],
  // App支付状态
  SVCAppPayStatus: [
    { value: '1: cnText', cnText: '发送App金额成功' },
    { value: '2: cnText', cnText: '已支付' },
    { value: '3: cnText', cnText: '发送App状态成功' }
  ],
  // 批量选择项目类型
  SVCBatchAddItemQueryType: [
    { value: 'Discount', cnText: '优惠包' },
    { value: 'Item', cnText: '维修项目' },
    { value: 'SuggestItem', cnText: '历史建议项目' },
    { value: 'Suit', cnText: '套餐' }
  ],
  // 单据结算类型
  SVCBatchSettleType: [
    { value: '00', cnText: '免费类单据' },
    { value: '01', cnText: '欠账结算单据' }
  ],
  // 电池类型
  SVCBatteryType: [
    { value: 'M', cnText: '电池模组' },
    { value: 'P', cnText: '电池包' }
  ],
  // 单据项目类型
  SVCBillItemType: [
    { value: '0', cnText: '项目' },
    { value: '1', cnText: '套餐' },
    { value: '2', cnText: '服务包' }
  ],
  // 预约单预约类别
  SVCBookKind: [
    { value: '01', cnText: '经销商主动预约' },
    { value: '02', cnText: '客户主动预约' }
  ],
  // 预约项目备件类别
  SVCBookSapKind: [
    { value: '0', cnText: '首保' },
    { value: '1', cnText: '索赔' },
    { value: '2', cnText: '正常' },
    { value: '3', cnText: '免费' },
    { value: '4', cnText: '保养' }
  ],
  // 预定状态
  SVCBookSta: [
    { value: '01', cnText: '预订' },
    { value: '02', cnText: '取消预订' },
    { value: '03', cnText: '预订完成' }
  ],
  // 品牌
  SVCBrand: [
    { value: 'O', cnText: '其他' },
    { value: 'V', cnText: '大众' }
  ],
  // 预约单查询条件日期类型
  SVCBRDateType: [
    { value: 'DCreate', cnText: '预约登记时间' },
    { value: 'DMeatingCar', cnText: '预约接车时间' }
  ],
  // 预约单履约状态
  SVCBRExecuteStatus: [
    { value: '01', cnText: '未修' },
    { value: '02', cnText: '已修' },
    { value: '03', cnText: '作废' }
  ],
  // 预约单状态
  SVCBRStatus: [
    { value: '01', cnText: '新增' },
    { value: '02', cnText: '修改' }
  ],
  // 救援服务管理费用性质
  SVCCarFeeKind: [
    { value: '01', cnText: '自费' },
    { value: '02', cnText: '保险' },
    { value: '03', cnText: '索赔' },
    { value: '04', cnText: '其他' }
  ],
  // 救援服务管理救援原因
  SVCCarRescueRsn: [
    { value: '01', cnText: '意外事故' },
    { value: '02', cnText: '车辆原因' },
    { value: '03', cnText: '用户及其他原因' }
  ],
  // 救援服务管理问题处理
  SVCCarSolveWay: [
    { value: '01', cnText: '搭电启动' },
    { value: '02', cnText: '添加机油' },
    { value: '03', cnText: '更换蓄电池' },
    { value: '04', cnText: '更换点火线圈' },
    { value: '05', cnText: '清除故障码' },
    { value: '06', cnText: '更换备胎' },
    { value: '07', cnText: '派送燃油' },
    { value: '08', cnText: '事故车咨询' },
    { value: '09', cnText: '其他' }
  ],
  // 救援服务管理任务来源
  SVCCarTaskFrom: [
    { value: '01', cnText: '总部下发' },
    { value: '02', cnText: '客户' },
    { value: '03', cnText: '其他' }
  ],
  // 救援服务管理拖车类型
  SVCCarTrailerType: [
    { value: '01', cnText: '直接拖车' },
    { value: '02', cnText: '补派拖车' }
  ],
  // 救援服务管理上传总部状态
  SVCCarUploadState: [
    { value: '01', cnText: '待发' },
    { value: '02', cnText: '已发' }
  ],
  // 渠道
  SVCChannel: [
    { value: '01', cnText: '原装' },
    { value: '02', cnText: '非原装' }
  ],
  // 委托书索赔状态
  SVCCLMStatus: [
    { value: '01', cnText: '未填报索赔' },
    { value: '02', cnText: '放弃索赔' }
  ],
  // 颜色类型
  SVCColorType: [
    { value: '01', cnText: '车身' },
    { value: '02', cnText: '内饰' }
  ],
  // 包工方式
  SVCContractMode: [
    { value: '00', cnText: '不包' },
    { value: '01', cnText: '包工料' },
    { value: '02', cnText: '包工' }
  ],
  // 优惠券类型
  SVCCouponType: [
    { value: '1', cnText: '红包' },
    { value: '2', cnText: '套装' }
  ],
  // 查询区域日期类型
  SVCDateType: [
    { value: '01', cnText: '送修日期' },
    { value: '02', cnText: '结算日期' }
  ],
  // 查询日期方式送修审核结算
  SVCDateType3: [
    { value: '01', cnText: '送修日期' },
    { value: '02', cnText: '结算日期' },
    { value: '03', cnText: '审核日期' }
  ],
  // 进厂日期查询方式
  SVCEnterDateType: [
    { value: '01', cnText: '送修日期' },
    { value: '02', cnText: '约定交车日期' }
  ],
  // 进厂输入方式
  SVCEnterInputType: [
    { value: '01', cnText: '按牌照号输入' },
    { value: '02', cnText: '按底盘号输入' },
    { value: '03', cnText: '一般输入' },
    { value: '04', cnText: '按估算委托书输入' },
    { value: '05', cnText: '按预约单输入' },
    { value: '06', cnText: '按救援单输入' },
    { value: '07', cnText: '读会员卡' }
  ],
  // 估算维修状态
  SVCEstimateRprSta: [
    { value: '00', cnText: '估算' },
    { value: '02', cnText: '结清' }
  ],
  // 估算维修状态浏览页
  SVCEstimateRprStaView: [
    { value: '00', cnText: '估算' },
    { value: '02', cnText: '结清' }
  ],
  // 估算处理状态
  SVCEstProcessSt: [
    { value: '00', cnText: '未修' },
    { value: '01', cnText: '已修' }
  ],
  // 延保估算单-维修状态
  SVCEWERepairStatus: [
    { value: '00', cnText: '未修' },
    { value: '01', cnText: '已修' }
  ],
  // 审核的是否底盘号定制的免责特殊件
  SVCFinishVinSpecialSpa: [
    { value: '0', cnText: '否' },
    { value: '1', cnText: '是' },
    { value: 'NULL', cnText: '空' }
  ],
  // 是否字典表
  SVCFlag: [
    { value: 'False', cnText: '否' },
    { value: 'True', cnText: '是' }
  ],
  // SVC单据来源
  SVCFrom: [
    { value: '0', cnText: '预约' },
    { value: '1', cnText: '估算' },
    { value: '2', cnText: '档案' },
    { value: '3', cnText: '救援' },
    { value: '5', cnText: '延保估算' },
    { value: 'A', cnText: '接车单' }
  ],
  // IO标识
  SVCIO: [
    { value: 'I', cnText: 'I' },
    { value: 'O', cnText: 'O' }
  ],
  // 可兑奖状态
  SVCIsPrizeStatus: [
    { value: 'F', cnText: '不可兑奖' },
    { value: 'T', cnText: '可兑奖' }
  ],
  // 流失客户查询类型
  SVCLostCustomerQueryType: [
    { value: '01', cnText: '流失客户' },
    { value: '02', cnText: '流失再回厂' }
  ],
  // 套餐包类型
  SVCMaintainSuitType: [
    { value: '1', cnText: '保养' },
    { value: '2', cnText: '新保' },
    { value: '3', cnText: '尊享' },
    { value: '4', cnText: '悦享' },
    { value: '5', cnText: '服务包' }
  ],
  // SVC0409里程查询限定
  SVCMileageCond: [
    { value: '01', cnText: '全部' },
    { value: '02', cnText: '0-10000KM' },
    { value: '03', cnText: '10000-20000KM' },
    { value: '04', cnText: '20000KM以上' }
  ],
  // 新能源维修级别
  SVCNEVLevel: [
    { value: '0', cnText: '0 不具备此车型维修资质' },
    { value: '1', cnText: '1 可维修此车型非高压部分' },
    { value: '2', cnText: '2 可维修此车型高压部分，可维修能够正常断电的事故车，但不可打开电池维修' },
    { value: '3', cnText: '3 有车型维修全部资质' }
  ],
  // 打印派工单项目
  SVCPGBillItem: [
    { value: '00', cnText: '全部项目' },
    { value: '10', cnText: '追加项目' }
  ],
  // 兑奖单状态
  SVCPrizeBillStatus: [
    { value: '0', cnText: '录入' },
    { value: '1', cnText: '出库' }
  ],
  // 精准营销包精品类别
  SVCPrizeClass: [
    { value: 'D04', cnText: '200代金券' },
    { value: 'D05', cnText: '300元代金券' },
    { value: 'D06', cnText: '300元工时代金券-老' },
    { value: 'D07', cnText: '300元工时代金券-新' },
    { value: 'H', cnText: '微信红包' },
    { value: 'MA1', cnText: '多次保养包' },
    { value: 'MB5', cnText: '服务包' },
    { value: 'MB8', cnText: '机电200代金券' },
    { value: 'MB9', cnText: '299自费喷漆代金券' },
    { value: 'MF1', cnText: '66元工时代金券' },
    { value: 'MG1', cnText: '基础保养5折' }
  ],
  // 厂家奖品明细类型
  SVCPrizeDetailType: [
    { value: '1', cnText: '工时' },
    { value: '2', cnText: '备件' },
    { value: '3', cnText: '现金' }
  ],
  // 兑奖状态
  SVCPrizeStatus: [
    { value: '0', cnText: '未兑奖' },
    { value: '1', cnText: '已兑奖' }
  ],
  // 奖品类别
  SVCPrizeType: [
    { value: 'A', cnText: 'A' },
    { value: 'D', cnText: '代金券' },
    { value: 'D02', cnText: '材料代金券' },
    { value: 'D03', cnText: '666元代金券' },
    { value: 'D04', cnText: '200代金券' },
    { value: 'D05', cnText: '300元代金券' },
    { value: 'D06', cnText: '300元工时代金券-老' },
    { value: 'D07', cnText: '300元工时代金券-新' },
    { value: 'F', cnText: '服务包' },
    { value: 'H', cnText: '微信红包' },
    { value: 'HA1', cnText: 'HA1' },
    { value: 'HA2', cnText: 'HA2' },
    { value: 'HA3', cnText: 'HA3' },
    { value: 'HB1', cnText: 'HB1' },
    { value: 'HB2', cnText: 'HB2' },
    { value: 'HC1', cnText: 'HC1' },
    { value: 'HF1', cnText: 'HF1' },
    { value: 'J', cnText: '备件' },
    { value: 'MA1', cnText: '多次保养包' },
    { value: 'MB5', cnText: '服务包7折' },
    { value: 'MB8', cnText: '机电200代金券' },
    { value: 'MB9', cnText: '299自费喷漆代金券' },
    { value: 'MC1', cnText: '玻璃水' },
    { value: 'MD1', cnText: '安全座椅' },
    { value: 'MD2', cnText: '轮胎' },
    { value: 'MD4', cnText: '刹车片' },
    { value: 'MF1', cnText: '66元工时代金券' },
    { value: 'MG1', cnText: '基础保养5折' }
  ],
  // 查询结账日期类型
  SVCQuerySettleAccountDateType: [
    { value: '01', cnText: '结算日期' },
    { value: '02', cnText: '出厂日期' }
  ],
  // 查询结账委托书类别
  SVCQuerySettleAccountKind: [
    { value: '01', cnText: '全部' },
    { value: '02', cnText: '钣喷类委托书' },
    { value: '03', cnText: '首保类委托书' },
    { value: '04', cnText: '索赔类委托书' },
    { value: '05', cnText: '其他类委托书' }
  ],
  // 查询全部前台领料日期类型
  SVCQuerySettlementSpaDateType: [
    { value: '01', cnText: '出库日期' },
    { value: '02', cnText: '结算日期' }
  ],
  // 委托书放弃索赔原因
  SVCRenounceReason: [
    { value: '01', cnText: '经销商自愿承担' },
    { value: '02', cnText: '商品车不申报' },
    { value: '03', cnText: '损伤件丢失' },
    { value: '04', cnText: '其它原因' }
  ],
  // 维修属性
  SVCRepairProp: [
    { value: 'BJ', cnText: '钣金' },
    { value: 'JX', cnText: '机修' },
    { value: 'PQ', cnText: '喷漆' },
    { value: 'QT', cnText: '其他' }
  ],
  // 故障状态
  SVCRepairSta: [
    { value: '01', cnText: '故障' },
    { value: '02', cnText: '取消维修' },
    { value: '03', cnText: '故障完成' }
  ],
  // 维修状态
  SVCRepairStatus: [
    { value: '00', cnText: '在修' },
    { value: '01', cnText: '审核' },
    { value: '02', cnText: '结清' },
    { value: '03', cnText: '欠账' }
  ],
  // 首保权益
  SVCSBQYDateType: [
    { value: 'N', cnText: '无权益' },
    { value: 'Y', cnText: '有权益' }
  ],
  // 公务车转卖审批状态
  SVCSellApproveStatus: [
    { value: '01', cnText: '录入' },
    { value: '02', cnText: '已提交' }
  ],
  // 转卖状态
  SVCSellSta: [
    { value: '01', cnText: '录入' },
    { value: '02', cnText: '提交' },
    { value: '03', cnText: '批注' },
    { value: '04', cnText: '驳回' }
  ],
  // 委托书服务包字典
  SVCSerPackProp: [
    { value: '0', cnText: '服务包' },
    { value: '1', cnText: '服务包子项' },
    { value: '2', cnText: '备件' }
  ],
  // 替换车状态统计
  SVCServiceCarTHStatus: [
    { value: '01', cnText: '预约' },
    { value: '02', cnText: '预订' },
    { value: '03', cnText: '故障' }
  ],
  // 预估备件价格类型
  SVCSPAEstimatePriceType: [
    { value: '00', cnText: '采购价' },
    { value: '10', cnText: '出库价' }
  ],
  // 备件出库类别
  SVCSPAOutType: [
    { value: '0', cnText: '正常' },
    { value: '1', cnText: '首保' },
    { value: '2', cnText: '索赔' },
    { value: '3', cnText: '免费' },
    { value: '4', cnText: '保养' }
  ],
  // 权益使用情况
  SVCSYQKDateType: [
    { value: 'N', cnText: '未使用' },
    { value: 'Y', cnText: '已使用' }
  ],
  // 救援费用申请交通方式
  SVCTrafficWay: [
    { value: '01', cnText: '火车' },
    { value: '02', cnText: '汽车' },
    { value: '03', cnText: '轮船' },
    { value: '04', cnText: '开救援车' },
    { value: '05', cnText: '其他' }
  ],
  // FD维护
  SVCVFDMainTain: [
    { value: '01', cnText: '已维护' },
    { value: '02', cnText: '未维护' }
  ],
  // 车辆来源
  SVCVFrom: [
    { value: '01', cnText: '享受替换车财务支持' },
    { value: '02', cnText: 'Mahle项目支持' },
    { value: '03', cnText: '回购车享受替换车财务支持' },
    { value: '04', cnText: 'Mahle项目租用' }
  ],
  // 车辆状态
  SVCVSta: [
    { value: '01', cnText: '正常使用' },
    { value: '02', cnText: '暂停使用' },
    { value: '03', cnText: '停用处理' },
    { value: '04', cnText: '申请停用' },
    { value: '05', cnText: '转卖' }
  ],
  // 车辆类别
  SVCVType: [
    { value: '01', cnText: '拖车' },
    { value: '02', cnText: '救援车' },
    { value: '03', cnText: '替换车' },
    { value: '04', cnText: '试乘试驾车' }
  ],
  // 救援费用申请上传结果
  SVCVUploadResult: [
    { value: '01', cnText: '成功' },
    { value: '02', cnText: '失败' }
  ],
  // 救援费用申请上传状态
  SVCVUpLoadStatus: [
    { value: '01', cnText: '未上传' },
    { value: '02', cnText: '已上传' }
  ],
  // 使用状态
  SVCVUseSta: [
    { value: '01', cnText: '空闲' },
    { value: '02', cnText: '使用中' },
    { value: '03', cnText: '故障' }
  ],
  // 工时统计日期类别
  SVCWorkHourDateType: [
    { value: '1', cnText: '派工日期' },
    { value: '2', cnText: '审核日期' },
    { value: '3', cnText: '出厂日期' },
    { value: '4', cnText: '结清日期' },
    { value: '5', cnText: '最后结算日期' }
  ],
  // 尊享悦享
  SVCZXYX: [
    { value: '3', cnText: '尊享' },
    { value: '4', cnText: '悦享' }
  ],
  SVCNCarMaintainCostApplyBillType: [
    { value: '0', cnText: '正常维护' },
    { value: '1', cnText: '补录单据' }
  ],
  SALSellArealType: [
    { value: '0', cnText: '跨区销售' },
    { value: '1', cnText: '首要市场' }
  ],
  SVCHXCardStatus: [
    { value: '10', cnText: '待激活' },
    { value: '20', cnText: '可用' },
    { value: '30', cnText: '已使用' },
    { value: '40', cnText: '无效' }
  ],
  SVCcardTicketType: [
    { value: '1', cnText: '满减券' },
    { value: '2', cnText: '代金券' },
    { value: '3', cnText: '折扣券' },
    { value: '4', cnText: '实物券' },
    { value: '5', cnText: '套餐券' },
    { value: '6', cnText: '异业券' }
  ],
  SVCcardTicketChildStatus: [
    { value: '1001', cnText: '已领取待激活' },
    { value: '1002', cnText: '已发放待激活' },
    { value: '2001', cnText: '已领取未使用' },
    { value: '2002', cnText: '已发放未使用' },
    { value: '2003', cnText: '已使用未用完' },
    { value: '3001', cnText: '已使用未用' },
    { value: '3002', cnText: '已使用已用完' },
    { value: '3003', cnText: '退单已使用' },
    { value: '3004', cnText: '冻结' },
    { value: '4001', cnText: '过期' }
  ],
  SVCbusinessCode: [
    { value: '1', cnText: '维修保养' },
    { value: '2', cnText: '保养' },
    { value: '3', cnText: '不限制' },
    { value: '4', cnText: '取送车' }
  ],
  vItemProperty: [
    { value: '0', cnText: '项目' },
    { value: '1', cnText: '套餐' }
  ],
  SPAdocumentsState: [
    { value: '00', cnText: '录入' },
    { value: '10', cnText: '提交' },
    { value: '20', cnText: '批准' },
    { value: '30', cnText: '拒绝' },
    { value: '41', cnText: '发货' },
    { value: '42', cnText: '部分发货' },
    { value: '80', cnText: '完成' }
  ],
  SPAvProperty: [
    { value: '00', cnText: '正常' },
    { value: '10', cnText: '紧急' }
  ],
  ZDPFmSPrtcCFMQuery: [
    { value: 'N', cnText: '新建' },
    { value: 'D', cnText: '删除' },
    { value: 'C', cnText: '确认' },
    { value: 'P', cnText: '审核' },
    { value: 'Q', cnText: '作废' }
  ]
};
