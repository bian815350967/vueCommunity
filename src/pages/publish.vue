<template>
  <div class="publish-w" @click="isSelect = false">
    <fixed-top :title="title"></fixed-top>
    <div class="form-w">
      <div class="form-item">
        <label class="label">选择模块</label>
        <div class="select-w" @click.stop>
          <div class="select-in" @click="showSel">
            <div>{{defaultLabel}}</div>
            <span class="cube-icon cubeic-pulldown" :class="{'rotate-icon': isSelect}"></span>
          </div>
          <ul class="select-uls" :class="{'show-uls': isSelect}">
            <li v-for="(item, index) in tabs" :key="index" class="select-list" :class="{'current-list': currentItem === index}" @click="checkOne(item, index)">{{item.label}}</li>
          </ul>
        </div>
      </div>
      <div class="form-item">
        <label class="label">标题</label>
        <input type="text" placeholder="标题字数必须5字以上" class="input" v-model.trim="inputTitle">
      </div>
      <div class="form-item editor-w">
        <textarea  v-model="content" class="textarea" placeholder="输入文本，支持markdown格式"></textarea>
      </div>
      <cube-button @click="sendPubilsh" class="send" :class="{'loading-btn': isLoading}">
        <span class="cube-icon cubeic-navigation"></span>
        <span>发布话题</span>
        <cube-loading v-show="isLoading"></cube-loading>
      </cube-button>
    </div>
    <v-tab-bar></v-tab-bar>
  </div>
</template>

<script type="text/ecmascript-6">
import marked from 'marked'
export default {
  data () {
    return {
      isLoading: false,
      content: '',
      inputTitle: '',
      currentItem: 0,
      defaultLabel: '分享',
      defaultTab: 'share',
      isSelect: false,
      title: '发布',
      tabs: [{
        label: '分享',
        path: 'share'
      }, {
        label: '问答',
        path: 'ask'
      }, {
        label: '招聘',
        path: 'job'
      }],
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
    }
  },
  methods: {
    sendPubilsh () {
      if (this.checkFlag()) {
        var rendererMD = new marked.Renderer()
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
        let content = marked(this.content)
        this.isLoading = true
        this.$fetch.post('/topics', {
          accesstoken: this.accesstoken,
          title: this.inputTitle,
          tab: this.defaultTab,
          content: content
        }).then(res => {
          this.isLoading = false
          if (res.success) {
            this.$router.push({
              path: '/details',
              query: {id: res.topic_id}
            })
          }
        })
      }
    },
    checkFlag () {
      let flag = true
      if (this.content.trim() === '') {
        this.$createDialog({
          type: 'alert',
          title: '请输入内容',
          content: ''
        }).show()
        flag = false
      }
      if (this.inputTitle.length < 5) {
        this.$createDialog({
          type: 'alert',
          title: '标题字数必须5字以上',
          content: ''
        }).show()
        flag = false
      }
      if (this.inputTitle === '') {
        this.$createDialog({
          type: 'alert',
          title: '请输入标题',
          content: ''
        }).show()
        flag = false
      }
      return flag
    },
    checkOne (item, index) {
      this.currentItem = index
      this.defaultLabel = item.label
      this.defaultTab = item.path
      this.isSelect = false
    },
    showSel () {
      this.isSelect = !this.isSelect
    }
  },
  components: {
    fixedTop: resolve => require(['@/components/fixedTop.vue'], resolve),
    vTabBar: resolve => require(['@/components/tabBar.vue'], resolve)
  }
}
</script>

<style scoped lang="stylus">
.form-w
  width: 100%
  height: 100%
  padding: 50px 10px 58px
  background-color: #fff
  .form-item
    .label
      font-size: 14px
      color #333
      margin: 30px 0 10px
      display: block
    .select-w
      position: relative
      .select-in
        width: 100%
        height: 30px
        padding-left: 10px
        display: flex
        align-items center
        justify-content space-between
        border-bottom: 1px solid #ccc
        font-size: 16px
        color #000
        .cubeic-pulldown
          font-size: 20px
          color #333
          transition all .3s linear
          transform rotate(0)
          &.rotate-icon
             transform rotate(180deg)
      .select-uls
        position: absolute
        left: 0
        top 100%
        z-index: 1510
        width: 100%
        max-height: 0
        overflow: hidden
        background-color: #fff
        box-shadow: 0 1px 6px rgba(0,0,0,.1), 0 1px 4px rgba(0,0,0,.1);
        transition all .3s linear
        &.show-uls
          max-height 200px
        .select-list
          line-height: 30px
          padding: 10px
          color #333
          font-size: 14px
          &.current-list
            color #ff4081
    .input
      border-bottom: 1px solid #ccc
      height: 36px
      width: 100%
      color #000
    .input::-webkit-input-placeholder
      color: #ccc;
    .input:-moz-placeholder
      color: #ccc;
    .input::-moz-placeholder
      color: #ccc;
  .editor-w
    margin: 10px 0
    .textarea
      height: 200px
      width: 100%
      padding: 10px
      border: 1px solid #ccc
      border-radius 4px
      font-family:"Microsoft YaHei UI"
  .send
    width: 100%
    height: 40px
    display: flex
    align-items center
    justify-content center
    background-color: #009688
    color #fff
    border-radius 4px
    margin: 20px 0
    padding: 0
    &.loading-btn
      pointer-events none
    >>> .cube-loading
      margin-left: 10px
    .cubeic-navigation
      margin-right: 10px
      font-size: 20px
      color #fff
</style>
