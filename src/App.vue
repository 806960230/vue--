<template>
  <div>
    <v-header :seller="seller"></v-header>
    <div class="tab ">
        <div class="tab-item">
          <router-link :to="{path:'/goods'}" class="link-item">商品</router-link>
        </div>
        <div class="tab-item">
           <router-link :to="{path:'/ratings'}" class="link-item">评论</router-link>
          </div>
        <div class="tab-item">
           <router-link :to="{path:'/seller'}" class="link-item">商家</router-link>
        </div>
    </div>
    <keep-alive>
   <router-view :seller="seller" ></router-view>
    </keep-alive><!--
     要记得传这个否则seller是undefined报错,加了keep-alive后,你点击了小球增加，切换页面
     后，再切换回来，小球还是在增加，说明了keep-alive使得不用重新请求数据-->
  </div>
</template>

<script>
import header from './components/header/header'
import {urlParse} from '@/common/js/util'
export default {
  name: 'App',
  data () {
    return {
      seller: {
        id:(()=>{
         let queryParam=urlParse()
         console.log(queryParam)
         console.log(queryParam.id);
         return queryParam.id
        })()
      }
    }
  },
  created () {
      this.$http.get('/api/seller?id='+this.seller.id)
      .then((response) => {
          console.log(response)

  // 用于对象的合并 , Object.assign方法的第一个参数是目标对象，后面的参数都是源对象。
  //用于扩展原数据不存在的属性，例如id属性
         this.seller=Object.assign({},this.seller,response.data)
         console.log(this.seller.id)
      }, (err) => {
        console.log(err)
      })
  },
  components: {
     'v-header': header
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
 @import "./common/stylus/mixin.styl"
   .tab
     display:flex
     width:100%
     height:40px
     line-height:40px
    .tab-item
      flex:1
     .link-item
       display:block
       text-decoration:none
       font-size:14px
       text-align:center
       color:rgb(77,85,93)
       border-1px((rgba(7,17,27,.1)))
       &.router-link-active
         color:red
</style>
