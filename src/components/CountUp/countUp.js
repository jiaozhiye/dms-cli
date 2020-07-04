/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-06-20 10:12:47
 **/
import { CountUp } from 'countup.js';
import PropTypes from '../_utils/vue-types';
import { isFunction } from 'lodash';

export default {
  name: 'CountUp',
  props: {
    endVal: PropTypes.number.isRequired,
    delay: PropTypes.number.def(0),
    options: PropTypes.object.def({})
  },
  data() {
    this.instance = null;
    return {};
  },
  watch: {
    endVal(value) {
      if (this.instance && isFunction(this.instance.update)) {
        this.instance.update(value);
      }
    }
  },
  mounted() {
    this.create();
  },
  destroyed() {
    this.instance = null;
  },
  methods: {
    create() {
      this.instance = new CountUp(this.$refs.countup, this.endVal, this.options) || { error: true };
      if (this.instance.error) return;
      if (this.delay < 0) {
        return this.$emit('ready', this.instance, CountUp);
      }
      setTimeout(() => this.instance.start(() => this.$emit('ready', this.instance, CountUp)), this.delay);
    },
    printValue(value) {
      if (this.instance && isFunction(this.instance.printValue)) {
        return this.instance.printValue(value);
      }
    },
    start(callback) {
      if (this.instance && isFunction(this.instance.start)) {
        return this.instance.start(callback);
      }
    },
    pauseResume() {
      if (this.instance && isFunction(this.instance.pauseResume)) {
        return this.instance.pauseResume();
      }
    },
    reset() {
      if (this.instance && isFunction(this.instance.reset)) {
        return this.instance.reset();
      }
    },
    update(newEndVal) {
      if (this.instance && isFunction(this.instance.update)) {
        return this.instance.update(newEndVal);
      }
    }
  },
  render() {
    return <span ref="countup" />;
  }
};
