// pages/category/category.js
//导入数据
import {Category} from 'category-model.js';
var category = new Category();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

this._onLoad();
  },
  _onLoad:function(){

    category.getCategoryType((categoryData)=>{
      console.log(categoryData);
      this.setData({
        categoryTypeArr:categoryData,
      });


      category.getProductByCategory(categoryData[0].id,(data)=>{
       console.log(data);
        var dataObj = {
          procucts:data,
          topImgUrl: categoryData[0].img.url,
          title: categoryData[0].name,
        };
        this.setData({
          categoryProdcuts: dataObj
        })
      })


    });

  },
  onProductsItemTap: function (event) {
    var id = category.getDataSet(event, 'id');

    wx.navigateTo({
      url: '../product/product?id=' + id,
    })
  }

})