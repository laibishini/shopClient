// pages/theme/theme.js
//导入数据
import{Theme} from 'theme-model.js';
var theme = new Theme();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  
  onLoad: function (option) {
    var id = option.id;
    var name = option.name
    
    this.data.name = name;
    this.data.id = id;
    
    
    this._loadData();

  },
  onReady:function(){
    
 wx.setNavigationBarTitle({
   title: this.data.name,
 })
  },

  /*加载所有数据*/
  _loadData: function () {
 
    /*获取单品列表信息*/
    theme.getProductorData(this.data.id, (data) => {
     
      this.setData({
        themeInfo:data,
      });
      
    });
  },

  /*跳转到商品详情*/
  onProductsItemTap: function (event) {
    var id = theme.getDataSet(event, 'id');
    console.log(id);
    wx.navigateTo({
      url: "../product/product?id=" + id,
    })
  },
  onProductsItemTab:function(event){
    var  id = theme.getDataSet(event,'id');

    wx.navigateTo({
      url: '../product/product?id='+id,
    })
  }

  
})