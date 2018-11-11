//收货地址类
import {Base} from 'base.js';
import{config} from 'config.js';
class Address extends Base{

constructor(){
  super();
}

//组装收货地址proviceName是自带的调试模式下
setAddressInfo(res){
  //组装数据
  var province = res.provinceName || res.province,
  city = res.cityName || res.city,
    country = res.countyName || res.country,
  detail = res.detailInfo || res.detail;

var totalDetail = city+country+detail;


//判断一下是不是直辖市
if(!this.isCeterCity(province)){
 
 //如果不是直辖市我们才把省名加在前面
 totalDetail = province + totalDetail;

}
//把详细地址返回回去
return totalDetail;

}

//从服务器获得地址
getAddress(callback){
  var that = this;
  var param = {
    url:'address',
    sCallBack:function(res){
      var res = res.data
      if(res){
        res.totalDetail = that.setAddressInfo(res);
        callback && callback(res)
      }
    }
  }

  that.request(param);
}


//判断是不是直辖市
isCeterCity(name){
  var centerCitys = ['北京市','天津市','重庆市','上海市'],flag = centerCitys.indexOf(name) >= 0;

  return flag;


}

//更新保存地址到数据库
submitAddress(data,callback){
  data = this._setUpAddress(data);
  console.log(data);

  var param = {
    url:'address',
    type:'POST',
    data:data,
    sCallback:function(res){
     
      callback && callback(true,res);
    },eCallback(res){
      callback && callback(false, res);
    }
  };

  this.request(param);

  //地址和数据库的地址市不一样的我们要组装一下
}

_setUpAddress(res){
  var formData = {

    name:res.userName,
    province:res.provinceName,
    city:res.cityName,
    country:res.countyName,
    mobile:res.telNumber,
    detail:res.detailInfo
  };


  return formData;


}

}

export{Address};