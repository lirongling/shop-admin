<template>
  <div>
    <div class="container">
      <div class="top flex a-center">
        <div class="btn">
          <el-button type="primary" @click="addRole">添加用户</el-button>
        </div>
      </div>
      <div class="dialog">
        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="600px">
          <el-form :model="editForm" :rules="editRules" ref="editForm" v-if="dialogTitle!=='分配权限'">
            <el-form-item label="角色名" label-width="120px" prop="roleName">
              <el-input v-model="editForm.roleName" clearable autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" label-width="120px">
              <el-input v-model="editForm.roleDesc" clearable autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div v-else>
            <div v-if="dialogFormVisible">
              <el-tree
                ref="rightsTree"
                :data="treeList"
                show-checkbox
                node-key="id"
                :default-expand-all="true"
                :default-checked-keys="checkedKeys"
                :props="defaultProps"
              ></el-tree>
            </div>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="add">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <div class="content">
        <el-table :data="roles" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <div v-if="props.row.children.length>0">
                  <div class="level flex a-center" v-for="(item,index) in props.row.children">
                    <div class="levelone">
                      <el-tag
                        closable
                        @close="closeTag(props.row,item.id,[index])"
                      >{{ item.authName }}</el-tag>
                      <span class="right-icon">
                        <i class="el-icon-caret-right"></i>
                      </span>
                    </div>
                    <div class="leveltwo">
                      <div
                        class="two-tag flex a-center"
                        v-for="(items,indexs) in item.children"
                        :key="indexs"
                      >
                        <span>
                          <el-tag
                            type="success"
                            @close="closeTag(props.row,items.id,[index,indexs])"
                            closable
                          >{{items.authName}}</el-tag>
                        </span>
                        <span class="right-icon">
                          <i class="el-icon-caret-right"></i>
                        </span>
                        <div class="leveltwo levelthree flex f-wrap a-center">
                          <div
                            class="two-tag"
                            style="  margin-left: 20px;"
                            v-for="(tag,indexss) in items.children"
                            :key="tag.id"
                          >
                            <el-tag
                              type="warning"
                              @close="closeTag(props.row,tag.id,[index,indexs,indexss])"
                              closable
                            >{{tag.authName}}</el-tag>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="flex a-center j-center">暂无权限</div>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column type="index" width="50" label="#"></el-table-column>
          <el-table-column label="职位" prop="roleName"></el-table-column>
          <el-table-column label="描述" prop="roleDesc"></el-table-column>
          <el-table-column align="center">
            <template slot="header" slot-scope="scope">操作</template>
            <template slot-scope="scope">
              <span>
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
                <el-tooltip content="分配权限" placement="top">
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
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const roleModule = createNamespacedHelpers("role");
const { mapActions: roleAtions, mapState: roleState } = roleModule;
export default {
  data() {
    return {
      dialogFormVisible: false,
      dialogTitle: "编辑角色",
      operate: null,
      checkedKeys: [101],
      editForm: {
        id: null,
        roleName: "",
        roleDesc: ""
      },
      editRules: {
        roleName: [
          { required: true, message: "角色名不能为空", trigger: "blur" }
        ]
      },
      roleId: null,
      defaultProps: {
        children: "children",
        label: "authName"
      }
    };
  },
  components: {},
  props: {},
  methods: {
    ...roleAtions([
      "getRoles",
      "editRole",
      "addRoles",
      "delRole",
      "authorityList",
      "impowerRole",
      "delRoles"
    ]),
    // 打开dialog
    showDialog() {
      this.dialogFormVisible = true;
    },
    // 编辑角色
    handleEdit(index, item) {
      this.editForm = JSON.parse(JSON.stringify(item));
      delete this.editForm.children;
      this.operate = JSON.parse(JSON.stringify(this.editForm));
      this.dialogTitle = "编辑角色";
      this.showDialog();
    },
    // 添加角色
    addRole() {
      delete this.editForm.id;
      this.editForm.roleName = "";
      this.editForm.roleDesc = "";
      this.dialogTitle = "添加角色";
      this.showDialog();
    },
    // 获取角色列表并关闭弹框
    refresh(flage) {
      if (flage) {
        this.getRoles();
        this.dialogFormVisible = false;
      }
    },
    // 删除角色
    async del(item) {
      let flage = await this.delRole(item.id);
      this.refresh(flage);
    },
    // 删除权限
    async closeTag(item, id, indexArr) {
      let flage = await this.delRoles({ roleId: item.id, rightId: id });
      if (indexArr.length === 1) {
        item.children.splice(indexArr[0], 1);
      } else if (indexArr.length === 2) {
        item.children[indexArr[0]].children.splice(indexArr[1], 1);
      } else if (indexArr.length === 3) {
        item.children[indexArr[0]].children[indexArr[1]].children.splice(
          indexArr[2],
          1
        );
      }
    },
    // 分配权限
    async handleAllot(index, item) {
      this.roleId = item.id;
      if (this.treeList.length === 0) {
        await this.authorityList("tree");
      }
      this.checkedKeys = [];
      item.children.map(items => {
        if (items.children.length > 0) {
          items.children.map(itemss => {
            if (itemss.children.length > 0) {
              itemss.children.map(itemsss => {
                this.checkedKeys.push(itemsss.id);
              });
            }
          });
        }
      });
      this.operate = JSON.parse(JSON.stringify(this.checkedKeys));
      this.dialogTitle = "分配权限";
      this.showDialog();
    },
    async add() {
      let flage = false;
      if (this.dialogTitle !== "分配权限") {
        this.$refs.editForm.validate(async valid => {
          if (valid) {
            if (this.dialogTitle === "编辑角色") {
              if (this.editForm === this.operate) {
                this.$message("暂未修改，请修改");
              } else {
                flage = await this.editRole(this.editForm);
              }
            } else if (this.dialogTitle === "添加角色") {
              flage = await this.addRoles(this.editForm);
            }
            this.refresh(flage);
          } else {
            this.$message({
              message: "请填写完整",
              type: "warning"
            });
            return false;
          }
        });
      } else {
        if (this.operate === this.checkedKeys) {
          this.$message("暂未修改，请修改");
        } else {
          this.$nextTick(async () => {
            let a = await this.$refs.rightsTree.getCheckedKeys();
            let b = await this.$refs.rightsTree.getHalfCheckedKeys();
            this.checkedKeys = a.concat(b);
            let rids = this.checkedKeys.join(",");
            flage = await this.impowerRole({
              roleId: this.roleId,
              rids
            });
            this.refresh(flage);
          });
        }
      }
    }
  },
  beforeMount() {
    this.getRoles();
  },
  mounted() {},
  watch: {},
  computed: {
    ...roleState(["roles", "treeList"])
  }
};
</script>

<style scoped lang='scss'>
.container {
  .top {
    width: 100%;
    margin-bottom: 20px;
  }
  .dialog {
    .dialog-item {
      height: 40px;
    }
  }
  .content {
    .level {
      border-top: 1px solid #eee;
      .right-icon {
        margin-left: 10px;
      }
      .levelone {
        flex: 1;
        padding: 10px 0;
        margin: 2px 0;
      }
      .leveltwo {
        flex: 4;
        .two-tag {
          margin: 5px 0;
        }
        .two-tag:nth-child(2n) {
          border-top: 1px solid #eee;
          border-bottom: 1px solid #eee;
          padding: 10px 0;
        }
        .levelthree {
          margin-left: 60px;
        }
      }
    }
  }
}
</style>