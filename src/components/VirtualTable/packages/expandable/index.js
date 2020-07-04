/*
 * @Author: 焦质晔
 * @Date: 2020-03-30 15:59:26
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-06-16 09:38:43
 */
const noop = () => {};

export default {
  name: 'Expandable',
  props: ['record', 'rowKey'],
  inject: ['$$table'],
  computed: {
    expanded() {
      return this.$$table.rowExpandedKeys.includes(this.rowKey);
    }
  },
  watch: {
    expanded(val) {
      const { onChange = noop } = this.$$table.expandable || {};
      onChange({ [this.rowKey]: val });
    }
  },
  methods: {
    clickHandle(ev) {
      ev.stopPropagation();
      const { rowExpandedKeys } = this.$$table;
      // 展开状态 -> 收起
      const result = this.expanded ? rowExpandedKeys.filter(x => x !== this.rowKey) : [...new Set([...rowExpandedKeys, this.rowKey])];
      this.$$table.rowExpandedKeys = result;
    }
  },
  render() {
    const cls = [
      `v-expand--icon`,
      {
        expanded: this.expanded,
        collapsed: !this.expanded
      }
    ];
    return <span class={cls} onClick={this.clickHandle} />;
  }
};
