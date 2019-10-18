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
    return {
      workers: [
        {
          id: '1',
          name: '张三',
          imgUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
          num: 10
        },
        {
          id: '2',
          name: '李四',
          imgUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
          num: 20
        }
      ],
      list: this.createTableList()
    };
  },
  methods: {
    createTableList() {
      let res = [];
      for (let i = 0; i < 10; i++) {
        let tmp = [];
        this.tHeadsList.forEach(x => {
          tmp.push({});
        });
        res.push(tmp);
      }
      return res;
    },
    createWorkerNode(item) {
      return (
        <div class="worker">
          <div class="info">
            <span class="img">
              <img src={item.imgUrl} />
            </span>
            <span class="name">{item.name}</span>
          </div>
          <div class="box">数量：{item.num}</div>
        </div>
      );
    },
    createCellNode(item) {
      if (!Object.keys(item).length) return null;
      return <div>asdasd</div>;
    },
    bindDragEvent() {
      const nodes = Array.from(this.$refs.workerList.querySelectorAll('.worker'));
      nodes.forEach(x => {
        new DragElement({ $dragNode: x, targetNodes: [] });
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
                  <th key={x} width={index === 0 ? 40 : null}>
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
                      return <td disabled>{index + 1}</td>;
                    }
                    return (
                      <td x={index} y={i}>
                        {this.createCellNode(x)}
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
  border: 1px solid @borderColorSecondary;
  border-radius: @borderRadius;
  padding: @modulePadding;
  box-shadow: @boxShadow;
  background-color: #fff;
  position: relative;
  .info {
    .img {
      display: inline-block;
      overflow: hidden;
      width: 24px;
      height: 24px;
      border-radius: @borderRadius;
      vertical-align: middle;
      img {
        object-fit: cover;
        display: block;
        height: 100%;
      }
    }
    .name {
      display: inline-block;
      margin-left: 5px;
      line-height: 24px;
      vertical-align: middle;
    }
  }
  .box {
    margin-top: 7px;
    padding-top: 5px;
    border-top: 1px solid @borderColorSecondary;
  }
}
.worker-list {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  position: relative;
  .worker {
    min-width: 80px;
    margin-right: @moduleMargin;
    cursor: move;
  }
}
.plan-container {
  margin-top: 10px;
  .table-wrap {
    width: 100%;
    border: 1px solid @borderColorSecondary;
    thead tr th {
      text-align: left;
      font-weight: 700;
      padding: 10px 5px;
      border: 1px solid @borderColorSecondary;
      background-color: @backgroundColor;
      vertical-align: middle;
    }
    tbody tr td {
      padding: 5px;
      height: 30px;
      border: 1px solid @borderColorSecondary;
      vertical-align: middle;
    }
  }
}
</style>
