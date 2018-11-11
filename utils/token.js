//令牌类
//导入配置类
import {config} from 'config.js';
class Token{

  constructor(){
    
    this.verifyUrl = config.restUrl + 'token/verify';

    //令牌服务器地址
    this.tokenUrl = config.restUrl + 'token/user';
   
    
  
  }

//令牌类
verify(){
  //从stroge缓存中读取令牌
  var token = wx.getStorageSync('token');
  
  if(!token){
    //如果token令牌不存在我们要从PHP服务器获取令牌
    this.getTokenFromServer();
  }else{
    //否则令牌存在，存在我们要从服务器请求这个令牌是不是有没有失效
    this._verifyFromServer(token);
   
  }
}
//验证令牌是不是在有效的期限内
_verifyFromServer(token){
  var that = this;


  wx.request({
    url: that.verifyUrl,
    method:'POST',
    data:{
      token:token
    },
    //成功和失败都要返回是不是令牌在生效
    success:function(res){
      var valid = res.data.isValid;
      if(!valid){
        //如果从服务器返回的令牌已经过期我们在，获取一下新的令牌
        that.getTokenFromServer();
      }
    }
  })
}
//读取令牌从服务器先获得code码

getTokenFromServer(callback){
  var that = this;

  wx.login({
    success:function(res){
      wx.request({
        url: that.tokenUrl,
        method:'POST',
        data:{
          code:res.code
        },
        //成功从服务器拿到给我们生成的令牌
        success:function(res){
            //把拿到的令牌存到缓存中
            wx.setStorageSync('token', res.data.token)

            //返回给调用
            callback && callback(res.data.token);
        }
      })
    }
  })
}



}

export{Token};