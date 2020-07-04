<template>
  <div class="logo">
    <router-link to="/" :title="title">
      <img :class="imgClassName" :src="imgUrl" />
    </router-link>
  </div>
</template>

<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-17 16:20:04
 **/
const logoEp = require('@/assets/img/logo_ep.png');
const logo = require('@/assets/img/logo.png');

export default {
  name: 'Logo',
  props: {
    title: {
      type: String,
      default: ''
    },
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isInitial: true
    };
  },
  computed: {
    imgUrl() {
      return !this.collapsed ? logoEp : logo;
    },
    imgClassName() {
      const res = !this.collapsed ? `img1` : `img2`;
      return this.isInitial ? `${res} none` : res;
    }
  },
  watch: {
    collapsed(val) {
      this.isInitial = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.logo {
  height: 56px;
  background-color: $logoBgColor;
  overflow: hidden;
  a {
    height: 100%;
    line-height: 54px;
    display: block;
    img {
      display: inline-block;
      vertical-align: middle;
    }
    .img1 {
      width: 140px;
      margin-left: 24px;
      animation: show 0.3s ease both;
    }
    .img2 {
      width: 140px;
      margin-left: 16px;
      animation: hide 0.3s ease both;
    }
    .none {
      animation: none;
    }
  }
}
@keyframes show {
  0% {
    opacity: 0;
    width: 30px;
  }
  100% {
    opacity: 1;
    width: 140px;
  }
}
@keyframes hide {
  0% {
    opacity: 0;
    width: 50px;
  }
  100% {
    opacity: 1;
    width: 30px;
  }
}
</style>
