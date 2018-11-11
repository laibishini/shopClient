// pages/my/my.js
import {My} from 'my-model.js';
import {Address} from '../../utils/address.js';
import {Order} from '../order/order-model.js';
var order = new Order();
var address = new Address();
var my = new My();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex : 1,
    orderArr:[],
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this._loadData();
    this._getAddressInfo();
  },

_loadData:function(){
  my.getUserInfo((data)=>{
    this.setData({
      UserInfo:data
    })
  })

  //获取订单的数据
  this._getOrders();
},
_getOrders:function(callback){
  order.getOrders(this.data.pageIndex,(res)=>{
    var data = res;
    console.log(data);
    if(data.length > 0){
      this.data.orderArr.push.apply(this.data.orderArr,data);
      this.setData({
        orderArr: this.data.orderArr
      })
    }else{
      this.data.isLoadeAll = true;
    }
    callback && callback();
    
  })
},

//获取用户地址
_getAddressInfo:function(){
  address.getAddress((addressInfo)=>{
    console.log(addressInfo);
    this._bindAddressInfo(addressInfo);
  });
},
  _bindAddressInfo: function (addressInfo){
    this.setData({
      addressInfo:addressInfo
    })
  },

  onGotUserInfo: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var newOrderFlag = order.hasNewOrder();
    if(newOrderFlag){
      this.refresh();
    }
   
  },
  refresh:function(){
    //有新订单了，我们重新从服务器加载数据
    var that = this;
    this.data.orderArr = [];//订单初始化
    this._getOrders(() => {
      that.data.isLoadeAll = false;//是否加载完全
      that.data.pageIndex = 1;
      //更新状态关闭
      order.execSetStorageSync(false);
    });

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //显示订单详细信息
  showOrderDetailInfo:function(event){
    var id = order.getDataSet(event,'id');
    wx.navigateTo({
      url: '../order/order?from=order&id='+id,
    })
  },

  //我的订单详情页面去支付
  rePay:function(event){
    var id = order.getDataSet(event,'id'),
    index = order.getDataSet(event,'index');
    this._execPay(id,index);
  },
  _execPay:function(id,index){
    var that = this;
    order.execPay(id,(statusCode)=>{
      //发送支付
      if(statusCode > 0 ){
        var flag = statusCode == 2;

        //更新订单的状态
        //支付成功以后，把付款变成已经付款
        if(flag){
          that.data.orderArr[index].status = 2;
          that.setData({
            orderArr:that.data.orderArr
          })
        }

        //然后支付成功以后跳转页面
        wx.navigateTo({
          url: '../pay-result/pay-result?id='+id+'&flag='+flag+'&from=my',
        })
      }else{
        that.showTips('支付失败','商品已经下架或者库存不足')
      }
    })
  },
  //微信提示框
  showTips:function(title,content){
    wx.showModal({
      title: title,
      content: content,
      success:function(res){

      }
    })
  },
  editAddress: function (event) {
    var that = this;

    //自动获取收货地址
    wx.chooseAddress({
      success: function (res) {
        //得到收货地址数据绑定

        var addressInfo = {
          name: res.userName,
          mobile: res.telNumber,
          totalDetail: address.setAddressInfo(res)

        }

        //绑定收货地址
        that._bindAddressInfo(addressInfo);

        //保存地址到数据库
        address.submitAddress(res, (flag) => {

          if (!flag) {
            that.showTips('操作提示，地址信息更新失败');
          }
        })



      }
    })
  }

  

})