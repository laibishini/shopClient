//开始订单支付类
import {Base} from '../../utils/base.js';
class Order extends Base{

  constructor(){
    super();
    this._storageKeyName = 'newOrder';
  }
//开始下订单把数据给服务器生成订单编号
  doOrder(param,callback){
    
    var that = this;
    var allParams = {
      url:'order',
      type:'POST',
      data:{products:param},
      sCallBack:function(data){
        
        var data = data.data;
          //返回生成订单的数据
          //先保存到缓存中
          that.execSetStorageSync(true);
         
          callback && callback(data);
      },
      eCallback:function(){
        //失败了
      }
    };

    //发送请求
    this.request(allParams);
  }

//调用订单表信息
  getOrderInfoById(id,callback){
    var that = this;
    var allParams = {
      url:'order/detail/'+id,
      sCallBack:function(data){
        console.log(data);
        
        callback && callback(data.data)
      },
      eCallback:function(){
        
      }
    }
    this.request(allParams);
  }

/**
 * 0 商品可能缺货导致订单失败
 * 1/支付失败或者支付取消
 * 2支付成功
 */
  //第二部下订单支付订单编号传入，
  _execPay(orderNumber,callback){
      var allParams = {
        url:'pay/pre_order',
        type:'POST',
        data:{id:orderNumber},
        sCallback:function(data){
          var timeStamp = data.timeStamp;
          //如果微信服务器没有返回结果我们就认为市失败的
          if(timeStamp){
            //如果有结果拉起微信支付，把参数绑定返回过来的
            wx.requestPayment({
              timeStamp: timeStamp.toString(),
              nonceStr: data.nonceStr,
              package: data.package,
              signType: data.signType,
              paySign: data.paySign,
              success:function(){
                //2就说明支付成功
                callback && callback(2);
              },
              fail:function(){
                callback && callback(1);
              }
            })
          }else{
            callback && callback(0);
          }
        }
      };
      //发起请求
      this.request(allParams);
  }

  execSetStorageSync(data){
    //保存到缓存中下单如果成功了
    wx.setStorageSync(this._storageKeyName, data)
  }

  //获取所有的订单信息
  getOrders(pageIndex,callback){

    var allParams = {
      url:'order/by_user',
      data:{page:pageIndex},
      type:'GET',
      sCallBack:function(data){
        var data = data.data.data.data
        console.log(data);
        callback && callback(data)
      }
    };
    this.request(allParams);
  }
  //是否有新的订单
  hasNewOrder(){
    var flag = wx.getStorageSync(this._storageKeyName);
    return flag == true;


  }

}


export{Order};