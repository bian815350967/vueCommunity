<template>
  <div class="my-w">
    <fixed-top :title="title"></fixed-top>
    <div class="content-w">
      <input type="text" placeholder="Access Token" class="input" v-model.trim="token">
      <p class="err-msg">{{errMsg}}</p>
      <button class="send" @click="login">登录</button>
      <ul class="tips-uls">
        <li>温馨提示：</li>
        <li>为了更好的体验请登录😊</li>
        <li>请输入vue中文社区账号的Access Token😄</li>
        <li>在个人中心可以获取Access Token😉</li>
        <li>调用的是官方API,请放心使用🤗</li>
      </ul>
      <a href="https://www.vue-js.com" class="link" target="_blank">获取Access Token链接</a>
    </div>
    <v-tab-bar></v-tab-bar>
  </div>
</template>

<script type="text/ecmascript-6">
import axios from 'axios'
export default {
  data () {
    return {
      title: '登录',
      token: '',
      errMsg: ''
    }
  },
  created () {
    // 'Access Token: 55b176a9-8a6a-4b0b-b13c-1c04e9db5d1a
  },
  methods: {
    login () {
      this.errMsg = ''
      if (this.token !== '') {
        this.$fetch.post('/accesstoken', {
          accesstoken: this.token
        }).then(res => {
          localStorage.setItem('__userId__', res.id)
          localStorage.setItem('__accesstoken__', this.token)
          localStorage.setItem('__userName__', res.loginname)
          this.$router.push('/personalCenter')
        }).catch(() => {
          this.errMsg = '输入错误，请重新输入'
        })
      } else {
        this.errMsg = '请输入Access Token'
      }
    },
    geta () {
      axios.get('http://www.sgcarlife.com/index.php/Home/Exam/getQuestion.html?qid=1934&pid=338').then(res => {
        console.log(res)
      })
    }
  },
  components: {
    fixedTop: resolve => require(['@/components/fixedTop.vue'], resolve),
    vTabBar: resolve => require(['@/components/tabBar.vue'], resolve)
  }
}
</script>

<style scoped lang="stylus">
.my-w
  width: 100%
  height: 100%
  display: flex
  align-items center
  justify-content center
  flex-direction column
  .content-w
    height: 100%
    width: 80%
    /*position: fixed*/
    /*left: 0*/
    /*top: 0*/
    display: flex
    align-items center
    justify-content center
    flex-direction column
  .input
    margin-top: 30px
    width: 100%
    height: 46px
    padding-left: 20px
    border: 1px solid #ddd
  .err-msg
    font-size: 14px
    color #ff363d
    margin-top: 20px
    text-align: center
  .send
    width: 100%
    height: 46px
    margin-top: 30px
    color #fff
    background-color: #009688
  .tips-uls
    margin-top: 50px
    width: 100%
    li
      color #666
      font-size: 14px
      line-height: 1.5
  .link
    width: 100%
    margin-top: 20px
    color: #ff4081;
    display: block
</style>
