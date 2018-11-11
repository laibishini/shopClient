 import {Base} from '../../utils/base.js';

class My extends Base{
  constructor(){
    super();
  };
  
  //得到用户的信息
  getUserInfo(cb){
     var that = this;
     wx.login({
       success:function(){
         wx.getUserInfo({
           success:function(res){
             typeof cb == 'function' && cb(res);
           },
           fail:function(res){
             typeof cb == 'function' && cb({
               avataUrl:'../../imgs/icon/user@default.png',
               nickName:'胡浩商店'
             });
           }
         })
       }
     })
  }
}

export{My};