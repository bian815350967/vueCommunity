<template>
  <div class="personal">
    <div class="fixed-title" v-if="$route.query.author">
      <span class="cube-icon cubeic-back" @click="$router.go(-1)"></span>
      <h3 class="title">{{title}}</h3>
    </div>
    <fixed-top :title="title" v-else></fixed-top>
    <div class="content-wrap">
      <div class="user-wrap">
        <div class="avatar-img">
          <img v-lazy="userData.avatar_url" alt="">
        </div>
        <div class="user-info">
          <h3 class="username">{{userData.loginname}}</h3>
          <div class="d-con">
            <p>积分: {{userData.score}}</p>
            <p class="time">注册时间: {{$getDateDiff(userData.create_at)}}</p>
          </div>
          <div class="logout-btn" @click="logout" v-show="!$route.query.author">退出登录</div>
        </div>
      </div>
    </div>
    <cube-page type="tab-composite-view" title="tab-composite" class="cont-m">
      <div slot="content">
        <cube-tab-bar v-model="selectedLabel"
                      show-slider
                      :use-transition="disabled"
                      ref="tabNav"
                      :data="tabLabels">
        </cube-tab-bar>
        <div class="tab-slide-container">
          <cube-slide
            ref="slide"
            :loop="loop"
            :initial-index="initialIndex"
            :auto-play="autoPlay"
            :show-dots="showDots"
            :options="slideOptions"
            @scroll="scroll"
            @change="changePage"
          >
            <!-- 收藏的话题 -->
            <cube-slide-item>
              <cube-scroll :data="collectData" :options="scrollOptions">
                <ul class="list-wrapper">
                  <li class="list-item" v-for="(item, index) in collectData" :key="index" @click="gotoDetails(item)">
                    <div class="avatar" v-if="item.author">
                      <img v-lazy="item.author.avatar_url" alt="">
                    </div>
                    <div class="content">
                      <div class="title-w">
                        <h3 class="title-msg"> {{item.title}}</h3>
                      </div>
                      <div class="desc-w">
                        <span v-if="item.author">{{item.author.loginname}}</span>
                        <span>{{$getDateDiff(item.last_reply_at)}}</span>
                      </div>
                    </div>
                  </li>
                  <li class="no-data" v-show="collectData.length === 0">暂无收藏的话题</li>
                </ul>
              </cube-scroll>
            </cube-slide-item>
            <!--   创建的话题 -->
            <cube-slide-item>
              <cube-scroll :data="createData" :options="scrollOptions">
                <ul class="list-wrapper">
                  <li class="list-item" v-for="(item, index) in createData" :key="index" @click="gotoDetails(item)">
                    <div class="avatar" v-if="item.author">
                      <img v-lazy="item.author.avatar_url" alt="">
                    </div>
                    <div class="content">
                      <div class="title-w">
                        <div class="title-msg"> {{item.title}}</div>
                      </div>
                      <div class="desc-w">
                        <span v-if="item.author">{{item.author.loginname}}</span>
                        <span>{{$getDateDiff(item.last_reply_at)}}</span>
                      </div>
                    </div>
                  </li>
                  <li class="no-data" v-show="createData.length === 0">暂无创建的话题</li>
                </ul>
              </cube-scroll>
            </cube-slide-item>
            <!--   参与的话题 -->
            <cube-slide-item>
              <cube-scroll :data="recentData" :options="scrollOptions">
                <ul class="list-wrapper">
                  <li class="list-item" v-for="(item, index) in recentData" :key="index" @click="gotoDetails(item)">
                    <div class="avatar" v-if="item.author">
                      <img v-lazy="item.author.avatar_url" alt="">
                    </div>
                    <div class="content">
                      <div class="title-w">
                        <div class="title-msg"> {{item.title}}</div>
                      </div>
                      <div class="desc-w">
                        <span v-if="item.author">{{item.author.loginname}}</span>
                        <span>{{$getDateDiff(item.last_reply_at)}}</span>
                      </div>
                    </div>
                  </li>
                  <li class="no-data" v-show="recentData.length === 0">暂无参与的话题</li>
                </ul>
              </cube-scroll>
            </cube-slide-item>
          </cube-slide>
        </div>
      </div>
    </cube-page>
    <v-tab-bar  v-show="!$route.query.author"></v-tab-bar>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {
      title: '个人中心',
      userData: '',
      createData: [],
      collectData: [],
      recentData: [],
      selectedLabel: '收藏的话题',
      disabled: false,
      tabLabels: [{
        label: '收藏的话题'
      }, {
        label: '创建的话题'
      }, {
        label: '参与的话题'
      }],
      loop: false,
      autoPlay: false,
      showDots: false,
      slideOptions: {
        listenScroll: true,
        probeType: 3,
        directionLockThreshold: 0
      },
      scrollOptions: {
        directionLockThreshold: 0
      },
      followersData: [],
      recommendData: [],
      hotData: []
    }
  },
  created () {
    this.getUserInfo()
  },
  methods: {
    // 退出登录
    logout () {
      this.$createDialog({
        type: 'confirm',
        title: '是否确定退出登录？',
        content: '',
        confirmBtn: {
          text: '确定',
          active: true,
          disabled: false,
          href: 'javascript:;'
        },
        cancelBtn: {
          text: '取消',
          active: false,
          disabled: false,
          href: 'javascript:;'
        },
        onConfirm: () => {
          localStorage.clear()
          this.$router.push('/')
        }
      }).show()
    },
    iconKeywords (item) {
      if (item.top) return '置顶'
      let tab = item.tab
      if (tab === 'good') return '精华'
      if (tab === 'weex') return ''
      if (tab === 'share') return '分享'
      if (tab === 'ask') return '问答'
      if (tab === 'job') return '招聘'
    },
    iconCls (item) {
      let tab = item.tab
      if (item.top || tab === 'good') return '#009688'
      return 'rgb(153, 153, 153)'
    },
    getUserInfo () {
      let loginname
      if (this.$route.query.author) {
        loginname = this.$route.query.author
      } else {
        loginname = localStorage.getItem('__userName__')
      }
      this.$fetch.get(`/user/${loginname}`).then(res => {
        this.collectData = res.data.collect_topics // 收藏的话题
        this.createData = res.data.recent_topics // 创建的话题
        this.recentData = res.data.recent_replies // 回复的话题
        this.userData = res.data
      })
    },
    // 跳转到详情
    gotoDetails (item) {
      this.$router.push({
        path: '/details',
        query: {id: item.id}
      })
    },
    // 索引
    findIndex (ary, fn) {
      if (ary.findIndex) {
        return ary.findIndex(fn)
      }
      let index = -1
      ary.some(function (item, i, ary) {
        const ret = fn.call(this, item, i, ary)
        if (ret) {
          index = i
          return ret
        }
      })
      return index
    },
    // 切换tab
    changePage (current) {
      this.selectedLabel = this.tabLabels[current].label
    },
    scroll (pos) {
      const x = Math.abs(pos.x)
      const tabItemWidth = this.$refs.tabNav.$el.clientWidth
      const slideScrollerWidth = this.$refs.slide.slide.scrollerWidth
      const deltaX = x / slideScrollerWidth * tabItemWidth
      this.$refs.tabNav.setSliderTransform(deltaX)
    }
  },
  computed: {
    initialIndex () {
      let index = 0
      index = this.findIndex(this.tabLabels, item => item.label === this.selectedLabel)
      return index
    }
  },
  components: {
    fixedTop: resolve => require(['@/components/fixedTop.vue'], resolve),
    CubePage: resolve => require(['@/components/cubePage.vue'], resolve),
    vTabBar: resolve => require(['@/components/tabBar.vue'], resolve)
  }
}
</script>

