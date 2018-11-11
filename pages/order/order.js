// pages/order/order.js
import {Cart} from '../cart/cart-model.js';
import {Order} from '../order/order-model.js';
import {Address} from '../../utils/address.js';
var order = new Order();
var address = new Address();


var cart = new Cart();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //本地订单详情
    var from = options.from;
    if(from == 'cart'){
      this._fromCart(options.account);
    }else{
      var id = options.id;
      this._fromOrder(id);
    }

  },
  //获取数据库具体订单信息
  _fromCart:function(account){

    //产品的信息

    var productsAtt = cart.getCarDataFromLocal(true);

    this.data.account = account;//产品总金额

    //显示数据 
    this.setData({
      productsArr: productsAtt,
      account: account,
      orderStatus: 0,
    });

    //显示数据的收货地址
    address.getAddress((res) => {
      console.log(res);
      this._bindAddressInfo(res);
    });

  },

  //从数据库读取订单信息
  _fromOrder:function(id){

    var that = this;
     //订单失败和成功后我们都要读取订单的信息
      
      order.getOrderInfoById(id, (data)=> {
        
          console.log(data);
       that.setData({
          orderStatus:data.status,
          productsArr:data.snap_items,
          account:data.total_price,
          hasicInfo:{
            orderTime:data.create_time,
            orderNo:data.order_no
          }
        });

        //快照地址绑定地址信息
        var addressInfo = data.snap_address;
        addressInfo.totalDetail = address.setAddressInfo(addressInfo);
        that._bindAddressInfo(addressInfo);
       });

     

  },

  

  //下订单
  pay:function(){
    if(!this.data.addressInfo){
      //如果地址不存在
      this.showTips('下单提示，请填写您的收货地址');
      return;
    }
    if(this.data.orderStatus == 0){
      //如果返回是购物车支付，我们要生成订单
      this._firstTimePay();
    }else{
      //下单是从我的页面来支付的
      this._onMoresTimePay();
    }

  },

  //第一次从购物车下的订单我们要组装他
  _firstTimePay:function(){

    var orderInfo = [],
    procuctInfo = this.data.productsArr,
    order = new Order();

    //循环产品的ID和数量要拿到
    for(let i = 0; i < procuctInfo.length; i++){
      orderInfo.push({
        product_id:procuctInfo[i].id,
        count:procuctInfo[i].counts
      })
    }

    //支付分为两步，第一步是生成订单号，然后根据订单号来支付
    var that = this;

  //把组装好的下单数据
    order.doOrder(orderInfo,(data)=>{
      console.log(data);
    //返回给我们结果订单生成
    if(data.pass){
      //库存通过
      var id = data.order_id;
      that.data.id = id;
    //把订单主键ID存起来
      // that.data.fromCartFlag = false;
      

    //开始支付
    // that._execPay(id);

    }else{
      that._orderFail(data);//下单失败
    }
    })
  },

  //开始支付
  _execPay:function(id){
    var that = this;
    order._execPay(id,(statusCode)=>{
      if(statusCode !=0){
        //说明支付成功了
        //把购物车清空
        that.deleteProducts();
        var flag = statusCode == 2;//如果不是2就是false

        wx.navigateTo({
          url: '../pay-result/pay-result?id='+id+'&flag='+flag+'&from=order',
        });
      }
    })
  },

  //下单失败了会返回库存信息
  _orderFail:function(data){

    var nameArr = [],
    name = '',
    str = '',
    pArr = data.pStatusArray;

    //循环他
    for(let i = 0 ; i < pArr.length; i ++){
      if(!pArr[i].haveStock){
        name = pArr[i].name;
        if(name.length > 15){
          name = name.substr(0,12)+'....';
        }

        nameArr.push(name);

        if(nameArr.length >= 2){
          break;
        }
      }
    }

    //循环完成以后
    str += nameArr.join('、');
    if(nameArr.length > 2){
      str+= '等';
    }
    str += '缺货';
    wx.showModal({
      title: '下单失败',
      content: str,
      showCancel:false,
      success:function(res){

      }
    })
  },

  //把支付成功的购物车清空
  deleteProducts:function(){
    var ids = [],arr = this.data.productsArr;
    for(let i = 0; i < arr.length; i++){
      ids.push(arr[i].id);
    }

    //保存的ID号后删除
    cart.delete(ids);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var productsAtt = cart.getCarDataFromLocal(true);
    //显示数据 
    this.setData({
      productsArr: productsAtt,
      account: this.data.account,
      orderStatus: 0,
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    if(this.data.id){
      
      this._fromOrder(this.data.id);

   }
   
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

  editAddress:function(event){
    var that = this;

    //自动获取收货地址
    wx.chooseAddress({
      success:function(res){
        //得到收货地址数据绑定
        
        var addressInfo = {
          name : res.userName,
          mobile : res.telNumber,
          totalDetail: address.setAddressInfo(res)

        }

        that._bindAddressInfo(addressInfo);

      //保存地址到数据库
        address.submitAddress(res,(flag)=>{
         
          if(!flag){
            that.showTips('操作提示，地址信息更新失败');
          }
        })
        


      }
    })
  },


  //绑定数据
  _bindAddressInfo: function (addressInfo){

    //绑定到模版
    this.setData({
      addressInfo : addressInfo,
    })

  }
})