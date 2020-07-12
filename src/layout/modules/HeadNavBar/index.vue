<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-07 09:01:35
 **/
import config from '@/config';
import ScreenFull from '../ScreenFull';
import ThemePicker from '../ThemePicker';
import LangSelect from '../LangSelect';
import SizeSelect from '../SizeSelect';
import NoticeCenter from '../NoticeCenter';
import UserCenter from '@/pages/userCenter/index';

export default {
  name: 'HeadNavBar',
  render() {
    return (
      <div class="actions">
        {config.showScreenFull && <ScreenFull />}
        {config.showCustomTheme && <ThemePicker />}
        {config.showLangSelect && <LangSelect />}
        {config.showSizeSelect && <SizeSelect />}
        {config.showNotification && <NoticeCenter />}
        <UserCenter />
      </div>
    );
  }
};
</script>

<style lang="scss" scoped>
.actions {
  height: 100%;
  margin-right: $moduleMargin;
  display: flex;
  align-items: center;
}
</style>
