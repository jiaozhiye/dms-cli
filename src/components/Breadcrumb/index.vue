<script>
export default {
  name: 'Breadcrumb',
  computed: {
    breadcrumbs() {
      return this.$route.matched
        .map(x => {
          let { path: key, meta } = x;
          let { title = '', breadcrumb = true } = meta;
          if (!key) key = '/';
          return { key, title, breadcrumb };
        })
        .filter(x => x.breadcrumb && !this.isRedirect(x.key));
    }
  },
  methods: {
    // 重定向刷新页面
    isRedirect(path) {
      return path.startsWith('/redirect');
    }
  },
  render() {
    return (
      <div class="breadcrumb-wrap">
        <span>位置导航：</span>
        <el-breadcrumb separator="/">
          {this.breadcrumbs.map(x => (
            <el-breadcrumb-item key={x.key} to={{ path: x.key }}>
              {x.title}
            </el-breadcrumb-item>
          ))}
        </el-breadcrumb>
      </div>
    );
  }
};
</script>

<style lang="less">
.breadcrumb-wrap {
  display: flex;
  padding: @modulePadding;
  .el-breadcrumb__item {
    .is-link {
      color: @textColor;
      font-weight: 400;
      &:hover {
        color: @primaryColor;
      }
    }
    &:last-child .is-link {
      color: @disabledColor;
    }
  }
}
</style>