<style scoped lang="stylus">
.no-data
  font-size: 14px
  margin-top: 20px
  text-align: center
  color #ff4081
.personal
  .cont-m
    top: 140px
    bottom: 60px
    position: fixed
    .tab-slide-container
      position: fixed
      top: 180px
      left: 0
      right: 0
      bottom: 58px
  .content-wrap
    width: 100%
    padding-top: 50px
    .user-wrap
      display: flex
      align-items center
      padding: 10px
      .avatar-img
        img
          width: 80px
          height: 80px
          border-radius 50%
      .user-info
        flex 1
        padding-left: 10px
        .username
          font-size: 24px
          font-weight: bold
          color #009688
          margin-bottom: 10px
        .d-con
          display: flex
          font-size: 14px
          .time
            margin-left: 20px
        .logout-btn
          padding: 10px 0
          font-size: 14px
          color #ff4081
  .tabbar-w
    .tab-list
      font-size: 12px
  .list-wrapper
    .list-item
      width: 100%
      display: flex
      padding: 10px
      border-bottom: 1px solid #eee
      .avatar
        width: 50px
        height 50px
        min-width 50px
        margin-right: 10px
        img
          width: 100%
          border-radius 50%
          display: block
      .content
        flex 1
        margin: 0
        display: flex
        flex-direction column
        overflow: hidden
        .title-w
          word-break: break-all;
          word-wrap:break-word;
          overflow: hidden
          display:block;
          .title-icon
            color #fff
            padding: 2px
            font-size: 12px
            border-radius 2px
          .title-msg
            font-size: 14px
            font-weight: bold
            padding-left: 2px
            line-height: 1.5
            height auto
            white-space normal
            word-wrap:break-word;
            word-break:break-all;
            overflow:hidden;
        .desc-w
          margin-top: 10px
          display: flex
          align-items center
          justify-content space-between
          color #333
          font-size: 12px
</style>
