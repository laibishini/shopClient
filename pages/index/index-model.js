//banner数据请求类
import{ Base } from '../../utils/base.js';
class Home extends Base{
constructor(){
 super();
}
//向服务器请求banner
getBannerData(id,callback){
var data = {
  url:'banner/'+id,
  sCallBack:function(res){
    callback && callback(res.data.item);
  }

  //服务器调用
  
};

  this.request(data);
}

  getThemeData(callback){
    var params = {
      url:'theme?ids=1,2,3',
      sCallBack: function (data) {
        callback && callback(data.data);
      }
    }
    this.request(params);
    
  }

  //获取产品数据
  getProductData(callback) {
    var params = {
      url: 'product/recent',
      sCallBack: function (data) {
        callback && callback(data.data);
      }
    }
    this.request(params);

  }
}

export {Home};