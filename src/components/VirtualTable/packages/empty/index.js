/*
 * @Author: 焦质晔
 * @Date: 2020-03-08 14:47:28
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-19 19:24:16
 */
import EmptyEle from './element';

export default {
  name: 'EmptyContent',
  inject: ['$$table'],
  computed: {
    styles() {
      const { layout } = this.$$table;
      return {
        top: `${layout.headerHeight}px`,
        height: `${layout.viewportHeight}px`
      };
    }
  },
  render() {
    return (
      <div class="v-table--empty-placeholder" style={this.styles}>
        <div class="v-table--empty-content">
          <EmptyEle />
        </div>
      </div>
    );
  }
};
