<template>
  <div>
    <div class="container">
      <el-card class="box-card">
        <InlineTable :tableData="users" :tableDesc="tableDesc" @add="add"></InlineTable>
      </el-card>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const userModule = createNamespacedHelpers("user");
const { mapActions: userAtions, mapState: userState } = userModule;
import InlineTable from "../../components/InlineTable";
export default {
  data() {
    return {
      tableDesc: [
        { label: "编号", prop: "id" },
        { label: "描述", prop: "des" },
        { label: "调用次数", prop: "requestNumber" },
        { label: "状态", prop: "state" },
        { label: "更新时间", prop: "date" }
      ]
    };
  },
  components: {
    InlineTable
  },
  props: {},
  methods: {
    ...userAtions(["getUserList", "addUser"]),
    add(e) {
      this.addUser(e);
    }
  },
  beforeMount() {
    this.getUserList({ query: null, pagenum: 1, pagesize: 10 });
  },
  mounted() {},
  watch: {},
  computed: {
    ...userState(["users"])
  }
};
</script>

<style scoped lang='scss'>
</style>