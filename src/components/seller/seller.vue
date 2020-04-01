<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc border-1px">
        <span class="text">({{seller.ratingCount}})</span>
        <span class="text">月售{{seller.sellCount}}</span>
        </div>
      <ul class="remark">
        <li class="block">
           <h2>起送价</h2>
           <div class="content">
             <span class="stress">{{seller.minPrice}}元</span>
           </div>
        </li>
        <li class="block">
           <h2>商家配送</h2>
           <div class="content">
             <span class="stress">{{seller.deliveryPrice}}元</span>
           </div>
        </li>
        <li class="block">
           <h2>平均配送时间</h2>
           <div class="content">
             <span class="stress">{{seller.deliveryTime}}分钟</span>
           </div>
        </li>
      </ul>
      <div class="favorite" @click="toggleFavorite">
        <span class="icon-favorite" :class="{'active':favorite}">
        <span class="text">{{favoriteText}}</span>
        </span>
      </div>
      </div>
      <split></split>
      <div class="bulletin">
         <h1 class="title">公告与活动</h1>
         <div class="content-wrapper">
            <p class="content">{{seller.bulletin}}</p>
          <ul v-if="seller.supports" class="supports"><!--要有v-if-->
          <li class="support-item border-1px" v-for="item in seller.supports">
           <span class="icon" :class="classMap[item.type]"></span>
           <span class="text">{{item.description}}</span>
          </li>
        </ul>
         </div>

        </div>
     <split></split>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picWrapper">
        <ul class="pic-list" v-show="seller.pics" ref="picList">
          <li class="pic-item" v-for="item in seller.pics">
             <img :src="item" width="120" height="90">
          </li>
        </ul>
        </div>
      </div>
      <split></split>
      <div class="info">
        <h1 class="title">商家信息</h1>
        <ul>
          <li class="info-item  border-1px" v-for="info in seller.infos">
              {{info}}
          </li>
        </ul>
      </div>
     </div>
    </div>
</template>

