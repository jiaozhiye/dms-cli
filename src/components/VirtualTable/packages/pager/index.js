/*
 * @Author: 焦质晔
 * @Date: 2020-03-19 13:45:50
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-07-07 19:46:05
 */
import PropTypes from '../../../_utils/vue-types';
import config from '../config';
import Locale from '../locale/mixin';

export default {
  name: 'Pager',
  mixins: [Locale],
  props: {
    // 尺寸
    size: PropTypes.string,
    // 自定义布局
    layouts: PropTypes.array.def(['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']),
    // 当前页
    currentPage: PropTypes.number.def(config.pagination.currentPage || 1),
    // 每页大小
    pageSize: PropTypes.number.def(config.pagination.pageSize || 10),
    // 总条数
    total: PropTypes.number.def(0),
    // 显示页码按钮的数量
    pagerCount: PropTypes.number.def(7),
    // 每页大小选项列表
    pageSizes: PropTypes.array.def(config.pagination.sizes),
    // 列对其方式
    align: PropTypes.string.def('right'),
    // 带背景颜色
    background: PropTypes.bool.def(true),
    // 额外的组件渲染
    extraRender: PropTypes.func
  },
  computed: {
    vSize() {
      return this.size;
    },
    isSizes() {
      return this.layouts.some(name => name === 'Sizes');
    },
    pageCount() {
      return this.getPageCount(this.total, this.pageSize);
    },
    numList() {
      const len = this.pageCount > this.pagerCount ? this.pagerCount - 2 : this.pagerCount;
      const rest = [];
      for (let index = 0; index < len; index++) {
        rest.push(index);
      }
      return rest;
    },
    offsetNumber() {
      return Math.floor((this.pagerCount - 2) / 2);
    }
  },
  render(h) {
    const { vSize, align, extraRender } = this;
    const cls = [
      'v-pager',
      {
        [`size--${vSize}`]: vSize,
        [`align--${align}`]: align,
        'is--background': this.background
      }
    ];
    return (
      <div class={cls}>
        {typeof extraRender === 'function' && extraRender()}
        <div class="v-pager--wrapper">{this.layouts.map(name => this[`render${name}`](h))}</div>
      </div>
    );
  },
  methods: {
    // 上一页
    renderPrevPage(h) {
      return h(
        'span',
        {
          class: [
            'v-pager--prev-btn',
            {
              'is--disabled': this.currentPage <= 1
            }
          ],
          attrs: {
            title: this.t('table.pagination.prev')
          },
          on: {
            click: this.prevPage
          }
        },
        [
          h('i', {
            class: ['v-pager--btn-icon iconfont icon-left']
          })
        ]
      );
    },
    // 向上翻页
    renderPrevJump(h, tagName) {
      return h(
        tagName || 'span',
        {
          class: [
            'v-pager--jump-prev',
            {
              'is--fixed': !tagName,
              'is--disabled': this.currentPage <= 1
            }
          ],
          attrs: {
            title: this.t('table.pagination.jumpPrev')
          },
          on: {
            click: this.prevJump
          }
        },
        [
          tagName
            ? h(
                'i',
                {
                  class: ['v-pager--jump-more']
                },
                '•••'
              )
            : null,
          h('i', {
            class: ['v-pager--jump-icon iconfont icon-doubleleft']
          })
        ]
      );
    },
    // number
    renderNumber(h) {
      return h(
        'ul',
        {
          class: 'v-pager--btn-wrapper'
        },
        this.renderPageBtn(h)
      );
    },
    // jumpNumber
    renderJumpNumber(h) {
      return h(
        'ul',
        {
          class: 'v-pager--btn-wrapper'
        },
        this.renderPageBtn(h, true)
      );
    },
    // 向下翻页
    renderNextJump(h, tagName) {
      return h(
        tagName || 'span',
        {
          class: [
            'v-pager--jump-next',
            {
              'is--fixed': !tagName,
              'is--disabled': this.currentPage >= this.pageCount
            }
          ],
          attrs: {
            title: this.t('table.pagination.jumpNext')
          },
          on: {
            click: this.nextJump
          }
        },
        [
          tagName
            ? h(
                'i',
                {
                  class: ['v-pager--jump-more']
                },
                '•••'
              )
            : null,
          h('i', {
            class: ['v-pager--jump-icon iconfont icon-doubleright']
          })
        ]
      );
    },
    // 下一页
    renderNextPage(h) {
      return h(
        'span',
        {
          class: [
            'v-pager--next-btn',
            {
              'is--disabled': this.currentPage >= this.pageCount
            }
          ],
          attrs: {
            title: this.t('table.pagination.next')
          },
          on: {
            click: this.nextPage
          }
        },
        [
          h('i', {
            class: ['v-pager--btn-icon iconfont icon-right']
          })
        ]
      );
    },
    // sizes
    renderSizes(h) {
      return (
        <el-select
          size="mini"
          class="v-pager--sizes"
          value={this.pageSize}
          onInput={val => {
            this.pageSizeEvent(val);
          }}
        >
          {this.pageSizes.map(x => (
            <el-option key={x} label={`${x}${this.t('table.pagination.pagesize')}`} value={x} />
          ))}
        </el-select>
      );
    },
    // FullJump
    renderFullJump(h) {
      return this.renderJump(h, true);
    },
    // Jump
    renderJump(h, isFull) {
      return h(
        'span',
        {
          class: 'v-pager--jump'
        },
        [
          isFull
            ? h(
                'span',
                {
                  class: 'v-pager--goto-text'
                },
                this.t('table.pagination.goto')
              )
            : null,
          h('input', {
            class: 'v-pager--goto',
            domProps: {
              value: this.currentPage
            },
            attrs: {
              type: 'text',
              autocomplete: 'off'
            },
            on: {
              keydown: this.jumpKeydownEvent,
              blur: this.triggerJumpEvent
            }
          }),
          isFull
            ? h(
                'span',
                {
                  class: 'v-pager--classifier-text'
                },
                this.t('table.pagination.pageClassifier')
              )
            : null
        ]
      );
    },
    // PageCount
    renderPageCount(h) {
      return h(
        'span',
        {
          class: 'v-pager--count'
        },
        [
          h('span', {
            class: 'v-pager--separator'
          }),
          h('span', this.pageCount)
        ]
      );
    },
    // total
    renderTotal(h) {
      return h(
        'span',
        {
          class: 'v-pager--total'
        },
        this.t('table.pagination.total', { total: this.total })
      );
    },
    // number
    renderPageBtn(h, showJump) {
      const { numList, currentPage, pageCount, pagerCount, offsetNumber } = this;
      const nums = [];
      const isOv = pageCount > pagerCount;
      const isLt = isOv && currentPage > offsetNumber + 1;
      const isGt = isOv && currentPage < pageCount - offsetNumber;
      let startNumber = 1;
      if (isOv) {
        if (currentPage >= pageCount - offsetNumber) {
          startNumber = Math.max(pageCount - numList.length + 1, 1);
        } else {
          startNumber = Math.max(currentPage - offsetNumber, 1);
        }
      }
      if (showJump && isLt) {
        nums.push(
          h(
            'li',
            {
              class: 'v-pager--num-btn',
              on: {
                click: () => this.jumpPage(1)
              }
            },
            1
          ),
          this.renderPrevJump(h, 'li')
        );
      }
      numList.forEach((item, index) => {
        const number = startNumber + index;
        if (number <= pageCount) {
          nums.push(
            h(
              'li',
              {
                class: [
                  'v-pager--num-btn',
                  {
                    'is--active': currentPage === number
                  }
                ],
                on: {
                  click: () => this.jumpPage(number)
                },
                key: number
              },
              number
            )
          );
        }
      });
      if (showJump && isGt) {
        nums.push(
          this.renderNextJump(h, 'li'),
          h(
            'li',
            {
              class: 'v-pager--num-btn',
              on: {
                click: () => this.jumpPage(pageCount)
              }
            },
            pageCount
          )
        );
      }
      return nums;
    },
    getPageCount(total, size) {
      return Math.max(Math.ceil(total / size), 1);
    },
    prevPage() {
      const currentPage = this.currentPage;
      if (currentPage > 1) {
        this.jumpPage(Math.max(currentPage - 1, 1));
      }
    },
    nextPage() {
      const { currentPage, pageCount } = this;
      if (currentPage < pageCount) {
        this.jumpPage(Math.min(currentPage + 1, pageCount));
      }
    },
    prevJump() {
      this.jumpPage(Math.max(this.currentPage - this.numList.length, 1));
    },
    nextJump() {
      this.jumpPage(Math.min(this.currentPage + this.numList.length, this.pageCount));
    },
    jumpPage(currentPage) {
      if (currentPage !== this.currentPage) {
        this.$emit('update:currentPage', currentPage);
        this.$emit('change', { type: 'current-change', pageSize: this.pageSize, currentPage });
      }
    },
    pageSizeEvent(pageSize) {
      this.changePageSize(pageSize);
    },
    changePageSize(pageSize) {
      if (pageSize !== this.pageSize) {
        this.$emit('update:pageSize', pageSize);
        this.$emit('change', { type: 'size-change', pageSize, currentPage: Math.min(this.currentPage, this.getPageCount(this.total, pageSize)) });
      }
    },
    jumpKeydownEvent(evnt) {
      if (evnt.keyCode === 13) {
        this.triggerJumpEvent(evnt);
      }
      if (evnt.keyCode === 38) {
        evnt.preventDefault();
        this.nextPage();
      }
      if (evnt.keyCode === 40) {
        evnt.preventDefault();
        this.prevPage();
      }
    },
    triggerJumpEvent(evnt) {
      const value = Number(evnt.target.value);
      const current = value <= 0 ? 1 : value >= this.pageCount ? this.pageCount : value;
      evnt.target.value = current;
      this.jumpPage(current);
    }
  }
};
