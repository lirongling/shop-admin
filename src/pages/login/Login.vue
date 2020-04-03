<template>
  <div class="container flex a-center j-center">
    <el-card class="box-card" shadow="hover">
      <div class="content">
        <div class="content-title">
          <h1>欢迎来到小艾后台管理系统</h1>
        </div>
        <div class="content-from">
          <el-form
            label-position="left"
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="150px"
          >
            <el-form-item label="请输入用户名" prop="username">
              <el-input v-model="ruleForm.username"></el-input>
            </el-form-item>
            <el-form-item label="请输入密码" prop="password">
              <el-input v-model="ruleForm.password"></el-input>
            </el-form-item>
            <div class="remind">特别提醒: 如果您是管理员,请使用管理员账号登录,如果不知道账号,请联系公司人事。</div>
            <div class="btn flex j-center">
              <el-button type="primary" @click="submit('ruleForm')">立即登录</el-button>
            </div>
          </el-form>
          <!-- 提醒 -->

          <div></div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const userModule = createNamespacedHelpers("user");
const { mapActions: userAtions } = userModule;
export default {
  data() {
    return {
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码至少为六位", trigger: "blur" }
        ]
      }
    };
  },
  components: {},
  props: {},
  methods: {
    ...userAtions(["login"]),
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.login(this.ruleForm);
        } else {
          this.$message({
            message: "请完成表单验证",
            type: "warning"
          });
        }
      });
    }
  },
  mounted() {},
  watch: {},
  computed: {}
};
</script>

<style scoped lang='scss'>
.container {
  background: url("http://49.233.66.125/shop-admin/img/bj.2753abc2.jpg");
  height: 100vh;
  background-size: cover;
  .content {
    width: auto;
    .content-title {
      text-align: center;
      border-bottom: 1px solid #ebeef5;
      padding: 18px 20px;
      box-sizing: border-box;
    }
    .content-from {
      padding: 20px;
    }
    .remind {
      text-align: center;
    }
    .btn {
      padding: 20px;
    }
  }
}
</style>