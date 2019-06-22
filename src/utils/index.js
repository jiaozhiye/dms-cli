/**
 * @Author: Jzy
 * @Date: 2017/12/12
 * @Last Modified by:   jzy
 * @Last Modified time: 2018-02-21 17:52:11
 */
// 等待
export const sleep = async timeLen => {
  return new Promise(resolve => {
    setTimeout(resolve, timeLen);
  });
};
