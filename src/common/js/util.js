export function urlParse(){
    let url=window.location.search
    let obj={}
    let reg=/[?&][^?&]+=[^?&]+/g
    let arr=url.match(reg)
    if(arr){
      arr.forEach((item)=>{
        let tempArr=item.substring(1).split('=')
        let key=decodeURIComponent(tempArr[0])
        let val=decodeURIComponent(tempArr[1])
        // let key=tempArr[0]
        // let val=tempArr[1]
//decodeURIComponent() 函数可对 encodeURIComponent() 函数编码的 URI 进行解码。
       obj[key] = val

      })
    }
    return obj
}

//如何得网页的参数
//window.location.search
//如何解析url参数@example ?id=1234&a=b
//@return Object{id:1234,a:b}
//如果找不到任何匹配的文本match()返回null否则它返回一个数组,如果没有g
//该数组的第0个元素存放是的是匹配文本而其余元素存放的是与正则表达式
//的子表达式匹配的文本,如果有g就存放所有子表达式匹配的文本包括第0个元素
