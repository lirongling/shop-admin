import api from "../../http/api"
import { Notification } from "element-ui"
import router from "../../router"

export default {
    namespaced: true,
    state: {
        users: [],
        total: null
    },
    mutations: {
        getUsers(state, data) {
            state.users = data
        },
        getTotal(state, data) {
            state.total = data
        },
    },
    actions: {
        // 只能传两个参数 第一个为store对象 第二个接口需要的
        // 登录
        async login({ commit }, params) {
            try {
                let res = await api.login(params)
                if (res.meta.status === 200) {
                    localStorage.setItem('userInfo', JSON.stringify(res.data))
                    localStorage.setItem('adminToken', res.data.token)
                    router.push('/home')
                    Notification({
                        title: '登录成功',
                        type: 'success'
                    });
                } else if (res.meta.status === 400) {
                    Notification({
                        title: res.meta.msg,
                        type: 'warning'
                    });
                }
            } catch (err) {
                console.log(err)
            }
        },
        // 获取用户列表
        async getUserList({ commit }, { query, pagenum, pagesize }) {
            try {
                let res = await api.getUserList(query, pagenum, pagesize)
                if (res.meta.status === 200) {
                    commit("getUsers", res.data.users)
                    commit("getTotal", res.data.total)
                } else {
                    Notification({
                        title: res.meta.msg,
                        type: 'warning'
                    });
                }
            } catch (err) {
                console.log(err)
            }
        },
        // 添加用户
        async addUser({ commit }, params) {
            try {
                let res = await api.addUser(params)
                if (res.meta.status === 201) {
                    Notification({
                        title: res.meta.msg,
                        type: 'success'
                    });
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
        // 修改用户状态
        async modifyUser({ commit }, { uId, type }) {
            try {
                let res = await api.modifyUser(uId, type)
                if (res.meta.status === 200) {
                    Notification({
                        title: res.meta.msg,
                        type: 'success'
                    });
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
        // 编辑用户提交
        async editUser({ commit }, params) {
            try {
                let res = await api.editUser(params.id, params)
                if (res.meta.status === 200) {
                    Notification({
                        title: res.meta.msg,
                        type: 'success'
                    });
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
        // 删除单个用户
        async delUser({ commit }, id) {
            try {
                let res = await api.delUser(id)
                if (res.meta.status === 200) {
                    Notification({
                        title: res.meta.msg,
                        type: 'success'
                    });
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
        // 分配用户角色
        async allotUser({ commit }, { id, rid }) {
            try {
                let res = await api.allotUser(id, { rid })
                if (res.meta.status === 200) {
                    Notification({
                        title: res.meta.msg,
                        type: 'success'
                    });
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
    },
}