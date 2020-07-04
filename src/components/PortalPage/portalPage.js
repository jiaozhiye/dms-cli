/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-06-15 10:19:04
 **/
import addEventListener from 'add-dom-event-listener';
import Cookies from 'js-cookie';
import PropTypes from '../_utils/vue-types';
import PrefixCls from '../_utils/mixins/prefix-cls';
import Spin from '../Spin';

export default {
  name: 'PortalPage',
  mixins: [PrefixCls],
  props: {
    method: PropTypes.string.def('POST'),
    loginUrl: PropTypes.string.def('').isRequired,
    loginParams: PropTypes.object.def({}).isRequired,
    pageUrl: PropTypes.string.def('').isRequired,
    containerStyle: PropTypes.object.def({})
  },
  data() {
    return {
      isLogined: false,
      loading: false
    };
  },
  mounted() {
    this.initial();
  },
  destroyed() {
    this.tIframeEvent && this.tIframeEvent.remove();
    this.sIframeEvent && this.sIframeEvent.remove();
  },
  methods: {
    initial() {
      this.bindLoadPageEvent();
      // 判断 Portal 系统是否已登录
      if (Cookies.get('portal') === '1') {
        this.isLogined = true;
      } else {
        this.bindLoginEvent();
        setTimeout(() => this.doLogin());
      }
    },
    doLogin() {
      this.$refs['form'].submit();
    },
    bindLoadPageEvent() {
      this.loading = true;
      this.sIframeEvent = addEventListener(this.$refs['sIframe'], 'load', ev => {
        this.loading = false;
        this.$emit('success');
      });
    },
    bindLoginEvent() {
      this.tIframeEvent = addEventListener(this.$refs['tIframe'], 'load', ev => {
        Cookies.set('portal', '1', { expires: new Date(new Date().getTime() + 24 * 60 * 1000) });
        this.isLogined = true;
      });
    },
    createFormItem(data) {
      const res = [];
      for (let key in data) {
        const Node = <input key={key} type="hidden" name={key} value={data[key]} />;
        res.push(Node);
      }
      return res;
    }
  },
  render() {
    const { method, loginUrl, loginParams, pageUrl, containerStyle, isLogined, loading } = this;
    const prefixCls = this.getPrefixCls('portal--wrapper');
    const cls = {
      [prefixCls]: true
    };
    return (
      <div class={cls} style={containerStyle}>
        <form ref="form" class="form" target="form-target" method={method} action={loginUrl}>
          {this.createFormItem(loginParams)}
        </form>
        <iframe ref="tIframe" name="form-target" class="t-iframe" />
        <Spin spinning={loading} tip="Portal Loading..." containerStyle={{ height: `100%` }}>
          <iframe ref="sIframe" src={isLogined ? pageUrl : null} class="s-iframe" style={containerStyle} />
        </Spin>
      </div>
    );
  }
};
