import { Base } from '../../utils/base.js';


class Category extends Base{
  constructor(){
    super();
  }

//获得分类数据
  getCategoryType(callback) {
    var data = {
      url: 'category/all',
      sCallBack: function (res) {
        callback && callback(res.data);
      }

      //服务器调用

    };

    this.request(data);
  }
//获取分类产品的数据
  getProductByCategory(id,callback) {
    var data = {
      url: 'product/by_category?id='+id,
      sCallBack: function (res) {
        callback && callback(res.data);
      }

      //服务器调用

    };

    this.request(data);
  }
}

export{Category};