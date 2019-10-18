/**
 * @Author: 焦质晔
 * @Date: 2019/6/20
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 15:45:00
 */

export default class DragElement {
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

  resetPosition = () => {
    this.$dragNode.style.transition = 'all 0.3s ease';
    this.moveHandle(0, 0);
    this.$dragNode.style.zIndex = 0;
    setTimeout(() => (this.$dragNode.style.transition = null), 300);
  };

  moveHandle = (l, t) => {
    this.$dragNode.style.transform = `translate3d(${l}px, ${t}px, 0)`;
  };

  createDragHandle = () => {
    this.$dragNode.onmousedown = ev => {
      this.$dragNode.style.zIndex = 1;

      const arr = this.getTranslateValue(this.$dragNode);
      let disX = ev.clientX - arr[0];
      let disY = ev.clientY - arr[1];

      document.onmousemove = e => {
        let l = e.clientX - disX;
        let t = e.clientY - disY;
        this.throttle(this.moveHandle, 20)(l, t);
      };

      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
        this.resetPosition();
      };

      return false;
    };
  };
}
