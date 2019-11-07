<template>
  <div>
    <fixed-top :title="title"></fixed-top>
    <cube-page type="tab-composite-view" title="tab-composite" class="scroll-w">
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
            <!-- 未读消息 -->
            <cube-slide-item>
              <cube-scroll :data="followersData" :options="scrollOptions">
                <ul class="list-wrapper">
                  <li class="list-item" v-for="(item, index) in noReadData" :key="index" @click="gotoDetails(item)">
                    <div class="avatar" v-if="item.author">
                      <div>
                        <img v-lazy="item.author.avatar_url" alt="">
                      </div>
                    </div>
                    <div class="content">
                      <div class="title-w">
                        <h1 class="title-c" v-if="item.reply.content"> {{item.reply.content}}</h1>
                        <h1 class="title-c" v-else>此内容已被作者删除</h1>
                      </div>
                      <div class="title-w">
                        <div class="title-msg" v-show="item.topic">来自:《{{item.topic.title}}》</div>
                      </div>
                      <div class="desc-w">
                        <span v-if="item.author">{{item.author.loginname}}</span>
                        <span>{{$getDateDiff(item.last_reply_at)}}</span>
                      </div>
                    </div>
                  </li>
                  <li v-if="noReadData.length === 0" class="no-data">暂无消息</li>
                </ul>
              </cube-scroll>
            </cube-slide-item>
            <!-- 已读消息 -->
            <cube-slide-item>
              <cube-scroll :data="followersData" :options="scrollOptions">
                <ul class="list-wrapper">
                  <li class="list-item" v-for="(item, index) in hasReadData" :key="index" @click="gotoDetails(item)">
                    <div class="avatar" v-if="item.author">
                      <div>
                        <img v-lazy="item.author.avatar_url" alt="">
                      </div>
                    </div>
                    <div class="content">
                      <div class="title-w">
                        <h1 class="title-c" v-if="item.reply.content"> {{item.reply.content}}</h1>
                        <h1 class="title-c" v-else>此内容已被作者删除</h1>
                      </div>
                      <div class="title-w">
                        <div class="title-msg" v-show="item.topic">来自:《{{item.topic.title}}》</div>
                      </div>
                      <div class="desc-w">
                        <span v-if="item.author">{{item.author.loginname}}</span>
                        <span>{{$getDateDiff(item.last_reply_at)}}</span>
                      </div>
                    </div>
                  </li>
                  <li v-if="hasReadData.length === 0" class="no-data">暂无消息</li>
                </ul>
              </cube-scroll>
            </cube-slide-item>
          </cube-slide>
        </div>
      </div>
    </cube-page>
    <v-tab-bar></v-tab-bar>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {
      title: '消息中心',
      selectedLabel: '未读消息',
      noReadData: [],
      hasReadData: [],
      disabled: false,
      tabLabels: [{
        label: '未读消息'
      }, {
        label: '已读消息'
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
      hotData: [],
      accesstoken: ''
    }
  },
  created () {
    this.accesstoken = localStorage.getItem('__accesstoken__')
    if (!this.accesstoken) {
      this.$createDialog({
        type: 'alert',
        title: '请先登录',
        confirmBtn: {
          text: '去登陆',
          active: true,
          disabled: false,
          href: 'javascript:;'
        },
        onConfirm: () => {
          this.$router.push('/login')
        }
      }).show()
    } else {
      this.getMsg()
    }
  },
  methods: {
    gotoDetails (item) {
      this.$router.push({
        path: '/details',
        query: {id: item.topic.id}
      })
    },
    changePage (current) {
      this.selectedLabel = this.tabLabels[current].label
    },
    scroll (pos) {
      const x = Math.abs(pos.x)
      const tabItemWidth = this.$refs.tabNav.$el.clientWidth
      const slideScrollerWidth = this.$refs.slide.slide.scrollerWidth
      const deltaX = x / slideScrollerWidth * tabItemWidth
      this.$refs.tabNav.setSliderTransform(deltaX)
    },
    resolveTitle (item) {
      return `${item.name}关注了问题 · ${item.postTime} 小时前`
    },
    resolveQuestionFollowers (item) {
      return `${item.answers} 赞同 · ${item.followers} 评论`
    },
    getMsg () {
      this.$fetch.get('/messages', {
        accesstoken: this.accesstoken
      }).then(res => {
        this.noReadData = res.data.hasnot_read_messages // 未读消息
        this.hasReadData = res.data.has_read_messages // 已读消息
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
  .scroll-w
    position: fixed
    top: 50px
    bottom: 58px
    height auto
  .cube-page
    &.tab-composite-view
      > .wrapper
        > .content
          margin: 0
  .tab-composite-view
    .cube-tab-bar
      background-color: white
    .cube-tab, .cube-tab_active
      color: black
    .cube-tab-bar-slider
      background-color: black
    .tab-slide-container
      position: fixed
      top: 90px
      left: 0
      right: 0
      bottom: 58px
    .list-wrapper
      overflow: hidden
      li
        padding: 15px 10px
        margin-top: 10px
        text-align: left
        background-color: white
        font-size: 14px
        color: #999
        white-space: normal
        &.no-data
          font-size: 14px
          margin-top: 20px
          text-align: center
          color #ff4081
        .line-height
          line-height: 1.5
        .is-black
          color: black
        .is-grey
          color: #999
        .is-bold
          font-weight: bold
        .top
          display: flex
          .avatar
            width: 15px
            height: 15px
            margin-right: 2px
            border-radius: 100%
          .author-name
            font-size: 12px
            margin-top: 6px
          .time
            flex: 1
        .middle
          display: flex
          margin: 10px 0
          color: black
        .hot-title
          display: flex
          align-items: center
          font-size: 12px
          .hot-sequence
            display: inline-block
            margin-right: 2px
            padding: 3px 6px
            border-radius: 2px
            background-color: darkgoldenrod
            color: white
        .hot-content
          margin-top: 15px
  .list-wrapper
    .list-item
      width: 100%
      display: flex
      padding: 10px
      border-bottom: 1px solid #eee
      .avatar
        width: 50px
        min-width 50px
        margin-right: 10px
        img
          width: 50px
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
          .title-c
            font-size: 16px
            line-height: 1.3
            font-weight: bold
            color #333
            margin-bottom: 10px
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
