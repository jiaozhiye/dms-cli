/**
 * @Author: 焦质晔
 * @Date: 2019/6/20
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 15:45:00
 */

export default class DragElement {
  targetNode = null;

  constructor(props) {
    this.createParams(props);
    this.initalHandle();
  }

  createParams = options => {
    this.$dragNode = options.$dragNode;
    this.targetNodes = options.targetNodes || [];
    this.callback = options.callback;
  };

  throttle = (fn, delay) => {
    return function(...args) {
      let nowTime = +new Date();
      if (!fn.lastTime || nowTime - fn.lastTime > delay) {
        fn.apply(this, args);
        fn.lastTime = nowTime;
      }
    };
  };

  initalHandle = () => {
    this.createDragHandle();
  };

  getTranslateValue = el => {
    const val = el.style.transform;
    if (!val) return [0, 0];
    const res = val
      .replace('translate3d', '')
      .replace(/[^0-9\-,]/g, '')
      .split(',');
    return res.slice(0, 2).map(x => Number(x));
  };

  setStyleHandle = (obj, prefixFeature, value) => {
    let prefix = prefixFeature.slice(0, 1).toUpperCase() + prefixFeature.slice(1);
    let prefixArr = ['webkit' + prefix, 'moz' + prefix, 'ms' + prefix, prefixFeature];
    for (let i = 0; i < prefixArr.length; i++) {
      obj.style[prefixArr[i]] = value;
    }
  };

  resetPosition = () => {
    this.$dragNode.style.transition = 'all 0.3s ease';
    this.moveHandle(0, 0);
    this.$dragNode.style.zIndex = 0;
    setTimeout(() => (this.$dragNode.style.transition = null), 300);
  };

  // el1 移动节点     el2 目标节点
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

  calcLength(el1, el2) {
    const { left: l1, top: t1 } = el1.getBoundingClientRect();
    const { left: l2, top: t2 } = el2.getBoundingClientRect();
    const { offsetWidth: w1, offsetHeight: h1 } = el1;
    const { offsetWidth: w2, offsetHeight: h2 } = el2;
    const disX = Math.abs(l1 + w1 / 2 - (l2 + w2 / 2));
    const disY = Math.abs(t1 + h1 / 2 - (t2 + h2 / 2));
    return Math.sqrt(disX * disX + disY * disY);
  }

  findTargetNode = el => {
    const res = [];
    for (let i = 0; i < this.targetNodes.length; i++) {
      const target = this.targetNodes[i];
      if (this.isCollision(el, target)) {
        res.push(target);
      }
    }
    if (!res.length) return null;
    const arr = res.map(x => ({ node: x, val: this.calcLength(el, x) })).sort((a, b) => a.val - b.val);
    return arr[0].node;
  };

  setTableCellClass = el => {
    for (let i = 0; i < this.targetNodes.length; i++) {
      this.targetNodes[i].classList.remove('actived');
    }
    el && el.classList.add('actived');
  };

  moveHandle = (l, t) => {
    this.setStyleHandle(this.$dragNode, 'transform', `translate3d(${l}px, ${t}px, 0)`);
    const target = this.findTargetNode(this.$dragNode);
    this.targetNode = null;
    if (target && !target.children.length) {
      this.targetNode = target;
      this.setTableCellClass(target);
    } else {
      this.setTableCellClass();
    }
  };

  createDragHandle = () => {
    this.$dragNode.onmousedown = ev => {
      this.$dragNode.style.zIndex = 1;

      const arr = this.getTranslateValue(this.$dragNode);
      const disX = ev.clientX - arr[0];
      const disY = ev.clientY - arr[1];

      document.onmousemove = e => {
        let l = e.clientX - disX;
        let t = e.clientY - disY;
        this.throttle(this.moveHandle, 20)(l, t);
      };

      document.onmouseup = () => {
        this.resetPosition();
        this.setTableCellClass();
        if (this.targetNode) {
          this.callback && this.callback(this.$dragNode, this.targetNode);
        }
        document.onmousemove = null;
        document.onmouseup = null;
      };

      return false;
    };
  };
}
