<template>
  <div class="container">
    <div class="nav flex a-center j-between">
      <div class="nav-left">欢迎来到小艾后台系统</div>
      <div class="nav-right flex a-center">
        <div class="time">{{time}}</div>
        <div class="weather flex a-center" v-if="weather.wea">
          <img :src="weather.pictureUrl" alt />
          <div>{{weather.wea}}</div>
        </div>
        <div class="user">亲爱的,{{userInfo.username}}</div>
        <div class="excit">
          <el-button type="text" @click="excit">退出</el-button>
        </div>
      </div>
    </div>
    <div class="content flex">
      <div class="nav-menu">
        <el-menu
          :default-active="active"
          :unique-opened="true"
          class="el-menu-vertical-demo"
          @select="handleSelect"
        >
          <el-menu-item index="0">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-submenu :index="''+item.id" v-for="item in menus" :key="item.id">
            <template slot="title">
              <i :class="getIcon(item.id)"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item :index="''+items.id" v-for="items in item.children" :key="items.id">
                <template slot="title">
                  <i :class="getIcon(items.id)"></i>
                  <span>{{items.authName}}</span>
                </template>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </div>
      <div class="main">
        <div class="main-title flex a-center">
          <group :activeList="activeList" :actives="active" @send="send" v-if="activeList.length>0"></group>
        </div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const roleModule = createNamespacedHelpers("role");
const { mapActions: roleAtions, mapState: roleState } = roleModule;
import group from "../../components/comm/Group";
export default {
  data() {
    return {
      userInfo: {},
      time: null,
      interval: null,
      city: null,
      activeList: [],
      navList: [
        { id: 0, authName: "首页", url: "/", icon: "el-icon-user" },
        { id: null, url: "", icon: "el-icon-folder-opened" },
        { id: null, url: "", icon: "el-icon-folder" },
        { id: null, url: "", icon: "el-icon-setting" },
        { id: null, url: "", icon: "el-icon-c-scale-to-original" },
        { id: null, url: "", icon: "el-icon-goods" },
        { id: null, url: "", icon: "el-icon-help" },
        { id: null, url: "", icon: "el-icon-bell" },
        { id: null, url: "", icon: "el-icon-date" },
        { id: null, url: "", icon: "el-icon-s-order" },
        { id: null, url: "", icon: "el-icon-folder-add" },
        { id: null, url: "", icon: "el-icon-message" },
        { id: null, url: "", icon: "el-icon-position" },
        { id: null, url: "", icon: "el-icon-odometer" }
      ],
      active: "0"
    };
  },
  components: {
    group
  },
  props: {},
  methods: {
    ...roleAtions(["getMenus", "getWeather"]),
    getTime() {
      let a = new Date().getTime();
      let time1 = this.$dayjs(a).format("YYYY/MM/DD");
      if (
        this.weather.date &&
        time1.slice(-1) !== this.weather.date.slice(-1)
      ) {
        this.getWeather(this.city);
      }
      let time2 = this.$dayjs(a).format("HH:mm:ss");
      let hour = new Date().getHours();
      if (hour >= 0 && hour < 6) {
        this.time = time1 + " 凌晨 " + time2;
        return;
      } else if (hour >= 6 && hour < 12) {
        this.time = time1 + " 上午 " + time2;
        return;
      } else if (hour >= 12 && hour < 18) {
        this.time = time1 + " 下午 " + time2;
        return;
      } else {
        this.time = time1 + " 晚上 " + time2;
        return;
      }
    },
    // 获取城市
    getCity() {
      let _this = this;
      AMap.plugin("AMap.CitySearch", function() {
        var citySearch = new AMap.CitySearch();
        citySearch.getLocalCity(function(status, result) {
          if (status === "complete" && result.info === "OK") {
            _this.city = result.city.slice(0, -1);
            _this.getWeather(_this.city);
          } else {
            // _this.city = "查询失败";
          }
        });
      });
    },
    // 退出登录
    excit() {
      localStorage.removeItem("userInfo");
      localStorage.removeItem("adminToken");
      this.$router.push("/login");
      this.$notify({
        title: "退出成功",
        type: "success"
      });
    },
    getIcon(id) {
      let item = this.navList.find(item => item.id === id);
      if (item) {
        return item.icon;
      }
      return;
    },
    send(val) {
      this.active = val;
      // console.log(val);
      let item = this.navList.find(item => item.id == val);
      this.$router.push(`${item.url}`);
    },
    // handleOpen(key, keyPath) {
    //   this.active = key;
    // },
    handleSelect(key, keyPath) {
      let id = Number(key);
      let item = this.navList.find(item => item.id === id);
      let a = JSON.parse(JSON.stringify(item));
      delete a.icon;
      this.$bus.$emit("send", a);
      this.$router.push({ path: `${item.url}` });
    },
    async getMenuList() {
      let a = await this.getMenus();
      let index = 1;
      let url = "";
      a.map(item => {
        if (item.children.length === 0) {
          this.navList[index].authName = item.authName;
          index++;
          url = item.path;
        } else if (item.children.length > 0) {
          this.navList[index].authName = item.authName;
          this.navList[index].id = item.id;
          index++;
          url = item.path;
          item.children.map(items => {
            if (items.children.length === 0) {
              this.navList[index].authName = items.authName;
              this.navList[index].id = items.id;
              this.navList[index].url = `/${url}/${items.path}`;
              index++;
            }
          });
        }
      });
      let path = this.$route.path;
      let item = this.navList.find(item => item.url === path);
      this.active = String(item.id);
      this.getActive(item);
    },
    getActive(item) {
      if (localStorage.getItem("activeList")) {
        let activeList = JSON.parse(localStorage.getItem("activeList"));
        let flage = activeList.findIndex(items => items.id === item.id);
        if (flage === -1) {
          delete item.icon;
          activeList.push(item);
        }
        this.activeList = activeList;
      } else {
        delete item.icon;
        this.activeList = [item];
      }
    }
  },
  beforeMount() {
    this.getCity();
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.interval = setInterval(this.getTime, 1000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  mounted() {
    this.getMenuList();
  },
  watch: {},
  computed: {
    ...roleState(["menus", "weather"])
  }
};
</script>

<style scoped lang='scss'>
::v-deep .el-menu-vertical-demo {
  width: 200px;
  height: calc(100vh - 60px);
}
.container {
  .nav {
    background: #fff;
    width: 100%;
    color: #2e5e85;
    position: fixed;
    height: 60px;
    top: 0;
    z-index: 99;
    border-bottom: 1px solid #f0f2f5;
    padding-left: 40px;
    padding-right: 50px;
    box-sizing: border-box;
    .nav-left {
    }
    .nav-right {
      div {
        margin-left: 20px;
      }
    }
  }
  .content {
    box-sizing: border-box;
    padding-top: 60px;
    height: 100vh;
    .nav-menu {
      padding-left: 40px;
      height: 100%;
      width: 200px;
    }
    .main {
      flex: 1;
      padding: 20px;
      .main-title {
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
        min-height: 33px;
      }
    }
  }
}
</style>