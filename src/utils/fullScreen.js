/* 画布操作 全屏和退出全屏 */

// 全屏
export function fullscreen() {
    let el = document.documentElement;
    (el.requestFullscreen&&el.requestFullscreen())||
    (el.mozRequestFullScreen&&el.mozRequestFullScreen())||
    (el.webkitRequestFullscreen&&el.webkitRequestFullscreen())||(el.msRequestFullscreen&&el.msRequestFullscreen());
}

// 退出全屏
export function exitFullscreen() {
    document.exitFullscreen?document.exitFullscreen():
        document.mozCancelFullScreen?document.mozCancelFullScreen():
            document.webkitExitFullscreen?document.webkitExitFullscreen():'';

}
export function FullScreen(){
    let el=document.documentElement;
    let isFullscreen=document.fullScreen||document.mozFullScreen||document.webkitIsFullScreen;
    if(!isFullscreen){//进入全屏,多重短路表达式
        (el.requestFullscreen&&el.requestFullscreen())||
        (el.mozRequestFullScreen&&el.mozRequestFullScreen())||
        (el.webkitRequestFullscreen&&el.webkitRequestFullscreen())||(el.msRequestFullscreen&&el.msRequestFullscreen());

    }else{	//退出全屏,三目运算符
        document.exitFullscreen?document.exitFullscreen():
            document.mozCancelFullScreen?document.mozCancelFullScreen():
                document.webkitExitFullscreen?document.webkitExitFullscreen():'';
    }
}
export function fullScreenCallback(fun){
    // console.info('setlistener')
    callbackFS=fun;
}
function callbackFS() {
    console.info('olistener')

}

// 监听是否全屏
//  window.onload = function() {
//     console.info('listener')
    let elem = document.getElementById('state');
    document.addEventListener('fullscreenchange',
        function() {
        // console.info('fullscreenchange')
            callbackFS(document.fullscreen)
        },
        false);
    document.addEventListener('mozfullscreenchange',
        function() {
            // console.info('mozfullscreenchange')
            callbackFS(document.mozFullScreen)
        },
        false);
    document.addEventListener('webkitfullscreenchange',
        function() {
            // console.info('webkitfullscreenchange')
            callbackFS(document.webkitIsFullScreen)
        },
        false);
    document.addEventListener('msfullscreenchange',
        function() {
            // console.info('msfullscreenchange')
            callbackFS(document.msFullscreenElement)
        },
        false);
// }