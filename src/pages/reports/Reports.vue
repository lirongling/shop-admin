<template>
  <div>
    <el-card class="box-card">
      <div id="myChart" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const orderModule = createNamespacedHelpers("order");
const { mapActions: orderAtions, mapState: orderState } = orderModule;
export default {
  data() {
    return {};
  },
  components: {},
  props: {},
  methods: {
    ...orderAtions(["getReports"]),
    //  imageUrl为后台提供图片地址
    async doDraw() {
      let res = await this.getReports();
      if (res) {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById("myChart"));
        // 绘制图表
        myChart.setOption({
          title: {
            text: "用户堆叠区域图"
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              label: {
                backgroundColor: "#6a7985"
              }
            }
          },
          legend: this.reports.legend,
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          xAxis: this.reports.xAxis,
          yAxis: this.reports.yAxis,
          series: this.reports.series
        });
      }
    }
    //     async getData(){
    // // let res=await
    // //     }
  },
  mounted() {
    this.doDraw();
  },
  beforeMount() {},
  watch: {},
  computed: {
    ...orderState(["reports"])
  }
};
</script>

<style scoped lang='scss'>
</style>