/* 全局 公共方法 */

import * as qiniu from "qiniu-js/esm/index";
import { v4 as uuidv4 } from 'uuid';
import channel from "@/channel";

export function get() {
    // console.info('handy get')

}
export function set() {
    // console.info('handy set')

}
/**
 * 下划线转换驼峰
 * @param {String} name 
 * @return  {String}
 */
export function toHump(name) {
    return name.replace(/\_(\w)/g, function (all, letter) {
        return letter.toUpperCase();
    });
}

/**
 * 驼峰转换下划线
 * @param {String} name 
 * @return  {String}
 */
export function toLine(name) {
    return name.replace(/([A-Z])/g, "_$1").toLowerCase();
}

/**
 * 下划线转换驼峰 处理对象中的属性名
 * @param  {Object} config
 * @return  {Object}
 */
export function toHumpS(config) {
    let obj;
    if (config instanceof Array) {
        obj = [];
        for (let i = 0; i < config.length; i++) {
            if (typeof config[i] === 'object') {
                obj[i] = toHumpS(config[i]);
            } else {
                obj[i] = config[i];
            }
        }
    } else if (config instanceof Object) {
        obj = {};
        for (let i in config) {
            if (typeof config[i] === 'object') {
                obj[toHump(i)] = toHumpS(config[i]);
            } else {
                obj[toHump(i)] = config[i];
            }
        }
    }
    return obj
}

/**
 * 驼峰转换下划线 处理对象中的属性名
 * @param  {Object} config  
 * @return  {Object}
 */
export function toLineS(config) {
    let obj;
    if (config instanceof Array) {
        obj = [];
        for (let i = 0; i < config.length; i++) {
            if (typeof config[i] === 'object') {
                obj[i] = toLineS(config[i]);
            } else {
                obj[i] = config[i];
            }
        }
    } else if (config instanceof Object) {
        obj = {};
        for (let i in config) {
            if (typeof config[i] === 'object') {
                obj[toLine(i)] = toLineS(config[i]);
            } else {
                obj[toLine(i)] = config[i];
            }
        }
    }
    return obj
}

/**
 * 获取 blob
 * @param  {String} url 目标文件地址
 * @return {Promise}
 */

function getBlob(url) {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.response);
            }
        };

        xhr.send();
    });
}

/**
 * 保存
 * @param  {Blob} blob
 * @param  {String} filename 想要保存的文件名称
 */
function saveAs(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
    } else {
        const link = document.createElement('a');
        const body = document.querySelector('body');

        link.href = window.URL.createObjectURL(blob);
        link.download = filename;

        // fix Firefox
        link.style.display = 'none';
        body.appendChild(link);

        link.click();
        body.removeChild(link);

        window.URL.revokeObjectURL(link.href);
    }
}

/**
 * 下载
 * @param  {String} url 目标文件地址
 * @param  {String} filename 想要保存的文件名称
 */
export function download(url, filename) {
    let _url = url.replace(/http:/, 'https:');
    if (window.location.protocol === 'http:') {
        _url = url;
    }
    getBlob(_url).then(blob => {
        saveAs(blob, filename);
    });
}

// export function download(data, strFileName, strMimeType) {
//     $.ajax({
//         type : "post",
//         dataType : "json",
//         url : data,
//         data : {
//             url: data,
//         },
//         async : false,
//         success : function(data) {
//             if (data.success) {
//                 window.location.href=data.url;
//             }
//         },
//         error:()=>{
//             // window.location.href=data;
//
//         }
//     });
//
// }
export function getParam(href, param) {
    let result = '';
    let url = href.toLowerCase();
    param = param.toLowerCase();
    let one = url.indexOf(param + '=');
    let two = url.indexOf(param + '#');
    if (one >= 0) {
        let preStr = href.substr(one + param.length + 1);
        preStr = preStr.split('?')[0];
        preStr = preStr.split('&')[0];
        preStr = preStr.split('#')[0];
        result = preStr;
    } else if (two >= 0) {
        let preStr = href.substr(two + param.length + 1);
        preStr = preStr.split('?')[0];
        preStr = preStr.split('&')[0];
        preStr = preStr.split('#')[0];
        result = preStr;
    }
    return result;
}

/**
 * 
 * @param  {String} f 要检测的字体
 */
