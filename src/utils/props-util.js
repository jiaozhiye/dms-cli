/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-01-12 13:54:55
 */
import isPlainObject from 'lodash/isPlainObject';
import classNames from 'classnames';

function getType(fn) {
  const match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : '';
}

const camelizeRE = /-(\w)/g;
const camelize = str => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
};

const parseStyleText = (cssText = '', camel) => {
  const res = {};
  const listDelimiter = /;(?![^(]*\))/g;
  const propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function(item) {
    if (item) {
      const tmp = item.split(propertyDelimiter);
      if (tmp.length > 1) {
        const k = camel ? camelize(tmp[0].trim()) : tmp[0].trim();
        res[k] = tmp[1].trim();
      }
    }
  });
  return res;
};

const hasProp = (instance, prop) => {
  const $options = instance.$options || {};
  const propsData = $options.propsData || {};
  return prop in propsData;
};

const slotHasProp = (slot, prop) => {
  const $options = slot.componentOptions || {};
  const propsData = $options.propsData || {};
  return prop in propsData;
};

const filterProps = (props, propsData = {}) => {
  const res = {};
  Object.keys(props).forEach(k => {
    if (k in propsData || props[k] !== undefined) {
      res[k] = props[k];
    }
  });
  return res;
};

const getScopedSlots = ele => {
  return (ele.data && ele.data.scopedSlots) || {};
};

const getSlots = ele => {
  let componentOptions = ele.componentOptions || {};
  if (ele.$vnode) {
    componentOptions = ele.$vnode.componentOptions || {};
  }
  const children = ele.children || componentOptions.children || [];
  const slots = {};
  children.forEach(child => {
    if (!isEmptyElement(child)) {
      const name = (child.data && child.data.slot) || 'default';
      slots[name] = slots[name] || [];
      slots[name].push(child);
    }
  });
  return { ...slots, ...getScopedSlots(ele) };
};

const getAllChildren = ele => {
  let componentOptions = ele.componentOptions || {};
  if (ele.$vnode) {
    componentOptions = ele.$vnode.componentOptions || {};
  }
  return ele.children || componentOptions.children || [];
};

const getSlotOptions = ele => {
  if (ele.fnOptions) {
    // 函数式组件
    return ele.fnOptions;
  }
  let componentOptions = ele.componentOptions;
  if (ele.$vnode) {
    componentOptions = ele.$vnode.componentOptions;
  }
  return componentOptions ? componentOptions.Ctor.options || {} : {};
};

const getOptionProps = instance => {
  if (instance.componentOptions) {
    const componentOptions = instance.componentOptions;
    const { propsData = {}, Ctor = {} } = componentOptions;
    const props = (Ctor.options || {}).props || {};
    const res = {};
    for (const [k, v] of Object.entries(props)) {
      const def = v.default;
      if (def !== undefined) {
        res[k] = typeof def === 'function' && getType(v.type) !== 'Function' ? def.call(instance) : def;
      }
    }
    return { ...res, ...propsData };
  }
  const { $options = {}, $props = {} } = instance;
  return filterProps($props, $options.propsData);
};

const getComponentFromProp = (instance, prop, options = instance, execute = true) => {
  if (instance.$createElement) {
    const h = instance.$createElement;
    const temp = instance[prop];
    if (temp !== undefined) {
      return typeof temp === 'function' && execute ? temp(h, options) : temp;
    }
    return instance.$slots[prop] || (instance.$scopedSlots[prop] && execute && instance.$scopedSlots[prop](options)) || instance.$scopedSlots[prop] || undefined;
  } else {
    const h = instance.context.$createElement;
    const temp = getPropsData(instance)[prop];
    if (temp !== undefined) {
      return typeof temp === 'function' && execute ? temp(h, options) : temp;
    }
    const slotsProp = [];
    const componentOptions = instance.componentOptions || {};
    (componentOptions.children || []).forEach(child => {
      if (child.data && child.data.slot === prop) {
        if (child.tag === 'template') {
          slotsProp.push(child.children);
        } else {
          slotsProp.push(child);
        }
      }
    });
    return slotsProp.length ? slotsProp : undefined;
  }
};

const getAllProps = ele => {
  let data = ele.data || {};
  let componentOptions = ele.componentOptions || {};
  if (ele.$vnode) {
    data = ele.$vnode.data || {};
    componentOptions = ele.$vnode.componentOptions || {};
  }
  return { ...data.props, ...data.attrs, ...componentOptions.propsData };
};

