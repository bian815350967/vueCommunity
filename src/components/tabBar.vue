<template>
  <cube-tab-bar
    class="tabbar-bottom"
    v-model="selectedLabelSlots"
    show-slider>
    <cube-tab v-for="(item, index) in tabs" :label="item.label" :key="item.label" @click.native="gotoPath(item, index)">
      <i slot="icon" :class="item.icon"></i>
      <div>{{item.label}}</div>
    </cube-tab>
  </cube-tab-bar>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {
      selectedLabelSlots: '首页',
      tabs: [{
        label: '首页',
        path: '/',
        icon: 'cubeic-home'
      }, {
        label: '发布',
        path: '/publish',
        icon: 'cubeic-like'
      }, {
        label: '消息',
        path: '/message',
        icon: 'cubeic-vip'
      }, {
        label: '我的',
        path: '/my',
        icon: 'cubeic-person'
      }]
    }
  },
  methods: {
    gotoPath (item, index) {
      if (index === 3) {
        let loginname = localStorage.getItem('__userName__')
        console.log(loginname)
        if (loginname) {
          this.$router.push('/personalCenter')
        } else {
          this.$router.push('/login')
        }
      } else {
        this.$router.push(item.path)
      }
    },
    getRoute () {
      if (this.$route.path === '/') this.selectedLabelSlots = '首页'
      if (this.$route.path === '/publish') this.selectedLabelSlots = '发布'
      if (this.$route.path === '/message') this.selectedLabelSlots = '消息'
      if (this.$route.path === '/personalCenter') this.selectedLabelSlots = '我的'
      if (this.$route.path === '/login') this.selectedLabelSlots = '我的'
    }
  },
  created () {
    this.getRoute()
  },
  watch: {
    '$route': 'getRoute'
  }
}
</script>

<style scoped lang="stylus">
.tabbar-bottom
  position: fixed
  bottom: 0
  left: 0
  width: 100%
  z-index: 80
  background-color: #fff
  border-top: 1px solid rgba(0,0,0,0.1);
  >>> .cube-tab div
    margin-top: 10px
</style>
