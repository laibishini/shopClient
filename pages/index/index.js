//index.js
//获取应用实例
const app = getApp()
//拿到home
import{Home} from 'index-model.js'
//拿到模型home模型
var home = new Home();
Page({
  data: {
    
  },

onLoad:function(){
this._loadData();

},
_loadData:function(){
  var id = 1;
   home.getBannerData(id,(res)=>{
    //显示出图片
    
  this.setData({
    'bannerAttr':res,
  });
  
  });
  //获取主题数据
  home.getThemeData((res) => {
   
    this.setData({
      'themeAttr': res,
    });
  });

//获取产品数据
  home.getProductData((res)=>{
  
    this.setData({
      'ProductsAttr': res,
    });
  });
 
},
//产品地址跳转
onProductsItemTab:function(event){

  
  var id = home.getDataSet(event,'id');
 
//banner图片跳转
wx.navigateTo({
  
  url: "../product/product?id="+id,
})
  },
  //产品专题跳转
  onThemesItemTap: function (event) {


    var id = home.getDataSet(event, 'id');
    var name = home.getDataSet(event, 'name');
    
    //专题图片跳转
    wx.navigateTo({

      url: '../theme/theme?id=' + id + '&name=' + name,
    })
  },
  
})
