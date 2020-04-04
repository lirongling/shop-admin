import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../pages/Home.vue'
import Comm from '../pages/comm/Comm.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/home',
    // 重定向
    redirect: '/'
}, {
    path: "/",
    component: Comm,
    children: [{
        path: '/',
        name: "home",
        component: Home,
        meta: {
            title: '首页'
        }
    }, ]
}, {
    path: '/login',
    name: 'login',
    component: () =>
        import ('../pages/login/Login'),
    meta: {
        title: '登录'
    }
}, ]

const isPro = process.env.NODE_ENV === 'production'


const router = new VueRouter({
    mode: isPro ? 'hash' : 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    document.title = to.meta.title
        // let loginMsg = localStorage.getItem('loginMsg')
        // if (to.path==='/login')
        //     next()
        // else
        //     loginMsg ? next():next('/login')
        // if (to.path==='/edit'||to.path==='/look') {
        //     let a=to.query._id
        //     a ? next():next('/published')
        // }
        // console.log(from.path)
        // console.log(to.path === from.path)
        // if (!(from.path == '/login' && to.path === from.path)) {

    // } else {
    //     next(false)
    // }

    next()


})

export default router