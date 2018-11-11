import { Base } from '../../utils/base.js';
//定义product类


class Product extends Base{

  constructor(){
    super();
  }

  getDetailInfo(id,callback){
    
    var params = {
      url: 'product/'+id,
      sCallBack: function (data) {
        callback && callback(data.data);
      }
    }
    this.request(params);
  }
}

export { Product };