<script>
/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-04-23 14:45:45
 */
import _ from 'lodash';
import moment from 'moment';
import DragElement from './drag';

// 模拟数据
const dataList = [
  {
    id: '1',
    name: '张三',
    imgUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
    num: 10,
    time: '00:00:00'
  },
  {
    id: '2',
    name: '李四',
    imgUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
    num: 20,
    time: '00:00:00'
  },
  {
    id: '3',
    name: '刘德华',
    imgUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
    num: 50,
    time: '00:00:00'
  },
  {
    id: '4',
    name: '周润发',
    imgUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
    num: 60,
    time: '00:00:00'
  }
];

export default {
  name: 'Panel1',
  data() {
    // 表头，固定不变
    this.tHeadsList = ['序号', '接待中', '交车中', '就餐', '内部事务', '休假'];
    // 实例化的拖拽对象集合
    this.instances = {};
    // 定时器
    this.timer = {};
    return {
      workers: [...dataList],
      list: this.createTableList()
    };
  },
  mounted() {
    this.bindDragEvent();
  },
  destroyed() {
    this.removeDragEvent();
  },
  methods: {
    // 创建 Table 列表数据
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
    stopRunningTime(id) {
      this.timer[id] && clearInterval(this.timer[id]);
    },
    runningTime(id, data, key) {
      this.stopRunningTime(id);
      // 恢复时间
      data[key] = '00:00:00';
      // 定时器
      this.timer[id] = setInterval(() => {
        data[key] = moment(`1970-01-01 ${data[key]}`)
          .add(1, 's')
          .format('HH:mm:ss');
      }, 1000);
    },
    // 创建 Table 单元格节点
    createTableCellNode(item, coor) {
      if (!item) return null;
      return this.createWorkerNode(item, coor);
    },
    // 创建员工节点(JSX)
    createWorkerNode(item, coor = []) {
      return (
        <div key={item.id} class="worker" data-id={item.id}>
          <span class="img">
            <img src={item.imgUrl} />
          </span>
          <span class="name">{item.name}</span>
          {coor.length ? <span class="time-len">{item.time}</span> : null}
          {coor.length ? (
            <span class="del-btn" onClick={() => this.removeHandle(item.id, coor)}>
              <i class="el-icon-delete"></i>
            </span>
          ) : null}
        </div>
      );
    },
    // 从 Table 移除员工
    removeHandle(id, [x, y]) {
      this.list[x][y] = null;
      this.workers.push(dataList.find(x => x.id == id));
      this.list = [...this.list];
      this.stopRunningTime(id);
      // 绑定拖拽事件
      this.$nextTick(() => {
        const workers = this.getWorkerNodes();
        // 添加到员工列表中的目标节点
        const target = workers[workers.length - 1];
        if (this.getNodeDataId(target) !== id) return;
        // 绑定事件
        this.createDragInstance(target);
      });
    },
    // 获取 worker 节点的 data-id
    getNodeDataId(el) {
      return el.getAttribute('data-id') || '';
    },
    // 获取 worker 节点列表
    getWorkerNodes() {
      return Array.from(this.$refs.workerList.querySelectorAll('.worker'));
    },
    // 获取 Table td 单元格集合
    getTableTdsHandle() {
      const tableTds = Array.from(document.querySelectorAll('.table-wrap > tbody tr td'));
      return tableTds.filter(x => !x.getAttribute('disabled'));
    },
    // 创建拖拽实例
    createDragInstance(node) {
      this.instances[this.getNodeDataId(node)] = new DragElement({
        $dragNode: node,
        targetNodes: this.getTableTdsHandle(),
        callback: (currentEl, targetEl) => {
          const curId = this.getNodeDataId(currentEl);
          const index = this.workers.findIndex(x => x.id === curId);
          if (index === -1) return;
          const worker = this.workers[index];
          this.runningTime(curId, worker, 'time');
          // Table 插入记录
          this.list[targetEl.getAttribute('x')][targetEl.getAttribute('y')] = worker;
          this.list = [...this.list];
          // workerList 移除记录
          this.workers.splice(index, 1);
        }
      });
    },
    // 给员工节点绑定事件
    bindDragEvent() {
      this.getWorkerNodes().forEach(x => {
        this.createDragInstance(x);
      });
    },
    // 移除事件，释放内存
    removeDragEvent() {
      for (let key in this.instances) {
        if (this.instances[key]) {
          this.instances[key].destroye();
        }
      }
      this.instances = null;
    }
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

<style scoped lang="scss">
.worker {
  min-width: 80px;
  padding: $modulePadding;
  position: relative;
  .img {
    display: inline-block;
    overflow: hidden;
    width: 24px;
    height: 24px;
    border-radius: 50%;
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
    margin-left: $moduleMargin;
  }
  .del-btn {
    position: absolute;
    padding: 5px;
    right: 5px;
    cursor: pointer;
    &:hover {
      color: $primaryColor;
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
    border: 1px solid $borderColorSecondary;
    border-radius: $borderRadius;
    margin-right: $moduleMargin;
    box-shadow: $boxShadow;
    background-color: #fff;
    cursor: move;
  }
}
.plan-container {
  margin-top: $moduleMargin;
  .table-wrap {
    width: 100%;
    border: 1px solid $borderColorSecondary;
    thead tr th {
      text-align: left;
      font-weight: 700;
      padding: 10px 0 10px 10px;
      border: 1px solid $borderColorSecondary;
      background-color: $backgroundColor;
      vertical-align: middle;
    }
    tbody tr td {
      height: 46px;
      border: 1px solid $borderColorSecondary;
      vertical-align: middle;
      &.actived {
        background-color: $backgroundColorSecondary;
      }
    }
  }
}
</style>
