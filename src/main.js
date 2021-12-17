import Vue from 'vue'
import './plugins/axios'
import App from '@/App.vue'
import router from './router'
import store from './store'
import '@/assets/css/global.css'
import './plugins/element.js'

// NProgress
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.config.productionTip = false
// 在request拦截器中展示进度条
axios.interceptors.request.use(config => {
  NProgress.start()
  // config.headers.Authorization = JSON.parse(window.localStorage.getItem('vuex-along')).root.userInfo.token
  return config
})
// 在response拦截器中隐藏进度条
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
// axios挂载到this.$http中
Vue.prototype.$http = axios
// 默认后端地址
axios.defaults.baseURL = 'http://localhost:8090/'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