const getPropsData = ele => {
  let componentOptions = ele.componentOptions;
  if (ele.$vnode) {
    componentOptions = ele.$vnode.componentOptions;
  }
  return componentOptions ? componentOptions.propsData || {} : {};
};

const getValueByProp = (ele, prop) => {
  return getPropsData(ele)[prop];
};

const getAttrs = ele => {
  let data = ele.data;
  if (ele.$vnode) {
    data = ele.$vnode.data;
  }
  return data ? data.attrs || {} : {};
};

const getKey = ele => {
  let key = ele.key;
  if (ele.$vnode) {
    key = ele.$vnode.key;
  }
  return key;
};

export function getEvents(child) {
  let events = {};
  if (child.componentOptions && child.componentOptions.listeners) {
    events = child.componentOptions.listeners;
  } else if (child.data && child.data.on) {
    events = child.data.on;
  }
  return { ...events };
}

export function getClass(ele) {
  let data = {};
  if (ele.data) {
    data = ele.data;
  } else if (ele.$vnode && ele.$vnode.data) {
    data = ele.$vnode.data;
  }
  const tempCls = data.class || {};
  const staticClass = data.staticClass;
  let cls = {};
  staticClass &&
    staticClass.split(' ').forEach(c => {
      cls[c.trim()] = true;
    });
  if (typeof tempCls === 'string') {
    tempCls.split(' ').forEach(c => {
      cls[c.trim()] = true;
    });
  } else if (Array.isArray(tempCls)) {
    classNames(tempCls)
      .split(' ')
      .forEach(c => {
        cls[c.trim()] = true;
      });
  } else {
    cls = { ...cls, ...tempCls };
  }
  return cls;
}

export function getStyle(ele, camel) {
  let data = {};
  if (ele.data) {
    data = ele.data;
  } else if (ele.$vnode && ele.$vnode.data) {
    data = ele.$vnode.data;
  }
  let style = data.style || data.staticStyle;
  if (typeof style === 'string') {
    style = parseStyleText(style, camel);
  } else if (camel && style) {
    // 驼峰化
    const res = {};
    Object.keys(style).forEach(k => (res[camelize(k)] = style[k]));
    return res;
  }
  return style;
}

export function getComponentName(opts) {
  return opts && (opts.Ctor.options.name || opts.tag);
}

export function isEmptyElement(c) {
  return !(c.tag || (c.text && c.text.trim() !== ''));
}

export function filterEmpty(children = []) {
  return children.filter(c => !isEmptyElement(c));
}

const initDefaultProps = (propTypes, defaultProps) => {
  Object.keys(defaultProps).forEach(k => {
    if (propTypes[k]) {
      propTypes[k].def && (propTypes[k] = propTypes[k].def(defaultProps[k]));
    } else {
      throw new Error(`not have ${k} prop`);
    }
  });
  return propTypes;
};

export function mergeProps() {
  const args = [].slice.call(arguments, 0);
  const props = {};
  args.forEach((p = {}) => {
    for (const [k, v] of Object.entries(p)) {
      props[k] = props[k] || {};
      if (isPlainObject(v)) {
        Object.assign(props[k], v);
      } else {
        props[k] = v;
      }
    }
  });
  return props;
}

function isValidElement(element) {
  return element && typeof element === 'object' && 'componentOptions' in element && 'context' in element && element.tag !== undefined; // remove text node
}

export {
  hasProp,
  filterProps,
  getOptionProps,
  getComponentFromProp,
  getSlotOptions,
  slotHasProp,
  getPropsData,
  getKey,
  getAttrs,
  getValueByProp,
  parseStyleText,
  initDefaultProps,
  isValidElement,
  camelize,
  getSlots,
  getAllProps,
  getAllChildren
};

// render 示例：
// render() {
//   const { $listeners, $slots = {}, $attrs, $scopedSlots } = this;
//   const props = getOptionProps(this);
//   const wrapProps = mergeProps({
//     props: {
//       ...props,
//       children: $slots || props.children || []
//     },
//     on: $listeners,
//     attrs: $attrs,
//     scopedSlots: $scopedSlots,
//   });
//   return (
//     <WrappedComponent {...wrapProps} ref="wrappedInstance">
//       {Object.keys($slots).map(name => {
//         return <template key={name} slot={name}>{$slots[name]}</template>;
//       })}
//     </WrappedComponent>
//   );
// }
// 注释：作用域插槽和普通插槽(匿名/具名)在组件传参时的处理方式不同，
// 作用域插槽通过 scopedSlots 传递即可，普通插槽则是通过装载子组件的方式传递
