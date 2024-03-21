/* 全局 提示弹窗 loading msg */
import $ from 'jquery';
import { message } from 'antd';
import say from '@/database/local_language';
import './index.scss';

export function get() {
    // console.info('handy get')

}

export function set() {
    // console.info('handy set')

}

function close() {
    $('.dialog-info').hide();
}
export function closeConfirm() {
    $('.dialog-confirm').hide().find('.sure').unbind('click', confirmFunc);
}

function closeMsg() {
    $('.browserV').hide();
}
// function closeTip() {
//     $('.tipV').hide();
// }
let confirmFunc = () => {

};
let infoDom = '<div class="dialog dialog-info">' +
    '<div class="shadow clo" > </div>' +
    '<div class="scope">' +
    '<div class="win">' +
    '<div class="title">' +
    '<span>' + say('main', 'reminder') + '</span>' +
    '<span class="close clo"> </span>' +
    '</div>' +
    '<div class="main">' +
    '<ul>' +
    '<li class="ms">{win.msg}</li>' +
    '<li>' +
    '<span class="btn clo" >' + say('main', 'confirm') + '</span>' +
    '</li>' +
    '</ul>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>';
let confirmDom = '<div class="dialog dialog-confirm">' +
    '<div class="shadow clo" > </div>' +
    '<div class="scope">' +
    '<div class="win">' +
    '<div class="title">' +
    '<span>' + say('main', 'reminder') + '</span>' +
    '<span class="close clo"> </span>' +
    '</div>' +
    '<div class="main">' +
    '<ul>' +
    '<li class="ms">{win.msg}</li>' +
    '<li>' +
    '<span class="btn sure" >' + say('main', 'confirm') + '</span>' +
    '<span class="btn clo" >' + say('main', 'cancel') + '</span>' +
    '</li>' +
    '</ul>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>';
let loadingDom = '<div class="dialog-loading">' +
    '<div class="dialog-loading-main">' +
    '<span class="close"></span>' +
    '<span>' + say('main', 'waiting') + '…</span>' +
    ' <div class="k-square-holder2">' +
    '<div class="k-square4 k-square4a"></div>' +
    '<div class="k-square4 k-square4b"></div>' +
    '<div class="k-square4 k-square4c"></div>' +
    '<div class="k-square4 k-square4d"></div>' +
    '</div>' +
    '</div>' +
    '</div>';
let msgDom = '<div class="the-msg browserV">' +
    '<div>' +
    '<span class="ico iconfont ">' +
    '</span>' +
    '<span>' + say('info', 'say1') + ' <span class="downChrome">' + say('info', 'say2') + '</span> </span>' +
    '<span class="ico iconfont icon-guanbi clo">' +
    '</span> </div>' +
    '</div>';
let tipDom = '<div class="the-msg tipV">' +
    '<div>' +
    '<span class="ico iconfont icon-cuowujinggao">' +
    '</span>' +
    '<span class="ms"></span>' +
    '</div>' +
    '</div>';
$('body').append(
    infoDom).append(loadingDom).append(msgDom).append(confirmDom).append(tipDom);
$('.dialog-loading').find('.close').bind('click', loadingOff);
$('.dialog-info').find('.clo').bind('click', close);
$('.dialog-confirm').find('.clo').bind('click', closeConfirm);
// $('.browserV').find('.clo').bind('click', closeMsg);
$('.tipV').find('.clo').bind('click', closeMsg);
$('.the-msg').find('.clo').bind('click', closeMsg);
$('.browserV').find('.downChrome').bind('click', () => {
    window.open('http://rj.baidu.com/soft/detail/14744.html', '_blank')
});

//info message
export function info(msg) {
    message.info(msg)
}
export function confirm(msg, func) {
    confirmFunc = func;
    $('.dialog-confirm .ms').text(msg);
    $('.dialog-confirm').show().find('.sure').bind('click', confirmFunc);
}
export function msg(msg) {
    $('.browserV').show();
}
let tipTimeout = '';
export function tip(tip) {
    let tipD = $('.tipV');
    $('.tipV .ms').text(tip);
    tipD.show().animate({ top: "60px" });
    clearTimeout(tipTimeout);
    tipTimeout = setTimeout(() => {
        tipD.hide().css({ top: '-30px' });
    }, 2000);
}
//loading show
export function loadingOn() {
    $('.dialog-loading').show();
}
//loading hide
export function loadingOff() {
    $('.dialog-loading').hide();
}