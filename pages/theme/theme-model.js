/**
 * Created by jimmy on 17/2/26.
 */
import {Base} from '../../utils/base.js';

class Theme extends Base{
    constructor(){
        super();
    }

    /*商品*/
    getProductorData(id,callback){
     
        var param={
            url: 'theme/'+id,
          sCallBack:function(data){
             
                callback && callback(data.data);
            }
        };
        this.request(param);
    }
};

export {Theme};