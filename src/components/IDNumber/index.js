/*
 * @Author: 焦质晔
 * @Date: 2020-01-17 16:53:45
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-01-17 18:15:40
 */
import axios from 'axios';

export default class IDNumber {
  state = {};

  // 创建链接
  createConnect = async () => {
    try {
      const res = await axios.post(`http://127.0.0.1:18889/api/connect`);
      if (res.status === 200) {
        return [null, res.data];
      }
    } catch (err) {
      return [{ errMsg: '未启动读卡插件!' }, null];
    }
  };

  // 获取状态
  getConnectStatus = async () => {
    try {
      const res = await axios.post(`http://127.0.0.1:18889/api/getStatus`);
      if (res.status === 200) {
        return [null, res.data];
      }
    } catch (err) {
      return [{ errMsg: '未启动读卡插件!' }, null];
    }
  };

  // 断开连接
  disConnect = async () => {
    try {
      const res = await axios.post(`http://127.0.0.1:18889/api/disconnect`);
      if (res.status === 200) {
        return [null, res.data];
      }
    } catch (err) {
      return [{ errMsg: '未启动读卡插件!' }, null];
    }
  };

  // 读卡
  readCardInfo = async () => {
    try {
      const res = await axios.post(`http://127.0.0.1:18889/api/readCard`);
      if (res.status === 200) {
        if (res.data.resultFlag === 0) {
          return [null, res.data.resultContent];
        }
        return [{ errMsg: res.data.errorMsg }, null];
      }
    } catch (err) {
      return [{ errMsg: '未启动读卡插件!' }, null];
    }
  };

  // 销毁方法
  destroye = () => {
    // 释放内存
    for (let key in this) {
      this[key] = null;
    }
  };
}
