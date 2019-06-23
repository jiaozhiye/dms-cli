<template>
  <div class="menu-list">
    <div class="search">
      <div class="top">
        <el-autocomplete
          v-model="menuPath"
          value-key="title"
          :fetch-suggestions="querySearch"
          placeholder="请输入菜单名称/拼音头"
          @select="handleSelect"
        >
          <i class="el-icon-edit el-input__icon" slot="suffix"></i>
          <template slot-scope="{ item }">
            <span class="name">{{ item.title }}</span>
          </template>
        </el-autocomplete>
      </div>
    </div>
    <div class="collect">
      <el-tabs tab-position="right" style="height: 100%">
        <el-tab-pane key="k1" label="我的收藏" lazy>
          <div class="cont">我的收藏</div>
        </el-tab-pane>
        <el-tab-pane key="k2" label="常用导航" lazy>
          <div class="cont">常用导航</div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="main">
      <el-tabs tab-position="right" style="height: 100%">
        <el-tab-pane v-for="item in menu" :key="item.key" :label="item.title" lazy>
          <div class="column-wrap">
            <div v-for="sub in item.children" :key="sub.key" class="box">
              <h4>{{ sub.title }}</h4>
              <ul>
                <li v-for="x in sub.children" :key="x.key">
                  <router-link :to="x.key" @click.native="clickHandle">{{ x.title }}</router-link>
                </li>
              </ul>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MenuList',
  props: {
    menu: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      menuPath: '',
      list: this.formateData(this.menu)
    };
  },
  methods: {
    formateData(list) {
      const res = [];
      list.forEach(x => {
        if (Array.isArray(x.children)) {
          res.push(...this.formateData(x.children));
        } else {
          res.push(x);
        }
      });
      return res;
    },
    querySearch(queryString = '', cb) {
      const res = queryString ? this.list.filter(this.createFilter(queryString)) : this.list;
      cb(res);
    },
    createFilter(queryString) {
      return state => {
        const str = `${state.title}|${state.pyt}`;
        return str.toLowerCase().includes(queryString.toLowerCase());
      };
    },
    handleSelect(item) {
      this.$router.push({ path: item.key });
      this.clickHandle();
      setTimeout(() => {
        this.menuPath = '';
      }, 500);
    },
    clickHandle() {
      setTimeout(() => {
        this.$parent.close();
      }, 200);
    }
  },
  mounted() {
    console.log(this.list);
  }
};
</script>

<style lang="less">
.menu-list {
  height: 100%;
  &::after {
    content: '';
    position: absolute;
    width: 150px;
    height: 100%;
    right: 0;
    top: 0;
    background: @asideBgColor;
  }
  .search {
    height: 130px;
    .top {
      padding: 60px 0 0 100px;
      .el-autocomplete {
        width: 300px;
      }
    }
  }
  .collect {
    height: 150px;
    .cont {
      margin-left: 30px;
      color: #fff;
    }
  }
  .main {
    .column-wrap {
      column-count: 2;
      .box {
        margin: 0 0 30px 30px;
        -webkit-column-break-inside: avoid;
        break-inside: avoid;
        h4 {
          padding: 10px 0;
          color: #fff;
          line-height: 20px;
        }
        ul {
          li {
            line-height: 30px;
            a {
              font-size: 12px;
              color: #fff;
            }
          }
        }
      }
    }
  }
  .is-right {
    width: 151px;
  }
  .el-tabs__nav-wrap {
    &::after {
      display: none;
    }
    .el-tabs__item {
      color: #fff;
      &.is-active {
        color: @primaryColor;
      }
    }
  }
}
</style>