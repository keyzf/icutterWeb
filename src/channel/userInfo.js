
/* 全局方法 获取用户信息 */
import channel, { set_serve_ip } from '@/channel';

let userInfo = {};
let meal = {};
let backList = [];
export function getUserInfo() {
    return userInfo;
}
export function getMeal() {
    return getMeal;
}
export function line(func) {
    backList.push(func);
}
export function refresh(func) {
    /* channel('get_account', {}, (re) => {
        userInfo=re;
        // set_serve_ip(re.server_host+'//');
        userInfo.guide=2;
        localStorage.username=userInfo.username;
        func&&func(userInfo);
    },'','info'); */
}
export function refreshMeal(func) {
    channel('meal', {}, (re) => {
        meal = re;
        func && func(meal);
    }, '', 'info');
}