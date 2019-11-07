<template>
  <div class="details-w">
    <div class="fixed-title">
      <span class="cube-icon cubeic-back" @click="$router.go(-1)"></span>
      <h3 class="title">帖子详情</h3>
    </div>
    <div v-if="errPublish && isData" class="err-publish">该帖子已被删除</div>
    <div class="content" v-if="!errPublish && isData">
      <div class="title-w">
        <span class="title-icon" v-if="topiContent.top === true">置顶</span>
        <h3 class="title-msg">{{topiContent.title}}</h3>
      </div>
      <div v-if="noLogin">
        <div class="collect-w" @click="collectTopic" v-if="isCollect">
          <span class="iconfont icon-duomeitiicon-"></span>
          <span>收藏主题</span>
        </div>
        <div class="collect-w" v-else @click="deleteCollect">
          <span class="cube-icon cubeic-like"></span>
          <span>取消收藏</span>
        </div>
      </div>
      <div class="label-w">
        <span class="solid">·</span>发布于  {{$getDateDiff(topiContent.create_at)}}
        <span class="solid">·</span>作者 <div class="author" v-if="topiContent.author" @click="gotoAuthor(topiContent.author.loginname)">{{topiContent.author.loginname}}</div>
        <div class="label-list">
          <span class="solid">·</span>{{topiContent.visit_count}} 次浏览
        </div>
        <div class="label-list">
          <span class="solid">·</span>来自  {{iconKeywords(topiContent.tab)}}
        </div>
      </div>
      <!--      新闻内容-->
      <div v-html="topiContent.content" class="content-detials" v-highlight></div>
      <!--    所有评论  -->
      <div class="reply-w" v-if="repliesData && repliesData.length > 0">
        <div class="title-l">{{repliesData.length}}条回复</div>
        <ul class="reply-uls" v-if="topiContent.replies">
          <li class="reply-list" v-for="(item, index) in repliesData" :key="index" ref="replyList">
            <div class="list-top">
              <div class="left" v-if="item.author">
                <img v-lazy="item.author.avatar_url" alt="" class="img">
                <span class="name">{{item.author.loginname}} </span>
                <span class="time">{{index + 1}}楼 • {{$getDateDiff(item.create_at)}}</span>
              </div>
              <div class="right" v-if="noLogin">
                <div class="good-t" @click="upsGood(item.id, index)">
                  <span :class="{'cube-icon cubeic-good': item.ups.length > 0, 'iconfont icon-dianzan': item.ups.length === 0}"></span>
                  <span class="numUps">{{item.ups.length}}</span>
                </div>
                <span class="cube-icon cubeic-message" @click="showCont(item, index)"></span>
              </div>
            </div>
            <p class="reply-desc" v-html="item.content"></p>
            <!--   回复别人         -->
            <div class="my-reply-import" v-if="replyShowIndex === index && replyShow">
              <div class="text-w">
                <textarea v-model="importContent"></textarea>
              </div>
              <div class="btn-w">
                <div class="btn-list" @click="replyOther(item)">回复</div>
                <div class="btn-list" @click="cancelReply">取消</div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <!-- 添加回复     -->
      <div class="my-reply" v-if="noLogin">
        <div class="title-l">添加回复</div>
        <div class="mark-w">
          <label for=""></label><textarea placeholder="请输入回复内容..." class="textarea" v-model="repContent"></textarea>
        </div>
        <div class="btn-w">
          <div class="btn-send" @click="replies" :class="{'loading-btn': isLoading}">
            <span class="cube-icon cubeic-navigation"></span>
            <span class="rep-t">回复</span>
            <cube-loading v-show="isLoading"></cube-loading>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed-dialog" v-show="axaShow">
      <div class="ball-pulse">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import marked from 'marked'
