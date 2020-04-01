export function formdate(date,fmt){//时间格式化代码
    if(/(y+)/.test(fmt)){
      fmt=fmt.replace(RegExp.$1,(date.getFullYear()+'').substr(4-RegExp.$1.length))
      //RegExp.$1是RegExp的一个属性,指的是与正则表达式匹配的第一个 子匹配(以括号为标志)字符串，
      //以此类推，RegExp.$2，RegExp.$3，..RegExp.$99总共可以有99个匹配
    }
    let o={
      'M+':date.getMonth()+1,
      'd+':date.getDate(),
      'h+':date.getHours(),
      'm+':date.getMinutes(),
      's+':date.getSeconds()
    }
    for(let k in o){
      if(new RegExp(`(${k})`).test(fmt)){
        let str = o[k]+''
        fmt=fmt.replace(RegExp.$1,(RegExp.$1.length===1)?str:padLeftZero(str))
      }
    }
    return fmt
}


function padLeftZero(str){
  return ('00'+str).substr(str.length)
}
