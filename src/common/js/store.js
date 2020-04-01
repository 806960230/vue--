export function saveToLocal(id,key,value){//存取数据
    let seller = window.localStorage._seller_  //双下划线编码风格,专门存储私有属性
    if(!seller){
      seller={}
      seller[id]={}


    }else{
      seller=JSON.parse(seller)
       if(!seller[id]){
         seller[id]={}
       }
    }
    seller[id][key]=value
    window.localStorage._seller_=JSON.stringify(seller)
}


export function loadFromLocal(id,key,def){//读取数据
    let seller = window.localStorage._seller_
    if(!seller){
      return def
    }
    seller= JSON.parse(seller)[id]
    if(!seller){
      return def
    }
    let ret =seller[key]
    return ret || def

}

//关于json的两种方法看笔记(如何得出网页的参数)
