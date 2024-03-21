/* 全局方法， 发送请求的分发 是调取本地还是调取服务器 */
import remote from './request-remote';
import local from './request-local';

const shunt = (url, data, success, type, async,fail,auto,path,json,trans) => {
  switch (type) {
    case 'self':local(url, data, success, type, async,fail,auto,path,json,trans);break;
    default:(type==='self')&&(type='');remote(url, data, success, type, async,fail,auto,path,json,trans);
  }
};

export default shunt
