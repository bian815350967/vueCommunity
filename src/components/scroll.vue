<template>
  <cube-page type="scroll-view" title="Scroll" class="toutiao">
    <template slot="content">
      <div class="nav-scroll-list-wrap">
        <cube-tab-bar
          class="tabbar-top"
          v-model="selectedLabelSlots"
          show-slider>
          <cube-tab v-for="item in tabs" :label="item.label" :key="item.label" @click.native="selectItem(item)">
            <div>{{item.label}}</div>
          </cube-tab>
        </cube-tab-bar>
      </div>
      <div class="content-scroll-wrapper">
        <div class="content-scroll-list-wrap" ref="scrollWrapper">
          <cube-scroll
            ref="contentScroll"
            :data="topicArr"
            :options="options"
            @pulling-down="onPullingDown"
            @pulling-up="onPullingUp">
            <ul class="uls">
              <li class="list-item" v-for="(item, index) in topicArr" :key="index" @click="gotoDetails(item)">
                <div class="avatar">
                  <img v-lazy="item.author.avatar_url" alt="" @load="onImgLoad">
                </div>
                <div class="content">
                  <div class="title-w">
                    <span class="title-icon" :style="{'background-color': iconCls(item)}" v-show="item.tab !== 'weex'">{{iconKeywords(item)}}</span>
                    <h3 class="title-msg"> {{item.title}}</h3>
                  </div>
                  <div class="desc-w">
                    <div>
                      <span class="author">{{item.author.loginname}}</span>
                      <span style="color: #9e78c0">{{item.reply_count}}</span> / {{item.visit_count}}
                    </div>
                    <span>{{$getDateDiff(item.last_reply_at)}}</span>
                  </div>
                </div>
              </li>
              <cube-loading v-show="topicArr.length === 0" class="loading-w"></cube-loading>
            </ul>
            <div class="no-more" v-show="!hasMore">没有更多了</div>
            <template slot="pulldown" slot-scope="props">
              <div v-if="props.pullDownRefresh"
                   class="cube-pulldown-wrapper"
                   :style="props.pullDownStyle">
                <div v-if="props.beforePullDown"
                     class="before-trigger"
                     :style="{paddingTop: props.bubbleY + 'px'}">
                  <span :class="{rotate: props.bubbleY > 0}">↓</span>
                </div>
                <div class="after-trigger" v-else>
                  <div v-show="props.isPullingDown" class="loading">
                    <cube-loading></cube-loading>
                  </div>
                  <transition name="success">
                    <div v-show="!props.isPullingDown" class="text-wrapper"><span class="refresh-text">刷新成功</span></div>
                  </transition>
                </div>
              </div>
            </template>
          </cube-scroll>
        </div>
      </div>
    </template>
  </cube-page>
</template>