export default {
  data () {
    return {
      axaShow: false,
      replyShow: false,
      replyShowIndex: -1,
      importContent: '',
      repliesData: [],
      isLoading: false,
      repContent: '',
      isData: false,
      errPublish: false,
      isCollect: true,
      topiContent: '',
      noLogin: false,
      accesstoken: '',
      topic_id: this.$route.query.id
    }
  },
  created () {
    this.getDetails()
    this.getUserInfo()
    this.accesstoken = localStorage.getItem('__accesstoken__')
    if (this.accesstoken) {
      this.noLogin = true
    } else {
      this.noLogin = false
    }
  },
  methods: {
    gotoAuthor (author) {
      this.$router.push({
        path: '/personalCenter',
        query: {author}
      })
    },
    // 显示评论
    showCont (item, index) {
      if (this.replyShowIndex === -1 && this.replyShow === false) {
        this.importContent = `@${item.author.loginname} `
        this.replyShowIndex = index
        this.replyShow = true
      } else if (this.replyShow === true && this.replyShowIndex !== index) {
        this.importContent = `@${item.author.loginname} `
        this.replyShowIndex = index
        this.replyShow = true
      } else {
        this.importContent = ''
        this.replyShowIndex = -1
        this.replyShow = false
      }
    },
    // 取消评论
    cancelReply () {
      this.replyShowIndex = -1
      this.replyShow = false
      this.importContent = ''
    },
    // 评论其他人
    replyOther (item) {
      if (this.importContent.trim() === '') {
        this.$createDialog({
          type: 'alert',
          title: '请输入评论内容'
        }).show()
      } else {
        this.axaShow = true
        this.$fetch.post(`/topic/${this.topic_id}/replies`, {
          accesstoken: this.accesstoken,
          content: this.importContent,
          reply_id: item.id
        }).then(res => {
          this.axaShow = false
          this.importContent = ''
          this.replyShowIndex = -1
          this.replyShow = false
          if (res.success) {
            this.getDetails()
          }
        }).catch(() => {
          this.axaShow = false
        })
      }
    },
    // 评论
    replies () {
      if (this.repContent.trim() === '') {
        this.$createDialog({
          type: 'alert',
          title: '请输入评论内容'
        }).show()
      } else {
        this.isLoading = true
        let rendererMD = new marked.Renderer()
        marked.setOptions({
          renderer: rendererMD,
          gfm: true,
          tables: true,
          breaks: true,
          pedantic: false,
          sanitize: false,
          smartLists: true,
          smartypants: false
        })
        let content = marked(this.repContent)
        this.$fetch.post(`/topic/${this.topic_id}/replies`, {
          accesstoken: this.accesstoken,
          content: content
        }).then(res => {
          this.repContent = ''
          this.isLoading = false
          if (res.success) {
            this.getDetails()
          }
        }).catch(err => {
          if (err.error_msg.indexOf('not found') > -1) {
            this.$createDialog({
              type: 'alert',
              title: '该帖子已被删除'
            }).show()
          }
        })
      }
    },
    // tab分类
    iconKeywords (item) {
      let tab = item
      if (tab === 'good') return '精华'
      if (tab === 'weex') return 'weex'
      if (tab === 'share') return '分享'
      if (tab === 'ask') return '问答'
      if (tab === 'job') return '招聘'
    },
    // 收藏主题
    collectTopic () {
      this.$fetch.post('/topic/collect', {
        accesstoken: this.accesstoken,
        topic_id: this.topiContent.id
      }).then(res => {
        if (res.success) {
          this.isCollect = false
        }
      })
    },
    // 取消收藏
    deleteCollect () {
      this.$fetch.post('/topic/de_collect', {
        accesstoken: this.accesstoken,
        topic_id: this.topiContent.id
      }).then(res => {
        if (res.success) {
          this.isCollect = true
        }
      })
    },
    // 点赞
    upsGood (id, index) {
      this.$fetch.post(`/reply/${id}/ups`, {
        accesstoken: this.accesstoken
      }).then(res => {
        if (res.success) {
          let numGood
          numGood = this.$refs.replyList[index].getElementsByClassName('numUps')[0].innerHTML
          this.$refs.replyList[index].getElementsByClassName('good-t')[0].children[0].className = ''
          if (res.action === 'down') {
            this.$refs.replyList[index].getElementsByClassName('numUps')[0].innerHTML = Number(numGood) - 1
            if (Number(this.$refs.replyList[index].getElementsByClassName('numUps')[0].innerHTML) === 0) {
              this.$refs.replyList[index].getElementsByClassName('good-t')[0].children[0].className = 'iconfont icon-dianzan'
            } else {
              this.$refs.replyList[index].getElementsByClassName('good-t')[0].children[0].className = 'cube-icon cubeic-good'
            }
          } else {
            this.$refs.replyList[index].getElementsByClassName('numUps')[0].innerHTML = Number(numGood) + 1
            this.$refs.replyList[index].getElementsByClassName('good-t')[0].children[0].className = 'cube-icon cubeic-good my-good'
          }
        } else {
          const toast = this.$createToast({
            txt: res.error_msg,
            time: 2000,
            type: 'txt'
          })
          toast.show()
        }
      })
    },
    // 获取用户信息
    getUserInfo () {
      let loginname = localStorage.getItem('__userName__')
      if (loginname) {
        this.$fetch.get(`/user/${loginname}`).then(res => {
          let collectData = res.data.collect_topics
          collectData.forEach(item => {
            if (item.id === this.topiContent.id) {
              this.isCollect = false
            }
          })
        })
      }
    },
    // 获取内容
    getDetails () {
      this.$fetch.get(`/topic/${this.topic_id}`).then(res => {
        this.isData = true
        if (res.data) {
          this.topiContent = res.data
          let repliesData = res.data.replies
          setTimeout(() => {
            repliesData.forEach((item, index) => {
              if (this.$refs.replyList) {
                item.ups.forEach(list => {
                  if (list === localStorage.getItem('__userId__')) { // 让自己的点赞高亮
                    this.$refs.replyList[index].getElementsByClassName('good-t')[0].children[0].className = 'cube-icon cubeic-good my-good'
                  }
                })
              }
            })
            this.repliesData = repliesData
          }, 500)
        } else {
          this.errPublish = true
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus">
@keyframes scale
  30%
    transform: scale(.3);
  100%
    transform: scale(1);
.details-w
  .err-publish
    margin-top: 80px
    text-align: center
    color: #ff4081;
  .content
    margin-top: 50px
    padding-bottom: 58px
    .title-w
      padding: 10px
      .title-icon
        background-color: #009688;
        color #fff
        padding: 2px
        font-size: 24px
        border-radius 4px
      .title-msg
        display inline
        font-size: 24px
        font-weight: bold
        line-height: 1.3
        margin-left: 2px
        word-break: break-all;
    .collect-w
      padding: 10px
      margin: 15px 0 8px
      font-size: 16px
      color #009688
      .cubeic-like
        color #009688
        font-size: 20px
        margin-right: 10px
      .iconfont
        font-size: 20px
        margin-right: 10px
        color #333
    .label-w
      padding: 0 10px
      font-size: 12px
      color #999
      margin-bottom: 20px
      line-height: 1.5
      .label-list
        display inline
        white-space nowrap
      .solid
        border-radius 50%
        font-size: 16px
        font-weight: bold
        margin-left: 6px
        margin-right: 2px
      .author
        color #ff4081
        display inline
        margin-left: 4px
    .content-detials
      border-top: 1px solid #999
      padding: 10px
      margin-bottom: 30px
    .title-l
      width: 100%
      font-size: 16px
      color #666
      line-height: 2
      padding: 10px
      background-color: #f6f6f6
    .reply-w
      .reply-uls
        .reply-list
          padding: 10px 0
          border-bottom: 1px solid #ccc
          &:last-child
            border-bottom none
          .list-top
            display: flex
            justify-content space-between
            padding: 0 10px
            .left
              display: flex
              .img
                width: 36px
                height: 36px
              .name
                font-size: 14px
                color #000
                margin: 0 10px
              .time
                font-size: 14px
                color #08c
            .right
              display: flex
              align-items center
              .good-t
                margin-right: 12px
                .my-good
                  color #ff4081
          .reply-desc
            color #000
            font-size: 14px
            padding: 10px
            >>> .markdown-text
              p
                line-height: 1.5
              a
                color #ff4081
          .my-reply-import
            padding: 10px
            .text-w
              textarea
                width: 100%
                height: 80px
                padding: 10px
                border: 1px solid #ccc
                border-radius 4px
                font-family:"Microsoft YaHei UI"
            .btn-w
              display: flex
              align-items center
              margin-top: 20px
              .btn-list
                margin-right: 20px
                width: 80px
                height: 40px
                display: flex
                align-items center
                justify-content center
                color #fff
                border-radius 4px
                &:first-child
                  background-color: #009688
                &:nth-child(2)
                  background-color: #ccc
    .my-reply
      margin-bottom: 30px
      margin-top: 10px
      .mark-w
        margin: 10px 0
        padding: 10px
        .textarea
          width: 100%
          height: 200px
          padding: 10px
          border: 1px solid #ccc
          border-radius 4px
          font-family:"Microsoft YaHei UI"
      .btn-w
        padding: 10px
        .btn-send
          width: 100%
          height: 46px
          display: flex
          align-items center
          justify-content center
          text-align: center
          color #fff
          background-color: #009688
          border-radius 6px
          cursor pointer
          &.loading-btn
            cursor none
            pointer-events none
          .rep-t
            margin: 0 6px
  .fixed-dialog
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 0
    background-color: rgba(0,0,0,.7)
    display: flex
    align-items center
    justify-content center
    z-index: 2000
    .ball-pulse
      > div
        width: 15px;
        height: 15px;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
        background-color: #fff;
        border-radius: 100%;
        margin: 2px;
        display: inline-block;
        &:nth-child(1)
          animation: scale .75s -.24s infinite cubic-bezier(.2,.68,.18,1.08);
        &:nth-child(2)
          animation: scale .75s -.12s infinite cubic-bezier(.2,.68,.18,1.08);
        &:nth-child(3)
          animation: scale .75s 0s infinite cubic-bezier(.2,.68,.18,1.08);
</style>
