<template>
  <div>
    <zk-table
      ref="table"
      index-text="#"
      :data="tableList"
      :columns="columns"
      :stripe="false"
      :border="true"
      :show-header="true"
      :show-row-hover="false"
      :show-index="true"
      :tree-type="true"
      :is-fold="true"
      :expand-type="false"
      :selection-type="false"
    >
      <template slot="cat_deleted" scope="scope">
        <i class="el-icon-success" style="color: blue;" v-if="scope.row.cat_deleted"></i>
        <i class="el-icon-success" style="color: skyblue;" v-else></i>
      </template>
      <template slot="sort" scope="scope">
        <el-tag
          :type="tagType[scope.row.cat_level]"
          size="medium"
        >{{ Number(scope.row.cat_level)+1 }}级</el-tag>
      </template>
      <template slot="operate" scope="scope">
        <el-tooltip content="编辑角色" placement="top">
          <el-button
            style="margin-right:10px"
            size="mini"
            icon="el-icon-edit"
            @click="handleEdit(scope.$index, scope.row)"
          ></el-button>
        </el-tooltip>
        <el-tooltip content="删除角色" placement="top">
          <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="del( scope.row)">
            <el-button
              style="margin-right:10px"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              slot="reference"
            ></el-button>
          </el-popconfirm>
        </el-tooltip>
      </template>
    </zk-table>
  </div>
</template>

<script>
import { type } from "os";
export default {
  data() {
    return {
      tagType: ["success", "info", "warning", "danger"],
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
          headerAlign: "center"
        },
        {
          align: "center",
          label: "是否有效",
          headerAlign: "center",
          prop: "cat_deleted",
          type: "template",
          template: "cat_deleted"
        },
        {
          align: "center",
          label: "排序",
          prop: "cat_level",
          headerAlign: "center",
          type: "template",
          template: "sort"
        },
        {
          align: "center",
          label: "操作",
          headerAlign: "center",
          type: "template",
          template: "operate"
        }
      ]
    };
  },
  props: {
    tableList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    propList() {
      return Object.keys(this.props).map(item => ({
        name: item
      }));
    }
  },
  methods: {
    handleEdit(index, item) {},
    del(index, item) {}
  }
};
</script>

<style scoped lang='scss'>
</style>