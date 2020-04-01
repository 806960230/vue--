<template>
  <div class="shopcart">
    <div class="content" @click="toggleList">
       <div class="content-left">
           <div class="logo-wrapper">
               <div class="logo" :class="{'highlight':totalCount>0}">
                 <span class="icon-shopping_cart"
                 :class="{'highlight':totalCount>0}"></span>
               </div>
               <div class="num" v-show="totalCount>0">
                   {{totalCount}}
               </div>
           </div>
           <div class="price" :class="{'highlight':totalCount>0}">
             ￥{{totalPrice}}元
           </div>
           <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
       </div>
       <div class="content-right">
          <div class="pay" :class="payClass">
             {{payDesc}}
          </div>
       </div>

    </div>
    <div class="ball-container">
      <transition-group name="drop" tag="div"
       v-on:before-enter="beforeEnter"
        v-on:enter="dropEnter"
        v-on:after-enter="afterEnter">
        <div v-for="(ball,index) in balls" class="ball" v-show="ball.show" :key="index">
          <span class="inner inner-hook"></span>
        </div>
      </transition-group>

   </div>
   <transition name="fold">
   <div class="shopcart-list" v-show="listShow">
       <div class="list-header">
         <h1 class="title">购物车</h1>
         <span class="empty">清空</span>
       </div>
       <div class="list-content" ref="listContent">
           <ul>
             <li class="food" v-for="food in selectFoods">
                <span class="name-food">{{food.name}}</span>
                <div class="price-food">
                   <span>￥{{food.price*food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
             </li>
           </ul>
       </div>
   </div>
   </transition>
  </div>
</template>

<script>
import cartcontrol from '../cartcontrol/cartcontrol'
import BScroll from 'better-scroll'
export default {
  name: '',
  components:{
    cartcontrol
  },
  data () {
    return {
         balls:[
        {
          show:false
        },
        {
          show:false
        },
        {
          show:false
        },
        {
          show:false
        },
        {
          show:false
        }
      ],
      dropBall:[],
      fold:true
    }
  },
  methods:{
    drop(el){

      for(let i=0;i<this.balls.length;i++){
        let ball = this.balls[i]
        if(!ball.show){
        ball.show=true
        ball.el=el
        this.dropBall.push(ball)
        return
        }

      }

    },
    toggleList(){

     if(!this.totalCount){
       return
     }
     this.fold =!this.fold
    },
      beforeEnter(el,done){//这个el与上面的el不一样，这个el指的是被点击的元素，以下就是从这个元素掉出小球
        console.log('1')
          let count=this.balls.length

          while(count--){
            let ball =this.balls[count]
            if(ball.show){
              let rect = ball.el.getBoundingClientRect()//这个el是指被点击的元素
              console.log(ball.el)
              //Element.getBoundingClientRect()方法返回元素的大小及其相对于视口的位置。
              //这个rect可以给出x:333,y:281,也就是原始的本身蓝色加号按钮相对于视口的位置
              let x=rect.left-32//减去32,32是因为在购物车图标附近的小圆球落脚点相距视口left是32这是在
              //CSS中已经设置好了的可以看下面.ball的css样式,所以结果得出距离是小圆球落脚点与最初加号
              //按钮两个球之间的水平距离
              let y=-(window.innerHeight-rect.top-22)//innerheight	返回窗口的文档显示区的高度。
              //同理这里也是得出两个小球之间的纵向距离
              console.log(y)
              console.log(el)
              el.style.display=""//初始位置,把display的none先初始为空
              console.log(el.style.display)
              el.style.webkitTransform=`translate3d(0,${y}px,0)`//向下为负方向移动,但是y轴正方向为向下
              el.style.transform=`translate3d(0,${y}px,0)`
              let inner=el.getElementsByClassName('inner-hook')[0]
              console.log(inner)
              inner.style.webkitTransform=`translate3d(${x}px,0,0)`//向左为正方向移动,但是x轴正方向是向右
              inner.style.transform=`translate3d(${x}px,0,0)`

            }
          }
       },
       dropEnter(el,done){
         /*eslint-disable no-unused-vars*/
         console.log('1')
         let rf=el.offsetHeight// 触发浏览器重绘，offsetWidth、offsetTop等方法都可以触发
         this.$nextTick(() => {
           el.style.webkitTransform='translate3d(0,0,0)'
           el.style.transform='translate3d(0,0,0)'
            let inner=el.getElementsByClassName('inner-hook')[0]
            inner.style.webkitTransform='translate3d(0,0,0)'
            inner.style.transform='translate3d(0,0,0)'
           el.addEventListener('transitionend', done);//dropEnter中 el.addEventListener('transitionend', done);
           //这句如果没有，则不会触发transition 的after-enter 事件，导致小球状态不能被还原
         })

       },
       afterEnter(el){
         console.log('1')
           el.style.display = 'none';
          let ball = this.dropBall.shift()
          if (ball){
            ball.show=false
            // el.style.display="none"
          }
       }
  },
  computed:{
     totalPrice(){
       let total = 0;
       this.selectFoods.forEach((food) => {
         total += food.price*food.count
       })
       return total
     },
     totalCount(){
       let count = 0
       this.selectFoods.forEach((food) => {
         count += food.count
       })
       return count
     },
     payDesc(){
       if(this.totalPrice===0){
         return `￥${this.minPrice}元起送`

       }else if(this.totalPrice<this.minPrice){
         let diff=this.minPrice-this.totalPrice
         return `还差￥${diff}元起送`
       }else{
         return '去结算'
       }
     },
     payClass(){
       if(this.totalPrice<this.minPrice){
         return 'not-enough'
       }else{
         return 'enough'
       }
     },
     listShow(){
       if(!this.totalCount){
         this.fold = true
         return false
       }
       let show = !this.fold
       if(show){
        //这里是驼峰式写法不能带杆号listContent
         this.$nextTick(()=>{
           if(!this.scroll){
            this.scroll = new BScroll(this.$refs.listContent,{
              click:true
            })
            }else{
              this.scroll.refresh()//这样写就是不用每次实例化scroll了
            }
         })
       }
       return show
     }
  },
  props:{
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    },
    selectFoods: {
      type: Array,
      default() {
        return [
          {
            price: 30,
            count: 2
          }
        ]
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
@import "../../common/stylus/mixin.styl"
     .shopcart
         position: fixed
         left:0
         bottom:0
         z-index:50
         width:100%
         height:48px
         background:#000
        .content
          display:flex
          background:#141d27
         .content-left
            flex:1
           .logo-wrapper
              display:inline-block
              position: relative
              top:-10px
              margin: 0 12px
              padding:6px
              width:56px
              height:56px
              box-sizing:border-box
              vertical-align:top
              border-radius:50%
              background:#141d27
             .logo
                width:100%
                height:100%
                border-radius:50%
                background:#2b343c
                text-align:center
                &.highlight
                   background:rgb(0,160,220)
               .icon-shopping_cart
                 font-size:24px
                 color:#80858a
                 line-height:44px
                 &.highlight
                   color:#fff
             .num
                position:absolute
                top:0
                right:0
                width:24px
                height:16px
                line-height:16px
                text-align:center
                border-radius:16px
                font-size:9px
                background-color:rgb(240,20,20)
                color:#fff
                font-weight:700
                box-shadow:0 4px 8px 0 rgba(0,0,0,0.4)
           .price
              position:absolute
              display:block
              vertical-align:top
              margin-top:12px
              line-height:24px
              box-sizing:border-box
              padding-right:6px
              border-right:1px solid rgba(255,255,255,.1)
              font-size:16px
              font-weight:700
              color:rgba(255,255,255,.4)
              top:0
              left:65px
              min-width:60px
              &.highlight
                   color:#fff
           .desc
              position:absolute
              display:inline-block
              vertical-align:top
              line-height:24px
              margin:12px 0 0 12px
              color:rgba(255,255,255,.4)
              font-size:10px
              top:0px
              left:120px
         .content-right
            flex:0  0  105px
            width:105px
           .pay
            height:48px
            line-height:48px
            text-align:center
            font-size:14px
            color:rgba(255,255,255,.4)
            font-weight:700
            background:#2b333b
            &.not-enough
              background:#2b333b
            &.enough
              background:#00b43c
              color:#fff
        .ball-container
            .ball
                  position:fixed
                  left:32px
                  bottom:22px
                  z-index:200
                  background-color:red
                  .inner//以后记住不用次类别的点.在上面属性的前面了
                     display:inline-block//必须有block或者inlineblock否则transition不起效果
                     width:15px
                     height:15px
                     border-radius:50%
                     background-color:yellow
                     transition: all .4s linear
           &.drop-enter-active//注意格式看对准哪里否则出现不了效果,这里意思是指，在ballcontainer下凡是有dropenteractive类的元素都产生效果
                       transition:all .4s cubic-bezier(0.49,-0.29,0.75,0.41)
          // &.drop-enter
          //        transform:translate3d(0,-400px,0)
          //        .inner
          //          transform:translate3d(300px,0,0)
          // &.drop-enter-to
          //        transform: translate3d(0,0,0)
          //        .inner
          //          transform:translate3d(0,0,0)

        .shopcart-list
             position:absolute
             bottom:0
             z-index:-1
             left:0
             width:100%
             margin-bottom:48px//不知为什么我要加48px才看到正常效果，人家老师都没有加而且是top为0
             background:red
          &.fold-enter-active,&.fold-leave-active
                transition: all 0.5s
          &.fold-enter
                transform: translate3d(0,100%,0)
          &.fold-enter-to
                transform: translate3d(0,0,0)
          &.fold-leave
                transform:translate3d(0,0,0)
          &.fold-leave-to
                transform:translate3d(0,100%,0)
             .list-header
                height:40px
                line-height:40px
                padding:0 18px
                background:#f3f5f7
                border-bottom: 1px solid rgba(7,17,27,.1)
                max-height:127px
               .title
                   float:left
                   font-size:14px
                   color:rgb(7,17,27)
               .empty
                   float:right
                   font-size:12px
                   color:rgb(0,160,220)
             .list-content
                max-height:217px
                padding:0 18px
                background:#fff
                overflow:hidden
               .food
                   position:relative
                   padding:12px  0
                   box-sizing:border-box
                   border-1px(rgba(7,17,27,.1))
                  .name-food
                      line-height:24px
                      font-size:14px
                      color:rgb(7,17,27)
                      // color:white
                  .price-food
                      position:absolute
                      right:90px
                      bottom:12px
                      line-height:24px
                      font-size:14px
                      font-weight:700
                      color:rgb(240,20,20)
                  .cartcontrol-wrapper
                      position:absolute
                      right:0
                      bottom:6px


</style>
