<template>
<div class="goods">
  <div class="menu-wrapper" ref="menuwrapper">
     <ul>
       <li v-for="(item,index) in goods" class="menu-item" :key="index"
       :class="{'current':currentIndex===index}"
       @click="selectMenu(index,$event)"><!--传递$event是为了在PC页面时，点击会自动生成两遍-->
           <span class="text">
             <span class="icon" :class="classMap[item.type]" v-show="item.type>0"></span>
             {{item.name}}
           </span>
       </li>
     </ul>
  </div>
  <div class="foods-wrapper" ref="foodwrapper">
     <ul>
       <li v-for="(item,index) in goods" class="food-list food-list-hook" :key="index">
         <h1 class="title">{{item.name}}</h1>
         <ul>
           <li v-for="(food,index) in item.foods" class="food-item border-1px" :key="index"
           @click="selectFood(food,$event)">
             <div class="food-icon">
               <img :src="food.icon" class="icon-picture">
             </div>
             <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count-month">月售{{food.sellCount}}份</span>
                    <span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                      <span class="now">￥{{food.price}}</span>
                      <span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"  @cartadd="sendshopcart"></cartcontrol><!--不要把自定义
                  事件放错了组件，不然是没反应的，例如把cartadd这个自定义组件放在shopcart组件上
                  是没反应的，因为cartadd是由子组件carcontrol发出来的，还有尽量用小写写事件名-->
                  </div>
             </div>
           </li>
         </ul>
       </li>
     </ul>
  </div>
  <shopcart :delivery-price="seller.deliveryPrice"
  :min-price="seller.minPrice"
  :select-foods="selectFoods"
  ref="shopcart"
 ></shopcart>
   <food :food="selectedFood" ref="food" @cartadd="sendshopcart">
     <div slot="cartcon"><!--为什么用插槽呢，因为子组件的子组件不能直接用emit直接传参数到父组件上-->
        <div class="cartcontrol-wrapper-two">
          <cartcontrol :food="selectedFood" @cartadd="sendshopcart"></cartcontrol>
       </div>
     </div>
   </food>
</div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import shopcart from '../shopcart/shopcart'
import cartcontrol from '../cartcontrol/cartcontrol'
import Vue from 'vue'
import food from '../food/food'
export default {
  name: '',
  data () {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedFood:{},
    }
  },
  props:{
    seller:Object
  },
  components: {
    shopcart,cartcontrol,food
  },
  created () {
    this.$http.get('/api/goods')
    .then((response) => {
     const res = response.data
       this.goods = res
       console.log(this.goods)
       this.$nextTick(() => {
        this._initScroll()
        this._calculateHeight()
       })
// 用nextTick是为了不让betterscroll计算错误,要等我们把goods里面的数据拿完再初始化betterscroll计算就完整了
    }, (err) => {
      console.log(err)
    })
     this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    // var eventHub = new Vue()

  },
  computed: {
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
       let height1 = this.listHeight[i]
       console.log(height1)
       let height2 = this.listHeight[i + 1]
       if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i
       }
      }
        return 0
    },
    selectFoods(){
      let foods = []
      this.goods.forEach((good)=>{
        good.foods.forEach((food)=>{
          if(food.count){
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  methods: {
    _initScroll() {
      this.menuScroll = new BScroll(this.$refs.menuwrapper, {
        click: true
      })// 要有click为true才能被点击实现点击事件
      this.foodScroll = new BScroll(this.$refs.foodwrapper, {probeType: 3,
      click: true})// 放了个探针,click为true才能使得在foodscroll下，加减号按钮可以点击
      this.foodScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    // _drop(target){
    //    this.$refs.shopcart.drop(target)
    // },
    _calculateHeight() {
      let foodList = this.$refs.foodwrapper.getElementsByClassName('food-list-hook')
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        height += item.clientHeight// 元素自身高度
        this.listHeight.push(height)
      }
    },
    sendshopcart(e){
            //优化性能代码,异步执行下落动画
        console.log(555)
        this.$nextTick(()=>{
         this.$refs.shopcart.drop(e)
        })

    },
    selectMenu(index, event) {
      if (!event._constructed) { // 在PC上是没有_constructed属性，但是移动端自己做的事件
      // 是有这个属性的且为true
          return
      }
       let foodList = this.$refs.foodwrapper.getElementsByClassName('food-list-hook')
       let el = foodList[index]
       this.foodScroll.scrollToElement(el, 300)
    },
    selectFood(food,event){
      if(!event._constructed){
        return
      }
      this.selectedFood=food
      this.$refs.food.show()
    }

  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
@import "../../common/stylus/mixin.styl"
     .goods
        display:flex
        position:absolute
        width:100%
        top:176px
        bottom:46px
        overflow:hidden
       .menu-wrapper
          width:80px
          flex:0 0  80px
          height:432px
          background:#f3f5f7
         .menu-item
            display:table
            height:54px
            width:56px
            line-height:14px
            padding:0 12px
           &.current
               font-weight:700
               position:relative
               margin-top:-1px
               background:#fff
               z-index:10
              .text
                border-none()//没反应？？
           .icon
                display:inline-block
                width:12px
                height:12px
                vertical-align:top
                margin-right:2px
                background-size:12px 12px
                background-repeat: no-repeat
                &.decrease
                  //bg-image('decrease_1')
                  background-image:url('decrease_3@2x.png')
                &.discount
                  //bg-image('discount_1')
                  background-image:url('discount_3@2x.png')
                &.guarantee
                  //bg-image('guarantee_1')
                  background-image:url('guarantee_3@2x.png')
                &.invoice
                  //bg-image('invoice_1')
                  background-image:url('invoice_3@2x.png')
                &.special
                  //bg-image('special_1')
                  background-image:url('special_3@2x.png')
           .text
              font-size:12px
              display:table-cell
              width:56px
              vertical-align:middle
              border-1px(rgba(7,17,27,.1))
       .foods-wrapper
          flex:1
         .title
            padding-left:14px
            height:26px
            line-height:26px
            border-left:2px solid #d9dde1
            font-size: 12px
            color:rgb(147,153,159)
            background:#f3f5f7
         .food-item
            display:flex
            margin:18px
            border-1px(rgba(7,17,27,.1))
            padding-bottom:18px
            &:last-child
               border-none()
               margin-bottom:0
           .food-icon
              flex:0 0 57px
              margin-right:10px
             .icon-picture
               width:100%
               height:100%
           .content
               flex:1
              .name
                 margin:2px 0 8px 0
                 height:14px
                 line-height:14px
                 font-size:14px
                 color:rgb(7,17,27)
              .desc
                 margin-bottom:8px
                 line-height:12px
                 font-size:8px
                 color:rgb(147,153,159)
              .extra
                  line-height:10px
                  font-size: 13px
                  color: #93999f
                 .count-month
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
                    right:0
                    bottom:12px
       .ball-container
          .ball
            position:fixed
            left:32px
            bottom:22px
            z-index:200
          &.drop-enter-active
               transition:all .4s
              .inner
                 width:16px
                 height:16px
                 border-radius:50%
                 background:rgb(0,160,220)
                 transition:all .4s
       .cartcontrol-wrapper-two
         position:absolute
         right:12px
         bottom:18px
</style>
