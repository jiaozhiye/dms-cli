<template>
  <div>
    <UploadCropper
      action-url="/api/basedata/upload"
      :initial-value="form.imgPath"
      :fixed-size="[4, 5]"
      @success="handler"
    />
  </div>
</template>

<script>
import axios from 'axios';
import UploadCropper from '@/components/UploadCropper/UploadCropper';

export default {
  data() {
    return {
      form: {
        imgPath: ''
      }
    };
  },
  methods: {
    handler(val) {
      console.log(val);
      this.form.imgPath = val;
    }
  },
  components: {
    UploadCropper
  }
};
</script>

<style lang="less">
</style>
