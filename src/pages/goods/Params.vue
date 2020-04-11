<template>
  <div>
    <el-card class="box-card">
      <el-alert title="注意:只允许为第三级分类设置相关参数!" type="warning" show-icon></el-alert>
      <div class="select flex a-center">
        <div class="desc">选择商品分类:</div>
        <el-cascader
          ref="cascader"
          clearable
          v-model="selectValue"
          :options="categories"
          :props="props"
        ></el-cascader>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数"></el-tab-pane>
        <el-tab-pane label="静态参数"></el-tab-pane>
      </el-tabs>
      <el-button type="primary" size="small" :disabled="attributes.length===0">添加属性</el-button>

      <el-table :data="attributes" style="width: 100%">
        <el-table-column type="index" label="#" width="80"></el-table-column>
        <el-table-column prop="attr_name" label="参数名称"></el-table-column>
        <el-table-column prop="attr_write" label="操作"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const goodModule = createNamespacedHelpers("good");
const { mapActions: goodAtions, mapState: goodState } = goodModule;
export default {
  data() {
    return {
      selectValue: [],
      props: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
        expandTrigger: "hover"
      },
      activeName: "0"
    };
  },
  components: {},
  props: {},
  methods: {
    ...goodAtions(["getCategories", "getAttributes"]),
    handleClick(e) {
      if (e.index == 1) {
        this.getAttributes({ id: null, sel: "only" });
      } else {
        this.getAttributes({ id: null, sel: "many" });
      }
    }
  },
  mounted() {},
  beforeMount() {
    this.getCategories({
      type: 3,
      pagenum: null,
      pagesize: null
    });
    this.getAttributes({ id: null, sel: "only" });
  },
  watch: {},
  computed: {
    ...goodState(["categories", "attributes"])
  }
};
</script>

<style scoped lang='scss'>
.select {
  margin: 20px 0;
  .desc {
    margin-right: 20px;
    font-size: 18px;
  }
}
</style>