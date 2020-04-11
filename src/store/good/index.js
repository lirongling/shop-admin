import api from "../../http/api"
import { Notification } from "element-ui"
import router from "../../router"

export default {
    namespaced: true,
    state: {
        goods: [],
        total: null,
        categories: [],
        categoryTwo: [],
        attributes: [],
        cateTotal: null,
    },
    mutations: {
        setGoods(state, data) {
            state.goods = data
        },
        setTotal(state, data) {
            state.total = data
        },
        setCategories(state, data) {
            state.categories = data
        },
        setCategoryTwo(state, data) {
            state.categoryTwo = data
        },
        setAttributes(state, data) {
            state.attributes = data
        },
        setCateTotal(state, data) {
            state.cateTotal = data
        },
    },
    actions: {
        // 商品管理
        // 获取用户列表
        async getGoods({ commit }, { type, pagenum, pagesize }) {
            try {
                let res = await api.getGoods(type, pagenum, pagesize)
                if (res.meta.status === 200) {
                    commit("setGoods", res.data.goods)
                    commit("setTotal", res.data.total)
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
        // 编辑商品
        async editGoods({ commit }, { id, from }) {
            try {
                let res = await api.editGoods(id, from)
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
                console.log(err);
                return false
            }

        },
        // 删除商品
        async delGoods({ commit }, id) {
            try {
                let res = await api.delGoods(id)
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
                console.log(err);
                return false
            }

        },
        // 商品分类管理
        async getCategories({ commit }, { type, pagenum, pagesize }) {
            try {
                let res = await api.getCategories(type, pagenum, pagesize)
                if (res.meta.status === 200) {
                    if (type == 2) {
                        commit("setCategoryTwo", res.data)
                    } else {
                        if (pagenum) {
                            commit("setCateTotal", res.data.total)
                            commit("setCategories", res.data.result)
                        } else {
                            commit("setCategories", res.data)
                        }
                    }
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
        // 添加商品
        async addGoods({ commit }, params) {
            try {
                let res = await api.addGoods(params)
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
                console.log(err);
                return false
            }

        },
        // 分类参数管理
        async getAttributes({ commit }, { id, sel }) {
            try {
                let res = await api.addGoods(id, sel)
                if (res.meta.status === 200) {
                    commit("setAttributes", res.data)
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
                console.log(err);
                return false
            }

        },
        // 添加分类
        async addCategory({ commit }, params) {
            try {
                let res = await api.addCategory(params)
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
                console.log(err);
                return false
            }

        },
        // 编辑提交分类
        async editCategory({ commit }, params) {
            try {
                let res = await api.editCategory(params.id, params.cat_name)
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
                console.log(err);
                return false
            }

        },
        // 删除分类
        async delCategory({ commit }, id) {
            try {
                let res = await api.delCategory(id)
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
                console.log(err);
                return false
            }

        },
    }
}