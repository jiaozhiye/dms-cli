<template>
  <div class="v-screen">
    <h2 class="v-screen--toper-title">一汽大众EP数据平台智能监控系统</h2>
    <div class="v-screen--wrapper">
      <div class="v-screen--wrapper-left">
        <div class="chart animate__animated animate__animated.animate__delay-5s animate__fadeInUp">1</div>
        <div class="chart animate__animated animate__fadeInUp">2</div>
      </div>
      <div class="v-screen--wrapper-middle">
        <div class="chart map">5</div>
        <div class="chart">6</div>
      </div>
      <div class="v-screen--wrapper-right">
        <div class="chart">3</div>
        <div class="chart">4</div>
      </div>
    </div>
  </div>
</template>

<script>
import './assets/animate.css';
import './assets/index.scss';

export default {
  name: 'BigScreen'
};
</script>
