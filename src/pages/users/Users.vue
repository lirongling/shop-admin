<template>
  <div class="container">
    <div class="top flex a-center">
      <div class="search">
        <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <div class="btn">
        <el-button type="primary" @click="showDialog">添加用户</el-button>
      </div>
    </div>
    <div class="dialog">
      <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="600px">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-if="dialogTitle==='添加用户'">
          <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
            <el-input v-model="ruleForm.username" clearable autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
            <el-input v-model="ruleForm.password" show-password autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="ruleForm.email" clearable autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
            <el-input v-model="ruleForm.mobile" clearable autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <el-form :model="ruleForm1" :rules="rules" ref="ruleForm1" v-else-if="dialogTitle==='编辑用户'">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="ruleForm1.username" :disabled="true" clearable autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="ruleForm1.email" clearable autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
            <el-input v-model="ruleForm1.mobile" clearable autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div v-else>
          <div class="dialog-item flex a-center">当前用户：{{ruleForm1.username}}</div>
          <div class="dialog-item flex a-center">当前角色：{{ruleForm1.role_name}}</div>
          <div>
            <el-select v-model="selectRole" placeholder="请选择">
              <el-option
                v-for="item in roles"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="add">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <el-table :data="users" style="width: 100%">
      <el-table-column type="index" width="50" :index="indexMethod" label="#"></el-table-column>
      <el-table-column
        :label="item.label"
        width="200"
        v-for="(item,index) in tableDesc"
        :key="index"
      >
        <!-- <template slot-scope="scope" v-if="item.prop==='mg_state'"></template> -->
        <template slot-scope="scope">
          <span v-if="item.prop==='mg_state'">
            <el-switch v-model="scope.row[item.prop]" @change="changeSwitch($event,scope.row)"></el-switch>
          </span>
          <span v-else>{{scope.row[item.prop]}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center">
        <template slot="header" slot-scope="scope">操作</template>
        <template slot-scope="scope">
          <span v-if="tableIdx===scope.$index">
            <el-button size="mini" @click="save(scope.$index, scope.row)">保存</el-button>
            <el-button size="mini" type="danger" @click="cancel(scope.$index,scope.row)">取消</el-button>
          </span>
          <span v-else>
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
            <el-tooltip content="分配角色" placement="top">
              <el-button
                size="mini"
                icon="el-icon-setting"
                @click="handleAllot(scope.$index, scope.row)"
              ></el-button>
            </el-tooltip>
          </span>
        </template>
      </el-table-column>
    </el-table>
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
import { createNamespacedHelpers } from "vuex";
const userModule = createNamespacedHelpers("user");
const roleModule = createNamespacedHelpers("role");
const { mapActions: userAtions, mapState: userState } = userModule;
const { mapActions: roleAtions, mapState: roleState } = roleModule;
export default {
  data() {
    var validateMobile = (rule, value, callback) => {
      let a = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
      if (!a.test(value)) {
        callback(new Error("手机号格式错误"));
      } else {
        callback();
      }
    };
    return {
      tableDesc: [
        { label: "姓名", prop: "username" },
        { label: "角色", prop: "role_name" },
        { label: "电话", prop: "mobile" },
        { label: "邮箱", prop: "email" },
        { label: "状态", prop: "mg_state" }
      ],
      selectRole: null,
      page: 1,
      size: 10,
      pageSize: 10,
      search: "",
      tableDatass: [],
      tableIdx: -1,
      tableItem: {},
      tableIdxs: -1,
      dialogTitle: "添加用户",
      dialogFormVisible: false,
      ruleForm: {
        username: "",
        password: "",
        email: "",
        mobile: null
      },
      ruleForm1: {
        id: null,
        username: "",
        email: "",
        mobile: null
      },
      formLabelWidth: "120px",
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { min: 2, max: 15, message: "长度在 2 到 15 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: "blur"
          }
        ],
        mobile: [
          { required: true, message: "电话号码不能为空", trigger: "blur" },
          { validator: validateMobile, trigger: "blur" }
        ]
      }
    };
  },
  components: {},
  props: {},
  methods: {
    ...userAtions([
      "getUserList",
      "addUser",
      "modifyUser",
      "editUser",
      "delUser",
      "allotUser"
    ]),
    ...roleAtions(["getRoles"]),
    // 每页条数切换的配置

    handleSizeChange(val) {
      this.size = val;
      this.getUserList({
        query: null,
        pagenum: this.page,
        pagesize: this.size
      });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getUserList({
        query: null,
        pagenum: this.page,
        pagesize: this.size
      });
    },
    async del(item) {
      //  delUser
      let flage = await this.delUser(item.id);
      if (flage) {
        if (this.total % this.size === 1 && this.page > 1) {
          this.page--;
        }
        this.getUserList({
          query: null,
          pagenum: this.page,
          pagesize: this.size
        });
        this.dialogFormVisible = false;
      }
    },
    handleEdit(index, item) {
      this.dialogTitle = "编辑用户";
      this.ruleForm1 = JSON.parse(JSON.stringify(item));
      this.showDialog();
    },
    handleAllot(index, item) {
      if (this.roles.length === 0) {
        this.getRoles();
      }
      this.showDialog();
      this.dialogTitle = "分配用户";
      this.ruleForm1 = JSON.parse(JSON.stringify(item));
    },
    indexMethod(index) {
      return index + (this.page - 1) * this.size + 1;
    },
    save(index, item) {
      this.$emit("edit", item);
      this.tableItem = JSON.stringify(item);
      this.tableIdx = -1;
    },
    cancel(index, item) {
      this.tableDatass.splice(this.tableIdxs, 1, JSON.parse(this.tableItem));
      this.tableIdx = -1;
    },
    // 打开dialog
    showDialog() {
      this.dialogFormVisible = true;
    },
    // 添加用户
    async add() {
      if (this.dialogTitle === "添加用户") {
        this.$refs.ruleForm.validate(async valid => {
          if (valid) {
            let flage = await this.addUser(this.ruleForm);
            if (flage) {
              this.getUserList({
                query: null,
                pagenum: this.page,
                pagesize: this.size
              });
              this.dialogFormVisible = false;
            }
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else if (this.dialogTitle === "编辑用户") {
        this.$refs.ruleForm1.validate(async valid => {
          if (valid) {
            let flage = await this.editUser(this.ruleForm1);
            if (flage) {
              this.getUserList({
                query: null,
                pagenum: this.page,
                pagesize: this.size
              });
              this.dialogFormVisible = false;
            }
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else {
        let flage = await this.allotUser({
          id: Number(this.ruleForm1.id),
          rid: Number(this.selectRole)
        });
        if (flage) {
          this.getUserList({
            query: null,
            pagenum: this.page,
            pagesize: this.size
          });
          this.dialogFormVisible = false;
        }
      }
    },
    // 改变switch状态
    changeSwitch(e, item) {
      this.modifyUser({
        uId: item.id,
        type: e
      });
    }
  },
  beforeMount() {
    this.getUserList({
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
        this.getUserList({
          query: val.trim(),
          pagenum: this.page,
          pagesize: this.size
        });
      }
    }
  },
  computed: {
    ...userState(["users", "total"]),
    ...roleState(["roles"]),
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
// ::v-deep .el-input__inner {
//   width: 200px;
// }
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