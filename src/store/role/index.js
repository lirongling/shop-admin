import api from "../../http/api"
import { Notification } from "element-ui"
import router from "../../router"
import pinyin from "pinyin";

export default {
    namespaced: true,
    state: {
        menus: [],
        weather: {},
        roles: [],
        treeList: [],
        list: [],
    },
    mutations: {
        setMenus(state, data) {
            state.menus = data
        },
        setWeather(state, data) {
            state.weather = data
        },
        getRole(state, data) {
            state.roles = data
        },
        setTree(state, data) {
            state.treeList = data
        },
        setList(state, data) {
            state.list = data
        },
    },
    actions: {
        // 左侧菜单权限
        async getMenus({ commit }) {
            try {
                let res = await api.getMenus()
                if (res.meta.status === 200) {
                    commit("setMenus", res.data)
                    return res.data
                } else if (res.meta.status === 400) {
                    router.push('/login')
                    Notification({
                        title: res.meta.msg,
                        type: 'warning'
                    });
                } else {
                    Notification({
                        title: res.meta.msg,
                        type: 'warning'
                    });
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 获取天气
        async getWeather({ commit }, city) {
            try {
                let res = await api.getWeather(city)
                    // console.log(res);
                if (res.wea_img) {
                    // let a = pinyin(res.wea, {
                    //     style: pinyin.STYLE_NORMAL // 设置拼音风格
                    // }).join("");
                    res.dayPictureUrl = `http://api.map.baidu.com/images/weather/day/${res.wea_img}.png`;
                    res.nightPictureUrl = `http://api.map.baidu.com/images/weather/night/${res.wea_img}.png`;
                    res.pictureUrl = res.dayPictureUrl;
                    let hour = new Date().getHours();
                    if (hour >= 18 || hour < 6) {
                        res.pictureUrl = res.nightPictureUrl;
                    }
                    commit("setWeather", res)
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 角色列表
        async getRoles({ commit }) {
            try {
                let res = await api.getRoles()
                if (res.meta.status === 200) {

                    commit("getRole", res.data)
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
        // 编辑提交角色
        async editRole({ commit }, params) {
            try {
                let res = await api.editRole(params.id, params)
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
        // 编辑提交角色
        async editRole({ commit }, params) {
            try {
                let res = await api.editRole(params.id, params)
                if (res.meta.status === 200) {
                    Notification({
                        title: '修改成功',
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
        // 添加角色
        async addRoles({ commit }, params) {
            try {
                let res = await api.addRoles(params)
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
        // 删除角色
        async delRole({ commit }, id) {
            try {
                let res = await api.delRole(id)
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
        // 权限管理
        async authorityList({ commit }, type) {
            try {
                let res = await api.authorityList(type)
                if (res.meta.status === 200) {
                    if (type === "tree") {
                        commit("setTree", res.data)
                    } else {
                        commit("setList", res.data)
                    }

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
        // 角色授权
        async impowerRole({ commit }, params) {
            try {
                let res = await api.impowerRole(params.roleId, params.rids)
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
        // 删除角色指定权限
        async delRoles({ commit }, params) {
            try {
                let res = await api.delRoles(params.roleId, params.rightId)
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
    }
}