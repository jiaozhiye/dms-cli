<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-05-06 10:00:00
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-05-07 11:00:00
 **/
export default {
  name: 'Cascader',
  props: {
    list: {
      type: Array,
      required: true,
      default: () => []
    },
    defaultValue: {
      type: String
    },
    labels: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      values: this.createInitValue(this.defaultValue)
    };
  },
  computed: {
    dataList() {
      let res = [this.list];
      this.values.forEach((x, i) => {
        const arr = res[i].find(k => k.value === x.value).children;
        if (typeof arr !== 'undefined' && Array.isArray(arr)) {
          res.push(arr);
        }
      });
      return res;
    }
  },
  watch: {
    values: {
      handler(val) {
        this.$emit('change', val);
      },
      immediate: true
    },
    defaultValue(val) {
      this.values = this.createInitValue(val);
    }
  },
  methods: {
    createInitValue(valText) {
      let res = [];
      if (valText && _.isString(valText)) {
        const valStrList = valText.split(',');
        let arr = this.list;
        valStrList.forEach(x => {
          const target = arr.find(k => k.value === x);
          if (target) {
            res.push({ value: x, text: target.text });
            arr = target.children || [];
          }
        });
      }
      return res;
    },
    clickHandle(ev, index, { value, text, children }) {
      ev.stopPropagation();
      this.$set(this.values, index, { value, text });
      this.values.length = index + 1;
      if (!children) {
        this.$emit('close', false);
      }
    }
  },
  render() {
    const { labels, dataList, values } = this;
    return (
      <div class="casc-wrap">
        <table class="table" width="100%">
          {labels.length ? (
            <tr>
              {labels.map(x => (
                <th key={x}>{x}</th>
              ))}
            </tr>
          ) : null}
          <tr>
            {dataList.map((list, index) => (
              <td key={`td-${index}`}>
                {list.map(item => {
                  const actived = values[index] && values[index].value === item.value ? 'selected' : '';
                  return (
                    <li key={item.value} class={actived} onClick={ev => this.clickHandle(ev, index, item)}>
                      {item.text}
                      {Array.isArray(item.children) && item.children.length ? <i class="el-icon-arrow-right"></i> : null}
                    </li>
                  );
                })}
              </td>
            ))}
          </tr>
        </table>
      </div>
    );
  }
};
</script>

<style lang="less" scoped>
.casc-wrap {
  min-width: 300px;
  .table {
    tr {
      th {
        padding: 5px;
      }
      td {
        padding: 5px;
        li {
          list-style: none;
          line-height: 28px;
          cursor: pointer;
          position: relative;
          margin: 0 -5px;
          padding: 0 5px;
          padding-right: 20px;
          i {
            position: absolute;
            right: 5px;
            top: 7px;
          }
          &:hover {
            background-color: #f5f7fa;
          }
          &.selected {
            color: @primaryColor;
          }
        }
      }
    }
  }
}
</style>
