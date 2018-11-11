// pages/product/product.js
import { Product } from 'product-model.js';
import { Cart } from '../cart/cart-model.js';

var cart = new Cart();

var product = new Product();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    countsArray : [1,2,3,4,5,6,7,8,9,10],
    productCounts :1,
    currentTabsIndex:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

var  id = options.id;
   
    this.data.id = id;

console.log(this.data.id);
    this._loadData();


    
  },
  _loadData:function(){
var that = this;
product.getDetailInfo(this.data.id,(res)=>{
  console.log(res);
  this.setData({
  
    'product': res,
    cartTotalCounts: cart.getCartTotalCounts()
  });
});

  },
  //显示获取商品数量然后返回给显示层
  bindPickerChange:function(event){
    var index = event.detail.value;
    var selectedCount = this.data.countsArray[index];
    //数据绑定
    this.setData({
      productCounts:selectedCount,
     
    })
  },
  //选项卡
  onTabsItemTap:function(event){
    //获取序列号
    var index = product.getDataSet(event,'index');
   
    this.setData({
      currentTabsIndex:index,
    })
  },
  //添加购物车
  onAddingToCartTap:function(event){

  var  counts = this.data.cartTotalCounts + this.data.productCounts;
  this.setData({
    cartTotalCounts:counts,
  })
    this.addToCart();
  },
  //添加缓存中我们要定义添加那些数据到缓存中
  addToCart:function(){
    var temObj = {};
    var keys = ['id','name','main_img_url','price'];
//循环他
for(var key in this.data.product ){
  if(keys.indexOf(key) >= 0 ){
    //有这些值说明存在
    temObj[key] = this.data.product[key];
  }
}

//写入到缓存中
    cart.add(temObj, this.data.productCounts);
    // cart.add(temObj, this.data.productCounts);
   
  },
  //跳转到购物车
  onCartTap:function(){
    wx.switchTab({
      url: '/pages/cart/cart',
    })
  }

 
})