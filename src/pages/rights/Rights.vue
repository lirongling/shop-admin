<template>
  <div class="container">
    <el-card class="box-card">
      <el-table :data="list" stripe border style="width: 100%">
        <el-table-column align="center" type="index" label="#" width="80"></el-table-column>
        <el-table-column align="center" prop="authName" label="权限名称"></el-table-column>
        <el-table-column align="center" label="权限等级">
          <template slot-scope="scope">
            <el-tag :type="tagType[scope.row.level]" size="medium">{{ Number(scope.row.level)+1 }}级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const roleModule = createNamespacedHelpers("role");
const { mapActions: roleAtions, mapState: roleState } = roleModule;
export default {
  data() {
    return {
      tagType: ["success", "info", "warning", "danger"]
    };
  },
  components: {},
  props: {},
  methods: {
    ...roleAtions(["authorityList"])
  },
  mounted() {},
  watch: {},
  computed: {
    ...roleState(["list"])
  },
  beforeMount() {
    this.authorityList("list");
  }
};
</script>

<style scoped lang='scss'>
</style>