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
          <i class="el-icon-search el-input__icon" slot="prefix"></i>
          <template slot-scope="{ item }">
            <span class="name">{{ item.title }}</span>
          </template>
        </el-autocomplete>
      </div>
    </div>
    <div class="collect">
      <el-tabs tab-position="right">
        <el-tab-pane key="k1" label="我的收藏" lazy>
          <div class="wrap">
            <h4>我的收藏</h4>
            <ul>
              <li v-for="item in starMenuList" :key="item.key">
                <router-link :to="item.key" @click.native="clickHandle">{{ item.title }}</router-link>
              </li>
            </ul>
          </div>
        </el-tab-pane>
        <el-tab-pane key="k2" label="常用导航" lazy>
          <div class="wrap">
            <h4>常用导航</h4>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="main">
      <el-tabs tab-position="right">
        <el-tab-pane v-for="item in packMenuList" :key="item.key" :label="item.title" lazy>
          <div class="column-wrap">
            <div v-for="sub in item.children" :key="sub.key" class="box">
              <h4>{{ sub.title }}</h4>
              <ul>
                <li v-for="x in sub.children" :key="x.key">
                  <i
                    :class="[x.star ? 'el-icon-star-on' : 'el-icon-star-off']"
                    @click.stop="starClickHandle(x.star, x.key, x.title)"
                  ></i>
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
import { mapState, mapActions } from 'vuex';
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
      menuPath: ''
    };
  },
  computed: {
    ...mapState('app', ['menuList', 'starMenuList']),
    packMenuList() {
      return this.createMenuList(this.menu);
    }
  },
  methods: {
    ...mapActions('app', ['addStarMenuList', 'removeStarMenuList']),
    createMenuList(list) {
      return list.map(x => {
        const t = { ...x };
        if (Array.isArray(x.children)) {
          t.children = this.createMenuList(x.children);
        }
        t.star = this.starMenuList.some(k => k.key === t.key);
        return t;
      });
    },
    querySearch(queryString = '', cb) {
      const res = queryString ? this.menuList.filter(this.createFilter(queryString)) : this.menuList;
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
    },
    starClickHandle(star, key, title) {
      if (!star) {
        if (this.starMenuList.length >= 9) {
          return this.$message.warning('最多只能收藏 9 个菜单');
        }
        this.addStarMenuList({ key, title });
      } else {
        this.removeStarMenuList(key);
      }
    }
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
    height: 120px;
    .top {
      padding: 60px 0 0 100px;
      .el-autocomplete {
        width: 300px;
        .el-input__inner {
          color: #fff;
          font-size: 14px;
          border-radius: 0;
          background: #001529;
          border: none;
          border-bottom: 1px solid #d9d9d9;
        }
      }
    }
  }
  .collect {
    height: 140px;
    .wrap {
      margin-left: 30px;
      color: #fff;
      h4 {
        padding: 10px 0;
        color: #7c93a8;
        font-weight: 700;
        line-height: 20px;
      }
      ul {
        display: flex;
        flex-wrap: wrap;
        li {
          width: 33%;
          line-height: 26px;
          a {
            font-size: 12px;
            color: #fff;
          }
        }
      }
    }
  }
  .main {
    position: relative;
    height: calc(100% - 120px - 140px);
    .el-tabs {
      height: 100%;
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      .el-tabs__header {
        position: absolute;
        right: 0;
        top: 0;
      }
      .el-tabs__content {
        margin-right: 150px;
        .column-wrap {
          column-count: 2;
          .box {
            margin: 0 0 30px 30px;
            -webkit-column-break-inside: avoid;
            break-inside: avoid;
            h4 {
              padding: 10px 0;
              color: #7c93a8;
              font-weight: 700;
              line-height: 20px;
            }
            ul {
              li {
                line-height: 26px;
                i {
                  font-size: 14px;
                  cursor: pointer;
                }
                .el-icon-star-on {
                  color: #fff;
                }
                .el-icon-star-off {
                  color: #7c93a8;
                }
                a {
                  font-size: 12px;
                  color: #fff;
                }
              }
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
