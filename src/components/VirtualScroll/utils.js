/*
 * @Author: 焦质晔
 * @Date: 2020-02-25 20:12:30
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-02-25 20:22:00
 */
const regex = /(auto|scroll)/;

const parents = function(node, ps) {
  if (node.parentNode === null) {
    return ps;
  }

  return parents(node.parentNode, ps.concat([node]));
};

const style = function(node, prop) {
  return getComputedStyle(node, null).getPropertyValue(prop);
};

const overflow = function(node) {
  return style(node, 'overflow') + style(node, 'overflow-y') + style(node, 'overflow-x');
};

const scroll = function(node) {
  return regex.test(overflow(node));
};

export function scrollParent(node) {
  if (!(node instanceof HTMLElement || node instanceof SVGElement)) {
    return;
  }

  const ps = parents(node.parentNode, []);

  for (let i = 0; i < ps.length; i += 1) {
    if (scroll(ps[i])) {
      return ps[i];
    }
  }

  return document.scrollingElement || document.documentElement;
}
