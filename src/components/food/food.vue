<template>
  <transition name="move">
  <div v-show="showFlag" class="food" ref="food">
     <div class="food-content">
       <div class="image-header">
         <img :src="food.image">
         <div class="back" @click="hide">
         <i class="icon-arrow_lift"></i>
         </div>
       </div>
       <div class="content">
          <h1 class="title">
            {{food.name}}
          </h1>
          <div class="detail">
             <span class="sell-count">
                月售{{food.sellCount}}份
             </span>
             <span class="rating">好评率{{food.rating}}</span>
          </div>
          <div class="price">
             <span class="now">
              ￥{{food.price}}
             </span>
             <span class="old" v-show="food.oldPrice">
                ￥{{food.oldPrice}}
             </span>
          </div>
          <slot name="cartcon" class="cartcontrol-wrapper"></slot>
          <transition name="purchase" tag="div">
          <div class="buy" v-show="!food.count||food.count===0" @click.stop.prevent="addFirst(food,$event)">
            加入购物车
          </div>
          </transition>
       </div>

       <split></split>
       <div class="info" v-show="food.info">
         <h1 class="title">商品信息</h1>
         <p class="text">{{food.info}}</p>
       </div>
       <split></split>
       <div class="rating">
          <h1 class="title">
            商品评价
          </h1>
          <ratingselect :select-type="selectType"
          :only-content="onlyContent"
          :desc="desc" :ratings="food.ratings"
          @change="change" @toggle="toggle"></ratingselect>
          <div class="rating-wrapper">
             <ul v-show="food.ratings&&food.ratings.length">
                 <li v-for="rating in food.ratings" class="rating-item"
                 v-show="needShow(rating.rateType,rating.text)">
                    <div class="user">
                       <span class="name">{{rating.username}}</span>
                       <img class="avatar" width="12" height="12" :src="rating.avatar">

                    </div>
                    <div class="time">
                       {{rating.rateTime|formdate}}
                    </div>
                    <p class="text">
                       <span :class="{'icon-thumb_up':rating.rateType==0,
                       'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
                    </p>
                 </li>
             </ul>
             <div class="no-rating" v-show="!food.ratings||!food.ratings.length">
                 暂无评价
             </div>
          </div>
       </div>
     </div>
  </div>
  </transition>
</template>

<script>
import BScroll from 'better-scroll'
import cartcontrol from '../cartcontrol/cartcontrol'
import split from '../split/split'
import Vue from 'vue'
import ratingselect from '../ratingselect/ratingselect'
import {formdate} from '@/common/js/date'
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2
export default {
  components:{
    cartcontrol,split,ratingselect
  },
  props:{
    food:{
      type:Object
    }
  },
  name: '',
  data () {
    return {
      showFlag:false,
      selectType:ALL,
      onlyContent:true,
      desc:{
        all:'全部',
        positive:'推荐',
        negative:'吐槽'
      }
    }
  },
  filters:{//新东西
      formdate(time){
        let date = new Date(time)
        return formdate(date,'yyyy-MM-dd hh:mm')
      }
  },
  methods:{
    change(type){
      this.selectType=type
    },
    toggle(val){
      this.onlyContent=val
    },
    show(){
      this.showFlag=true
      this.selectType=ALL
      this.onlyContent=true
      this.$nextTick(()=>{
        if(!this.scroll){
          this.scroll = new BScroll(this.$refs.food,{
            click:true
          })
        }else{
          this.scroll.refresh()
        }
      })
    },
    hide(){
      this.showFlag=false
    },
    addFirst(food,event){
     if(!event._constructed){
       return
     }
      console.log(event.target)
     this.$nextTick(()=>{
      this.$emit('cartadd',event.target)
      Vue.set(this.food,'count',1)
     })

    },
    needShow(type,text){
      if(this.onlyContent&&!text){
        return false
      }
      if(this.selectType==ALL){
        return true
      }else{
        return type===this.selectType
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
@import "../../common/stylus/mixin.styl"
  .food
      position:fixed
      left:0
      top:0
      bottom:48px
      width:100%
      z-index:30
      background:#fff
      .food-content
         position:relative
     &.move-enter-active,&.move-leave-active
        transition:all .2s linear
     &.move-enter
        transform:translate3d(100%,0,0)
     &.move-enter-to
        transform:translate3d(0,0,0)
     &.move-leave
        transform:translate3d(0,0,0)
     &.move-leave-to
        transform:translate3d(100%,0,0)

      .image-header
         position:relative
         width:100%
         height:0
         padding-bottom:100%
         img
           position:absolute
           top:0
           left:0
           width:100%
           height:100%
         .back
           position:absolute
           top:10px
           left:0
           .icon-arrow_lift
               display:block
               padding:10px
               font-size:20px
               color:#fff



      .content
         position:relative
         padding:18px
         .title
            line-height:14px
            margin-bottom:8px
            font-size:14px
            font-weight:700
            color:rgb(7,17,27)
         .detail
            margin-bottom:18px
            line-height:10px
            height:10px
            font-size:0
            .sell-count,.rating
               font-size:10px
               color:rgb(147,153,159)
            .sell-count
               margin-right:12px
         .price
              font-weight:700
              line-height:24px
              .now
                margin-right:8px
                font-size:14px
                color:rgb(240,20,20)
              .old
                text-decoration:line-through
                font-size:10px
                color:rgb(147,153,159)

         .cartcontrol-wrapper
            position:absolute
            right:12px
            bottom:18px
         .buy
            position:absolute
            right:12px
            bottom:18px
            z-index:500
            height:24px
            line-height:24px
            height:24px
            padding:0 12px
            box-sizing:border-box
            font-size:10px
            border-radius:12px
            color:#fff
            background:rgb(0,160,220)
            display:block
    .&purchase-enter-active,&purchase-leave-active
          transition:all .5s linear
    .&purchase-enter
          opacity:0
    .&purchase-enter-to
          opacity:1
    .&purchase-leave
          opacity:0
    .&purchase-leave-to
          opacity:0
      .info
         padding:18px
         .title
           line-height:14px
           margin-bottom:6px
           font-size:14px
           color:rgb(77,85,93)
         .text
            line-height:24px
            padding:0  8px
            font-size:12px
            color:rgb(77,85,93)
         .rating
            padding-top:18px
            .title
               line-height:14px
               margin-left:18px
               font-size:14px
               color:rgb(7,17,27)

      .rating
         padding-top:18px
         .title
            line-height:14px
            margin-left:18px
            font-size:14px
            color:rgb(7,17,27)
         .rating-wrapper
            padding:0 18px
            .rating-item
                position:relative
                padding:16px 0
                border-1px(rgba(7,17,27,.1))
                .user
                   position:absolute
                   right:0
                   top:16px
                   font-size:0
                   line-height:12px
                   .name
                      display:inline-block
                      vertical-align:top
                      font-size:10px
                      color:rgb(147,153,159)
                      margin-right:6px
                   .avatar
                      border-radius:50%
                .time
                   line-height:12px
                   margin-bottom:6px
                   font-size:10px
                   color:rgb(147,153,159)
                .text
                   line-height:16px
                   font-size:12px
                   color:rgb(7,17,27)
                   .icon-thumb_up,.icon-thumb_down
                       margin-right:4px
                       line-height:24px
                       font-size:12px
                   .icon-thumb_up
                       color:rgb(0,160,220)
                   .icon-thumb_down
                       color:rgb(147,153,159)

            .no-rating
               padding:16px 0
               font-size:12px
               color:rgb(147,153,159)
</style>
