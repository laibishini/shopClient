//基础类的封装很多的程序都要调用请求所以我们封装在一起了。
//引用配置文件
import{config} from '../utils/config.js';
import{Token} from 'token.js';
var token = new Token();

class Base{

  //定义一个基础类
  constructor(){

    this.baseRequestUrl = config.restUrl;

  }
  //调用我们应该传什么样的方法 norefetch为true的时候不做为授权重试机智这个参数可以不传，不传就是false;
  request(params,noRefetch){
    var that = this;
    var url = this.baseRequestUrl + params.url;
    

    if (!params.type){
  params.type = "GET";
}
//把令牌放到缓存中
wx.request({
  url: url,
  data:params.data,
  method:params.type,
  header:{
    'content-type':'application/json',
    'token':wx.getStorageSync('token'),
  },
  success:function(res){
   //判断回调函数
    
  
  //   if (params.sCallBack){
      
  //    params.sCallBack && params.sCallBack(res);
      
  //  }
//返回状态码
    
    var code = res.statusCode.toString();
  
  //截取状态码后第一位比如404  截取4
  var starChar = code.charAt(0);

  if(starChar == '2'){
    //如果状态返回是2是正常
    
    
    params.sCallBack && params.sCallBack(res)
  }else{
    if(code == '401'){
     
      //这说明服务器有错误
      //说明token失效了，我们在次请求服务器获得token令牌
      //2就是我们要在请求一下服务器请求的数据
      
      if (!noRefetch){
        that._refetch(params);
      }
     
    }

    if (noRefetch) {
      params.eCallBack && params.eCallBack(res.data)
    }
   
  }



  },
  fail:function(err){

  }
 

})

  }

  _refetch(params){
    var token = new Token();
    //获取新的令牌
    token.getTokenFromServer((token)=>{
      //再次请求一下服务器你要请求的数据，这种可能是令牌有效，但是请求接口的时候令牌失效了，所以我们要获得令牌然后在请求一次服务器
      this.request(params,true);
    })
  }

  //获取元素指定的值
getDataSet(event, key) {

    return event.currentTarget.dataset[key];
  }
}

export{Base};