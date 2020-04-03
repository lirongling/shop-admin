import api from "../../http/api"
import { Notification } from "element-ui"
import router from "../../router"

export default {
    namespaced: true,
    state: {},
    mutations: {},
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
        }
    },
}