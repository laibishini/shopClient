//定义数据库模型
import {Base} from '../../utils/base.js';

class Cart extends Base{

//初始化
constructor(){
  super();
  this._storageKeyName = 'cart';
}

//加入购物车
//如果之情没有这样的商品，我们直接添加一条记录数量为counts
//如果有，我们把相应的数量加counts
//iteme商品对象
//counts商品数量
add(item,counts){
  //获取缓存中的数据
  var carData = this.getCarDataFromLocal();
  //判断缓存中的数据和刚加入购物车的数据是不是存在
  var isHasInfo = this._isHasThatOne(item.id,carData);

  //判断
  //-1就是在缓存中没有购物车信息这个商品
  if(isHasInfo.index == -1){
    item.counts = counts;
    item.selectStatus = true;//设置选中状态
    carData.push(item);
  }else{
    //这个商品在购物车已经有了数据在原来的基础上加上数量
    carData[isHasInfo.index].counts +=counts;
  }

  //设置缓存中
  wx.setStorageSync(this._storageKeyName, carData);

}
//获取缓存中的数据
getCarDataFromLocal(flag){
  //从缓存中读取数据key:value
  var res = wx.getStorageSync(this._storageKeyName);
 
//如果读取缓存是空，返回空数组
  if(!res){
    res = [];
  }

if(flag){
  var newRes = [];
  for(let i = 0 ; i<res.length;i++){

    if(res[i].selectStatus){
      newRes.push(res[i]);
    }
  }

  res = newRes;
}


  return res;

}
//判断新添加的数据在缓存购物车中有没有
_isHasThatOne(id,arr){
var item,
result = {index:-1};
for(let i=0; i< arr.length;i++){
  item = arr[i];
  //如果存在说明缓存中，存在了添加的商品了
  if(item.id == id){
    result = {
      index:i,
      data:item,
    };
    break;
  }
}
return result;
}

//自动获取购物车的数量在缓存中读取
getCartTotalCounts(flag){
  var  data = this.getCarDataFromLocal();
  
 
  var counts = 0 ;
  for(let i= 0 ; i< data.length;i++){
    if(flag){
      //如果你选择我们就累加某一类商品
      if(data[i].selectStatus){
        counts += data[i].counts;
      }
    }else{
      counts += data[i].counts;
    }
   
  }


  return counts;
}
//数量增减
_changeCounts(id,counts){

  var cartData = this.getCarDataFromLocal(),
  hasInfo = this._isHasThatOne(id,cartData);

  if(hasInfo.index != -1 ){
    if(hasInfo.data.counts > 1){
      cartData[hasInfo.index].counts += counts;
    }
  }

  //更新本地缓存
  wx.setStorageSync(this._storageKeyName,cartData);

}

//
addCounts(id){
  this._changeCounts(id,1);
}

cutCounts(id){
  this._changeCounts(id,-1);
}

//删除购物车数据
delete(ids){
  //判断一下他是不是数组
  if(!(ids instanceof Array)){
    ids = [ids];
  }

  //获取缓存中的数据
  var cartData = this.getCarDataFromLocal();

//循环他
for (let i = 0; i < ids.length; i++){
  var hasInfo = this._isHasThatOne(ids[i],cartData);//有没有删除的数据存在
  if(hasInfo.index != -1){
    //说明存在//删除缓存中的数组的数据
    cartData.splice(hasInfo.index,1);
  }
}

  wx.setStorageSync(this._storageKeyName, cartData);

}

  execsetStorageSync(cartData){
    wx.setStorageSync(this._storageKeyName, cartData);
  }





}

export{Cart};