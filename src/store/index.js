import Vue from 'vue'
import Vuex from 'vuex'
import user from "./user"
import role from "./role"
import good from "./good"
import order from "./order"

Vue.use(Vuex)

// 只放公共的状态
export default new Vuex.Store({
    state: {
        activeList: [],
        flage: null
    },
    mutations: {},
    actions: {},
    modules: {
        user,
        role,
        good,
        order,
    }
})