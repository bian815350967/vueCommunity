<template>
  <div class="cube-page" :class="type">
    <div class="wrapper">
      <section v-show="desc" class="desc"><slot name="desc">{{desc}}</slot></section>
      <main class="content">
        <slot name="content">{{content}}</slot>
      </main>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    title: {
      type: String,
      default: '',
      required: true
    },
    type: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    }
  },
  methods: {
    back () {
      this.$router.back()
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  $color-orange = #fc9153
  $color-regular-blue = #4a4c5b
  $color-background = #f3f4f5
  $color-white = #fff

  //// gray
  $color-dark-grey = #333
  $color-grey = #666
  $color-light-grey = #999
  $color-light-grey-s = #ccc
  $color-light-grey-ss = #eee
  $color-light-grey-sss = #fcfcfc
  $color-active-grey = #e8e8e8

  $color-dark-grey-opacity = rgba(74, 76, 91, 0.8)
  $color-grey-opacity = rgba(0, 0, 0, .08)
  $color-light-grey-opacity = rgba(0, 0, 0, .04)

  //// orange
  $color-dark-orange = #e8864c
  $color-light-orange = #fdc2a5
  $color-orange-opacity = rgba(252, 145, 83, .08)
  $color-light-orange-opacity = rgba(252, 145, 83, .04)

  //// blue
  $color-blue = #444654

  //// row line
  $color-row-line = #ebebeb
  //// column line
  $color-col-line = #f5f5f5

  /// mask
  $color-mask-bg = rgba(37, 38, 45, .4)

  .cube-page
    position: absolute
    z-index: 10
    top: 0
    left: 0
    width: 100%
    height: 100%
    background: #fff
    .header
      position: relative
      height: 44px
      line-height: 44px
      text-align: center
      background-color: #edf0f4
      box-shadow: 0 1px 6px #ccc
      -webkit-backface-visibility: hidden
      backface-visibility: hidden
      z-index: 5
      h1
        font-size: 16px
        font-weight: 700
      .cubeic-back
        position: absolute
        top: 0
        left: 0
        padding: 0 15px
        color: #fc9153
    >.wrapper
      height: 100%
      overflow-x: hidden
      overflow-y: auto
      // -webkit-overflow-scrolling: touch
      .desc
        padding: 10px
        margin: 10px 0
        line-height: 20px
        font-size: 14px
      .content
        margin: 10px
    &.option-demo
      .wrapper
        background-color: $color-white
      .title
        font-size: $fontsize-large
        font-weight: 500
        color: $color-dark-grey
        padding: 15px
        border-bottom: 1px solid rgba(0, 0, 0, .1)
        margin-bottom: 15px
      .options
        margin-bottom: 15px
      .option-list
        .group
          margin-bottom: 15px
          border: 1px solid rgba(0, 0, 0, .1)
          border-radius: $radius-size-medium
        .item
          height: 52px
          border-bottom: 1px solid rgba(0, 0, 0, .1)
          &.sub
            font-size: $fontsize-medium
            background-color: $color-light-grey-opacity
            &.first
              box-shadow: 0 1px 1px 1px #eee inset
            &.last
              border-bottom: none
      .demo
        margin-bottom: 15px
      .methods
        .method-list
          .group
            margin-bottom: 15px
            border: 1px solid rgba(0, 0, 0, .1)
            border-radius: $radius-size-medium
          .item
          button
            height: 40px
            font-size: $fontsize-large
          .item
            background-color: $color-active-light-gray
            border-bottom: 1px solid rgba(0, 0, 0, .1)
          button
            width: 100%
            border-bottom-left-radius: $radius-size-medium
            border-bottom-right-radius: $radius-size-medium
            background-color: $color-orange
            box-shadow: 0 0 0 1px $color-orange
            border: none
            outline: none
            color: $color-white
</style>
