<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-06-29 08:42:09
 **/
export default {
  name: 'MenuFold',
  props: {
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isCollapse: this.collapsed
    };
  },
  methods: {
    clickHandler() {
      this.isCollapse = !this.isCollapse;
      this.$emit('change', this.isCollapse);
    }
  },
  render() {
    const cls = [this.isCollapse ? `el-icon-s-unfold` : `el-icon-s-fold`];
    return (
      <span class="menu-fold" title={this.isCollapse ? this.$t('header.unfold') : this.$t('header.fold')} onClick={this.clickHandler}>
        <i class={cls} />
      </span>
    );
  }
};
</script>

<style lang="scss" scoped>
.menu-fold {
  display: inline-block;
  font-size: 24px;
  line-height: 56px;
  padding: 0 15px;
  cursor: pointer;
  transition: color 0.3s ease;
  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
}
</style>
