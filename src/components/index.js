/*
 * @Author: 焦质晔
 * @Date: 2020-05-23 11:48:57
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-08 13:45:49
 */
import './style';
import locale from './locale';

import { default as Anchor } from './Anchor';
import { default as BaseDialog } from './BaseDialog';
import { default as BasePrint } from './BasePrint';
import { default as BaseTable } from './BaseTable';
import { default as BreakSpace } from './BreakSpace';
import { default as ButtonArea } from './ButtonArea';
import { default as CountUp } from './CountUp';
import { default as DownloadFile } from './DownloadFile';
import { default as Drawer } from './Drawer';
import { default as FormPanel } from './FormPanel';
import { default as JsonToExcel } from './JsonToExcel';
import { default as MultiuseButton } from './MultiuseButton';
import { default as PortalPage } from './PortalPage';
import { default as SearchHelper } from './SearchHelper';
import { default as Spin } from './Spin';
import { default as SuperTabs } from './SuperTabs';
import { default as SvgIcon } from './SvgIcon';
import { default as Tinymce } from './Tinymce';
import { default as TopFilter } from './TopFilter';
import { default as UploadCropper } from './UploadCropper';
import { default as UploadFile } from './UploadFile';
import { default as VirtualScroll } from './VirtualScroll';
import { default as VirtualTable } from './VirtualTable';
import { default as WebPrint } from './WebPrint';

const components = [
  Anchor,
  BaseDialog,
  BasePrint,
  BaseTable,
  BreakSpace,
  ButtonArea,
  CountUp,
  DownloadFile,
  Drawer,
  FormPanel,
  JsonToExcel,
  MultiuseButton,
  PortalPage,
  SearchHelper,
  Spin,
  SuperTabs,
  SvgIcon,
  Tinymce,
  TopFilter,
  UploadCropper,
  UploadFile,
  VirtualScroll,
  VirtualTable,
  WebPrint
];

const install = function(Vue, opts = {}) {
  locale.use(opts.locale);
  locale.i18n(opts.i18n);
  Vue.prototype.$VDESIGN = {
    size: opts.size || 'default',
    prefixCls: opts.prefix || 'v',
    config: Object.assign({}, opts.config)
  };
  components.forEach(component => {
    component.install(Vue, opts);
  });
};

// istanbul ignore if
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  version: '1.0.0',
  locale: locale.use,
  i18n: locale.i18n,
  install,
  Anchor,
  BaseDialog,
  BasePrint,
  BaseTable,
  BreakSpace,
  ButtonArea,
  CountUp,
  DownloadFile,
  Drawer,
  FormPanel,
  JsonToExcel,
  MultiuseButton,
  SearchHelper,
  Spin,
  SuperTabs,
  SvgIcon,
  Tinymce,
  TopFilter,
  UploadCropper,
  UploadFile,
  VirtualScroll,
  VirtualTable,
  WebPrint
};
