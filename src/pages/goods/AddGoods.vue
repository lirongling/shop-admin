<template>
  <div>
    <el-card class="box-card">
      <div class="container">
        <div class="top">
          <el-alert title="添加商品信息" type="info" center :closable="false"></el-alert>
          <div class="steps">
            <el-steps :active="Number(active)" finish-status="success">
              <el-step title="基本信息"></el-step>
              <el-step title="商品参数"></el-step>
              <el-step title="商品属性"></el-step>
              <el-step title="商品图片"></el-step>
              <el-step title="商品内容"></el-step>
              <el-step title="完成"></el-step>
            </el-steps>
          </div>
        </div>
        <div class="content">
          <div class="tabs">
            <el-tabs
              @tab-click="tabClick"
              tab-position="left"
              v-model="active"
              style="height: auto;"
            >
              <el-tab-pane label="基本信息">
                <div class="form">
                  <el-form
                    :model="information"
                    :rules="rulesInfo"
                    ref="information"
                    label-width="100px"
                    class="demo-ruleForm"
                    @validate="validate"
                  >
                    <el-form-item label="商品名称" :label-width="formLabelWidth" prop="goods_name">
                      <el-input v-model="information.goods_name" clearable autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" :label-width="formLabelWidth" prop="goods_price">
                      <el-input
                        :disabled="!(num>0&&valid>0)"
                        v-model="information.goods_price"
                        type="number"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" :label-width="formLabelWidth" prop="goods_number">
                      <el-input
                        :disabled="!(num>1&&valid>1)"
                        v-model="information.goods_number"
                        type="number"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量" :label-width="formLabelWidth" prop="goods_weight">
                      <el-input
                        :disabled="!(num>2&&valid>2)"
                        v-model="information.goods_weight"
                        type="number"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类" :label-width="formLabelWidth" required>
                      <el-cascader
                        ref="cascader"
                        clearable
                        :disabled="!(num>3&&valid>3)"
                        v-model="information.goods_cat"
                        :options="categories"
                        :props="props"
                      ></el-cascader>
                    </el-form-item>

                    <el-form-item label :label-width="formLabelWidth" v-show="num>4&&valid>4">
                      <el-button size="small" type="success" @click="next">下一步</el-button>
                    </el-form-item>
                  </el-form>
                </div>
              </el-tab-pane>
              <el-tab-pane label="商品参数" :disabled="flageInx<=1">
                <div class="tabs-content">
                  <el-button size="small" type="success" @click="next">下一步</el-button>
                </div>
              </el-tab-pane>
              <el-tab-pane label="商品属性" :disabled="flageInx<=2">
                <div class="tabs-content">
                  <div style="margin-bottom:20px">暂无属性</div>
                  <el-button size="small" type="success" @click="next">下一步</el-button>
                </div>
              </el-tab-pane>
              <el-tab-pane label="商品图片" :disabled="flageInx<=3">
                <div class="tabs-content">
                  <el-upload
                    :headers="headers"
                    class="upload-demo"
                    drag
                    action="/apis/upload"
                    :on-success="successUpload"
                    multiple
                  >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">
                      将文件拖到此处，或
                      <em>点击上传</em>
                    </div>
                    <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                  </el-upload>
                  <el-button style="margin-top:20px" size="small" type="success" @click="next">下一步</el-button>
                </div>
              </el-tab-pane>
              <el-tab-pane label="商品内容" :disabled="flageInx<=4">
                <div class="tabs-content">
                  <mavon-editor v-model="information.goods_introduce" />
                  <el-button
                    style="margin-top:20px"
                    size="small"
                    type="success"
                    @click="complete"
                  >完成</el-button>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { Notification } from "element-ui";
import { createNamespacedHelpers } from "vuex";
const goodModule = createNamespacedHelpers("good");
const { mapActions: goodAtions, mapState: goodState } = goodModule;
export default {
  data() {
    return {
      active: 0,
      flageInx: 1,
      headers: null,
      props: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
        expandTrigger: "hover"
      },
      information: {
        goods_name: "",
        goods_price: null,
        goods_number: null,
        goods_weight: null,
        goods_cat: [],
        goods_introduce: "",
        pics: [],
        attrs: []
      },
      num: 0,
      valid: 0,
      formLabelWidth: "120px",
      rulesInfo: {
        goods_name: [
          { required: true, message: "商品名名称不能为空", trigger: "change" }
        ],
        goods_price: [
          { required: true, message: "商品价格不能为空", trigger: "change" }
        ],
        goods_number: [
          { required: true, message: "商品数量不能为空", trigger: "change" }
        ],
        goods_weight: [
          { required: true, message: "商品重量不能为空", trigger: "change" }
        ],
        goods_cat: [
          { required: true, message: "请选择商品类型", trigger: "blur" }
        ]
      }
    };
  },
  components: {},
  props: {},
  methods: {
    ...goodAtions(["getCategories", "addGoods"]),
    next() {
      this.flageInx++;
      this.active = String(this.flageInx - 1);
    },
    // 验证部分信息
    validate(prop, flage, msg) {
      if (!flage) {
        this.valid = this.num - 1;
        this.flageInx = 1;
      } else {
        if (prop === "goods_name") {
          this.num > 0 ? null : this.num++;
        } else if (prop === "goods_price") {
          this.num > 1 ? null : this.num++;
        } else if (prop === "goods_number") {
          this.num > 2 ? null : this.num++;
        } else if (prop === "goods_weight") {
          this.num > 3 ? null : this.num++;
        }
        this.valid = this.num;
      }
    },
    // 确认增加
    async complete() {
      let information = JSON.parse(JSON.stringify(this.information));
      information.goods_cat = information.goods_cat.join(",");
      let res = await this.addGoods(information);
      if (!res) {
        this.information.pics = [];
      } else {
        this.$router.push("/goods/goods");
      }
    },
    // tab切换
    tabClick(e) {
      this.active = e.index;
      // this.flageInx = Number(e.index) + 1;
    },
    // 上传文件前
    successUpload(res, file, fileList) {
      if (res.meta.status === 200) {
        Notification({
          title: res.meta.msg,
          type: "success"
        });
        let a = { pic: `/tmp_uploads/${file.name}` };
        this.information.pics.push(a);
      }
    }
  },
  mounted() {},
  beforeMount() {
    this.headers = { Authorization: localStorage.getItem("adminToken") };
    this.getCategories({
      type: 3,
      pagenum: null,
      pagesize: null
    });
  },
  watch: {
    "information.goods_cat"(val) {
      if (val.length > 0) {
        this.num > 4 ? null : this.num++;
        this.valid = this.num;
      } else {
        this.valid = this.num - 1;
        this.flageInx = 1;
      }
    }
  },
  computed: {
    ...goodState(["categories"])
  }
};
</script>

<style scoped lang='scss'>
.container {
  height: 100% !important;
  .top {
    margin-left: 120px;
    margin-bottom: 20px;
    .steps {
      margin-top: 30px;
    }
  }
  .content {
    height: 100% !important;
    ::v-deep .el-tabs--left {
      overflow: visible;
    }
    .tabs {
      height: 100% !important;
      .form {
        height: 100% !important;
      }
      .tabs-content {
        margin: 20px;
      }
    }
  }
}
</style>