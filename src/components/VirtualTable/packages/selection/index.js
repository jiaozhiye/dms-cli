/*
 * @Author: 焦质晔
 * @Date: 2020-03-06 12:05:16
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-03-06 12:22:21
 */
import Radio from '../radio';
import Checkbox from '../checkbox';

export default {
  name: 'Selection',
  props: ['column', 'record'],
  methods: {
    renderRadio() {
      return <Radio />;
    },
    renderCheckbox() {
      return <Checkbox />;
    }
  },
  render() {
    const { type } = this.column;
    return type === 'radio' ? this.renderRadio() : this.renderCheckbox();
  }
};
