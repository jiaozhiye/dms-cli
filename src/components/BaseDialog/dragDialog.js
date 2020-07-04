/*
 * @Author: 焦质晔
 * @Date: 2020-02-27 12:30:19
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-25 17:01:54
 */
import { throttle } from '../_utils/tool';

const getStyle = (obj, attr) => {
  return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, false)[attr];
};

export default {
  inserted(el, binding, vnode) {
    const dialogHeaderEl = el.querySelector('.el-dialog__header');
    const dragDom = el.querySelector('.el-dialog');

    dialogHeaderEl.style.cursor = 'move';
    dragDom.style.top = 0;
    dragDom.style.left = 0;

    // 元素移动的方法
    function moveHandle(el, [l, t]) {
      el.style.left = `${l}px`;
      el.style.top = `${t}px`;
      // emit onDrag event
      vnode.child.$emit('dragDialog', { left: l, top: t });
    }

    dialogHeaderEl.onmousedown = function(e) {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - this.offsetLeft;
      const disY = e.clientY - this.offsetTop;

      const dragDomWidth = dragDom.offsetWidth;
      const dragDomHeight = dragDom.offsetHeight;

      const screenWidth = document.body.clientWidth;
      const screenHeight = document.body.clientHeight;

      const minDragDomLeft = dragDom.offsetLeft;
      const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth;

      const minDragDomTop = dragDom.offsetTop;
      const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomHeight;

      // 获取到的值带px 正则匹配替换
      let styL = getStyle(dragDom, 'left');
      let styT = getStyle(dragDom, 'top');

      if (styL.includes('%')) {
        styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100);
        styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100);
      } else {
        styL = +styL.replace(/\px/g, '');
        styT = +styT.replace(/\px/g, '');
      }

      document.onmousemove = function(e) {
        // 通过事件委托，计算移动的距离
        let left = e.clientX - disX;
        let top = e.clientY - disY;

        // 边界左处理
        if (-left > minDragDomLeft) {
          left = -minDragDomLeft;
        } else if (left > maxDragDomLeft) {
          left = maxDragDomLeft;
        }

        // 边界上处理
        if (-top > minDragDomTop) {
          top = -minDragDomTop;
        } else if (top > maxDragDomTop) {
          top = maxDragDomTop - 1;
        }

        // 移动当前元素
        throttle(moveHandle, 10)(dragDom, [left + styL, top + styT]);
      };

      document.onmouseup = function() {
        this.onmousemove = null;
        this.onmouseup = null;
      };

      return false;
    };
  },
  unbind(el) {
    const dialogHeaderEl = el.querySelector('.el-dialog__header');
    dialogHeaderEl.onmousedown = null;
  }
};
