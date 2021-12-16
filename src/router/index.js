import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'

Vue.use(VueRouter)

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