export function isSupportFontFamily(f) {
    //    f是要检测的字体
    if (typeof f !== "string") {
        return false
    }
    //    h是基础字体
    let h = "Arial";
    if (f.toLowerCase() === h.toLowerCase()) {
        return true
    }
    //    设置一个检测的字符A,看他是否支持f字体
    let e = "a";
    let d = 100;
    let a = 100,
        i = 100;
    let c = document.createElement("canvas");
    let b = c.getContext("2d");
    c.width = a;
    c.height = i;
    b.textAlign = "center";
    b.fillStyle = "black";
    b.textBaseline = "middle";
    let g = function (j) {
        b.clearRect(0, 0, a, i);
        //        字体是传入的j,或者是默认的h
        b.font = d + "px " + j + ", " + h;
        b.fillText(e, a / 2, i / 2);
        //        获取所有的canvas图片信息
        let k = b.getImageData(0, 0, a, i).data;
        //        k调用数组的 filter方法,筛选符合条件的。改变原数组。
        return [].slice.call(k).filter(function (l) {
            return l !== 0
        });
    };
    //    返回结果,如果h默认字体和输入待检测字体f.通过g函数检测得到的字符串不一致,说明自提生效
    return g(h).join("") !== g(f).join("");
};

/**
 * RGB颜色转换为16进制
 * @param  {String} color RGB颜色
 * @return  16进制颜色
 */
export function colorHex(color) {
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    let that = color;
    if (/^(rgb|RGB)/.test(that)) {
        let aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
        let strHex = "#";
        for (let i = 0; i < aColor.length; i++) {
            let hex = Number(aColor[i]).toString(16);
            if (hex === "0") {
                hex += hex;
            }
            strHex += hex;
        }
        if (strHex.length !== 7) {
            strHex = that;
        }
        return strHex;
    } else if (reg.test(that)) {
        let aNum = that.replace(/#/, "").split("");
        if (aNum.length === 6) {
            return that;
        } else if (aNum.length === 3) {
            let numHex = "#";
            for (let i = 0; i < aNum.length; i += 1) {
                numHex += (aNum[i] + aNum[i]);
            }
            return numHex;
        }
    } else {
        return that;
    }
};


/**
 * 16进制颜色转为RGB格式
 * @param  {String} color 16进制颜色
 * @return  RGB颜色
 */
export function colorRgba(hex, alpha) {
    //十六进制颜色值的正则表达式
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    let sColor = hex.toLowerCase();
    if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
            let sColorNew = "#";
            for (let i = 1; i < 4; i += 1) {
                sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值
        let sColorChange = [];
        for (let i = 1; i < 7; i += 2) {
            sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
        }
        if (alpha || alpha === 0) {
            sColorChange.push(alpha)
        }
        return "RGBA(" + sColorChange.join(",") + ")";
    } else {
        return sColor;
    }
};
export function detoxication(config) {
    let obj;
    if (config instanceof Array) {
        obj = [];
        for (let i = 0; i < config.length; i++) {
            if (typeof config[i] === 'object') {
                obj[i] = detoxication(config[i]);
            } else {
                obj[i] = config[i];
            }
        }
    } else if (config instanceof Object) {
        obj = {};
        for (let i in config) {
            if (i === 'name') {
                // obj[i]=[];
            } else if (i === 'audio_fade') {
                // obj[i]=[];
            } else if (i === 'special') {
                obj[i] = {};
            } else if (i === 'text_info') {
                // obj[i]={};
            } else if (i === 'delogo') {
                // obj[i]=[];
            } else if (typeof config[i] === 'object') {
                obj[i] = detoxication(config[i]);
            } else if (i === 'thumbnail') {
                obj[i] = '';
            } else if (i === 'obj_id' && config[i].indexOf('text_') >= 0) {
                obj[i] = config[i].substr(config[i].indexOf('text_'), 6)
            } else {
                obj[i] = config[i];
            }
        }
        if (config['obj_type'] && config['obj_type'] === 'text') {
            obj['end_time'] = Math.round(config['end_time'] * 1);
        }
    }
    return obj

}
export function comparison(first, second) {
    return JSON.stringify(detoxication(first)) === JSON.stringify(detoxication(second));
}
export function dataURLtoBlob(dataurl) {
    if (dataurl.indexOf('blob:') === 0) {
        return '';
    } else {
        let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }
}
export function dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}
export function uploadSnapshot(img, id, back) {
    let config = {
        useCdnDomain: true,
        checkByMD5: true,
        bucket: 'quickedit'
    }
    let host = 'https://quickstatic.pdnews.cn/';
    if (process.env.REACT_APP_ENV === "privateproduction") {
        config = {
          useCdnDomain: true,
          checkByMD5: true,
          disableStatisticsReport: true,
          bucket: 'imedia-xyy',
          uphost:'up-beijing2-oss.meitiyun.com',
          region:'beijing2',
        };
        host = 'https://imediaxyy.meitiyun.com/';
    } 
    const observer = {
        next(res) {
        },
        error(res) {
            console.info(res, 'error')
            back();
            // ...
        },
        complete(res) {
            console.info(res, 'complete');
            back( host + res.key);
            // ...
        }
    };
    channel('get_oss_token', {}, (token) => {
        console.info(img);
        let name = img.name ? img.name.replace(new RegExp(/( )/g), "_") : '.png';
        const num = uuidv4();
        const key = "user/" + num + name;

        const observable = qiniu.upload(img, key, token, {}, config)

        const subscription = observable.subscribe(observer) // 上传开始
    });

}

