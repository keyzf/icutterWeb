
/* 全局方法 获取本地数据文件 */
import $ from 'jquery';

const ajax = (url, data, success, type, async,fail,auto,path) => {
  /*-----调用本地---------*/
  let _url=url;
  let _array=_url.split('//');
  _array.splice(0,1);
  _url=_array.join('//');
  _array=_url.split('/');
  _array.splice(-1,1);
  _array.splice(0,1);
  _url=_array.join('/')+'.json';
  $.ajax({
    type:  'get',
    async: false,
    url: '/response/'+_url,
    success: function (data,status) {
      if(data.status==='success') {
        data.result ? success(data.result) : success(data)
      }else{
        success(data)
      }
    },
    error:function (data) {
      fail?fail(data):'';
    }
  });
};

export default ajax
