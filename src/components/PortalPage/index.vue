<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-12-21 20:08:02
 **/
import addEventListener from 'add-dom-event-listener';
import Spin from '@/components/Spin/Spin';

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
    height: {
      type: [Number, String],
      default: '300px'
    }
  },
  data() {
    return {
      isLogin: false,
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
      // 判断 Portal 系统是否已登录
      const mark = sessionStorage.getItem('portal');
      this.bindLoadPageEvent();
      if (mark === '1') {
        this.isLogin = true;
      } else {
        this.bindLoginEvent();
        this.doLogin();
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
        sessionStorage.setItem('portal', '1');
        this.isLogin = true;
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
    const { method, loginUrl, loginParams, pageUrl, height, isLogin, loading } = this;
    return (
      <div class="portal">
        <form ref="form" class="form" target="tIframe" method={method} action={loginUrl}>
          {this.createFormItem(loginParams)}
        </form>
        <iframe ref="tIframe" name="tIframe" class="t-iframe" />
        <Spin spinning={loading} tip="Portal Loading...">
          <iframe ref="sIframe" src={isLogin ? pageUrl : null} class="s-iframe" style={{ height: this.calcPanelSize(height) }} />
        </Spin>
      </div>
    );
  }
};
</script>

<style lang="less" scoped>
.portal {
  width: 100%;
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
  }
}
</style>