/**
 * 密码加密
 * @param  {String} pwd 密码
 * @return  加密后密码
 */
export function encrypt(pwd) {
    let arr = [];
    for (let i = 0; i < pwd.length; i++) {
        arr[i] = i;
    }
    arr.sort(function () {
        return 0.5 - Math.random()
    });

    let tmp = [];
    for (let j = 0; j < arr.length; j++) {
        tmp[j * 2] = pwd[arr[j]]
        if (arr[j] > 9) {
            tmp[j * 2 + 1] = String.fromCharCode(arr[j] + 55)
        } else {
            tmp[j * 2 + 1] = arr[j]
        }
    }

    return tmp.join('')
}
/**
 * 获取素材时长，单位精确到秒
 * @param  {String/Number} d 时长
 * @return  处理后时长（00:00:00）
 */
export function getDuration(d) {
    let duration = '';
    if (!d) return '00:00:00';
    if (isNaN(d)) {
        let array = [];
        if (d.indexOf(':') >= 0) {
            array = d.split(':');
        } else {
            array = d.split('：');
        }
        if (array.length === 3) {
            duration = array[0] * 60 * 60 + array[1] * 60 + array[2] * 1;
        } else if (array.length === 4) {
            duration = array[0] * 60 * 60 + array[1] * 60 + array[2] * 1 + array[2] * 0.01;
        } else {
            duration = d;
        }
    } else {
        d = Math.ceil(Math.max(d, 0));
        let h = Math.floor(d / 60 / 60), m = Math.floor(d / 60) % 60, s = d % 60;
        h > 9 ? duration += h : (duration += '0' + h);
        duration += ':';
        m > 9 ? duration += m : (duration += '0' + m);
        duration += ':';
        s > 9 ? duration += s : (duration += '0' + s);
    }
    return duration;
}

/**
 * 获取大小
 * @param  {Number} d 大小
 * @return  处理后大小（1MB,1KB...）
 */
export function getSize(d) {
    return d / 1024 / 1024 > 1 ? ((d / 1024 / 1024).toFixed(2) * 1 + ' MB')
        : d / 1024 > 1 ? ((d / 1024).toFixed(2) * 1 + ' KB') : (d + ' B');
}
/*
* 描述：判断浏览器信息
* 编写：LittleQiang_w
* 日期：2016.1.5
* 版本：V1.1
*/

//判断当前浏览类型
export function BrowserType() {
    let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    let isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
    let isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
    let isEdge = userAgent.indexOf("Edge") > -1; //判断是否IE的Edge浏览器
    let isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
    let isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
    let isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器

    if (isIE) {
        let reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        let fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion === 7) { return "IE7"; }
        else if (fIEVersion === 8) { return "IE8"; }
        else if (fIEVersion === 9) { return "IE9"; }
        else if (fIEVersion === 10) { return "IE10"; }
        else if (fIEVersion === 11) { return "IE11"; }
        else { return "0" }//IE版本过低
    }//isIE end

    if (isFF) { return "FF"; }
    if (isOpera) { return "Opera"; }
    if (isSafari) { return "Safari"; }
    if (isChrome) { return "Chrome"; }
    if (isEdge) { return "Edge"; }
}//myBrowser() end

// //判断是否是IE浏览器
// function isIE()
// {
//     var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
//     var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
//     if(isIE)
//     {
//         return "1";
//     }
//     else
//     {
//         return "-1";
//     }
// }
//
//
// //判断是否是IE浏览器，包括Edge浏览器
// function IEVersion()
// {
//     var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
//     var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
//     var isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE; //判断是否IE的Edge浏览器
//     if(isIE)
//     {
//         var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
//         reIE.test(userAgent);
//         var fIEVersion = parseFloat(RegExp["$1"]);
//         if(fIEVersion == 7)
//         { return "IE7";}
//         else if(fIEVersion == 8)
//         { return "IE8";}
//         else if(fIEVersion == 9)
//         { return "IE9";}
//         else if(fIEVersion == 10)
//         { return "IE10";}
//         else if(fIEVersion == 11)
//         { return "IE11";}
//         else
//         { return "0"}//IE版本过低
//     }
//     else if(isEdge)
//     {
//         return "Edge";
//     }
//     else
//     {
//         return "-1";//非IE
//     }
// }

