<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-05-10 17:02:16
 **/
import { mapState } from 'vuex';

export default {
  name: 'Breadcrumb',
  computed: {
    ...mapState('app', ['navList']),
    // breadcrumbs() {
    //   return this.$route.matched
    //     .map(x => {
    //       let { path: key, meta } = x;
    //       let { title = '', breadcrumb = true } = meta;
    //       if (!key) key = '/';
    //       return { key, title, breadcrumb };
    //     })
    //     .filter(x => x.breadcrumb && !x.key.startsWith('/redirect'));
    // },
    breadcrumbs() {
      const { path } = this.$route;
      return path === '/home' ? [this.deepMapRoutes(this.$router.options.routes, 'path', path).meta.title] : this.matchRoutes(this.navList, path);
    }
  },
  methods: {
    matchRoutes(menus, path) {
      let res = [];
      let target = this.deepMapRoutes(menus, 'key', path) || {};
      if (target.parentKey) {
        res = this.matchRoutes(menus, target.parentKey);
      }
      if (target.title) {
        res.push(target.title);
      }
      return res;
    },
    deepMapRoutes(arr, key, mark) {
      let res = null;
      for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i].children)) {
          res = this.deepMapRoutes(arr[i].children, key, mark);
        }
        if (res) {
          return res;
        }
        if (arr[i][key] === mark) {
          return arr[i];
        }
      }
      return res;
    }
  },
  render() {
    return (
      <div class="breadcrumb-wrap">
        <span class="location">{this.$t('dreadcrumb.location')}&nbsp;:&nbsp;</span>
        <el-breadcrumb separator="/">
          {this.breadcrumbs.map(x => (
            <el-breadcrumb-item key={x}>{x}</el-breadcrumb-item>
          ))}
        </el-breadcrumb>
      </div>
    );
  }
};
</script>

<style lang="scss" scoped>
.breadcrumb-wrap {
  display: flex;
  padding: $modulePadding $modulePadding 0;
  .location {
    line-height: 1;
  }
  /deep/ .el-breadcrumb__item {
    .el-breadcrumb__inner {
      color: $textColor;
    }
    .is-link {
      color: $textColor;
      font-weight: normal;
      &:hover {
        color: $primaryColor;
      }
    }
    &:last-child .is-link {
      color: $disabledColor;
    }
  }
}
</style>
