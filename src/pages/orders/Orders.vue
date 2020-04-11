<template>
  <div class="container">
    <div class="top flex a-center">
      <div class="search">
        <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
    </div>
    <div class="dialog">
      <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="600px">
        <div class="city" v-if="dialogTitle=='编辑地址'">
          <el-cascader :options="regionData" clearable></el-cascader>
        </div>
        <div v-else>
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in logistics"
              :key="index"
              :icon="activity.icon"
              :type="timeType()"
              :color="activity.color"
              size="large"
              :timestamp="activity.time"
            >{{activity.context}}</el-timeline-item>
          </el-timeline>
        </div>
        <!-- <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="add">确 定</el-button>
        </div>-->
      </el-dialog>
    </div>
    <div class="table">
      <el-table :data="orders" border style="width: 100%">
        <el-table-column align="center" :index="indexMethod" type="index" label="#" width="80"></el-table-column>
        <el-table-column align="center" prop="order_number" label="订单编号"></el-table-column>
        <el-table-column align="center" prop="order_price" label="订单价格"></el-table-column>
        <el-table-column align="center" prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="warning" v-if="scope.row.order_pay=='0'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="is_send" label="是否发货"></el-table-column>
        <el-table-column align="center" prop="create_time" label="下单时间">
          <template slot-scope="scope">{{getTime(scope.row.create_time)}}</template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <span>
              <el-tooltip content="编辑地址" placement="top">
                <el-button
                  style="margin-right:10px"
                  size="mini"
                  type="warning"
                  icon="el-icon-edit"
                  @click="handleEdit(scope.$index, scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="物流信息" placement="top">
                <el-button
                  size="mini"
                  type="info"
                  icon="el-icon-location"
                  @click="handleLook(scope.$index, scope.row)"
                ></el-button>
              </el-tooltip>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page" style="marginTop:25px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="pageSizeOpts"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { regionData } from "../../utils/cityData";
import { createNamespacedHelpers } from "vuex";
const orderModule = createNamespacedHelpers("order");
const { mapActions: orderAtions, mapState: orderState } = orderModule;
export default {
  data() {
    return {
      search: "",
      dialogFormVisible: false,
      dialogTitle: "编辑地址",
      page: 1,
      size: 10,
      pageSize: 10,
      regionData
    };
  },
  components: {},
  props: {},
  methods: {
    ...orderAtions(["getOrders", "getKuaidi"]),
    // 每页条数切换的配置
    handleSizeChange(val) {
      this.size = val;
      this.getOrders({
        query: null,
        pagenum: this.page,
        pagesize: this.size
      });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getOrders({
        query: null,
        pagenum: this.page,
        pagesize: this.size
      });
    },
    indexMethod(index) {
      return index + (this.page - 1) * this.size + 1;
    },
    // 处理时间
    getTime(time) {
      return this.$dayjs(time).format("YYYY-MM-DD hh:mm:sss");
    },
    // 编辑
    handleEdit(index, item) {
      this.dialogTitle = "编辑地址";
      this.dialogFormVisible = true;
    },
    // 查看物流
    handleLook(index, item) {
      this.getKuaidi(item.order_id);
      this.dialogTitle = "物流信息";
      this.dialogFormVisible = true;
    },
    timeType() {
      let tagType = ["success", "info", "warning", "danger", ""];
      let index = Math.floor(Math.random() * tagType.length);
      return tagType[index];
    }
  },
  beforeMount() {
    this.getOrders({
      query: null,
      pagenum: this.page,
      pagesize: this.size
    });
  },
  mounted() {},
  watch: {
    search(val) {
      if (val.trim().length > 0) {
        this.size = this.pageSize;
        this.page = 1;
        this.getOrders({
          query: val.trim(),
          pagenum: this.page,
          pagesize: this.size
        });
      }
    }
  },
  computed: {
    ...orderState(["orders", "total", "logistics"]),
    pageSizeOpts() {
      let a = [];
      let b = 50;
      if (this.total < 50) {
        b = this.total;
      }
      let i = 1;
      do {
        a.push(this.pageSize * i);
        i++;
      } while (i * this.pageSize <= b);
      return a;
    }
  }
};
</script>

<style scoped lang='scss'>
.city {
  ::v-deep .el-cascader {
    display: block !important;
  }
}

.dialog-item {
  height: 40px;
}
.top {
  width: 100%;
  margin-bottom: 20px;
  .search {
    width: 30%;
    margin-right: 20px;
  }
}
.container {
  margin-bottom: 20px;
}
</style>