import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}


const second_routes = [
    {
        path: '/Home',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
    },
    {
        path: '/Material',
        name: 'Material',
        component: () => import('@/views/MaterialInformationManage/Material'),
    },
    {
        path: '/PurchaseList',
        name: 'PurchaseList',
        component: () => import('@/views/PurchaseManage/PurchaseList'),
    },
    {
        path: '/AddPurchase',
        name: 'AddPurchase',
        component: () => import('@/views/PurchaseManage/AddPurchase'),
    },
    {
        path: '/EditPurchase',
        name: 'EditPurchase',
        component: () => import('@/views/PurchaseManage/EditPurchase'),
    },
    {
        path: '/about',
        name: 'About',
    },
]


const routes = [
    {
        path: '/',
        name: 'Main',
        redirect: '/Home',
        component: () => import('@/views/Main'),
        children: second_routes
    },
    {
        path: '/Login',
        name: 'Login',
        component: () => import('@/views/Login'),
    },

]

const router = new VueRouter({
    routes,
})

export default router
