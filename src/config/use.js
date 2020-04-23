/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-23 23:31:08
 */
import Vue from 'vue';
import ElementUI from 'element-ui';
// 自定义主题
import '@/assets/css/element-variables.scss';

const APP_ENV = (function(env) {
  if (env === 'development') {
    // ...
  } else {
    console.log = console.warn = console.info = () => {};
  }
  return { env };
})(process.env.NODE_ENV);

// 全局设置 ElementUI
Vue.use(ElementUI, { size: 'small', zIndex: 1000 });

// 全局挂载组件
import SvgIcon from '@/components/SvgIcon';
Vue.use(SvgIcon);

// 顶部搜索组件
import TopFilter from '@/components/TopFilter';
Vue.use(TopFilter);

// 表单组件
import FormPanel from '@/components/FormPanel';
Vue.use(FormPanel);

// Table 组件
import FilterTable from '@/components/BaseTable';
Vue.use(FilterTable);

// VirtualTable 组件
import VirtualTable from '@/components/VirtualTable';
Vue.use(VirtualTable);

// 抽屉组件
import Drawer from '@/components/Drawer';
Vue.use(Drawer);

// 对话框组件
import BaseDialog from '@/components/BaseDialog';
Vue.use(BaseDialog);

// 懒加载的选项卡组件
import LazyLoadTab from '@/components/LazyLoadTab';
Vue.use(LazyLoadTab);

// 打印组件
import BasePrint from '@/components/BasePrint';
Vue.use(BasePrint);

// 多功能按钮组件
import MultiuseButton from '@/components/MultiuseButton';
Vue.use(MultiuseButton);

// 按钮组容器组件
import ButtonArea from '@/components/ButtonArea';
Vue.use(ButtonArea);

// 面板锚点组件
import Anchor from '@/components/Anchor';
Vue.use(Anchor);

// 布局分隔符组件
import BreakSpace from '@/components/BreakSpace';
Vue.use(BreakSpace);

// 加载中组件
import Spin from '@/components/Spin';
Vue.use(Spin);

// 富文本编辑器组件
import Tinymce from '@/components/Tinymce';
Vue.use(Tinymce);

// 多功能选项卡组件
import SuperTabs from '@/components/SuperTabs';
Vue.use(SuperTabs);

// 计数动画组件
import CountUp from '@/components/CountUp';
Vue.use(CountUp);

// 图片裁剪、压缩组件
import UploadCropper from '@/components/UploadCropper';
Vue.use(UploadCropper);

// 文件上传组件
import UploadFile from '@/components/UploadFile';
Vue.use(UploadFile);

// 下载组件
import DownloadFile from '@/components/DownloadFile';
Vue.use(DownloadFile);

// 导出 excel/csv 组件
import JsonToExcel from '@/components/JsonToExcel';
Vue.use(JsonToExcel);

// 浏览器 PDF 打印组件
import WebPrint from '@/components/WebPrint';
Vue.use(WebPrint);