/**
 * 获取时间，精确到帧（1/25秒）；
 * @param {Number} t 时间(单位秒)
 * @return  {String} duration  时长（00:00:00）
 */
export function getTime(t) {
    if (isNaN(t)) {
        return '00:00:00';
    }
    let d = Math.round(t * 25) / 25;
    let duration = '', h = Math.floor(d / 60 / 60), m = Math.floor(d / 60) % 60, s = Math.floor(d) % 60,
        f = Math.floor(d.toFixed(2).split('.')[1] / 4);
    if (h > 0) {
        h > 9 ? duration += h : (duration += '0' + h);
        duration += ':';
    }
    m > 9 ? duration += m : (duration += '0' + m);
    duration += ':';
    s > 9 ? duration += s : (duration += '0' + s);
    duration += ':';
    f > 9 ? duration += f : (duration += '0' + f);
    return duration;
}

/**
 * 处理时间  100 -> 00:01:40
 * @param {Number} t 时间(单位秒)
 * @return  {String} duration  时长（00:00:00）
 */
export function getSecond(t) {
    if (isNaN(t)) {
        return '00:00:00';
    }
    if (t < 0) {
        t += 1 * 60 * 60 * 24;
    }
    let d = Math.round(t % (60 * 60 * 24));
    let duration = '', h = Math.floor(d / 60 / 60), m = Math.floor(d / 60) % 60, s = Math.floor(d) % 60;
    // f = Math.floor(d.toFixed(2).split('.')[1] / 4);
    // if (h > 0) {
    h > 9 ? duration += h : (duration += '0' + h);
    duration += ':';
    // }
    m > 9 ? duration += m : (duration += '0' + m);
    duration += ':';
    s > 9 ? duration += s : (duration += '0' + s);
    // duration += ':';
    // f > 9 ? duration += f : (duration += '0' + f);
    return duration;
}

export const requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback, element) {
        window.setTimeout(function () {
            callback('goOn', +new Date(), element);
        }, 1000 / 60);
    };

/**
 * 深拷贝对象
 * @param {Object} config 
 * @return  {Object}  拷贝完的对象
 */
export function cloneConfig(config) {
    let obj;
    if (config instanceof Array) {
        obj = [];
        for (let i = 0; i < config.length; i++) {
            if (typeof config[i] === 'object') {
                obj[i] = cloneConfig(config[i]);
            } else {
                obj[i] = config[i];
            }
        }
    } else if (config instanceof Object) {
        obj = {};
        for (let i in config) {
            if (typeof config[i] === 'object') {
                obj[i] = cloneConfig(config[i]);
            } else {
                obj[i] = config[i];
            }
        }
    }
    return obj
}

/**
 * 处理存储大小加单位 100 -> 100B
 * @param {Number} 存储大小
 * @return  {String} 存储大小(带单位B,KB,MB...)
 */
export function filterMB(num) {
    if (num >= 1024 * 1024 * 1024 * 1024 * 1024) {
        return (num / (1024 * 1024 * 1024 * 1024 * 1024)).toFixed(2) * 1 + 'PB'
    } else if (num >= 1024 * 1024 * 1024 * 1024) {
        return (num / (1024 * 1024 * 1024 * 1024)).toFixed(2) * 1 + 'TB'
    } else if (num >= 1024 * 1024 * 1024) {
        return (num / (1024 * 1024 * 1024)).toFixed(2) * 1 + 'GB'
    } else if (num >= 1024 * 1024) {
        return (num / (1024 * 1024)).toFixed(2) * 1 + 'MB'
    } else if (num >= 1024) {
        return (num / 1024).toFixed(2) * 1 + 'KB'
    } else {
        return num + 'B'
    }
}

/**
 * 处理时间加单位 100 -> 1m40s
 * @param {Number} num 时间（s）
 * @return  {String} 时间(带单位h,m,s)
 */
export function filterMin(num) {
    if (num >= 60 * 60) {
        return Math.floor(num / (60 * 60)) + 'h' + (Math.floor(num / 60) % 60 > 0 ? Math.floor(num / 60) % 60 > 9 ? Math.floor(num / 60) % 60 + 'm' : '0' + Math.floor(num / 60) % 60 + 'm' : '')
    } else if (num >= 60) {
        return Math.floor(num / 60) + 'm' + (num % 60 > 0 ? num % 60 > 9 ? num % 60 + 's' : '0' + num % 60 + 's' : '')
    } else {
        return num + 's'
    }
}

/**
 * 格式化数字， 三位加一个逗号
 * @param {Number} num 数值(12345)
 * @return {String}（12,345）
 */
export function getThousands(num) {
    let str = num.toString();
    let reg = str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
    return str.replace(reg, "$1,");
}

