
/* 全局方法 真实发送请求的封装 */
import $ from 'jquery';
import { Modal, message } from 'antd';
import { toLineS } from "@/utils/handy";
import { loadingOn, loadingOff } from "@/components/Info";

const _warning = Modal.warning;
let lock_redirect = false;
const ajax = (url, data, success, type, async, fail, auto, path, json, trans) => {
  let _data = data || {};
  url += localStorage.signature ? (url.indexOf('?') > 0 ? '&' : '?') + 'token=' + localStorage.signature : '';
  if (type === 'POST' && _data.data) {
    for (let i in _data) {
      if (i !== 'data') {
        url += (url.indexOf('?') > -1 ? '&' : '?') + i + '=' + _data[i];
      }
    }
    _data = _data.data;
  }
  url += (url.indexOf('?') > -1 ? '&' : '?') + 'lang=' + ('cn');
  // }
  if (auto === 'all' || auto === 'loading') {
    loadingOn();
  }
  if (typeof data === 'object') {
    for (let _i in data) {
      data[_i.replace(/\_(\w)/g, function (all, letter) {
        return letter.toUpperCase();
      })] = data[_i]
    }
  }
  $.ajax({
    type: type || 'GET',
    async: async,
    timeout: url.indexOf('get_video_url') > -1 ? 20 * 1000 : 60 * 1000,
    // crossDomain: true,
    // xhrFields : {
    //     withCredentials: stager
    // },
    // headers: {'Authorization':sessionStorage.signature || ''},
    dataType: json || 'json',
    contentType: 'application/json',
    url: url,
    // xhrFields: {
    //     withCredentials: true
    // },
    // crossDomain: true,
    data: _data || {},
    beforeSend: (xhr) => {
      xhr.setRequestHeader("Authorization", localStorage.signature || '');
    },
    success: function (data) {
      if (trans) {
        data = toLineS(data);
      }
      if (auto === 'all' || auto === 'loading') {
        loadingOff();
      }
      if (data.status === 'success') {
        data.result ? success(data.result) : success(data)
      } else if (data.status === 'redirect') {
        if (data.keep_token) {
          data.result ? window.location.href = data.result : '';
        } else {
          localStorage.signature = '';
          if (!lock_redirect) {
            lock_redirect = true;
            window.location.href = '/';
            setTimeout(() => {
              lock_redirect = false;
            }, 2000)
          }
        }
      } else if (data.status === 'fail') {
        if (auto === 'all' || auto === 'info') {
          _warning({
            title: '错误信息',
            content: data.result || path,
            style: {
              top: 200
            },
            cancelText: ''
          });
        } else if (auto === 'infoMessage') {
          message.warning(data.result || path);
        }

        fail ? fail(data) : '';
      } else if (data.status === 'exceed' || data.result === '没有权限，登陆后重试') {
        localStorage.signature = '';
        window.location.href = window.location.origin;
        // location.href=location.host;
      } else {
        success(data)
      }
    },
    error: function (data) {
      if (auto === 'all' || auto === 'loading') {
        loadingOff();
      }
      // if(auto==='infoMessage'){
      //     message.warning(data.result||path);
      // }
      fail ? fail(data) : '';
    }
  })
};

export default ajax
