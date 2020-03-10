<template>
  <component :is="tagName">
    <transition :name="transition" :duration="300" @after-leave="doDestroy">
      <span v-show="!disabled && showPopper" ref="popper" :class="rootClass">
        <slot>{{ content }}</slot>
      </span>
    </transition>
    <slot name="reference"></slot>
  </component>
</template>

<script>
/*
 * @Author: 焦质晔
 * @Date: 2020-03-09 18:07:04
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2020-03-09 18:07:04
 */
import Popper from './popper.js';

function on(element, event, handler) {
  if (element && event && handler) {
    document.addEventListener ? element.addEventListener(event, handler, false) : element.attachEvent('on' + event, handler);
  }
}

function off(element, event, handler) {
  if (element && event) {
    document.removeEventListener ? element.removeEventListener(event, handler, false) : element.detachEvent('on' + event, handler);
  }
}

export default {
  props: {
    tagName: {
      type: String,
      default: 'span'
    },
    trigger: {
      type: String,
      default: 'hover',
      validator: value => ['clickToOpen', 'clickToToggle', 'hover', 'focus'].indexOf(value) > -1
    },
    delayOnMouseOver: {
      type: Number,
      default: 10
    },
    delayOnMouseOut: {
      type: Number,
      default: 10
    },
    disabled: {
      type: Boolean,
      default: false
    },
    content: String,
    enterActiveClass: String,
    leaveActiveClass: String,
    boundariesSelector: String,
    reference: {},
    forceShow: {
      type: Boolean,
      default: false
    },
    dataValue: {
      default: null
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    visibleArrow: {
      type: Boolean,
      default: true
    },
    transition: {
      type: String,
      default: ''
    },
    stopPropagation: {
      type: Boolean,
      default: false
    },
    preventDefault: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default() {
        return {};
      }
    },
    rootClass: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      referenceElm: null,
      popperJS: null,
      showPopper: false,
      currentPlacement: '',
      popperOptions: {
        placement: 'bottom',
        modifiers: {
          computeStyle: {
            gpuAcceleration: false // 使用 left/top 定位
          }
        }
      }
    };
  },
  watch: {
    showPopper(value) {
      if (value) {
        this.$emit('show', this);
        if (this.popperJS) {
          this.popperJS.enableEventListeners();
        }
        this.updatePopper();
      } else {
        if (this.popperJS) {
          this.popperJS.disableEventListeners();
        }
        this.$emit('hide', this);
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
        this.showPopper = false;
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

    switch (this.trigger) {
      case 'clickToOpen':
        on(this.referenceElm, 'click', this.doShow);
        on(document, 'click', this.handleDocumentClick);
        on(document, 'mousedown', this.handleDocumentClick);
        break;
      case 'clickToToggle':
        on(this.referenceElm, 'click', this.doToggle);
        on(document, 'click', this.handleDocumentClick);
        on(document, 'mousedown', this.handleDocumentClick);
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
  },

  destroyed() {
    this.destroyPopper();
  },

  methods: {
    doToggle(event) {
      if (this.stopPropagation) {
        event.stopPropagation();
      }

      if (this.preventDefault) {
        event.preventDefault();
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

    doDestroy() {
      if (this.showPopper) {
        return;
      }

      if (this.popperJS) {
        this.popperJS.destroy();
        this.popperJS = null;
      }

      if (this.appendedToBody) {
        this.appendedToBody = false;
        document.body.removeChild(this.popper.parentElement);
      }
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
          this.$emit('created', this);
          this.$nextTick(this.updatePopper);
        };

        this.popperJS = new Popper(this.referenceElm, this.popper, this.popperOptions);
      });
    },

    destroyPopper() {
      off(this.referenceElm, 'click', this.doToggle);
      off(this.referenceElm, 'mouseup', this.doClose);
      off(this.referenceElm, 'mousedown', this.doShow);
      off(this.referenceElm, 'focus', this.doShow);
      off(this.referenceElm, 'blur', this.doClose);
      off(this.referenceElm, 'mouseout', this.onMouseOut);
      off(this.referenceElm, 'mouseover', this.onMouseOver);
      off(document, 'click', this.handleDocumentClick);
      off(document, 'mousedown', this.handleDocumentClick);

      this.showPopper = false;
      this.doDestroy();
    },

    appendArrow(element) {
      if (this.appendedArrow) {
        return;
      }

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
      this._timer = setTimeout(() => {
        this.showPopper = true;
      }, this.delayOnMouseOver);
    },

    onMouseOut() {
      clearTimeout(this._timer);
      this._timer = setTimeout(() => {
        this.showPopper = false;
      }, this.delayOnMouseOut);
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

      this.$emit('documentClick', this);

      if (this.forceShow) {
        return;
      }

      this.showPopper = false;
    },

    elementContains(elm, otherElm) {
      if (typeof elm.contains === 'function') {
        return elm.contains(otherElm);
      }

      return false;
    }
  }
};
</script>
