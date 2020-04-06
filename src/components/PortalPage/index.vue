<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-06 12:12:51
 **/
import addEventListener from 'add-dom-event-listener';
import Spin from '@/components/Spin';
import Cookies from 'js-cookie';

export default {
  name: 'PortalPage',
  props: {
    method: {
      type: String,
      default: 'POST'
    },
    loginUrl: {
      type: String,
      default: '',
      required: true
    },
    loginParams: {
      type: Object,
      default: () => ({}),
      required: true
    },
    pageUrl: {
      type: String,
      default: '',
      required: true
    },
    containerStyle: {
      type: Object,
      default: () => ({})
    }
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
  beforeDestroy() {
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
        this.$emit('onSuccess');
      });
    },
    bindLoginEvent() {
      this.tIframeEvent = addEventListener(this.$refs['tIframe'], 'load', ev => {
        Cookies.set('portal', '1', { expires: new Date(new Date().getTime() + 24 * 60 * 1000) });
        this.isLogined = true;
      });
    },
    calcPanelSize(val) {
      return Number(val) > 0 ? `${val}px` : val;
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
    return (
      <div class="portal">
        <form ref="form" class="form" target="form-target" method={method} action={loginUrl}>
          {this.createFormItem(loginParams)}
        </form>
        <iframe ref="tIframe" name="form-target" class="t-iframe" />
        <Spin spinning={loading} tip="Portal Loading...">
          <iframe ref="sIframe" src={isLogined ? pageUrl : null} class="s-iframe" style={containerStyle} />
        </Spin>
      </div>
    );
  }
};
</script>

<style lang="less" scoped>
.portal {
  width: 100%;
  height: 100%;
  .form {
    visibility: hidden;
    height: 0;
    overflow: hidden;
    display: none;
  }
  .t-iframe {
    display: none;
  }
  .s-iframe {
    display: block;
    border: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
