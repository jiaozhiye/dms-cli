/*
 * @Author: 焦质晔
 * @Date: 2020-03-30 15:59:26
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-30 17:00:43
 */
export default {
  name: 'Expandable',
  data() {
    return {
      isExpand: false // 默认收起
    };
  },
  methods: {
    clickHandle() {
      this.isExpand = !this.isExpand;
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
