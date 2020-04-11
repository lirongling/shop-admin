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
        },
        {
            path: '/users/users',
            name: "users",
            component: () =>
                import ('../pages/users/Users'),
            meta: {
                title: '用户列表'
            }
        },
        {
            path: '/rights/roles',
            name: "roles",
            component: () =>
                import ('../pages/rights/Roles'),
            meta: {
                title: '权限列表'
            }
        },
        {
            path: '/rights/rights',
            name: "rights",
            component: () =>
                import ('../pages/rights/Rights'),
            meta: {
                title: '用户列表'
            }
        },
        {
            path: '/goods/goods',
            name: "goods",
            component: () =>
                import ('../pages/goods/Goods'),
            meta: {
                title: '商品管理'
            }
        },
        {
            path: '/goods/addGoods',
            name: "addGoods",
            component: () =>
                import ('../pages/goods/AddGoods'),
            meta: {
                title: '新增商品'
            }
        },
        {
            path: '/goods/params',
            name: "params",
            component: () =>
                import ('../pages/goods/Params'),
            meta: {
                title: '分类参数'
            }
        },
        {
            path: '/goods/categories',
            name: "categories",
            component: () =>
                import ('../pages/goods/Categories'),
            meta: {
                title: '商品分类'
            }
        },
        {
            path: '/orders/orders',
            name: "orders",
            component: () =>
                import ('../pages/orders/Orders'),
            meta: {
                title: '订单列表'
            }
        },
        {
            path: '/reports/reports',
            name: "reports",
            component: () =>
                import ('../pages/reports/Reports'),
            meta: {
                title: '数据报表'
            }
        },
    ]
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
    let adminToken = localStorage.getItem('adminToken')
    if (to.path === '/login')
        next()
    else
        adminToken ? next() : next('/login')
})

export default router