<script>
import BScroll from 'better-scroll'
import split from '../split/split'
import {saveToLocal,loadFromLocal} from '@/common/js/store'
export default {
  name: '',
  created () {
     this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']

    },
  data () {
    return {
       favorite:(()=>{
         return loadFromLocal(this.seller.id,'favorite',false)
       })()
    }
  },
  computed:{
    favoriteText(){
      return this.favorite?"已收藏":"未收藏"
    }
  },
  mounted(){
      this.$nextTick(()=>{
       this._initScroll()

     })
  },
  ready(){//当DOM全部渲染完后，这里可填入BScroll。首先进入了商家页面，进行了ready里面的函数
  //由于第一次_initScroll执行所以就是初始化Bscroll,由于不能正确计算dom所以不能滚动,紧接着
  //seller回调回来了监听到完整的seller,再次执行_initScroll,可以正确计算dom了所以BScroll可执行了
     this.$nextTick(()=>{//ready是切换页面后就执行的，而mounted是只执行一次，在整一个页面刷新后
       this._initScroll()
       if(this.seller.pics){
         let picWidth=120;
         let margin =6
         let width=(picWidth+margin)*this.seller.pics.length-margin
         this.$refs.picList.style.width=width+'px'
         this.$nextTick(()=>{
           this.picScroll = new BScroll(this.$refs.picWrapper,{
             scrollX: true,
             eventPassthrough: 'vertical'
           })
         })

       }
     })

  },
  //3-7-2问题二：打开seller页面，无法滚动
//问题分析：出现这种现象是因为better-scroll插件是严格基于DOM的，数据是采用异步传输的，
//页面刚打开，DOM并没有被渲染，所以，要确保DOM渲染了，才能使用better-scroll，
//解决方案：用到mounted钩子函数，同时搭配this.$nextTick()
//3-7-3问题三：在seller页面，刷新后，无法滚动
//问题分析：出现这种情况是因为mounted函数在整个生命周期中只会只行一次
//解决方案：使用watch方法监控数据变化，并执行滚动函数 this._initScroll();this._initPicScroll();
  watch:{//只有在刷新页面时，才会重新监听seller这个数据，切换页面重新渲染dom是不会重新监听的
     'seller'(){
        this._initScroll()
        this._initScrollPics()
    }
  },
  methods:{
      _initScroll() {
        if(!this.scroll){
          this.scroll = new BScroll(this.$refs.seller,{
          click:true
      })
        }else{
          this.scroll.refresh()
        }
    },
      _initScrollPics(){
         if(this.seller.pics){
         let picWidth=120;
         let margin =6
         let width=(picWidth+margin)*this.seller.pics.length-margin
         this.$refs.picList.style.width=width+'px'
         this.$nextTick(()=>{
           this.picScroll = new BScroll(this.$refs.picWrapper,{
             scrollX: true,
             eventPassthrough: 'vertical'
           })
         })

       }else{
         this.picScroll.refresh()
       }
      },
      toggleFavorite(event){
        if(!event._constructed){
          return
        }
        this.favorite=!this.favorite
        saveToLocal(this.seller.id,'favorite',this.favorite)
      }
  },
  props:{
    seller:{
      type:Object
    }
  },
  components:{
    split
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
@import "../../common/stylus/mixin.styl"
    .seller
       position:absolute
       top:174px
       bottom:0
       left:0
       width:100%
       //height:1000px
       overflow:hidden
       .overview
          padding:18px
          position:relative
          .title
             margin-bottom:8px
             line-height:14px
             color:rgb(7,17,27)
             font-size:14px
          .desc
             padding-bottom:18px
             line-height:18px
             border-1px(rgba(7,17,27,.1))
             font-size:0
             .star
                display:inline-block
                margin-right:8px
                vertical-align:top
             .text
                margin-right: 12px
                display:inline-block
                line-height:18px
                vertical-align:top
                font-size:10px
                color:rgb(77,85,93)
          .remark
              display:flex
              padding-top:18px
              .block
                 flex:1
                 text-align:center
                 border-right:1px solid rgba(7,17,27,.1)
                 &:last-child
                    border:none
                 h2
                    margin-bottom:4px
                    line-height:10px
                    font-size:10px
                    color:rgb(147,153,159)
                 .content
                    line-height:24px
                    color:rgb(7,17,27)
                    font-size:10px
                    .stress
                      font-size:24px




          .favorite
              position:absolute
              right:18px
              top:18px
              text-align:center
              .icon-favorite
                 display:block
                 color:#d4d6d9
                 line-height: 24px
                 font-size: 24px
                 margin-bottom:4px
                 &.active
                   color:rgb(240,20,20)
              .text
                  line-height:10px
                  font-size: 12px
                  display: block
       .bulletin
          padding:18px 18px 0 18px
          .title
            margin-bottom:8px
            line-height:14px
            color:rgb(7,17,27)
            font-size:14px
          .content-wrapper
             padding: 0 12px 16px 12px
             border-1px(rgba(7,17,27,.1))
             .content
                line-height:24px
                font-size:12px
                color:rgb(240,20,20)
             .supports
               .support-item
                  padding:16px 12px
                  &:last-child
                     border:none
                  .icon
                    display:inline-block
                    width:12px
                    height:12px
                    vertical-align:middle
                    margin-right:4px
                    background-size:12px 12px
                    background-repeat: no-repeat
                    &.decrease
                       //bg-image('decrease_1')
                       background-image:url('decrease_4@2x.png')
                    &.discount
                       //bg-image('discount_1')
                       background-image:url('discount_4@2x.png')
                    &.guarantee
                       //bg-image('guarantee_1')
                       background-image:url('guarantee_4@2x.png')
                    &.invoice
                       //bg-image('invoice_1')
                       background-image:url('invoice_4@2x.png')
                    &.special
                       //bg-image('special_1')
                       background-image:url('special_4@2x.png')
                  .text
                     line-height:16px
                     font-size:12px
       .pics
          padding:18px
          .title
            margin-bottom:8px
            line-height:14px
            color:rgb(7,17,27)
            font-size:14px
          .pic-wrapper
             width:100%
             overflow:hidden
             white-space:nowrap
             .pic-list
                font-size:0
                .pic-item
                   display:inline-block
                   margin-right:6px
                   width:120px
                   height:90px


       .info
          padding:18px 18px 0 18px
          .title
             padding-bottom:12px
             line-height:14px
             border-1px(rgba(7,17,27,.1))
             color:rgb(7,17,27)
             font-size:14px
          .info-item
             padding:16px 12px
             line-height:16px
             border-1px(rgba(7,17,27,.1))
             font-size:12px


</style>
