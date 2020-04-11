import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './global'
import './filters'
import dayjs from 'dayjs'
import api from './http/api'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import './bus'
import ZkTable from 'vue-table-with-tree-grid'
// 引入echarts
import echarts from 'echarts'

Vue.use(ElementUI)
Vue.use(mavonEditor)
Vue.use(ZkTable)
Vue.prototype.$dayjs = dayjs
Vue.prototype.$api = api
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')