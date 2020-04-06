<template>
  <div class="container flex a-center j-center">欢迎来到小爱后台管理系统</div>
</template>

<script>
export default {
  name: "",
  props: {},
  components: {},
  data() {
    return {};
  },
  methods: {
    send() {
      this.$bus.$emit("send", this.msg);
    }
  },
  mounted() {},
  watch: {},
  computed: {}
};
</script>

<style scoped lang='scss'>
.container {
  font-size: 24px;
  font-weight: 700;
  position: relative;
  top: 20%;
}
</style>