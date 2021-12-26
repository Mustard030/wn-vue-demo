import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'

Vue.use(VueRouter)

//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    name:'Main',
    redirect:'/Home'
  },
  {
    path: '/Home',
    name: 'Home',
    component: Home,
  },
  {
    path: '/Material',
    name: 'Material',
    component: () => import('@/components/MaterialInformationManage/Material'),
  },
  {
    path: '/about',
    name: 'About',
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
]

const router = new VueRouter({
  routes,
})

export default router
