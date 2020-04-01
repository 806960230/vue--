<template>
  <div class="cartcontrol">
      <transition class="cart-decrease"
       name="move" >
         <div class="inner icon-remove_circle_outline" v-show="food.count>0"
           @click.stop.prevent="decreaseCart"></div><!--用v-show比较好，因为当按钮逐渐显现时，在过程中
           按这个按钮，回来的动画效果会一致-->
      </transition>
      <div class="cart-count"  v-show="food.count>0">{{food.count}}</div>
      <div class="cart-add icon-add_circle" @click.stop.prevent="addcart"></div>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  name: '',
  data () {
    return {

    }
  },
  props: {
    food: {
      type: Object
    }
  },
  created() {
  },
  methods:{
    addcart(event){
      if(!event._constructed){//PC点击不会出现点击一次出现两次click
        return
      }
      
      if(!this.food.count){//food的count属性是自己新建的，data.json文件里
      //面的food是没有count字段所以,你点击增加按钮，count是增加了，但是
      //减号按钮没出现因此需要引入Vue
      //然后是引入Vue.set方法
      Vue.set(this.food,'count',1)
        this.food.count = 1
      }else{
        this.food.count++
      }
      console.log(333)
      this.$emit('cartadd',event.target)

    },
    decreaseCart(event){
       if(!event._constructed){
            return
       }
       if(this.food.count){
         this.food.count--
       }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
   .cartcontrol
       font-size:0
       position:relative
       .inner
          font-size:24px
          color:rgb(0,160,220)
          font-size:24px
          line-height:24px
          display:inline-block
     &.move-enter-active
              transition:all .4s linear//这个起效果,出现时效果,不能旋转不能移动奇葩bug
     &.move-leave-active
              //完全显现opacity=1时
              transition:all .4s linear
     &.move-enter
              transform:translate3d(36px,0,0) rotate(180deg)//意思指一开始减号按钮是在加号按钮上
     &.move-enter-to
              opacity:1
              //transform:translate3d(0,0,0) rotate(180deg)//这里不用写因为本身减号按钮是设置在加号左边的
     &.move-leave
              //transform:translate3d(36px,0,0) rotate(0deg)
     &.move-leave-to
              opacity:0
              transform:translate3d(24px,0,0) rotate(180deg)
       .cart-count
         display:inline-block
         width:12px
         vertical-align:top
         //padding-top:6px
         line-height:24px
         text-align:center
         font-size:10px
         color:rgb(147,153,159)
       .cart-add
         display:inline-block
         font-size:24px
         line-height:24px
         color:rgb(0,160,220)
</style>
