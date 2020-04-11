import api from "../../http/api"
import { Notification } from "element-ui"
import router from "../../router"
export default {
    namespaced: true,
    state: {
        orders: [],
        total: null,
        logistics: [],
        reports: {}
    },
    mutations: {
        setOrders(state, data) {
            state.orders = data
        },
        setTotal(state, data) {
            state.total = data
        },
        setLogistics(state, data) {
            state.logistics = data
        },
        setReports(state, data) {
            state.reports = data
        },

    },
    actions: {
        // 角色列表
        async getOrders({ commit }, { query, pagenum, pagesize }) {
            try {
                let res = await api.getOrders(query, pagenum, pagesize)
                if (res.meta.status === 200) {
                    commit("setOrders", res.data.goods)
                    commit("setTotal", res.data.total)
                        // Notification({
                        //     title: res.meta.msg,
                        //     type: 'success'
                        // });
                    return true
                } else {
                    Notification({
                        title: res.meta.msg,
                        type: 'warning'
                    });
                    return false
                }
            } catch (err) {
                return false
            }
        },
        // 查看物流信息
        async getKuaidi({ commit }, id) {
            try {
                let res = await api.getKuaidi(id)
                if (res.meta.status === 200) {
                    commit("setLogistics", res.data)
                    return true
                } else {
                    Notification({
                        title: res.meta.msg,
                        type: 'warning'
                    });
                    return false
                }
            } catch (err) {
                return false
            }
        },
        // 数据统计
        async getReports({ commit }) {
            try {
                let res = await api.getReports()
                if (res.meta.status === 200) {
                    commit("setReports", res.data)
                    return true
                } else {
                    Notification({
                        title: res.meta.msg,
                        type: 'warning'
                    });
                    return false
                }
            } catch (err) {
                return false
            }
        },
    }
}