import Vue from 'vue'
import Vuex from 'vuex'
import user from "./user"
import role from "./role"

Vue.use(Vuex)

// 只放公共的状态
export default new Vuex.Store({
    state: {
        activeList: []
    },
    mutations: {},
    actions: {},
    modules: {
        user,
        role,
    }
})