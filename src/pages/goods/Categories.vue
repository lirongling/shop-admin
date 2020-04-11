<template>
  <div>
    <div class="container">
      <div class="top flex a-center">
        <div class="btn">
          <el-button type="primary" @click="addCategorys">添加分类</el-button>
        </div>
      </div>
      <div class="dialog">
        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="600px">
          <el-form :model="addForm" :rules="addRules" ref="addForm">
            <el-form-item label="分类名称" label-width="120px" prop="cat_name">
              <el-input v-model="addForm.cat_name" clearable autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="父级分类" label-width="120px" v-if="dialogTitle==='添加分类'">
              <el-cascader
                ref="cascader"
                clearable
                :disabled="addForm.cat_name.length===0"
                v-model="addForm.cat_desc"
                :options="categoryTwo"
                :props="props"
              ></el-cascader>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="add">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <div class="content">
        <zk-table
          ref="table"
          index-text="#"
          :data="categories"
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
          <template slot="cat_deleted" slot-scope="scope">
            <i class="el-icon-success" style="color: blue;" v-if="scope.row.cat_deleted"></i>
            <i class="el-icon-success" style="color: skyblue;" v-else></i>
          </template>
          <template slot="sort" slot-scope="scope">
            <el-tag
              :type="tagType[scope.row.cat_level]"
              size="medium"
            >{{ Number(scope.row.cat_level)+1 }}级</el-tag>
          </template>
          <template slot="operate" slot-scope="scope">
            <el-tooltip content="编辑分类" placement="top">
              <el-button
                style="margin-right:10px"
                size="mini"
                icon="el-icon-edit"
                @click="handleEdit(scope.rowIndex, scope.row)"
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
      <div class="page" style="marginTop:25px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="pageSizeOpts"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="cateTotal"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
// import { type } from "os";
// import myTable from "../../components/categories/MyTable";
import { createNamespacedHelpers } from "vuex";
const goodModule = createNamespacedHelpers("good");
const { mapActions: goodAtions, mapState: goodState } = goodModule;
export default {
  data() {
    return {
      dialogFormVisible: false,
      dialogTitle: "添加分类",
      page: 1,
      size: 5,
      pageSize: 5,
      editForm: {
        id: null,
        roleName: "",
        roleDesc: ""
      },
      addForm: {
        cat_name: "",
        cat_desc: []
      },
      activeId: null,
      props: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
        expandTrigger: "hover",
        checkStrictly: true
      },
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
      ],
      editRules: {
        roleName: [
          { required: true, message: "角色名不能为空", trigger: "blur" }
        ]
      },
      addRules: {
        cat_name: [
          { required: true, message: "分类名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  components: {
    // myTable
  },
  props: {},
  methods: {
    ...goodAtions([
      "getCategories",
      "addCategory",
      "editCategory",
      "delCategory"
    ]),
    // 添加分类
    addCategorys() {
      this.getCategories({
        type: 2,
        pagenum: null,
        pagesize: null
      });
      this.dialogTitle = "添加分类";
      this.dialogFormVisible = true;
    },
    // 确认按钮
    async add() {
      let flage = null;
      if (this.dialogTitle === "添加分类") {
        let a = {};
        a.cat_name = this.addForm.cat_name;
        if (this.addForm.cat_desc.length == 0) {
          a.cat_pid = 0;
          a.cat_level = 0;
        } else {
          a.cat_level = this.addForm.cat_desc.length;
          a.cat_pid = this.addForm.cat_desc[this.addForm.cat_desc.length - 1];
        }
        flage = await this.addCategory(a);
      } else {
        let a = { id: this.activeId, cat_name: this.addForm.cat_name };
        flage = await this.editCategory(a);
      }
      if (flage) {
        this.addForm.cat_name = "";
        this.addForm.cat_desc = [];
        this.dialogFormVisible = false;
        this.getCategories({
          type: 3,
          pagenum: this.page,
          pagesize: this.size
        });
      }
    },
    // 编辑分类
    handleEdit(index, item) {
      this.addForm.cat_name = item.cat_name;
      this.activeId = item.cat_id;
      this.dialogTitle = "编辑分类";
      this.dialogFormVisible = true;
    },
    // 删除
    async del(item) {
      let flage = await this.delCategory(item.cat_id);
      if (flage) {
        this.getCategories({
          type: 3,
          pagenum: this.page,
          pagesize: this.size
        });
      }
    },
    // 每页条数切换的配置

    handleSizeChange(val) {
      this.size = val;
      this.getCategories({
        type: 3,
        pagenum: this.page,
        pagesize: this.size
      });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getCategories({
        type: 3,
        pagenum: this.page,
        pagesize: this.size
      });
    }
  },
  beforeMount() {
    this.getCategories({
      type: 3,
      pagenum: this.page,
      pagesize: this.size
    });
  },
  mounted() {},
  watch: {},
  computed: {
    ...goodState(["categories", "cateTotal", "categoryTwo"]),
    pageSizeOpts() {
      let a = [];
      let b = 50;
      if (this.cateTotal < 50) {
        b = this.cateTotal;
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
.top {
  width: 100%;
  margin-bottom: 20px;
}
</style>