<script type="text/ecmascript-6">
/*eslint-disable*/
import CubePage from '@/components/cubePage.vue'
export default {
  data () {
    return {
      pageIndex: 1,
      hasMore: true,
      topicArr: [],
      selectedLabelSlots: '全部',
      tabName: '',
      tabs: [{
        label: '全部',
        tab: ''
      }, {
        label: '精华',
        tab: 'good'
      }, {
        label: 'weex',
        tab: 'weex'
      }, {
        label: '分享',
        tab: 'share'
      }, {
        label: '问答',
        tab: 'ask'
      }, {
        label: '招聘',
        tab: 'job'
      }],
      options: {
        pullDownRefresh: {
          threshold: 60,
          // stop: 44,
          stopTime: 1000,
          txt: '更新成功'
        },
        pullUpLoad: true
      },
      secondStop: 26
    }
  },
  created () {
    this.getTopics(1)
  },
  components: {
    CubePage
  },
  methods: {
    gotoDetails (item) {
      this.$router.push({
        path: '/details',
        query: { id: item.id }
      })
    },
    onPullingDown () {
      let dataObj = {
        page: 1,
        limit: 20
      }
      if (this.tabName) {
        dataObj.tab = this.tabName
      }
      this.$fetch.get('/topics', dataObj).then(res => {
        this.topicArr = res.data
        setTimeout(() => {
          this.$refs.contentScroll.forceUpdate()
          this.$refs.contentScroll.scrollTo(0, this.secondStop, 300)
        }, 500)
      })
    },
    onPullingUp () {
      let tab = this.tabName
      if (!this.hasMore) {
        this.$refs.contentScroll.forceUpdate()
        return
      }
      this.pageIndex++
      let dataObj = {
        page: this.pageIndex,
        limit: 20
      }
      if (tab) {
        dataObj.tab = tab
      }
      this.$fetch.get('/topics', dataObj).then(res => {
        setTimeout(() => {
          this.$refs.contentScroll.forceUpdate()
          this.topicArr = this.topicArr.concat(res.data)
          if (res.data.length === 0 || res.data.length < 20) {
            this.hasMore = false
          } else {
            this.hasMore = true
          }
        }, 1000)
      }).catch(() => {
        this.$refs.contentScroll.forceUpdate()
      })
    },
    onImgLoad () {
      const contentScroll = this.$refs.contentScroll
      if (contentScroll) {
        contentScroll.scroll.beforePullDown && contentScroll.refresh()
      }
    },
    selectItem (item) {
      this.$refs.contentScroll.forceUpdate()
      this.$refs.contentScroll.refresh()
      this.$refs.contentScroll.scrollTo(0, this.secondStop, 300)
      this.hasMore = true
      this.tabName = item.tab
      this.topicArr = []
      this.getTopics(1, item.tab)
    },
    getTopics (page, tab) {
      let dataObj = {
        page,
        limit: 20
      }
      if (tab) {
        dataObj.tab = tab
      }
      this.$fetch.get('/topics', dataObj).then(res => {
        this.topicArr = res.data
        if (res.data.length < 20) {
          this.options.pullUpLoad = false
        } else {
          this.options.pullUpLoad = true
        }
      })
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
    }
  },
  mounted () {
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .toutiao
    .content
      margin: 0 !important
      height: 100%
      display: flex
      flex-flow: column
      >header
        line-height: 0
        img
          width: 100%
      footer
        line-height: 0
        img
          width: 100%
    .nav-scroll-list-wrap
      transform: rotate(0deg) // fix 子元素超出边框圆角部分不隐藏的问题
      position: relative
      background-color: white
      border-bottom : 1px solid rgba(0, 0, 0, 0.1)
      .tabbar-top
        color #fff
        .cube-tab
          padding: 15px 0
      .cube-scroll-content
        display: inline-block
        .nav-wrapper
          display: inline-block
          white-space: nowrap
          line-height: 36px
          padding: 0 5px
          .nav-item
            display: inline-block
            padding: 0 5px
            &:nth-child(2)
              color: #fa7b7a
    .content-scroll-wrapper
      flex: 1
      position: relative
      .content-scroll-list-wrap
        height: 100%
        transform: rotate(0deg) // fix 子元素超出边框圆角部分不隐藏的问题
        position: absolute
        top: 0
        bottom: 0
        left: 0;
        right: 0;
        overflow: hidden
        .uls
          .loading-w
            margin: 30px auto 0
            display: flex
            align-items center
            justify-content center
          .list-item
            width: 100%
            display: flex
            padding: 10px
            border-bottom: 1px solid #eee
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
                  color #fff
                  padding: 2px
                  font-size: 12px
                  border-radius 2px
                .title-msg
                  display inline
                  font-size: 14px
                  font-weight: bold
                  line-height: 1.3
                  margin-left: 2px
                  word-break: break-all;
              .desc-w
                margin-top: 10px
                display: flex
                align-items center
                justify-content space-between
                color #333
                font-size: 12px
                .author
                  font-size: 14px
                  font-weight: bold
                  color #000
                  margin-right: 10px
        .no-more
          text-align: center
          color #ff4081
          margin: 20px auto
    .cube-pulldown-wrapper
      text-align: center
      padding-bottom: 30px
      .before-trigger
        height: auto
        font-size: 30px
        align-self: flex-end
        span
          display: inline-block
          line-height: 1
          transition: all 0.3s
          color: #666
          padding: 15px 0
          &.rotate
            transform: rotate(180deg)
      .after-trigger
        flex: 1
        margin: 0
        .text-wrapper
          margin: 0 auto
          margin-top: 14px
          padding: 5px 0
          color: #498ec2
          background-color: #d6eaf8
        .cube-loading-spinners
          margin: auto
    .success-enter-active, .success-leave-active
      transition: width .5s
    .success-enter, .success-leave-to
      width: 70%
    .success-enter-to, .success-leave
      width: 100%
</style>
