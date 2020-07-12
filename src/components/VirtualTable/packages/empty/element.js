/*
 * @Author: 焦质晔
 * @Date: 2020-05-19 19:15:37
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-07 15:01:27
 */
import SvgIcon from '../../../SvgIcon';
import config from '../config';

export default {
  name: 'EmptyEle',
  render() {
    return (
      <div class="v-empty--wrapper">
        <SvgIcon class="icon" icon-class="empty" />
        <span class="text">{config.emptyText()}</span>
      </div>
    );
  }
};
