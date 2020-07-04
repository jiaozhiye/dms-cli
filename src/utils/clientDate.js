/*
 * @Author: 焦质晔
 * @Date: 2020-05-08 17:07:15
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-06-04 20:20:41
 */
// 获取本地时间（当天到当天）例如：当天时间是2019-05-09，返回 ['2019-05-09 00:00:00','2019-05-09 23:59:59']
export function getClientDateRanges() {
  // let date = new Date();
  // let year = date.getFullYear();
  // let month = date.getMonth() + 1;
  // let dateFst = year + '-' + (month < 10 ? '0' + month : month) + '-01';
  // return [new Date(dateFst), date];
  let date = new Date();
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  let day = date.getDate();

  let d1 = y + '-' + (m < 10 ? '0' + m : m) + '-' + (day < 10 ? '0' + day : day) + ' 00:00:00';
  let d2 = y + '-' + (m < 10 ? '0' + m : m) + '-' + (day < 10 ? '0' + day : day) + ' 23:59:59';
  return [d1, d2];
}

// 获取本地时间（当月第一天到当天）例如：当天时间是2019-05-09，返回 ['2019-05-01 00:00:00','2019-05-09 23:59:59']
export function getClientDateRange() {
  // let date = new Date();
  // let year = date.getFullYear();
  // let month = date.getMonth() + 1;
  // let dateFst = year + '-' + (month < 10 ? '0' + month : month) + '-01';
  // return [new Date(dateFst), date];
  let date = new Date();
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  let day = date.getDate();

  let d1 = y + '-' + (m < 10 ? '0' + m : m) + '-' + '01' + ' 00:00:00';
  let d2 = y + '-' + (m < 10 ? '0' + m : m) + '-' + (day < 10 ? '0' + day : day) + ' 23:59:59';
  return [d1, d2];
}

// 获取本地时间（当月第一天到当天）例如：当天时间是2019-05-09 00:00:00，返回 ['2019-05-01 00:00:00','2019-05-09 当前时分秒']
export function getClientDateRange2() {
  let date = new Date();
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  let day = date.getDate();

  let h = date.getHours();
  h = h < 10 ? '0' + h : h;
  let minute = date.getMinutes();
  minute = minute < 10 ? '0' + minute : minute;
  let second = date.getSeconds();
  second = second < 10 ? '0' + second : second;

  let d1 = y + '-' + (m < 10 ? '0' + m : m) + '-' + '01' + ' 00:00:00';
  let d2 = y + '-' + (m < 10 ? '0' + m : m) + '-' + (day < 10 ? '0' + day : day) + ' 23:59:59';

  return [d1, d2];
}

// 获取当前时间 例如：当前时间是2019-05-11，返回 ['2019-05-11']
export function getNowFormatDate() {
  let date = new Date();
  let seperator1 = '-';
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = '0' + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate;
  }
  let currentdate = year + seperator1 + month + seperator1 + strDate + ' 00:00:00';
  return currentdate;
}

// 获取本地时间（当月第一天到当天）用于日期选择控件
// 例如：当天时间是2019-05-09 00:00:00，返回 ['2019-05-01 00:00:00','2019-05-09 23:59:59']
// 如果后边的查询日期没有，就默认至当前日的23:59:59，前边日期没有，默认至1900-01-01 00:00:00
export function getClientDateRangeForPicker(dataValue) {
  let date = new Date();
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  let day = date.getDate();

  let d1 = '1900-01-01 00:00:00';
  let d2 = y + '-' + (m < 10 ? '0' + m : m) + '-' + (day < 10 ? '0' + day : day) + ' 23:59:59';
  if (dataValue == null || dataValue.length == 0) {
    return [d1, d2];
  } else if (dataValue.length == 1) {
    if (dataValue[0].length == 10) {
      return [dataValue[0] + ' 00:00:00', d2];
    } else {
      return [dataValue[0], d2];
    }
  } else {
    let temp1 = dataValue[0];
    if (temp1 == null) {
      temp1 = d1;
    }
    if (temp1.length == 10) {
      temp1 = temp1 + ' 00:00:00';
    }

    let temp2 = dataValue[1];
    if (temp2 == null) {
      temp2 = d2;
    }
    if (temp2.length == 10) {
      temp2 = temp2 + ' 23:59:59';
    } else {
      temp2 = temp2.replace(' 00:00:00', ' 23:59:59');
    }

    return [temp1, temp2];
  }
}

// 当选择停用的时候给dStop赋值
// that:传过来的用例的this,flag:checkbox的选中状态,dataTool:需要修改的dom节点
export function setDateForCheckbox(that, event) {
  that.$nextTick(() => {
    if (event.cStop === 1) {
      let date = new Date();
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      let day = date.getDate();

      let h = date.getHours();
      h = h < 10 ? '0' + h : h;
      let minute = date.getMinutes();
      minute = minute < 10 ? '0' + minute : minute;
      let second = date.getSeconds();
      second = second < 10 ? '0' + second : second;

      let d = y + '-' + (m < 10 ? '0' + m : m) + '-' + (day < 10 ? '0' + day : day) + ' ' + h + ':' + minute + ':' + second;
      event.dStop = d;
    } else {
      event.dStop = null;
    }
  });
}

// 此方法给查回来的refList加个全部选项
export function setRefListAll(list) {
  let listcopy = [...list];
  listcopy.unshift({
    dictcode: '',
    dictname: '全部'
  });
  return listcopy;
}

export default {
  getClientDateRanges,
  getClientDateRange,
  getClientDateRange2,
  getNowFormatDate,
  getClientDateRangeForPicker,
  setDateForCheckbox,
  setRefListAll
};
