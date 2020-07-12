/*
 * @Author: 焦质晔
 * @Date: 2020-04-17 22:37:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-07 09:34:54
 */
import { mapState, mapActions } from 'vuex';

import '@/assets/css/style.scss';
import '@/assets/css/iconfont.scss';

export default {
  name: 'App',
  computed: {
    ...mapState('app', ['theme'])
  },
  created() {
    const localTheme = localStorage.getItem('theme');
    if (localTheme && localTheme !== this.theme) {
      this.createThemeColor(localTheme);
    }
  },
  mounted() {
    window.addEventListener('message', this.messageEventHandle, false);
  },
  destroyed() {
    window.removeEventListener('message', this.messageEventHandle);
  },
  methods: {
    ...mapActions('app', ['createElementSize', 'createThemeColor']),
    messageEventHandle({ data }) {
      if (typeof data !== 'object') return;
      if (data.type === 'lang') {
        this.$i18n.locale = data.data;
      }
      if (data.type === 'size') {
        this.createElementSize(data.data);
      }
      if (data.type === 'theme') {
        this.createThemeColor(data.data);
      }
    }
  },
  render() {
    return <router-view />;
  }
};
