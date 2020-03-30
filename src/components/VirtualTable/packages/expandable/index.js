/*
 * @Author: 焦质晔
 * @Date: 2020-03-30 15:59:26
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-30 23:37:04
 */
const noop = () => {};

export default {
  name: 'Expandable',
  props: ['record', 'rowKey'],
  inject: ['$$table'],
  data() {
    return {};
  },
  computed: {
    expandable() {
      return this.$$table.rowExpandedKeys.includes(this.rowKey);
    }
  },
  watch: {
    expandable(val) {
      const { onChange = noop } = this.$$table.expandable;
      onChange({ [this.rowKey]: val });
    }
  },
  methods: {
    clickHandle() {
      const { rowExpandedKeys } = this.$$table;
      // 展开状态 -> 收起
      const res = this.expandable ? rowExpandedKeys.filter(x => x !== this.rowKey) : [...new Set([...rowExpandedKeys, this.rowKey])];
      this.$$table.rowExpandedKeys = res;
    }
  },
  render() {
    const { expandable } = this;
    const cls = [
      `v-expand--icon`,
      {
        expanded: expandable,
        collapsed: !expandable
      }
    ];
    return <span class={cls} onClick={this.clickHandle}></span>;
  }
};
