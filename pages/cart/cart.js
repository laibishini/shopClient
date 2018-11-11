// pages/cart/cart.js
import {Cart} from 'cart-model.js';
var cart = new Cart();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //离开后购物车也也要保持状态
  onHide:function(){

    cart.execsetStorageSync(this.data.cartData);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this._reseCarData();

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

//获取缓存中的数据
    var cartData = cart.getCarDataFromLocal();

//获取总的数量这个数量是分为选择商品后的数量
    // var cuntsInfo = cart.getCartTotalCounts(true);
    var cal = this._calcTotalAccountAndCounts(cartData);
 

    this.setData({
      selectedCounts:cal.selectedCount,
      selectedTypeCounts:cal.selectedTypeCounts,
      cartData:cartData,
    })



  },
 //计算订单的总金额
 _calcTotalAccountAndCounts:function(data){
//把每个商品累加起来就是订单的总金额
var len = data.length,

account = 0,
//需要计算商品的总金额，但是我们还是要排除没有选中的商品

//某一个类商品的总数量，选中后的
selectedCounts = 0,

//某一个类商品的数量
selectedTypeCounts = 0;

let multiple = 100;
//计算总价格要乘以100有可能算的不准
for(let i = 0; i < len; i++){
  if(data[i].selectStatus){
    account +=
    data[i].counts * multiple * Number(data[i].price)*multiple;

    //某一种类型商品总数量
    selectedCounts +=data[i].counts;
    selectedTypeCounts ++;
  }
}

//返回数据
return {
  selectedCount:selectedCounts,
  selectedTypeCounts:selectedTypeCounts,
  account:account/(multiple*multiple)
}
 },
 //商品选中
  toggleSelect:function(event){

    var id = cart.getDataSet(event,'id'),
    status = cart.getDataSet(event,'status'),
    //得到缓存中数据的小标
      index = this._getProductIndexById(id);

     

      //通过下标来改变每条数据的选中状态
    this.data.cartData[index].selectStatus = !status;
    this._reseCarData();



    
  },

_reseCarData:function(){
 var newData = 
    this._calcTotalAccountAndCounts(this.data.cartData);

    this.setData({
      account : newData.account,
      selectedCounts: newData.selectedCount,
      selectedTypeCounts: newData.selectedTypeCounts,
      cartData: this.data.cartData,

    });
},

  //全选商品
  toggleSelectAll:function(event){
    var status = cart.getDataSet(event,'status') == 'true';

    //循环所有数据因为没全选所有都是false
    var data = this.data.cartData,
    len = data.length;

    for(let i = 0; i < len; i++){
      data[i].selectStatus = !status;
    }

    this._reseCarData();


  },

  //根据商品的ID来获得缓存中数据的小标
  _getProductIndexById:function(id){

    var data = this.data.cartData,
    len = data.length;

    for(let i = 0 ; i< len; i++){
      if(data[i].id == id){
        return i;
      }
    }
  },
  //加减数量
  changeCounts:function(event){
    var id = cart.getDataSet(event,'id'),
    type=cart.getDataSet(event,'type'),
    index = this._getProductIndexById(id),
    counts = 1;

    if(type == 'add'){
      cart.addCounts(id);
    }else{
      counts = -1;
      cart.cutCounts(id);
    }

//改变他数量更新到显示层
    this.data.cartData[index].counts += counts;
    this._reseCarData();

  },
  //删除商品
  delete:function(event){
    var  id = cart.getDataSet(event,'id'),
    
    //获取删除那个数据的索引
     index = this._getProductIndexById(id);

    this.data.cartData.splice(index,1);//删除数组的某一项商品

    //更新数据
    this._reseCarData();
    
    cart.delete(id);
  },
  

  //跳转到下单页面
  submitOrder:function () {
   
    wx.navigateTo({
      url: '../order/order?account=' + this.data.account + '&from=cart',
    })
  }


  
})