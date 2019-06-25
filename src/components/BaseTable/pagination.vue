<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-05-09 10:00:00
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-05-09 10:00:00
 **/
export default {
  name: 'pagination',
  props: {
    pagination: {
      type: Object,
      required: true
    },
    onPageChange: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {};
  },
  methods: {
    handleCurrentChange(val) {
      const { pageSize } = this.pagination;
      this.pagination.current = val;
      this.onPageChange({ pageNum: val, pageSize });
    }
  },
  render() {
    const {
      pagination: { current, pageSize, total }
    } = this;
    return (
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next, jumper"
        current-page={current}
        page-size={pageSize}
        total={total}
        on-current-change={this.handleCurrentChange}
      />
    );
  }
};
</script>

<style lang="less" scoped>
.pagination {
  padding: 10px 0;
  text-align: right;
}
</style>
