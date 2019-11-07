<template>
  <div id="app">
    <input type="text" style="display: none">
    <input type="password" style="display: none">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
    }
  }
}
</script>

<style lang="stylus">
@import "assets/css/article.styl"
@import "assets/iconfont/iconfont.styl"
@import "assets/css/theme.styl"

div,span,i,h1,h2,h3,img,input,body,html,ul,li, button, textarea,body
  padding: 0
  margin: 0
  box-sizing border-box
button,input, textarea
  outline none
  border none
  resize none
.fixed-title
  position: fixed
  left: 0
  top: 0
  width: 100%
  height: 50px
  line-height: 50px
  text-align: center
  color #fff
  font-weight: bold
  background-color: #009688
  .title
    width: 70%
    margin: 0 auto
    white-space nowrap
    overflow: hidden
    text-overflow: ellipsis
  .cubeic-back
    position: absolute
    left: 0
    padding: 0 10px
.content-w
  width: 100%
  padding-top: 50px
.cube-dialog-title-def
  font-weight: bold
  line-height: 2
  margin: 40px 0 !important
/*  设置进度条的颜色 */
#nprogress
  .bar
    background-color: #ff4081 !important
  .peg
    box-shadow: 0 0 10px #ff4081, 0 0 5px #ff4081;
  .spinner-icon
    border-top-color: #ff4081 !important
    border-left-color: #ff4081 !important
</style>
