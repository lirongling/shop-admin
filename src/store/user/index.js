import api from "../../http/api"
import { Notification } from "element-ui"
import router from "../../router"

export default {
    namespaced: true,
    state: {
        users: []
    },
    mutations: {
        getUsers(state, data) {
            state.users = data
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
                let arr = this.state.user.users;
                if (res.meta.status === 201) {
                    console.log(this.state);
                    this.state.flage = true
                    arr.push(res.data)
                    commit("getUsers", arr)
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
                    this.state.flage = false
                }
            } catch (err) {
                this.state.flage = false
            }
        }
    },
}