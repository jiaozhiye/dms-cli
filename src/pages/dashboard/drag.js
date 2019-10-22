/**
 * @Author: 焦质晔
 * @Date: 2019/6/20
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 15:45:00
 */
export default class DragElement {
  state = {
    targetNode: null // 满足放置条件的目标节点
  };

  constructor(props) {
    this.createParams(props);
    this.initalHandle();
  }

  // 创建组件参数
  createParams = options => {
    this.$dragNode = options.$dragNode;
    this.targetNodes = options.targetNodes || [];
    this.callback = options.callback || function() {};
  };

  // 初始化方法
  initalHandle = () => {
    this.createDragHandle();
  };

  // 组件销毁方法
  destroye = () => {
    // 解绑事件
    this.$dragNode.onmousedown = null;
    // 释放内存
    for (let key in this) {
      this[key] = null;
    }
  };

  // 设置状态
  setState(newState, callback) {
    this.state = Object.assign({}, this.state, newState);
    callback && callback(this.state);
  }

  // 函数截流
  throttle = (fn, delay) => {
    return function(...args) {
      let nowTime = +new Date();
      if (!fn.lastTime || nowTime - fn.lastTime > delay) {
        fn.apply(this, args);
        fn.lastTime = nowTime;
      }
    };
  };

  // 获取节点元素的位移偏移量，返回值是数组
  getTranslateOffset = el => {
    const val = el.style.transform;
    if (!val) return [0, 0];
    const res = val
      .replace('translate3d', '')
      .replace(/[^0-9\-,]/g, '')
      .split(',');
    return res.slice(0, 2).map(x => Number(x));
  };

  // 设置 css3 样式方法
  setStyleHandle = (el, prefixFeature, value) => {
    const prefix = prefixFeature.slice(0, 1).toUpperCase() + prefixFeature.slice(1);
    const prefixArr = ['webkit' + prefix, 'moz' + prefix, 'ms' + prefix, prefixFeature];
    for (let i = 0; i < prefixArr.length; i++) {
      el.style[prefixArr[i]] = value;
    }
  };

  // 移动到指定位置
  moveToTargetPos = (el, pos = [0, 0]) => {
    el.style.transition = 'all 0.2s ease';
    // 运动
    this.moveHandle(el, pos);
    setTimeout(() => {
      el.style.transition = null;
      this.setNodeClassName();
      // 执行回调
      const { targetNode } = this.state;
      targetNode && this.callback(el, targetNode);
    }, 200);
  };

  // 判断两个节点是否碰撞，el1 移动节点  el2 目标节点
  isCollision = (el1, el2) => {
    const l1 = el1.getBoundingClientRect().left,
      r1 = l1 + el1.offsetWidth,
      t1 = el1.getBoundingClientRect().top,
      b1 = t1 + el1.offsetHeight;
    const l2 = el2.getBoundingClientRect().left,
      r2 = l2 + el2.offsetWidth,
      t2 = el2.getBoundingClientRect().top,
      b2 = t2 + el2.offsetHeight;
    if (l1 > r2 || r1 < l2 || t1 > b2 || b1 < t2) {
      // 没有撞上
      return false;
    }
    // 撞上了
    return true;
  };

  // 勾股定理，计算两点之间的距离
  calcDistance(el1, el2) {
    const { left: l1, top: t1 } = el1.getBoundingClientRect();
    const { left: l2, top: t2 } = el2.getBoundingClientRect();
    const { offsetWidth: w1, offsetHeight: h1 } = el1;
    const { offsetWidth: w2, offsetHeight: h2 } = el2;
    const disX = Math.abs(l1 + w1 / 2 - (l2 + w2 / 2));
    const disY = Math.abs(t1 + h1 / 2 - (t2 + h2 / 2));
    return Math.sqrt(disX * disX + disY * disY);
  }

  // 查找目标节点，条件：1. 发生碰撞  2. 找到被碰撞节点中最近的一个
  findTargetNode = el => {
    const res = [];
    for (let i = 0; i < this.targetNodes.length; i++) {
      const target = this.targetNodes[i];
      if (this.isCollision(el, target)) {
        res.push(target);
      }
    }
    if (!res.length) return null;
    const arr = res.map(x => ({ node: x, val: this.calcDistance(el, x) })).sort((a, b) => a.val - b.val);
    return arr[0].node;
  };

  // 设置表格单元格 class
  setNodeClassName = el => {
    for (let i = 0; i < this.targetNodes.length; i++) {
      this.targetNodes[i].classList.remove('actived');
    }
    el && el.classList.add('actived');
  };

  // 核心移动算法
  moveHandle = (el, [l, t]) => {
    this.setStyleHandle(el, 'transform', `translate3d(${l}px, ${t}px, 0)`);
    const target = this.findTargetNode(el);
    // 找到目标节点，并且是空节点
    if (target && !target.children.length) {
      this.setState({ targetNode: target });
      this.setNodeClassName(target);
    } else {
      this.setState({ targetNode: null });
      this.setNodeClassName();
    }
  };

  // 创建节点拖动
  createDragHandle = () => {
    this.$dragNode.onmousedown = ev => {
      // 事件源节点对象
      const el = ev.currentTarget;
      el.style.zIndex = 1;

      const { left: rl, top: rt } = el.getBoundingClientRect();
      const [x, y] = this.getTranslateOffset(el);
      const disX = ev.clientX - x;
      const disY = ev.clientY - y;

      document.onmousemove = e => {
        const l = e.clientX - disX;
        const t = e.clientY - disY;
        this.throttle(this.moveHandle, 20)(el, [l, t]);
      };

      document.onmouseup = () => {
        el.style.zIndex = 0;
        const { targetNode } = this.state;
        let pos = [0, 0];
        // 找到符合放置条件的目标节点
        if (targetNode && targetNode.nodeType === 1) {
          const { left: x, top: y } = targetNode.getBoundingClientRect();
          pos = [x - rl, y - rt];
        }
        // 移动到目标位置
        this.moveToTargetPos(el, pos);
        // 解绑事件
        document.onmousemove = null;
        document.onmouseup = null;
      };

      return false;
    };
  };
}
