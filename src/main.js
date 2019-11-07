// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'babel-polyfill' // 兼容ie
import Cube from 'cube-ui'
// 引入nprogress
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' // 这个样式必须引入
import api from './api/api'
import VueLazyload from 'vue-lazyload'

import hljs from 'highlight.js'
import 'highlight.js/styles/googlecode.css' // 样式文件
import 'cube-ui/lib/cube.min.css'

Vue.directive('highlight', function (el) {
  let blocks = el.querySelectorAll('pre code')
  blocks.forEach((block) => {
    hljs.highlightBlock(block)
  })
})

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: require('./assets/img/common/avatar.jpg'),
  loading: require('./assets/img/common/avatar.jpg'),
  attempt: 1
})

Vue.use(Cube)
Vue.prototype.$fetch = api

Vue.config.productionTip = false

Vue.prototype.$getDateDiff = function (dateTimeStamp) {
  let time = Date.parse(dateTimeStamp)
  var minute = 1000 * 60
  var hour = minute * 60
  var day = hour * 24
  var month = day * 30
  var year = month * 12
  var now = new Date().getTime()
  var diffValue = now - time
  if (diffValue < 0) { return }
  var yearC = diffValue / year
  var monthC = diffValue / month
  var weekC = diffValue / (7 * day)
  var dayC = diffValue / day
  var hourC = diffValue / hour
  var minC = diffValue / minute
  let result
  if (yearC >= 1) {
    result = '' + Math.round(yearC) + '年前'
  } else if (monthC >= 1) {
    result = '' + Math.round(monthC) + '月前'
  } else if (weekC >= 1) {
    result = '' + Math.round(weekC) + '周前'
  } else if (dayC >= 1) {
    result = '' + Math.round(dayC) + '天前'
  } else if (hourC >= 1) {
    result = '' + Math.round(hourC) + '小时前'
  } else if (minC >= 1) {
    result = '' + Math.round(minC) + '分钟前'
  } else {
    result = '' + '几秒前'
  }
  return result
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
}).$mount('#app')

// 进度条
NProgress.configure({
  showSpinner: false,
  bg: '#ff4081',
  minimum: 0.6,
  easing: 'ease',
  speed: 200
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})

router.afterEach(() => {
  window.scrollTo(0, 0)
  NProgress.done()
})
