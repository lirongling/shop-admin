<template>
  <div class="grounp">
    <transition-group tag="div" class="container flex a-center">
      <div
        class="item flex a-center"
        :class="{'active' : activeId===item.id}"
        v-for="(item,index) in items"
        :key="item.id"
        @click="clickActive(item.id)"
        @contextmenu.prevent="more($event,item,index)"
        draggable="true"
        @dragstart="handleDragStart($event, item)"
        @dragover.prevent="handleDragOver($event, item)"
        @dragenter="handleDragEnter($event, item)"
        @dragend="handleDragEnd($event, item)"
      >
        <div class="circle" v-if="activeId===item.id"></div>
        <div class="name" :class="{'active-name' : activeId===item.id}">{{item.authName}}</div>
        <div class="close" v-if="activeId===item.id" @click.stop="delActive(item,index)">
          <i class="el-icon-close"></i>
        </div>
      </div>
    </transition-group>
    <div class="menus" id="problemList" :style="{left:offsetX,top:offsetY}">
      <div @click="closeItem(1)">关闭左侧</div>
      <div @click="closeItem(2)">关闭右侧</div>
      <div @click="closeItem(3)">关闭其他</div>
      <div @click="closeItem(4)">关闭当前</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [],
      dragging: null,
      activeId: 0,
      num: -1,
      offsetY: "",
      offsetX: "",
      activeIdx: null
    };
  },
  components: {},
  props: {
    activeList: {
      type: Array,
      default: () => []
    },
    actives: {
      type: String,
      default: () => 0
    }
  },
  methods: {
    // 拖拽前
    handleDragStart(e, item) {
      this.dragging = item;
    },
    // 拖拽后
    handleDragEnd(e, item) {
      this.dragging = null;
    },
    //首先把div变成可以放置的元素，即重写dragenter/dragover
    handleDragOver(e) {
      e.dataTransfer.dropEffect = "move"; // e.dataTransfer.dropEffect="move";//在dragenter中针对放置目标来设置!
    },
    handleDragEnter(e, item) {
      e.dataTransfer.effectAllowed = "move"; //为需要移动的元素设置dragstart事件
      if (item === this.dragging) {
        return;
      }
      const newItems = [...this.items];
      console.log(newItems);
      const src = newItems.indexOf(this.dragging);
      const dst = newItems.indexOf(item);

      newItems.splice(dst, 0, ...newItems.splice(src, 1));

      this.items = newItems;
      localStorage.setItem("activeList", JSON.stringify(this.items));
    },
    // 点击选中
    clickActive(id) {
      this.activeId = id;
      this.$emit("send", String(id));
    },
    // 删除选中
    delActive(item, index) {
      this.items.splice(index, 1);
      if (this.items.length > 0) {
        if (this.items.length === index) {
          this.activeId = this.items[index - 1].id;
        } else {
          this.activeId = this.items[index].id;
        }
        localStorage.setItem("activeList", JSON.stringify(this.items));
      } else {
        setTimeout(() => {
          this.items = [{ id: 0, authName: "首页", url: "/" }];
          this.activeId = this.items[0].id;
          localStorage.setItem("activeList", JSON.stringify(this.items));
        }, 500);
      }
      this.$emit("send", String(this.activeId));
    },
    // 右击事件
    more(e, item, index) {
      this.offsetX = e.pageX + "px";
      this.offsetY = e.pageY + "px";
      this.num = item.id;
      this.activeIdx = index;
      document.getElementById("problemList").style.display = "block";
    },
    // 关闭选项
    closeItem(index) {
      if (index === 1) {
        if (this.activeIdx) {
          this.items.splice(0, this.activeIdx);
          let flage = this.items.findIndex(item => item.id === this.activeId);
          if (flage === -1) {
            this.activeId = this.items[0].id;
            this.$emit("send", String(this.activeId));
          }
        } else {
          this.$message("当前已经是第一条了哟");
        }
      } else if (index === 4) {
        this.delActive(null, this.activeIdx);
      } else if (index === 2) {
        if (this.activeIdx === this.items.length - 1) {
          this.$message("当前已经是最后第一条了哟");
        } else {
          this.items.splice(this.activeIdx + 1);
          let flage = this.items.findIndex(item => item.id === this.activeId);
          if (flage === -1) {
            this.activeId = this.items[this.items.length - 1].id;
            this.$emit("send", String(this.activeId));
          }
        }
      } else if (index === 3) {
        if (this.items.length > 1) {
          this.items = [this.items[this.activeIdx]];
          this.activeId = this.items[0].id;
          this.$emit("send", String(this.activeId));
        } else {
          this.$message("只有一条数据了哟");
        }
      }
      localStorage.setItem("activeList", JSON.stringify(this.items));
    }
  },
  mounted() {
    this.$bus.$on("send", data => {
      let flage = this.items.findIndex(
        item => item.id === data.id && item.authName === data.authName
      );
      if (flage === -1) {
        this.items.push(data);
        localStorage.setItem("activeList", JSON.stringify(this.items));
      }
      this.activeId = data.id;
    });
  },
  beforeMount() {
    this.items = JSON.parse(JSON.stringify(this.activeList));
    this.activeId = Number(this.actives);
  },
  beforeDestroy() {},
  beforeUpdate() {
    // localStorage.setItem("activeList", JSON.stringify(this.items));
  },
  updated() {
    // this.items = JSON.parse(localStorage.getItem("activeList"));
  },
  created() {
    document.onclick = function() {
      // 要关闭的div的id (problemList)
      document.getElementById("problemList").style.display = "none";
    };
  },
  watch: {},
  computed: {}
};
</script>

<style scoped lang='scss'>
.grounp {
  position: relative;
}
.container {
  position: relative;
  .item {
    border: 1px solid #ddd;
    font-size: 12px;
    padding: 2px 10px;
    margin-right: 5px;
    position: relative;
    z-index: 1;
    cursor: pointer;
    transition: all linear 0.3s;
    .circle {
      height: 8px;
      width: 8px;
      background: #fff;
      border-radius: 50%;
      margin-right: 5px;
    }
    .active-name {
      padding-right: 10px;
    }
    .close {
      position: absolute;
      font-size: 12px;
      top: 50%;
      transform: translateY(-50%);
      right: 6px;
      // padding-right: 2px;
      z-index: 2020;
    }
  }
  .active {
    background: #409eff;
    color: #fff;
  }
}
.menus {
  display: none;
  position: fixed;
  background: #fff;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
  color: #333;
  border-radius: 4px;
  font-size: 12px;
  padding: 5px;
  z-index: 9999;
  cursor: pointer;
  div {
    padding: 7px 5px;
    z-index: 9999;
  }
}
</style>