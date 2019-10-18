<script>
/**
 * @Author: 焦质晔
 * @Date: 2019/6/20
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-06-20 15:45:00
 */
import _ from 'lodash';
import DragElement from './drag';

export default {
  name: 'Dashboard',
  data() {
    this.tHeadsList = ['序号', '销售1', '销售2', '销售3', '销售4', '销售5'];
    this.dataList = [
      {
        id: '1',
        name: '张三',
        imgUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        num: 10,
        time: '12:12:12'
      },
      {
        id: '2',
        name: '李四',
        imgUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        num: 20,
        time: '15:15:15'
      },
      {
        id: '3',
        name: '刘德华',
        imgUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        num: 50,
        time: '05:05:05'
      }
    ];
    return {
      workers: [...this.dataList],
      list: this.createTableList()
    };
  },
  methods: {
    createTableList() {
      let res = [];
      for (let i = 0; i < 10; i++) {
        let tmp = [];
        this.tHeadsList.forEach(x => {
          tmp.push(null);
        });
        res.push(tmp);
      }
      return res;
    },
    createWorkerNode(item, pos = []) {
      return (
        <div class="worker" data-id={item.id}>
          <span class="img">
            <img src={item.imgUrl} />
          </span>
          <span class="name">{item.name}</span>
          {pos.length ? <span class="time-len">{item.time}</span> : null}
          {pos.length ? (
            <span class="del-btn" onClick={() => this.removeHandle(item.id, pos)}>
              <i class="el-icon-delete"></i>
            </span>
          ) : null}
        </div>
      );
    },
    removeHandle(id, [x, y]) {
      this.list[x][y] = null;
      this.workers.push(this.dataList.find(x => x.id == id));
      this.list = [...this.list];
      this.$nextTick(() => {
        // this.bindDragEvent();
      });
    },
    createTableCellNode(item, pos) {
      if (!item) return null;
      return this.createWorkerNode(item, pos);
    },
    getTableTdsHandle() {
      const tableTds = Array.from(document.querySelectorAll('.table-wrap > tbody tr td'));
      return tableTds.filter(x => !x.getAttribute('disabled'));
    },
    bindDragEvent() {
      const targets = Array.from(this.$refs.workerList.querySelectorAll('.worker'));
      targets.forEach(x => {
        new DragElement({
          $dragNode: x,
          targetNodes: this.getTableTdsHandle(),
          callback: (el, target) => {
            const index = this.workers.findIndex(x => x.id === el.getAttribute('data-id'));
            this.list[target.getAttribute('x')][target.getAttribute('y')] = this.workers[index];
            this.workers.splice(index, 1);
            this.list = [...this.list];
          }
        });
      });
    }
  },
  mounted() {
    this.bindDragEvent();
  },
  render() {
    return (
      <div>
        <div ref="workerList" class="worker-list">
          {this.workers.map(x => this.createWorkerNode(x))}
        </div>
        <div class="plan-container">
          <table cellspacing="0" cellpadding="0" border="0" class="table-wrap">
            <thead>
              <tr>
                {this.tHeadsList.map((x, index) => (
                  <th key={x} width={index === 0 ? null : '19%'}>
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {this.list.map((arr, index) => (
                <tr key={`row-${index}`}>
                  {arr.map((x, i) => {
                    if (i === 0) {
                      return (
                        <td disabled>
                          <span style={{ paddingLeft: '10px' }}>{index + 1}</span>
                        </td>
                      );
                    }
                    return (
                      <td x={index} y={i} disabled={!!x ? 'disabled' : null}>
                        {this.createTableCellNode(x, [index, i])}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
};
</script>

<style scoped lang="less">
.worker {
  min-width: 80px;
  padding: @modulePadding;
  position: relative;
  .img {
    display: inline-block;
    overflow: hidden;
    width: 24px;
    height: 24px;
    border-radius: @borderRadius;
    img {
      object-fit: cover;
      display: block;
      height: 100%;
    }
  }
  .name {
    margin-left: 6px;
    line-height: 24px;
  }
  .time-len {
    margin-left: @moduleMargin;
  }
  .del-btn {
    position: absolute;
    padding: 5px;
    right: 5px;
    cursor: pointer;
    &:hover {
      color: @primaryColor;
    }
  }
  & > * {
    display: inline-block;
    vertical-align: middle;
  }
}
.worker-list {
  min-height: 46px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  position: relative;
  .worker {
    border: 1px solid @borderColorSecondary;
    border-radius: @borderRadius;
    margin-right: @moduleMargin;
    box-shadow: @boxShadow;
    background-color: #fff;
    cursor: move;
  }
}
.plan-container {
  margin-top: @moduleMargin;
  .table-wrap {
    width: 100%;
    border: 1px solid @borderColorSecondary;
    thead tr th {
      text-align: left;
      font-weight: 700;
      padding: 10px 0 10px 10px;
      border: 1px solid @borderColorSecondary;
      background-color: @backgroundColor;
      vertical-align: middle;
    }
    tbody tr td {
      height: 46px;
      border: 1px solid @borderColorSecondary;
      vertical-align: middle;
      &.actived {
        background-color: @backgroundColorSecondary;
      }
    }
  }
}
</style>
