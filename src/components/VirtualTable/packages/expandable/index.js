/*
 * @Author: 焦质晔
 * @Date: 2020-03-30 15:59:26
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-30 23:00:05
 */
const noop = () => {};

export default {
  name: 'Expandable',
  props: ['rowKey'],
  inject: ['$$table'],
  data() {
    return {
      isExpand: false // 默认收起(展开为 false)
    };
  },
  methods: {
    clickHandle() {
      this.isExpand = !this.isExpand;
      const { onChange = noop } = this.$$table.expandable;
      onChange(this.isExpand);
    }
  },
  render() {
    const { isExpand } = this;
    const cls = [
      `v-expand--icon`,
      {
        expanded: isExpand,
        collapsed: !isExpand
      }
    ];
    return <span class={cls} onClick={this.clickHandle}></span>;
  }
};
