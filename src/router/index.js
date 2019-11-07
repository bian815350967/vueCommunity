import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    { // 首页
      path: '/',
      name: 'home',
      component: () => import('@/pages/home.vue')
    },
    { // 发布
      path: '/publish',
      name: 'publish',
      component: () => import('@/pages/publish.vue')
    },
    { // 消息
      path: '/message',
      name: 'message',
      component: () => import('@/pages/message.vue')
    },
    { // 登录
      path: '/login',
      name: 'login',
      component: () => import('@/pages/login.vue')
    },
    { // 个人中心
      path: '/personalCenter',
      name: 'personalCenter',
      component: () => import('@/pages/personalCenter.vue')
    },
    { // 内容详情
      path: '/details',
      name: 'details',
      component: () => import('@/pages/details.vue')
    }
  ]
})
