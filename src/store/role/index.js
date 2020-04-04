import api from "../../http/api"
import { Notification } from "element-ui"
import router from "../../router"
import pinyin from "pinyin";

export default {
    namespaced: true,
    state: {
        menus: [],
        weather: {},
    },
    mutations: {
        setMenus(state, data) {
            state.menus = data
        },
        setWeather(state, data) {
            state.weather = data
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
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 获取天气
        async getWeather({ commit }, city) {
            try {
                let res = await api.getWeather(city)
                if (res.wea) {
                    let a = pinyin(res.wea, {
                        style: pinyin.STYLE_NORMAL // 设置拼音风格
                    }).join("");
                    res.dayPictureUrl = `http://api.map.baidu.com/images/weather/day/${a}.png`;
                    res.nightPictureUrl = `http://api.map.baidu.com/images/weather/night/${a}.png`;
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

    }
}