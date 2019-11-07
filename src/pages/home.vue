<template>
  <div class="home-w">
    <fixed-top :title="title"></fixed-top>
    <div class="home-content">
      <scroll></scroll>
    </div>
    <v-tab-bar></v-tab-bar>
  </div>
</template>

<script>
export default {
  data () {
    return { // 全部 精华 weex 分享 问答 招聘
      selectedLabelSlots: '全部',
      title: 'Vue.js 中文社区',
      tabs: [{
        label: '全部',
        path: ''
      }, {
        label: '精华',
        path: 'good'
      }, {
        label: 'weex',
        path: 'weex'
      }, {
        label: '分享',
        path: 'share'
      }, {
        label: '问答',
        path: 'ask'
      }, {
        label: '招聘',
        path: 'job'
      }]
    }
  },
  components: {
    scroll: resolve => require(['@/components/scroll.vue'], resolve),
    fixedTop: resolve => require(['@/components/fixedTop.vue'], resolve),
    vTabBar: resolve => require(['@/components/tabBar.vue'], resolve)
  }
}
</script>

<style scoped lang="stylus">
.home-w
  .tabbar-top
    position: fixed
    left: 0
    top: 50px
    width: 100%
    height: 50px
    display: flex
    align-items center
    justify-content space-between
    background-color: #009688
    border-bottom: 1px solid #fff
    >>> .cube-tab
          color rgba(255,255,255,.3)
          &.cube-tab_active
            color #fff
    >>> .cube-tab-bar-slider
      background-color: #ff4081
  .home-content
    position: fixed
    top: 50px
    bottom: 58px
    left: 0
    width: 100%
    .uls
      .list-item
        width: 100%
        display: flex
        align-items center
        padding: 10px
        .avatar
          width: 50px
          height 50px
          margin-right: 10px
          img
            width: 100%
            border-radius 50%
            display: block
        .content
          flex 1
          .title-w
            .title-icon
              background-color: #009688
              color #fff
              padding: 2px
            .title-msg
              display inline
              font-size: 16px
              font-weight: bold
              overflow hidden
              white-space nowrap
              margin-left: 2px
          .desc-w
            margin-top: 10px
            display: flex
            align-items center
            justify-content space-between
            color #333
            font-size: 12px
</style>
