/*
 * @Author: 焦质晔
 * @Date: 2020-03-29 14:18:07
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-29 14:41:02
 */
export default {
  name: 'Reload',
  inject: ['$$table'],
  methods: {
    clickHandle() {
      this.$$table.getTableData();
    }
  },
  render() {
    return (
      <span class="v-reload-data" title="刷新" onClick={this.clickHandle}>
        <i class="iconfont icon-reload" />
      </span>
    );
  }
};
