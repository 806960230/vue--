<template>
  <div class="header">
     <div class="content-wrapper">
       <div class="avatar">
         <img width="64" height="64" :src="seller.avatar">
       </div>
       <div class="content">
         <div class="title">
            <span class="brand"></span>
            <span class="name">{{seller.name}}</span>
         </div>
         <div class="description">
           {{seller.description}}/{{seller.deliveryTime}}分钟送达
         </div>
         <div v-if="seller.supports" class="support"><!--要有v-if-->
           <span class="icon" :class="classMap[seller.supports[0].type]"></span>
           <span class="text">{{seller.supports[0].description}}</span>
            <div v-if="seller.supports" class="support-count"
            @click="showDetail">
          <span class="count">{{seller.supports.length}}个</span>
          <i class="icon-keyboard_arrow_right"></i><!--这个class名是从stylus文件夹里面的icon文件取来的,
          因为你要显示右箭头的图标-->
        </div>
         </div>
       </div>
     </div>
     <div class="bulletin-wrapper" @click="showDetail">
       <span class="bulletin-title"></span>
       <span class="bulletin-text">{{seller.bulletin}}</span>
       <i class="icon-keyboard_arrow_right new_right"></i>
     </div>
     <div class="background">
       <img :src="seller.avatar" width="100%" height="100%">
     </div>
     <div class="detail" v-show="detailShow">

     </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
   seller: {
     type: Object
   }
  },
  name: '',
  data () {
    return {
      detailShow: false
      }
    },
  methods: {
    showDetail () {
      this.detailShow = true
    }
  },
  created () {
     this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
  @import "../../common/stylus/mixin.styl" //不能使用省略式写法，省略式写法只适用于引入js东西
      .header
         color:#fff
         position:relative
         background:rgba(7,17,27,.5)//一定要有关于显隐性的数值，否则模糊效果没有
         overflow:hidden
        .content-wrapper
          padding:24px 12px 18px 24px
          font-size:0
          position:relative
         .avatar
           display:inline-block
           vertical-align:top
           img
             border-radius:2px
         .content
           display:inline-block
           font-size:14px
           margin-left: 16px
          .title
            margin:2px 0 8px 0
           .brand
             width:30px
             height:18px
             vertical-align:middle
             display:inline-block
             //bg-image('brand')不知道为什么这个没反应
             background-image:url('brand@3x.png')
             background-size:30px 18px
             background-repeat:no-repeat
           .name
             margin-left:6px
             font-size:16px
             line-height:18px
             font-weight:bold
          .description
              margin-bottom: 10px
              line-height: 12px
              font-size: 12px
          .support
             .icon
                display:inline-block
                width:12px
                height:12px
                vertical-align:top
                margin-right:4px
                background-size:12px 12px
                background-repeat: no-repeat
                &.decrease
                  //bg-image('decrease_1')
                  background-image:url('decrease_1@2x.png')
                &.discount
                  //bg-image('discount_1')
                  background-image:url('discount_1@2x.png')
                &.guarantee
                  //bg-image('guarantee_1')
                  background-image:url('guarantee_1@2x.png')
                &.invoice
                  //bg-image('invoice_1')
                  background-image:url('invoice_1@2x.png')
                &.special
                  //bg-image('special_1')
                  background-image:url('special_1@2x.png')
             .text
                line-height:12px
                font-size:10px
             .support-count
                position:absolute
                right:12px
                bottom:18px
                padding:0 8px
                height:24px
                line-height:24px
                border-radius:14px
                background:rgba(0,0,0,.2)
                text-align:center
               .count
                  font-size:10px
               .icon-keyboard_arrow_right
                  font-size:10px
                  line-height:24px
                  margin-left:2px
        .bulletin-wrapper
           position:relative
           height:28px
           line-height:28px
           padding:0 22px 0 12px
           white-space: nowrap
           overflow: hidden
           text-overflow:ellipsis
           background:rgba(7,17,27,.2)
           //font-size:0//这种用于span标签之间空白字符的去除，如果不想要font-size为0可以直接把span标签与其他标签不要空行即可
          .bulletin-title
             display:inline-block
             width:22px
             height:12px
             background-image:url('bulletin@2x.png')
             background-repeat:no-repeat
             background-size:22px 12px
             vertical-align:top
             margin-top:7px
          .bulletin-text
             font-size:10px
             margin:0 4px
             vertical-align:top
          .new_right
             position:absolute
             font-size:10px
             right:12px
             top:8px
        .background
           position:absolute
           top:0
           left:0
           width:100%
           height:100%
           z-index:-1
           filter:blur(10px)
        .detail
           position:fixed
           z-index:100
           width:100%
           height:100%
           overflow:auto
           background:rgba(7,17,27,.8)
           top:0
           left:0
</style>
