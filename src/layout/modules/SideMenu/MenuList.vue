<template>
  <div class="menu-list">
    <div class="search">
      <div class="top">
        <el-autocomplete v-model="menuPath" value-key="title" :fetch-suggestions="querySearch" :placeholder="$t('sidebar.allNavPlaceholder')" @select="handleSelect">
          <i slot="prefix" class="el-icon-search el-input__icon" />
          <template slot-scope="{ item }">
            <span class="name">{{ item.title }}</span>
          </template>
        </el-autocomplete>
      </div>
    </div>
    <div class="main">
      <el-tabs tab-position="right">
        <el-tab-pane v-for="item in packMenuList" :key="item.key" :label="item.title" lazy>
          <div class="column-wrap">
            <div v-for="sub in item.children" :key="sub.key" class="box">
              <h4>{{ sub.title }}</h4>
              <ul>
                <li v-for="x in sub.children" :key="x.key">
                  <i :class="[x.star ? 'el-icon-star-on' : 'el-icon-star-off']" @click.stop="starClickHandle(x.star, x.key, x.title)" />
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
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-06-20 10:48:52
 **/
import { mapState, mapActions } from 'vuex';
import { flatten } from 'lodash';
import { notifyAction } from '@/utils';
import pinyin, { STYLE_FIRST_LETTER } from '@/components/Pinyin/index';

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
        const pyt = flatten(pinyin(state.title, { style: STYLE_FIRST_LETTER })).join('');
        const str = `${state.title}|${pyt}`;
        return str.toLowerCase().includes(queryString.toLowerCase());
      };
    },
    handleSelect(item) {
      this.$router.push({ path: item.key }).catch(() => {});
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
        if (this.starMenuList.length >= 10) {
          return notifyAction(this.$t('information.maxStar', { total: 10 }), 'warning');
        }
        this.addStarMenuList({ key, title });
      } else {
        this.removeStarMenuList(key);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.menu-list {
  height: 100%;
  &::after {
    content: '';
    position: absolute;
    width: 150px;
    height: 100%;
    right: 0;
    top: 0;
    background: $menuBg;
  }
  /deep/ .search {
    height: 120px;
    .top {
      padding: 60px 0 0 100px;
      .el-autocomplete {
        width: 300px;
        .el-input__inner {
          color: #fff;
          font-size: $textSize;
          border-radius: 0;
          background: $allMenuBgColor;
          border: none;
          border-bottom: 1px solid #626466;
          &:-ms-input-placeholder {
            color: $menuText !important;
          }
        }
      }
    }
  }
  /deep/ .main {
    position: relative;
    height: calc(100% - 120px);
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
        .el-tabs__nav-wrap {
          padding: 0;
          .el-tabs__nav-scroll {
            overflow-y: auto;
            .el-tabs__nav {
              padding-bottom: $modulePadding;
            }
          }
          .el-tabs__item {
            padding: 0 0 0 15px;
            height: 34px;
            line-height: 34px;
            color: $menuText;
            &.is-active {
              font-weight: 700;
              color: #fff;
            }
          }
          &.is-right {
            width: 151px;
          }
          &::after {
            display: none;
          }
        }
      }
      .el-tabs__content {
        margin-right: 170px;
        .column-wrap {
          column-count: 2;
          column-gap: 0;
          .box {
            padding-left: 20px;
            padding-bottom: 10px;
            -webkit-column-break-inside: avoid;
            page-break-inside: avoid;
            break-inside: avoid;
            h4 {
              color: $menuText;
              font-weight: 700;
              line-height: 34px;
              border-bottom: 1px solid #626466;
            }
            ul {
              margin-top: 8px;
              li {
                line-height: 26px;
                i {
                  font-size: 14px;
                  cursor: pointer;
                }
                .el-icon-star-on {
                  color: $menuText;
                }
                .el-icon-star-off {
                  color: $menuText;
                }
                a {
                  font-size: $textSizeSecondary;
                  color: $menuText;
                  transition: all 0.3s ease;
                  &:hover {
                    color: $menuActiveText;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
