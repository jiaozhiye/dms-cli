/**
 * @Author: 焦质晔
 * @Date: 2019/6/20
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 15:45:00
 */
import isPlainObject from 'lodash/isPlainObject';

function getType(fn) {
  const match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : '';
}

const filterProps = (props, propsData = {}) => {
  const res = {};
  Object.keys(props).forEach(k => {
    if (k in propsData || props[k] !== undefined) {
      res[k] = props[k];
    }
  });
  return res;
};

// 合并组件的 props 属性
const mergeProps = (...args) => {
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
};

// 获取组件的 props 属性
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

export { mergeProps, getOptionProps };

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
