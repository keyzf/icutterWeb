/* 页面操作 实时更新页面上项目状态及其他信息*/

import $ from 'jquery';
import channel from '@/channel';

export function get() {
    // console.info('handy get')
}
let _checkMore = () => {
    // console.info('ssss');
    // var scrollTop = $(window).scrollTop();
    // var scrollHeight = $(document).height();
    // var windowHeight = $(window).height();
    // console.info(scrollTop)
    // if(scrollTop + windowHeight === scrollHeight){
    //     alert("已经到最底部了！");
    // }
};
// if (document.addEventListener) {
//     document.addEventListener("mousewheel", _checkMore, false);
// }
// else {
//     document.attachEvent("onmousewheel", _checkMore);
// }
export function set() {
    // console.info('handy set')
}
export function LoadMore(url, data, callback, judge) {
    let _data = data;
    let that = this;
    _data['page'] = 1;
    _data['limit'] = 200;
    let res = [];
    this.refresh = (data) => {
        _data = data;
        _data['page'] = 1;
        that._loadMore();
    };
    _checkMore = () => {
        // console.info('ssss');
        judge && judge() ? this._loadMore() : '';
    };
    // console.info(_checkMore)
    this._loadMore = () => {
        channel(url, _data, (re) => {
            if (re && re.list) {
                res = res.concat(re.list);
                _data['page']++;
                callback(res);
            }
        })
    };
    this._loadMore();
}

