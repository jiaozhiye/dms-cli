<template>
  <div class="logo">
    <router-link to="/" :title="title">
      <img :class="imgClassName" :src="imgUrl" />
    </router-link>
  </div>
</template>

<script>
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
  computed: {
    imgUrl() {
      return !this.collapsed ? logoEp : logo;
    },
    imgClassName() {
      const res = !this.collapsed ? `img1` : `img2`;
      return this.isInitial ? `${res} none` : res;
    }
  },
  data() {
    return {
      isInitial: true
    };
  },
  watch: {
    collapsed(val) {
      this.isInitial = false;
    }
  }
};
</script>

<style lang="less" scoped>
.logo {
  height: 60px;
  line-height: 58px;
  background-color: @logoBgColor;
  overflow: hidden;
  .router-link-active {
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
      margin-left: 12px;
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
    width: 40px;
  }
  100% {
    opacity: 1;
    width: 140px;
  }
}
@keyframes hide {
  0% {
    opacity: 0;
    width: 80px;
  }
  100% {
    opacity: 1;
    width: 40px;
  }
}
</style>
