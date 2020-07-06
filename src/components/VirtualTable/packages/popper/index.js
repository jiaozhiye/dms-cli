/*
 * @Author: 焦质晔
 * @Date: 2020-07-06 08:30:35
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-06 08:43:35
 */
import Popper from './popper.js';
import PropTypes from '../../../_utils/vue-types';
import clickOutside from '../../../_utils/click-outside';
import { on, off } from '../../../_utils/tool';

export default {
  name: 'Popper',
  directives: {
    clickOutside
  },
  inject: ['$$table'],
  props: {
    trigger: PropTypes.oneOf(['clickToOpen', 'clickToToggle', 'hover', 'focus']).def('hover'),
    rootClass: PropTypes.string,
    transition: PropTypes.string,
    delayOnMouseOver: PropTypes.number.def(10),
    delayOnMouseOut: PropTypes.number.def(10),
    enterActiveClass: PropTypes.string,
    leaveActiveClass: PropTypes.string,
    boundariesSelector: PropTypes.string,
    reference: PropTypes.any,
    forceShow: PropTypes.bool.def(false),
    appendToBody: PropTypes.bool.def(true),
    visibleArrow: PropTypes.bool.def(false),
    stopPropagation: PropTypes.bool.def(true),
    preventDefault: PropTypes.bool.def(false),
    options: PropTypes.object.def({}),
    disabled: PropTypes.bool.def(false),
    containerStyle: PropTypes.object.def({})
  },
  data() {
    return {
      referenceElm: null,
      popperJS: null,
      showPopper: false,
      currentPlacement: '',
      popperOptions: {
        placement: 'bottom',
        gpuAcceleration: false // 使用 left/top 定位
      }
    };
  },
  computed: {
    $tableBody() {
      return this.$$table?.$$tableBody?.$el ?? null;
    }
  },
  watch: {
    showPopper(value) {
      if (value) {
        this.$emit('show', value);
        this.updatePopper();
      } else {
        this.$emit('hide', value);
      }
    },
    forceShow: {
      handler(value) {
        this[value ? 'doShow' : 'doClose']();
      },
      immediate: true
    },
    disabled(value) {
      if (value) {
        this.doClose();
      }
    }
  },
  created() {
    this.appendedArrow = false;
    this.appendedToBody = false;
    this.popperOptions = Object.assign(this.popperOptions, this.options);
  },
  mounted() {
    this.referenceElm = this.reference || this.$slots.reference[0].elm;
    this.popper = this.$slots.default[0].elm;
    this.popperElm = this.popper;
    this.popperElmCls = 'el-picker-panel';
    // 事件绑定
    switch (this.trigger) {
      case 'clickToOpen':
        on(this.referenceElm, 'click', this.doShow);
        // on(document, 'click', this.handleDocumentClick);
        break;
      case 'clickToToggle':
        on(this.referenceElm, 'click', this.doToggle);
        // on(document, 'click', this.handleDocumentClick);
        break;
      case 'hover':
        on(this.referenceElm, 'mouseover', this.onMouseOver);
        on(this.popper, 'mouseover', this.onMouseOver);
        on(this.referenceElm, 'mouseout', this.onMouseOut);
        on(this.popper, 'mouseout', this.onMouseOut);
        break;
      case 'focus':
        on(this.referenceElm, 'focus', this.onMouseOver);
        on(this.popper, 'focus', this.onMouseOver);
        on(this.referenceElm, 'blur', this.onMouseOut);
        on(this.popper, 'blur', this.onMouseOut);
        break;
    }
    on(this.popper, 'click', this.stopEventBubble);
    if (this.$tableBody) {
      on(this.$tableBody, 'mousedown', this.onMouseDown);
    }
  },
  destroyed() {
    this.destroyPopper();
  },
  methods: {
    doToggle(ev) {
      if (this.stopPropagation) {
        ev.stopPropagation();
      }
      if (this.preventDefault) {
        ev.preventDefault();
      }
      if (!this.forceShow) {
        this.showPopper = !this.showPopper;
      }
    },
    doShow() {
      this.showPopper = true;
    },
    doClose() {
      this.showPopper = false;
    },
    createPopper() {
      this.$nextTick(() => {
        if (this.visibleArrow) {
          this.appendArrow(this.popper);
        }
        if (this.appendToBody && !this.appendedToBody) {
          this.appendedToBody = true;
          document.body.appendChild(this.popper.parentElement);
        }
        if (this.popperJS && this.popperJS.destroy) {
          this.popperJS.destroy();
        }
        if (this.boundariesSelector) {
          const boundariesElement = document.querySelector(this.boundariesSelector);
          if (boundariesElement) {
            this.popperOptions.modifiers = Object.assign({}, this.popperOptions.modifiers);
            this.popperOptions.modifiers.preventOverflow = Object.assign({}, this.popperOptions.modifiers.preventOverflow);
            this.popperOptions.modifiers.preventOverflow.boundariesElement = boundariesElement;
          }
        }
        this.popperOptions.onCreate = () => {
          this.$nextTick(this.updatePopper);
        };
        this.popperJS = new Popper(this.referenceElm, this.popper, this.popperOptions);
      });
    },
    destroyPopper() {
      // 事件解绑
      off(this.referenceElm, 'click', this.doShow);
      // off(document, 'click', this.handleDocumentClick);
      off(this.referenceElm, 'click', this.doToggle);
      // off(document, 'click', this.handleDocumentClick);
      off(this.referenceElm, 'mouseover', this.onMouseOver);
      off(this.popper, 'mouseover', this.onMouseOver);
      off(this.referenceElm, 'mouseout', this.onMouseOut);
      off(this.popper, 'mouseout', this.onMouseOut);
      off(this.referenceElm, 'focus', this.onMouseOver);
      off(this.popper, 'focus', this.onMouseOver);
      off(this.referenceElm, 'blur', this.onMouseOut);
      off(this.popper, 'blur', this.onMouseOut);
      off(this.popper, 'click', this.stopEventBubble);
      if (this.$tableBody) {
        off(this.$tableBody, 'mousedown', this.onMouseDown);
      }
      this.doClose();
      this.doDestroy();
    },
    appendArrow(element) {
      if (this.appendedArrow) return;
      this.appendedArrow = true;
      const arrow = document.createElement('div');
      arrow.setAttribute('x-arrow', '');
      arrow.className = 'popper__arrow';
      element.appendChild(arrow);
    },
    updatePopper() {
      this.popperJS ? this.popperJS.scheduleUpdate() : this.createPopper();
    },
    onMouseOver() {
      clearTimeout(this._timer);
      this._timer = setTimeout(() => this.doShow(), this.delayOnMouseOver);
    },
    onMouseOut() {
      clearTimeout(this._timer);
      this._timer = setTimeout(() => this.doClose(), this.delayOnMouseOut);
    },
    onMouseDown(ev) {
      ev.target === this.$tableBody && this.handleDocumentClick(ev);
    },
    stopEventBubble(ev) {
      ev.stopPropagation();
    },
    handleDocumentClick(e) {
      if (
        !this.$el ||
        !this.referenceElm ||
        this.elementContains(this.$el, e.target) ||
        this.elementContains(this.referenceElm, e.target) ||
        !this.popper ||
        this.elementContains(this.popper, e.target)
      ) {
        return;
      }
      if (this.forceShow) {
        return;
      }
      this.doClose();
    },
    elementContains(elm, otherElm) {
      if (typeof elm.contains === 'function') {
        return elm.contains(otherElm);
      }
      return false;
    },
    doDestroy() {
      if (this.showPopper) return;
      if (this.popperJS) {
        this.popperJS.destroy();
        this.popperJS = null;
      }
      if (this.appendedToBody) {
        this.appendedToBody = false;
        document.body.removeChild(this.popper.parentElement);
      }
    }
  },
  render() {
    const { transition: transitionName, disabled, showPopper, rootClass, containerStyle, $slots } = this;
    return (
      <span v-clickOutside={this.doClose}>
        <transition name={transitionName} duration={200} onAfterLeave={this.doDestroy}>
          <span ref="popper" v-show={!disabled && showPopper} class={rootClass} style={containerStyle}>
            {$slots[`default`]}
          </span>
        </transition>
        {$slots[`reference`]}
      </span>
    );
  }
};
