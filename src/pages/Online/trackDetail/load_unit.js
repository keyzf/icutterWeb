/* 轨道操作 加载轨道上素材 */
import Hls from 'hls.js';
import $ from 'jquery';
import { message } from "antd";
import Lottie from 'lottie-web';
import { get_data } from "@/channel";
import { load_fonts } from "@/channel/load_fonts";
import { hls_list, video_list, load_unLoad as unLoad, load_unInit as unInit, load_callback } from './unitInfo';
import uploading from '@/channel/clipFileUpload';


/*//加载素材*/
let hlsFlag = Hls.isSupported();
//低清晰度
let low = false;
// let hlsFlag=false;
let div = document.createElement('div');
let img = document.createElement('img');
let canvas = document.createElement('canvas');
let canvas_thumbnail = document.createElement('canvas');
let context = canvas.getContext('2d');
let context_thumbnail = canvas_thumbnail.getContext('2d');
img.crossOrigin = "anonymous";
let fonts = load_fonts();
let font_data = [{ "origin": 0, "fClass": "", "fStyle": "Regular", "fPath": "", "fFamily": "FZFangSong-Z02S", "fName": "FZFangSong-Z02S", "fWeight": "", "ascent": 1 }, { "origin": 0, "fClass": "", "fStyle": "Regular", "fPath": "", "fFamily": "FZHei-B01S", "fName": "FZHei-B01S", "fWeight": "", "ascent": 1 }, { "origin": 0, "fClass": "", "fStyle": "Regular", "fPath": "", "fFamily": "FZKai-Z03S", "fName": "FZKai-Z03S", "fWeight": "", "ascent": 1 }, { "origin": 0, "fClass": "", "fStyle": "Regular", "fPath": "", "fFamily": "FZShuSong-Z01S", "fName": "FZShuSong-Z01S", "fWeight": "", "ascent": 1 }, { "origin": 0, "fClass": "", "fStyle": "Regular", "fPath": "", "fFamily": "HappyZcool-2016", "fName": "HappyZcool-2016", "fWeight": "", "ascent": 1 }, { "origin": 0, "fClass": "", "fStyle": "Regular", "fPath": "", "fFamily": "zcool-gdh", "fName": "zcool-gdh", "fWeight": "", "ascent": 1 }, { "origin": 0, "fClass": "", "fStyle": "Regular", "fPath": "", "fFamily": "HuXiaoBo_KuHei", "fName": "HuXiaoBo_KuHei", "fWeight": "", "ascent": 1 }, { "origin": 0, "fClass": "", "fStyle": "Regular", "fPath": "", "fFamily": "a dripping marker", "fName": "a dripping marker", "fWeight": "", "ascent": 1 }, { "origin": 0, "fClass": "", "fStyle": "Regular", "fPath": "", "fFamily": "Aspire", "fName": "Aspire", "fWeight": "", "ascent": 1 }, { "origin": 0, "fClass": "", "fStyle": "Regular", "fPath": "", "fFamily": "Champignon", "fName": "Champignon", "fWeight": "", "ascent": 1 }, { "origin": 0, "fClass": "", "fStyle": "Regular", "fPath": "", "fFamily": "Great Vibes", "fName": "Great Vibes", "fWeight": "", "ascent": 1 }, { "origin": 0, "fClass": "", "fStyle": "Regular", "fPath": "", "fFamily": "Regencie Alt", "fName": "Regencie Alt", "fWeight": "", "ascent": 1 }, { "origin": 0, "fClass": "", "fStyle": "Regular", "fPath": "", "fFamily": "TruenoBdOl", "fName": "TruenoBdOl", "fWeight": "", "ascent": 1 }, { "origin": 0, "fClass": "", "fStyle": "Regular", "fPath": "", "fFamily": "TruenoRg", "fName": "TruenoRg", "fWeight": "", "ascent": 1 }];
if (fonts.length) font_data = [];
fonts.map((v, k) => {
    font_data.push({
        "origin": 0,
        "fPath": "",
        "fClass": "",
        "fFamily": v.code,
        "fWeight": "",
        "fStyle": "Regular",
        "fName": v.code,
        "ascent": 1
    })
});
load_callback((re) => {
    re.map((v, k) => {
        let ids = unLoad[v.media_id];
        {/*
                        (0, gettext_lazy('Initing')),  # 正在初始化
                        (1, gettext_lazy('Init Over')),  # 初始化完成
                        (2, gettext_lazy('Init Fail')),  # 初始化失败
                        (3, gettext_lazy('Uploading')),  # 正在上传
                        (4, gettext_lazy('Importing')),  # 正在导入
                        (5, gettext_lazy('Import Fail')),  # 导入失败
                        */}

        console.info(v['status']);
        let item = unInit[v.media_id];
        if (v['status'] !== 4 && ids) {
            for (let i in ids) {
                if (ids[i] && video_list[i]) {
                    video_list[i].crossOrigin = "anonymous";
                    video_list[i].src = v.media_url;
                }
            }
            delete unInit[v.media_id];
        }
        if (item) {
            if (v['status'] === 2 || v['status'] === 5) {
                delete unInit[v.media_id];
            }
            if (v['status'] === 1) {
                for (let i in item) {
                    item[i]['special']['preview_hls'] = v.preview_hls || '';
                    item[i]['special']['preview_mp3'] = v.preview_mp3 || '';
                    item[i]['special']['media_url'] = v.media_url || '';
                    loadMedia(item[i], i.split('_')[0]);
                }
                delete unInit[v.media_id];
            }
        }
    })
});
export function load(u, layer, url) {
    if (!((hlsFlag && u.special.preview_hls) || (hlsFlag && u.special.media_url && u.special.media_url.toLocaleLowerCase().indexOf('.m3u8') > -1) || (u.special.media_url && u.special.media_url.toLocaleLowerCase().indexOf('.mp4') > -1) || url)) return;
    if (u.trans_end && u.trans_end.bind && !video_list[u.obj_id + '_' + layer + '_trans']) {
        // video_list[u.obj_id + '_' + layer+'_trans'] = document.createElement(u.obj_type);
        video_list[u.obj_id + '_' + layer + '_trans'] = document.createElement(u.obj_type);
        if (hlsFlag && u.special.preview_hls && low) {
            hls_list[u.obj_id + '_' + layer + '_trans'] = new Hls();
            hls_list[u.obj_id + '_' + layer + '_trans'].loadSource(u.special.preview_hls);
            hls_list[u.obj_id + '_' + layer + '_trans'].attachMedia(video_list[u.obj_id + '_' + layer + '_trans']);
        } else if (hlsFlag && u.special.media_url && u.special.media_url.toLocaleLowerCase().indexOf('.m3u8') > -1) {
            hls_list[u.obj_id + '_' + layer + '_trans'] = new Hls();
            hls_list[u.obj_id + '_' + layer + '_trans'].loadSource(u.special.media_url);
            hls_list[u.obj_id + '_' + layer + '_trans'].attachMedia(video_list[u.obj_id + '_' + layer + '_trans']);
        } if (u.special.preview_mp4 && u.special.preview_mp4.toLocaleLowerCase().indexOf('.mp4') > -1) {
            video_list[u.obj_id + '_' + layer + '_trans'].src = u.special.preview_mp4 || url;
        } else {
            video_list[u.obj_id + '_' + layer + '_trans'].src = u.special.media_url || url;
        }
    }
    if (!video_list[u.obj_id + '_' + layer]) {
        video_list[u.obj_id + '_' + layer] = document.createElement(u.obj_type);
        video_list[u.obj_id + '_' + layer].crossOrigin = "anonymous";
        video_list[u.obj_id + '_' + layer].onerror = (e) => {
            video_list[u.obj_id + '_' + layer].crossOrigin = null;
            video_list[u.obj_id + '_' + layer].onerror = null;
            video_list[u.obj_id + '_' + layer].load();
        };
        if (hlsFlag && u.special.preview_hls && low) {
            hls_list[u.obj_id + '_' + layer] = new Hls();
            hls_list[u.obj_id + '_' + layer].loadSource(u.special.preview_hls);
            hls_list[u.obj_id + '_' + layer].attachMedia(video_list[u.obj_id + '_' + layer]);
        } else if (hlsFlag && u.special.media_url && u.special.media_url.toLocaleLowerCase().indexOf('.m3u8') > -1) {
            hls_list[u.obj_id + '_' + layer] = new Hls();
            hls_list[u.obj_id + '_' + layer].loadSource(u.special.media_url);
            hls_list[u.obj_id + '_' + layer].attachMedia(video_list[u.obj_id + '_' + layer]);
        } if (u.special.preview_mp4 && u.special.preview_mp4.toLocaleLowerCase().indexOf('.mp4') > -1) {
            video_list[u.obj_id + '_' + layer].src = u.special.preview_mp4 || url;
        } else {
            video_list[u.obj_id + '_' + layer].src = u.special.media_url || url;
        }
    }
}
// 加载资源总入口， 分发到各个类型文件的方法
export function loadMedia(u, layer) {
    // console.info(u,layer)
    if (u && u.special) {
        let files = uploading.getFiles();
        let url = '';
        if ((!u.special.media_url) && u.special.uploading && u.special.buffer && files[u.special.buffer] && files[u.special.buffer].media_id === u.obj_id) {
            url = files[u.special.buffer].url;
        } else if (!u.special.media_url) {
            for (let i = 0; i < files.length; i++) {
                if (files[i].media_id === u.obj_id) {
                    url = files[i].url;
                    break;
                }
            }
        }
        // console.info(u.obj_type);
        switch (u.obj_type) {
            case 'video': loadVideo(u, layer, url); break;
            case 'audio': loadAudio(u, layer, url); break;
            case 'image': loadImage(u, layer, url); break;
            case 'text': loadText(u, layer, url); break;
        }

        // if((!video_list[u.obj_id + '_' + layer])&&u.special.uploading&&u.special.buffer&&files[u.special.buffer].media_id===u.obj_id){
        //
        //     video_list[u.obj_id + '_' + layer] = document.createElement(u.obj_type);
        //     video_list[u.obj_id + '_' + layer].src=files[u.special.buffer].url;
        //     // video_list[u.obj_id + '_' + layer] = files[u.special.buffer].obj;
        //     if(u.trans_end&&u.trans_end.bind&&u.obj_type==='video'&&!video_list[u.obj_id + '_' + layer+'_trans']) {
        //         video_list[u.obj_id + '_' + layer + '_trans'] = document.createElement(u.obj_type);
        //         let b = new Blob(files[u.special.buffer]), // 文件转化成二进制文件
        //             url = URL.createObjectURL(b); //转化成url
        //         video_list[u.obj_id + '_' + layer + '_trans'].onloadeddata= (e) => {
        //             URL.revokeObjectURL(this.src);  // 释放createObjectURL创建的对象
        //         };
        //         video_list[u.obj_id + '_' + layer + '_trans'].src=url;
        //     }
        // }
    }
}
// 加载视频
export function loadVideo(u, layer, url) {
    // if(u.special.sub_type==='animation'){
    //     loadAnimationText(u,layer);
    //     return;
    // }
    if (!((hlsFlag && u.special.preview_hls) || (hlsFlag && u.special.media_url && u.special.media_url.toLocaleLowerCase().indexOf('.m3u8') > -1) || (u.special.media_url && u.special.media_url.toLocaleLowerCase().indexOf('.mp4') > -1) || url)) {
        unInit[u.obj_id] = unInit[u.obj_id] || {};
        unInit[u.obj_id][layer + '_'] = u;
        return
    }
    if (u.trans_end && u.trans_end.bind && !video_list[u.obj_id + '_' + layer + '_trans']) {
        video_list[u.obj_id + '_' + layer + '_trans'] = document.createElement(u.obj_type);
        video_list[u.obj_id + '_' + layer + '_trans'].crossOrigin = "anonymous";
        video_list[u.obj_id + '_' + layer + '_trans'].onerror = (e) => {
            video_list[u.obj_id + '_' + layer + '_trans'].crossOrigin = null;
            video_list[u.obj_id + '_' + layer + '_trans'].onerror = null;
            video_list[u.obj_id + '_' + layer + '_trans'].load();
            unLoad[u.obj_id] = unLoad[u.obj_id] || {};
            unLoad[u.obj_id][u.obj_id + '_' + layer + '_trans'] = true;
        };
        if (hlsFlag && u.special.preview_hls && low) {
            hls_list[u.obj_id + '_' + layer + '_trans'] = new Hls();
            hls_list[u.obj_id + '_' + layer + '_trans'].loadSource(u.special.preview_hls);
            hls_list[u.obj_id + '_' + layer + '_trans'].attachMedia(video_list[u.obj_id + '_' + layer + '_trans']);
        } else if (hlsFlag && u.special.media_url && u.special.media_url.toLocaleLowerCase().indexOf('.m3u8') > -1) {
            hls_list[u.obj_id + '_' + layer + '_trans'] = new Hls();
            hls_list[u.obj_id + '_' + layer + '_trans'].loadSource(u.special.media_url);
            hls_list[u.obj_id + '_' + layer + '_trans'].attachMedia(video_list[u.obj_id + '_' + layer + '_trans']);
        } else if (u.special.preview_mp4 && u.special.preview_mp4.toLocaleLowerCase().indexOf('.mp4') > -1) {
            video_list[u.obj_id + '_' + layer + '_trans'].src = u.special.preview_mp4 || url;
        } else {
            video_list[u.obj_id + '_' + layer + '_trans'].src = u.special.media_url || url;
        }
        let obj = video_list[u.obj_id + '_' + layer + '_trans'];
        obj.currentTime = 5;
        obj['oncanplay'] = () => {
            let height = 270, width = 480;
            width = obj.videoWidth || width;
            height = obj.videoHeight || height;
            if (width / height > 16 / 9) {
                height = height / width * 480;
                width = 480;
            } else {
                width = width / height * 270;
                height = 270;
            }
            canvas_thumbnail.width = width;
            canvas_thumbnail.height = height;
            context_thumbnail.drawImage(obj, 0, 0, width, height);
            obj['thumbnail'] = canvas.toDataURL('image/png');
            obj['oncanplay'] = () => {

            };
            obj.currentTime = 0;
        }
    }
    if (!video_list[u.obj_id + '_' + layer]) {
        video_list[u.obj_id + '_' + layer] = document.createElement(u.obj_type);
        video_list[u.obj_id + '_' + layer].crossOrigin = "anonymous";
        video_list[u.obj_id + '_' + layer].onerror = (e) => {
            video_list[u.obj_id + '_' + layer].crossOrigin = null;
            video_list[u.obj_id + '_' + layer].onerror = null;
            video_list[u.obj_id + '_' + layer].load();
            unLoad[u.obj_id] = unLoad[u.obj_id] || {};
            unLoad[u.obj_id][u.obj_id + '_' + layer] = true;
        };
        if (hlsFlag && u.special.preview_hls && low) {
            hls_list[u.obj_id + '_' + layer] = new Hls();
            hls_list[u.obj_id + '_' + layer].loadSource(u.special.preview_hls);
            hls_list[u.obj_id + '_' + layer].attachMedia(video_list[u.obj_id + '_' + layer]);
        } else if (hlsFlag && u.special.media_url && u.special.media_url.toLocaleLowerCase().indexOf('.m3u8') > -1) {
            hls_list[u.obj_id + '_' + layer] = new Hls();
            hls_list[u.obj_id + '_' + layer].loadSource(u.special.media_url);
            hls_list[u.obj_id + '_' + layer].attachMedia(video_list[u.obj_id + '_' + layer]);
        } else if (u.special.preview_mp4 && u.special.preview_mp4.toLocaleLowerCase().indexOf('.mp4') > -1) {
            video_list[u.obj_id + '_' + layer].src = u.special.preview_mp4 || url;
        } else {
            video_list[u.obj_id + '_' + layer].src = u.special.media_url || url;
        }
        let obj = video_list[u.obj_id + '_' + layer];
        obj.currentTime = 5;
        obj['onloadeddata'] = () => {
            let height = 270, width = 480;
            width = obj.videoWidth || width;
            height = obj.videoHeight || height;
            if (width / height > 16 / 9) {
                height = height / width * 480;
                width = 480;
            } else {
                width = width / height * 270;
                height = 270;
            }
            canvas_thumbnail.width = width;
            canvas_thumbnail.height = height;
            context_thumbnail.drawImage(obj, 0, 0, width, height);
            try {
                obj['thumbnail'] = canvas_thumbnail.toDataURL('image/png');
            } catch (e) {
                obj['thumbnail'] = '';
                message.warning('该界面中包含未导入完成素材，请耐心等待！！');
            }
            obj['onloadeddata'] = () => {

            }
            obj.currentTime = 0;
        }
    }
}
// 加载音频
function loadAudio(u, layer, url) {
    if (!(u.special.preview_mp3 || (u.special.media_url && u.special.media_url.toLocaleLowerCase().indexOf('.mp3') > -1) || url)) {
        unInit[u.obj_id] = unInit[u.obj_id] || {};
        unInit[u.obj_id][layer + '_'] = u;
        return
    }
    if (!video_list[u.obj_id + '_' + layer]) {
        video_list[u.obj_id + '_' + layer] = document.createElement(u.obj_type);
        video_list[u.obj_id + '_' + layer].src = u.special.preview_mp3 || u.special.media_url || url;
        let obj = video_list[u.obj_id + '_' + layer];
        obj.onloadeddata = () => {
            if (obj.duration === Infinity) {
                obj.currentTime = 99999;
            }
        }
    }
}
// 加载图片
function loadImage(u, layer, url) {
    if (!video_list[u.obj_id + '_' + layer]) {
        video_list[u.obj_id + '_' + layer] = document.createElement('img');
        video_list[u.obj_id + '_' + layer].crossOrigin = "anonymous";
        video_list[u.obj_id + '_' + layer].onerror = (e) => {
            video_list[u.obj_id + '_' + layer].crossOrigin = null;
            video_list[u.obj_id + '_' + layer].onerror = null;
            video_list[u.obj_id + '_' + layer].load();
            unLoad[u.obj_id] = unLoad[u.obj_id] || {};
            unLoad[u.obj_id][u.obj_id + '_' + layer] = true;
        };
        video_list[u.obj_id + '_' + layer].onerror = () => {
            video_list[u.obj_id + '_' + layer].crossOrigin = null;
            video_list[u.obj_id + '_' + layer].onerror = null;
            video_list[u.obj_id + '_' + layer].src = u.special.thumbnail || u.special.media_url || url;
            unLoad[u.obj_id] = unLoad[u.obj_id] || {};
            unLoad[u.obj_id][u.obj_id + '_' + layer] = true;
        };
        video_list[u.obj_id + '_' + layer].src = u.special.thumbnail || u.special.media_url || url;
    }
}
// 加载文字和动效字幕（不包括字幕，字幕不需要加载）
function loadText(u, layer) {
    if (u.special.sub_type === 'animation') {
        loadAnimationText(u, layer);
        return;
    }
    if (!video_list[u.obj_id + '_' + layer]) {
        // if (!u.special.svg1) {
        refreshSvg(u.special);
        // }
        video_list[u.obj_id + '_' + layer] = document.createElement('img');
        video_list[u.obj_id + '_' + layer].crossOrigin = "anonymous";
        video_list[u.obj_id + '_' + layer] && (video_list[u.obj_id + '_' + layer].src = u.special.svg1);
        setTimeout(() => {
            refreshSvg(u.special);
            video_list[u.obj_id + '_' + layer] && (video_list[u.obj_id + '_' + layer].src = u.special.svg1);
        }, 1000)
    }
}
// 动效字幕生成图片 使用Lottie
function loadAnimationText(u, layer) {
    // console.info(u,layer);
    if (!video_list[u.obj_id + '_' + layer]) {
        let animationData = get_data(u.special.media_url || u.special.json_url);
        animationData.fonts = {
            "list": font_data
        };
        animationData.layers.map((v, k) => {
            if (v.ty === 5) {
                let font = v.t.d.k[0].s;
                font.tr = 0;
                if (u.layers && u.layers[k]) {
                    let param = u.layers[k]['s'] || {};
                    for (let i in font) {
                        if (param[i] && param[i] !== font[i]) {
                            font[i] = param[i];
                        }
                    }
                    if (!param.f) {
                        // font.f = font_data[0].fName;
                    }
                } else {
                    // font.f = font_data[0].fName;
                }
            } else if (v.ty === 0) {
                let V = v;
                animationData.assets.map((v, k) => {
                    if (v.id && v.id === V.refId) {
                        v.layers.map((v, k) => {
                            if (v.ty === 5) {
                                let font = v.t.d.k[0].s;
                                font.tr = 0;
                                /*
                                * 此处k值需具体匹配
                                * */
                                if (u.layers && u.layers[k]) {
                                    let param = u.layers[k]['s'] || {};
                                    for (let i in font) {
                                        if (param[i] && param[i] !== font[i]) {
                                            font[i] = param[i];
                                        }
                                    }
                                    if (!param.f) {
                                        // font.f = font_data[0].fName;
                                    }
                                } else {
                                    // font.f = font_data[0].fName;
                                }
                            }
                        })
                    }
                })
            }
        })
        if (u.special) {
            u.special.position_w = animationData.w;
            u.special.position_h = animationData.h;
        }
        let animData = {
            wrapper: document.createElement('div'),
            animType: 'svg',
            loop: true,
            prerender: true,
            autoplay: true,
            animationData: animationData,
        };
        // console.info(animationData)
        video_list[u.obj_id + '_' + layer] = document.createElement('img');
        video_list[u.obj_id + '_' + layer].crossOrigin = "anonymous";
        video_list[u.obj_id + '_' + layer]['lottie'] = Lottie.loadAnimation(animData);
        video_list[u.obj_id + '_' + layer]['lottie'].goToAndStop(video_list[u.obj_id + '_' + layer]['lottie'].totalFrames / 2, true);
        let svg = new Blob([video_list[u.obj_id + '_' + layer]['lottie'].wrapper.innerHTML], { type: "image/svg+xml;charset=utf-8" });
        let url = URL.createObjectURL(svg);
        video_list[u.obj_id + '_' + layer].src = url;
        // setTimeout(()=>{
        //     video_list[u.obj_id + '_' + layer]&&(video_list[u.obj_id + '_' + layer].src = u.special.svg1);
        // },300);
        // setTimeout(()=>{
        //     refreshSvg(u.special);
        //     video_list[u.obj_id + '_' + layer]&&(video_list[u.obj_id + '_' + layer].src = u.special.svg1);
        // },1000)
    }
}
// 文字生成svg图片
export function refreshSvg(v) {
    div.innerHTML = htmlDecodeByRegExp(v.text);
    canvas.width = v.position_w;
    canvas.height = v.position_h;
    context.font = v.font_size + "px _fangsong";
    context.beginPath();
    let list = [], _index = 0;
    let lines = 0;
    let lineWidth = 0;
    let textSiteX = 0;
    let _style = 'normal';
    let _weight = 'normal';
    let _underline = false;
    let _color = '#000';
    let _bg = '';
    let _family = 'arial';

    function _cloneConfig(config) {
        for (let i = 0; i < config.length; i++) {
            let the = config[i];
            if (the.nodeName === 'P') {
                list.push(0);
                _index = i;
            }
            if (the.nodeType === 3) {
                context.font = _style + ' ' + _weight + ' ' + v.font_size + 'px ' + _family;
                for (let j = 0; j < the.textContent.length; j++) {
                    list[_index] += (context.measureText(the.textContent[j]).width + v.spacing * 1);
                }
            } else if (the.nodeType === 1) {
                switch (the.nodeName) {
                    case 'P': lines = i; lineWidth = 0; setP(the); break;
                    case 'EM': _style = 'oblique'; break;
                    case 'STRONG': _weight = 'bold'; break;
                    case 'U': _underline = true; break;
                }
                let _f = '';
                if (the.className && the.className.toLocaleLowerCase().indexOf('ql-font-') !== -1) {
                    _f = the.className.split('ql-font-')[1];
                }
                _family = _f || _family;
                _cloneConfig(config[i].childNodes);
                _f && (_family = '_fangsong');
                switch (the.nodeName) {
                    case 'P': lines = i; lineWidth = 0; setP(the); break;
                    case 'EM': _style = 'normal'; break;
                    case 'STRONG': _weight = 'normal'; break;
                    case 'U': _underline = false; break;
                }
            }
        }
    }
    _cloneConfig(div.childNodes);
    cloneConfig(div.childNodes);
    function setP(the) {
        let align = the.className.split('ql-align-')[1];
        _style = 'normal';
        _weight = 'normal';
        _bg = '';
        _underline = false;
        _family = '_fangsong';
        switch (align) {
            case 'left': textSiteX = 0; break;
            case 'center': textSiteX = (canvas.width - list[lines]) / 2; break;
            case 'right': textSiteX = canvas.width - list[lines]; break;
            default: textSiteX = 0;
        }
    }
    function cloneConfig(config) {
        for (let i = 0; i < config.length; i++) {
            let the = config[i];
            if (the.nodeType === 1) {
                switch (the.nodeName) {
                    case 'P': lines = i; lineWidth = 0; setP(the); break;
                    case 'EM': _style = 'oblique'; break;
                    case 'STRONG': _weight = 'bold'; break;
                    case 'U': _underline = true; break;
                }
                let _f = '';
                if (the.className && the.className.toLocaleLowerCase().indexOf('ql-font-') !== -1) {
                    _f = the.className.split('ql-font-')[1];
                }
                let _c = $(the).css('color');
                let _bc = $(the).css('backgroundColor');
                _family = _f || _family;
                _color = _c || _color;
                _bg = _bc || _bg;
                cloneConfig(config[i].childNodes);
                _c && (_color = '#000');
                _bc && (_bg = '');
                _f && (_family = '_fangsong');
                switch (the.nodeName) {
                    case 'P': lines = i; lineWidth = 0; setP(the); break;
                    case 'EM': _style = 'normal'; break;
                    case 'STRONG': _weight = 'normal'; break;
                    case 'U': _underline = false; break;
                }
            } else if (the.nodeType === 3) {
                context.font = _style + ' ' + _weight + ' ' + v.font_size + 'px ' + _family;
                context.textBaseline = "middle";
                let _site = 0;
                _bg && (context.fillStyle = _bg);
                _bg && (context.fillRect(textSiteX, lines * v.line_height, context.measureText(the.textContent).width + the.textContent.length * v.spacing, v.line_height));
                for (let j = 0; j < the.textContent.length; j++) {
                    let __site = context.measureText(the.textContent[j]).width + v.spacing * 1;
                    context.fillStyle = _color || '#000';
                    _underline && (context.fillRect(textSiteX + _site, (lines + 1) * v.line_height + (v.font_size - v.line_height) / 2, __site, 4));
                    context.fillText(the.textContent[j], textSiteX + _site + v.spacing / 2, (lines + 0.5) * v.line_height);
                    _site += __site;
                }
                textSiteX += _site;
            }
        }
    }
    context.stroke(); // 进行绘制
    v.svg1 = canvas.toDataURL('image/png');
}
function htmlEscape(text) {
    return text.replace(/[<>"&]/g, function (match, pos, originalText) {
        switch (match) {
            case "<": return "&lt;";
            case ">": return "&gt;";
            case "&": return "&amp;";
            case "\"": return "&quot;";
        }
    });
}
function htmlDecodeByRegExp(str) {
    var s = "";
    if (str.length === 0) return "";
    s = str.replace(/&amp;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&#39;/g, "\'");
    s = s.replace(/&quot;/g, "\"");
    return s;
}

