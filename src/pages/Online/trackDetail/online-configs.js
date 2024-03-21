/* 轨道操作  轨道所有素材对象的处理 */
import $ from 'jquery';
import { message } from 'antd';
import Hls from 'hls.js';
import { get_data } from "@/channel";
import { hls_list, video_list, clearOnlineList, initInterview } from './unitInfo';
import say from '@/database/local_language';
import project_config from '@/database/project_config';
import { add_unit } from "./add_unit";
import { loadMedia as loadTheMedia } from './load_unit';
import { get_list, sub_add, sub_move, sub_del } from "./subtitles-config";



let _project_config = [cloneConfig(project_config)];
const text_1 = (localStorage.setpath || '') + '/images/text_1.png';
const text_2 = (localStorage.setpath || '') + '/images/text_2.png';
const text_3 = (localStorage.setpath || '') + '/images/text_3.png';
const text_5 = (localStorage.setpath || '') + '/images/text_4.mp4';
const text_4 = (localStorage.setpath || '') + '/images/text_5.png';
const text_6 = (localStorage.setpath || '') + '/images/text_6.mp4';
const crossfade = (localStorage.setpath || '') + '/images/trans_fade.mp4';
const crossblur = (localStorage.setpath || '') + '/images/trans_blur.mp4';
const fadeblack = (localStorage.setpath || '') + '/images/trans_black.mp4';
const fadewhite = (localStorage.setpath || '') + '/images/trans_white.mp4';
const rightslide = (localStorage.setpath || '') + '/images/trans_right.mp4';
const leftslide = (localStorage.setpath || '') + '/images/trans_left.mp4';
export let dragging_obj = {};
let _config_key = 0;
let tempConfig = '';
let tempObj = [];
let copy = false;
let tempLayer = 0;
let temp_list = {};
let section_s = 0;
let section_e = 0;
let main_set = true;
let pre_config = JSON.stringify(cloneConfig(project_config));
let div = document.createElement('div');
let _initConfig = () => {
    console.info('****')
}
const configs = () => {
    console.info('****')
}

export function get_unit_base(o) {
    console.info('****')

}
export function setPreConfig() {
    let _config = cloneConfig(getConfig());
    delete _config['text_list'];
    pre_config = JSON.stringify(_config);
}
export function getPreConfig() {
    let _config = cloneConfig(getConfig());
    delete _config['text_list'];
    return pre_config === JSON.stringify(_config);
}

export function setSection(s, e) {
    section_s = s;
    section_e = e;
}

export function getSection() {
    //片段的开始时间和结束时间；用来控制元件详情的播放；
    return { s: section_s, e: section_e }
}
//测试拖动边界值
export function testTrim(o, time, lr) {
    //获取基本信息
    let mediaType = o.attr('data-mediaType'); // 用户自己上传的视频素材
    let isGif = o.attr('data-mediaUrl') && o.attr('data-mediaUrl').toLocaleLowerCase().indexOf('.gif') !== -1;
    let k = o.attr('data-layer') * 1;// 所在轨道
    let position = o.attr('data-position') * 1;// 插入哪个元素之后
    let _config = tempConfig ? tempConfig : cloneConfig(_project_config[_config_key]);
    let _list = [];
    let video_len = _config.video_list.length;
    let audio_len = _config.audio_list.length;
    let text_len = _config.text_list.length || 1;
    if (k < video_len) {
        _list = _config.video_list[k].obj_list;
    } else if (k < video_len + audio_len) {
        _list = _config.audio_list[k - video_len].obj_list;
    } else if (k < video_len + audio_len + text_len) {
        _list = _config.text_list[0].obj_list;
    } else { return }
    let lock = video_len - 1 === k;
    let obj = _list[position + 1];
    if (!obj) return;
    if (lr === 'left') {
        if (!(main_set && lock)) {
            if (time < 0)
                time = 0;
            //测试相邻元素不重叠
            if (position >= 0 && _list[position].end_time > time)
                time = _list[position].end_time;
        }
        if (obj.end_time - time >= 0.04 && time >= 0 && (position >= 0 ? _list[position].end_time <= time : true)) {
            if (isGif) {
                let start_range = obj.special.end_range - (obj.end_time - time) * (obj.special.end_range - obj.special.start_range) / (obj.end_time - obj.start_time);
                start_range = Math.ceil(start_range * 25) / 25;
                let _start = start_range % obj.duration;
                if (_start < 0) _start = _start + obj.duration * 1;
                let _end = _start - start_range + obj.special.end_range;
                _start = Math.ceil(_start * 25) / 25;
                _end = Math.ceil(_end * 25) / 25;
                obj.special.start_range = _start;
                o.attr('data-startRange', _start);
                obj.special.end_range = _end;
                o.attr('data-endRange', _end);
            } else if (mediaType === 'audio' || mediaType === 'video') {
                let start_range = obj.special.end_range - (obj.end_time - time) * (obj.special.end_range - obj.special.start_range) / (obj.end_time - obj.start_time);
                start_range = Math.ceil(start_range * 25) / 25;
                if (start_range >= 0) {
                    obj.special.start_range = start_range;
                    o.attr('data-startRange', start_range);
                } else {
                    let time = obj.end_time - (obj.special.end_range) / ((obj.special.end_range - obj.special.start_range) / (obj.end_time - obj.start_time));
                    obj.special.start_range = 0;
                    o.attr('data-startRange', 0);
                    o.attr('data-startTime', time);
                    return;
                }
            }
            time = Math.ceil(time * 25) / 25;
            o.attr('data-startTime', time);
            o.attr('data-endTime', obj.end_time);
        }
        if (main_set && lock && (time < 0 || (position >= 0 && _list[position].end_time > time))) {
            if (isGif) {
                let start_range = obj.special.end_range - (obj.end_time - time) * (obj.special.end_range - obj.special.start_range) / (obj.end_time - obj.start_time);
                start_range = Math.ceil(start_range * 25) / 25;
                let _start = start_range % obj.duration;
                if (_start < 0) _start = _start + obj.duration * 1;
                let _end = _start - start_range + obj.special.end_range;
                obj.special.start_range = Math.ceil(_start * 25) / 25;
                obj.special.end_range = Math.ceil(_end * 25) / 25;
                obj['start_time'] = Math.ceil(time * 25) / 25;
            } else if (mediaType === 'audio' || mediaType === 'video') {
                let start_range = obj.special.end_range - (obj.end_time - time) * (obj.special.end_range - obj.special.start_range) / (obj.end_time - obj.start_time);
                start_range = Math.ceil(start_range * 25) / 25;
                if (start_range >= 0) {
                    obj.special.start_range = start_range;
                    obj['start_time'] = Math.ceil(time * 25) / 25;
                } else {
                    time = obj.end_time - (obj.special.end_range) / ((obj.special.end_range - obj.special.start_range) / (obj.end_time - obj.start_time));
                    obj.special.start_range = 0;
                    obj['start_time'] = Math.ceil(time * 25) / 25;
                    // return;
                }
            }
            obj['start_time'] = Math.ceil(time * 25) / 25;
            _list[position + 1]['current'] = 'focused';
            refreshMain(_config);
            let pathway = $('.tl-body .pathway-box').find('.pathway');
            tempConfig = '';
            pathway.eq(k).html(loadVideo(_list, k));
            _initConfig('solo');
        }
    } else if (lr === 'right') {
        if (!(main_set && lock)) {
            if (_list.length > position + 2 && _list[position + 2].start_time < time) time = _list[position + 2].start_time;
        }
        if (time - obj.start_time >= 0.04 && (_list.length > position + 2 ? _list[position + 2].start_time >= time : true)) {
            if (isGif) {
                let end_range = obj.special.start_range + (time - obj.start_time) * (obj.special.end_range - obj.special.start_range) / (obj.end_time - obj.start_time);
                end_range = Math.ceil(end_range * 25) / 25;
                obj.special.end_range = end_range;
                o.attr('data-endRange', end_range);
            } else if (mediaType === 'audio' || mediaType === 'video') {
                let end_range = obj.special.start_range + (time - obj.start_time) * (obj.special.end_range - obj.special.start_range) / (obj.end_time - obj.start_time);
                end_range = Math.ceil(end_range * 25) / 25;
                if (end_range <= obj.duration) {
                    obj.special.end_range = end_range;
                    o.attr('data-endRange', end_range);
                } else {
                    let time = obj.start_time + (obj.duration - obj.special.start_range) / ((obj.special.end_range - obj.special.start_range) / (obj.end_time - obj.start_time));
                    obj.special.end_range = obj.duration;
                    o.attr('data-endRange', obj.duration);
                    o.attr('data-endTime', time);
                    return;
                }
            }
            time = Math.ceil(time * 25) / 25;
            o.attr('data-endTime', time);
        }

        if (_list.length > position + 2 && _list[position + 2].start_time < time && main_set && lock) {
            if (isGif) {
                let end_range = obj.special.start_range + (time - obj.start_time) * (obj.special.end_range - obj.special.start_range) / (obj.end_time - obj.start_time);
                end_range = Math.ceil(end_range * 25) / 25;
                obj.special.end_range = end_range;
                obj['end_time'] = Math.ceil(time * 25) / 25;
            } else if (mediaType === 'audio' || mediaType === 'video') {
                let end_range = obj.special.start_range + (time - obj.start_time) * (obj.special.end_range - obj.special.start_range) / (obj.end_time - obj.start_time);
                end_range = Math.ceil(end_range * 25) / 25;
                if (end_range <= obj.duration) {
                    obj.special.end_range = end_range;
                    obj['end_time'] = Math.ceil(time * 25) / 25;
                } else {
                    time = obj.start_time + (obj.duration - obj.special.start_range) / ((obj.special.end_range - obj.special.start_range) / (obj.end_time - obj.start_time));
                    obj.special.end_range = obj.duration;
                    obj['end_time'] = Math.ceil(time * 25) / 25;
                }
            }
            obj['current'] = 'focused';
            obj['end_time'] = Math.ceil(time * 25) / 25;
            refreshMain(_config);
            let pathway = $('.tl-body .pathway-box').find('.pathway');
            tempConfig = '';
            pathway.eq(k).html(loadVideo(_list, k));
            _initConfig('solo');
        }

    }
}

export function addTrim(o, insert, auto, render) {
    console.info(o);
    let k = o.attr('data-layer') * 1;// 所在轨道
    let position = o.attr('data-position') * 1;// 插入哪个元素之后
    let startTime = o.attr('data-startTime') * 1; // 在轨道上开始位置（时间）
    let endTime = o.attr('data-endTime') * 1; // 在轨道上结束位置
    let startRange = o.attr('data-startRange') * 1;// 截取视频开始时间
    let endRange = o.attr('data-endRange') * 1;// 截取视频结束时间
    let _config = cloneConfig(_project_config[_config_key]);
    let _list = [];
    let video_len = _config.video_list.length;
    let audio_len = _config.audio_list.length;
    if (k < video_len) {
        _list = _config.video_list[k].obj_list;
    } else if (k < video_len + audio_len) {
        _list = _config.audio_list[k - video_len].obj_list;
    } else if (k < video_len + audio_len + 1) {
        _list = _config.text_list[0].obj_list;
    } else { return }
    if (o.hasClass('mater-subtitle')) {
        // language:second_language,
        //     project_id: obj.project_id,
        //     text_id: obj.chinese_id,
        //     start_time: obj.chinese_start_time,
        //     end_time: obj.chinese_end_time,
        //     text: obj.chinese||''
        //
        // <div data-duration="5" data-mediaid="a151780207995210" data-textid="a151780207995210" data-mediatype="subtitle"
        //      data-language="zh" data-mediaurl="" data-name="刹那芳华" data-text="刹那芳华" data-thumbnail="" data-layer="3"
        //      data-starttime="13" data-startrange="13" data-endtime="35.4" data-endrange="35.4" data-position="0"
        //      className="mater-helper mater-subtitle ui-draggable ui-draggable-handle"
        //      style="width: 224px; left: 130px;">
        //     <div className="trim trimL"></div>
        //     <div className="trim trimR"></div>
        //     <div className="clip-item-thumbs sub"
        //          style="width: 220px; background-image: url(&quot;&quot;); background-size: 63px 35px; background-repeat: repeat;">
        //         <div className="name">刹那芳华</div>
        //     </div>
        // </div>

        sub_move({
            current: "",
            end_time: endTime,
            language: o.attr('data-language') || '',
            project_id: _config.project_id,
            start_time: startTime,
            text: o.attr('data-text') || '',
            text_id: o.attr('data-mediaId') || ''
        });
    } else {
        let obj = _list[position + 1];
        obj.start_time = startTime;
        obj.end_time = endTime;
        obj.special.start_range = startRange;
        obj.special.end_range = endRange;
        if (obj.special.end_range > obj.duration) {
            obj.special.start_range = obj.special.start_range - (obj.special.end_range - obj.duration);
            obj.special.start_range = Math.max(obj.special.start_range, 0);
            obj.special.end_range = obj.duration
        }
        obj.audio_fade = [
            {
                "time_point": startRange,  // 相对该视频时间点
                "visibility": 100,  // 透明度
                "fade_type": 0,  // 0-视频/图片/文本/背景，1-音频
            },
            {
                "time_point": endRange,  // 相对该视频时间点
                "visibility": 100,  // 透明度
                "fade_type": 0,  // 0-视频/图片/文本/背景，1-音频
            }
        ];
        // _config.duration = total > _config.duration ? total : _config.duration;
        obj['current'] = 'focused';
        _project_config.length = _config_key + 1;
        _project_config.push(_config);
        _config_key++;
        refreshMain(_config);
        let pathway = $('.tl-body .pathway-box').find('.pathway');
        tempConfig = '';
        pathway.eq(k).html(loadVideo(_list, k));
        _initConfig('solo');
    }
}

export function setDragging(obj) {
    dragging_obj = obj;
}

export function test(o, s, e, k, auto, replace) {
    //获取基本信息
    let startTime = Math.round(s * 25) / 25; // 在轨道上开始位置（时间）
    let endTime = Math.round(e * 25) / 25; // 在轨道上结束位置
    let _config = tempConfig ? tempConfig : _project_config[_config_key];
    let video_len = _config.video_list.length + 1;
    let audio_len = _config.audio_list.length;
    let text_len = _config.text_list ? _config.text_list.length : 0;
    let _list = [];
    let oType = o.attr('data-mediaType');
    o.removeClass('onlyChoose').removeClass('replace').removeClass('yellow').removeClass('red');
    //超出上边界无效
    if (k < 0) {
        o.addClass('red');
        return;
    }
    //获取对应的行
    if (k < video_len) {
        // if(video_len-k===1){
        //     o.addClass('red');
        //     return;
        // }
        k = Math.min(video_len - 2, k);
        _list = _config.video_list[k].obj_list;
        if (oType === 'audio' || oType === 'subtitle') {
            o.addClass('red');
            return;
        }
    } else if (k < audio_len + video_len) {
        _list = _config.audio_list[k - video_len].obj_list;
        if (oType !== 'audio') {
            o.addClass('red');
            return;
        }
    } else if (k < audio_len + video_len + text_len) {
        _list = _config.text_list[0].obj_list;
        if (oType !== 'subtitle') {
            o.addClass('red');
            return;
        }
    } else {
        o.addClass('red');
        return;
    }
    //错误的行无效
    if (startTime < 0) {
        o.addClass('red');
        return;
    }
    //转场检测
    if (oType === 'transition') {
        for (let i = 0; i < _list.length; i++) {
            let list_start = _list[i].start_time;
            let list_end = _list[i].end_time;
            //移动块的开始时间匹配*****************
            // if(Math.abs(startTime-list_start)<(auto || 0)){
            let _theDuration = endTime - startTime < auto * 10 ? auto * 10 : endTime - startTime;
            if (list_start - startTime + 0.01 > 0 && list_start - startTime < _theDuration) {
                //匹配到转场
                if (_list[i].obj_type === 'transition') {
                    o.attr({ 'data-position': i - 1 });
                    return;
                }
                //匹配到时长不够的块
                if (list_end - list_start < endTime - startTime + 0.09) {
                    break;
                }
                //匹配到有联结的块；无联结则通过
                if (i > 0 && _list[i - 1].end_time === list_start) {
                    if (_list[i - 1].obj_type === 'transition') {
                        break;
                    } else if (_list[i - 1].end_time - _list[i - 1].start_time < endTime - startTime + 0.01) {
                        break;
                    } else {
                        o.attr({ 'data-position': i - 1 });
                        return;
                    }
                } else {
                    o.attr({ 'data-position': i - 1 });
                    return;
                }
            }
            //移动块的结束时间匹配*****************
            // console.info('移动块的结束时间匹配*****************');
            // if(Math.abs((endTime-startTime<auto*10?auto*10+startTime:endTime)-list_end)<(auto || 0)){
            let _theEnd = endTime - startTime < auto * 10 ? auto * 10 + startTime : endTime;
            if (_theEnd - list_end + auto * 4 > 0 && _theEnd - list_end <= _theDuration) {
                console.info('pass');
                //匹配到转场
                if (_list[i].obj_type === 'transition') {
                    o.attr({ 'data-position': i - 1 });
                    return;
                }
                //匹配到时长不够的块
                if (list_end - list_start < endTime - startTime + 0.09) {
                    break;
                }
                //匹配到有联结的块；无联结则通过
                if (i < _list.length - 1 && _list[i + 1].start_time === list_end) {
                    if (_list[i + 1].obj_type === 'transition') {
                        break;
                    } else if (_list[i + 1].end_time - _list[i + 1].start_time < endTime - startTime + 0.01) {
                        break;
                    } else {
                        o.attr({ 'data-position': i });
                        return;
                    }
                } else {
                    o.attr({ 'data-position': i });
                    return;
                }
            }
        }
        o.addClass('red');
        return;
    }
    // 位置为0有效
    if (startTime === 0) {
        if (_list.length && _list[0].start_time < endTime) {
            if (oType === 'subtitle') {
                o.addClass('red');
                return;
            }
            o.addClass('yellow');
            if (_list[0].start_time < 0.03) {
                o.addClass('onlyChoose')
            }
            o.attr({ 'data-position': -1 });
            return 0;
        } else {
            o.attr({ 'data-position': -1 });
            return 0;
        }
    }
    for (let i = 0; i < _list.length; i++) {
        let list_start = _list[i].start_time;
        let list_end = _list[i].end_time;
        //空间足够放下
        if (auto && (i === 0 ? (list_start - 0 >= endTime - startTime) : (list_start - _list[i - 1].end_time >= endTime - startTime)) && Math.abs(endTime - list_start) < auto) {
            o.attr({ 'data-position': i - 1 });
            return i - 1;
        }
        if (startTime <= list_end) {
            //空间足够放下
            if (endTime <= list_start) {
                o.attr({ 'data-position': i - 1 });
                return i - 1;
                //贴合前一个，空间足够放下
            } else if (startTime === list_end && ((_list.length - 1 > i && endTime <= _list[i + 1].start_time) || _list.length - 1 === i)) {
                o.attr({ 'data-position': i });
                return i - 1;
                //贴合前一个，空间足够放下
            } else if (auto && (Math.abs(startTime - list_end) < auto && ((_list.length - 1 > i && endTime - startTime <= _list[i + 1].start_time - list_end) || _list.length - 1 === i))) {
                o.attr({ 'data-position': i });
                return i - 1;
                //处于两个元素之间
            } else if (_list.length - 1 > i && _list[i + 1].start_time <= endTime && startTime >= list_start) {
                if (oType !== 'subtitle') {
                    o.addClass('yellow');
                    if (_list[i + 1].start_time - list_end < 0.03) {
                        o.addClass('onlyChoose')
                    }
                    o.attr({ 'data-position': i });
                    return i;
                } else {
                    o.addClass('red');
                    return;
                }
                //替换
            } else {
                if (oType !== 'subtitle') {
                    o.addClass('yellow');
                    o.addClass('replace');
                    o.attr({ 'data-position': i });
                    // o.addClass('red');
                    // o.attr({'data-position': i});
                    return i;

                } else {
                    o.addClass('red');
                    return;
                }
            }
        }
    }
    if (_list.length) {
        o.attr({ 'data-position': _list.length - 1 });
        return _list.length - 1;

    } else {
        o.attr({ 'data-position': -1 });
        return 0;
    }

}

function cloneConfig(config) {
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

/*
* o:jquery对象；
* k:轨道下标；
* */
export function dragStart(par, _copy) {
    tempObj = [];
    copy = _copy;
    let son = par.find('.mater-helper');
    let _config = cloneConfig(_project_config[_config_key]);
    for (let i = son.length - 1; i >= 0; i--) {
        let o = son.eq(i);
        let k = o.attr('data-layer') * 1;// 所在轨道
        let position = o.attr('data-position') * 1;// 插入哪个元素之后
        let _list = [];
        let video_len = _config.video_list.length;
        let audio_len = _config.audio_list.length;
        let text_len = _config.text_list.length;
        if (k < video_len) {
            _list = _config.video_list[k].obj_list;
        } else if (k < video_len + audio_len) {
            _list = _config.audio_list[k - video_len].obj_list;
        } else if (k < video_len + audio_len + text_len) {
            _list = _config.text_list[0].obj_list;
        }
        let clone = cloneConfig(_list[position + 1]);
        clone['current'] = '';
        if (o.hasClass('focused')) clone['current'] = 'focused';
        if (o.hasClass('ui-selected')) clone['current'] = 'ui-selected';
        tempObj.unshift(clone);
        if (!copy) {
            _list.splice(position + 1, 1);
        }
    }
    tempConfig = _config;
}

export function interAudio(buffer, media_id, start_time, duration, volume) {
    let end_time = start_time + duration;
    let obj = {
        "obj_type": 'audio',  // 用户自己上传的视频素材
        "obj_id": media_id,  // 视频ID
        "duration": duration,  // 时长
        "start_time": start_time,  // 在轨道上开始位置（时间）
        "end_time": end_time,  // 在轨道上结束位置
        "effects": 'original',  // 滤镜
        "special": {  // 该对象特有属性
            "media_url": '',  // 视频URL
            "preview_mp3": '',  // 预览URL（低码率）
            "video_preview_img": '',  // 视频缩略图
            "audio_preview_img": '',  // 音频缩略图
            "uploading": true,  // 预览URL（低码率）
            "buffer": (buffer !== 0 && !buffer) ? undefined : buffer,  // 预览URL（低码率）
            "thumbnail": '',  // 视频封面图
            "start_range": 0,  // 截取视频开始时间
            "end_range": duration,  // 截取视频结束时间
        },
        "volume": {  // 声音
            "value": volume * 100,  // 开始 音量大小
            "end_value": 1,  // 结束 音量大小
            "echoes": false,  // 是否加回声
        },
        "audio_fade": [
            {
                "time_point": 0,  // 相对该视频时间点
                "visibility": 100,  // 透明度
                "fade_type": 0,  // 0-视频/图片/文本/背景，1-音频
            },
            {
                "time_point": duration,  // 相对该视频时间点
                "visibility": 100,  // 透明度
                "fade_type": 0,  // 0-视频/图片/文本/背景，1-音频
            }
        ]
    };
    let _config = cloneConfig(_project_config[_config_key]);
    let flag = false, position = 0;
    for (let i = 0; i < _config.audio_list.length; i++) {
        let _list = _config.audio_list[i].obj_list;
        let _flag = false, _position = 0;
        for (let j = 0; j < _list.length; j++) {
            if (_list[j].end_time < start_time) {
                _position = j + 1;
            }
            if (_list[j].start_time < end_time && _list[j].end_time > start_time) {
                _flag = true;
                break;
            }
        }
        if (!_flag) {
            flag = true;
            _list.splice(_position, 0, obj);
            break
        }
    }
    if (!flag) {
        _config.audio_list.push({
            "name": "音频" + (_config.audio_list.length + 1),
            "order": 1,
            "update_time": "2017-08-02 12:21:12",
            "volume": 100,
            "lock_track": false,
            "obj_list": [obj]
        })
    }
    // _config.duration = end_time > _config.duration ? end_time : _config.duration;
    _project_config.length = _config_key + 1;
    _project_config.push(_config);
    _config_key++;
    render();
}

/*
* o:jquery对象；
* */
export function addUnit(o, insert, auto, _render, unit_data, tempObj, _config) {
    //获取基本信息
    let _obj = unit_data || {
        copy: copy,
        duration: o.attr('data-duration') * 1, // 时长
        media_type: o.attr('data-mediaType'), // 用户自己上传的视频素材
        media_id: o.attr('data-mediaId'),// 视频ID
        media_url: o.attr('data-mediaUrl'),//媒体源
        trans_name: o.attr('data-transName'),//媒体源
        video_preview_img: o.attr('data-videoPreviewImg'),//预览图
        audio_preview_img: o.attr('data-audioPreviewImg'),//预览图
        preview_hls: o.attr('data-previewHls'),//预览链接
        preview_mp3: o.attr('data-previewMp3'),//预览链接
        preview_mp4: o.attr('data-previewMp4'),//预览链接
        uploading: o.attr('data-uploading'),//预览链接
        name: o.attr('data-name'),//预览链接
        buffer: o.attr('data-buffer'),//预览链接
        thumbnail: o.attr('data-thumbnail'),// 视频封面图
        start_time: o.attr('data-startTime') * 1, // 在轨道上开始位置（时间）
        end_time: o.attr('data-endTime') * 1, // 在轨道上结束位置
        start_range: o.attr('data-startRange') * 1,// 截取视频开始时间
        end_range: o.attr('data-endRange') * 1,// 截取视频结束时间
        trans_type: o.attr('data-transType'),// 转场类型
        sub_type: o.attr('data-subType'),// 转场类型
        layer: o.attr('data-layer') * 1,// 所在轨道
        position: o.attr('data-position') * 1// 插入哪个元素之后
    };
    if (!_obj.preview_mp3) {

    }
    let mediaType = _obj.media_type;// 视频封面图
    let transName = _obj.trans_name;// 视频封面图
    let thumbnail = _obj.thumbnail;// 视频封面图
    let startTime = _obj.start_time;
    let endTime = _obj.end_time;
    let startRange = _obj.start_range;
    let endRange = _obj.end_range;
    let transType = _obj.trans_type;
    let subType = _obj.sub_type;
    let k = _obj.layer;
    let position = _obj.position;
    let _list = [];
    let video_len = _config.video_list.length;
    let audio_len = _config.audio_list.length;
    if (k < video_len) {
        _list = _config.video_list[k].obj_list;
    } else if (k < video_len + audio_len) {
        _list = _config.audio_list[k - video_len].obj_list;
    } else { return }
    let total = endTime;
    if (mediaType === 'transition') {
        let duration = endTime - startTime;
        endTime = endTime - startTime < auto * 10 ? auto * 10 + startTime : endTime;
        //联结块
        if (position + 1 < _list.length && position >= 0 && _list[position].end_time === _list[position + 1].start_time) {
            startTime = _list[position].end_time - duration / 2;
            endTime = _list[position].end_time + duration / 2;
            let _trans = {
                bind: true,
                name: transName,
                trans_type: transType,
                thumbnail: thumbnail,
                duration: duration
            };
            _list[position].trans_end = _trans;
            _list[position + 1].trans_start = _trans;
            //后
        } else if (position >= 0 && endTime > _list[position].end_time - auto * 4 && startTime <= _list[position].end_time + 0.01) {
            _list[position].trans_end = {
                bind: false,
                name: transName,
                trans_type: transType,
                thumbnail: thumbnail,
                duration: duration
            }
            //前
        } else if (position + 1 < _list.length && startTime < _list[position + 1].start_time + 0.01 && endTime > _list[position + 1].start_time + 0.01) {
            _list[position + 1].trans_start = {
                bind: false,
                name: transName,
                trans_type: transType,
                thumbnail: thumbnail,
                duration: duration
            }
        }
        return;
    }
    if (insert === 'copy') {
        let duration = endTime - startTime;
        startTime = startTime + duration;
        endTime = startTime + duration;
        position = position + 1;
        if (position + 1 < _list.length) {
            let delay = Math.max(duration - (_list[position + 1].start_time - startTime), 0);
            for (let i = position + 1; i < _list.length; i++) {
                _list[i].start_time = _list[i].start_time.toFixed(2) * 1 + delay;
                total = _list[i].end_time = _list[i].end_time.toFixed(2) * 1 + delay;
            }
        }
    }
    if (o && o.hasClass('yellow')) {
        let duration = endTime - startTime;
        if (position + 1 > 0) {
            startTime = _list[position].end_time;
        } else {
            startTime = 0;
        }
        if (!insert) {
            endTime = _list[position + 1].start_time;
            endRange = startRange + (endRange - startRange) * (endTime - startTime) / duration;
        } else if (insert === 'insert') {
            endTime = startTime + duration;
            let delay = duration - (_list[position + 1].start_time - startTime);
            for (let i = position + 1; i < _list.length; i++) {
                _list[i].start_time = _list[i].start_time.toFixed(2) * 1 + delay;
                total = _list[i].end_time = _list[i].end_time.toFixed(2) * 1 + delay;
            }
        } else if (insert === 'replace') {
            let viscosity = false;
            position = position < 0 ? position : position - 1;
            startTime = _list[position + 1].start_time;
            endTime = startTime + duration;
            if (_list[position + 2] && _list[position + 1].end_time >= _list[position + 2].start_time) {
                viscosity = true;
            }
            //原始元素
            let __obj = _list[position + 1];
            _obj['effects'] = __obj['effects'] || _obj['effects'];
            _obj['trans_start'] = __obj['trans_start'] || _obj['trans_start'];
            _obj['trans_end'] = __obj['trans_end'] || _obj['trans_end'];
            _obj['transform'] = __obj['transform'] || _obj['transform'];
            _obj['volume'] = __obj['volume'] || _obj['volume'];
            _obj['specialeffect'] = __obj['specialeffect'] || _obj['specialeffect'];
            _obj['color'] = __obj['color'] || _obj['color'];
            if (tempConfig) {
                tempObj['effects'] = __obj['effects'] || tempObj['effects'];
                tempObj['trans_start'] = __obj['trans_start'] || tempObj['trans_start'];
                tempObj['trans_end'] = __obj['trans_end'] || tempObj['trans_end'];
                tempObj['transform'] = __obj['transform'] || tempObj['transform'];
                tempObj['volume'] = __obj['volume'] || tempObj['volume'];
                tempObj['specialeffect'] = __obj['specialeffect'] || tempObj['specialeffect'];
                tempObj['color'] = __obj['color'] || tempObj['color'];
            }
            _list.splice(position + 1, 1);
            if (_list.length > position + 1) {
                let delay = duration - (_list[position + 1].start_time - startTime);
                if (delay > 0 || viscosity) {
                    for (let i = position + 1; i < _list.length; i++) {
                        _list[i].start_time = _list[i].start_time.toFixed(2) * 1 + delay;
                        total = _list[i].end_time = _list[i].end_time.toFixed(2) * 1 + delay;
                    }
                }
            }
        }
    }
    _obj['start_time'] = startTime;
    _obj['end_time'] = endTime;
    _obj['end_range'] = startRange;
    _obj['end_range'] = endRange;
    if (tempConfig) {
        tempObj['start_time'] = startTime;
        tempObj['end_time'] = endTime;
        tempObj['end_range'] = startRange;
        tempObj['end_range'] = endRange;
    }


    // let start_time=startTime;
    // let end_time=endTime;
    // if(auto){
    //     let _list = [];
    //     let video_len = _config.video_list.length;
    //     let audio_len = _config.audio_list.length;
    //     if(position+1<_list.length){
    //         let start = _list[position+1].start_time;
    //         if(Math.abs(start_time - startTime + endTime -start)<auto*10){
    //             start_time=start-endTime+startTime
    //         }
    //     }
    //     if(position>-1&&_list[position]){
    //         let end = _list[position].end_time;
    //         if(Math.abs(end-start_time)<auto*10){
    //             start_time=end;
    //         }
    //     }else if(position===-1){
    //         if(Math.abs(start_time)<auto*10){
    //             start_time=0;
    //         }
    //     }
    // }
    //
    // _obj['start_time']=start_time;
    // _obj['end_time']=(start_time - startTime + endTime * 1).toFixed(2)*1;
    // _obj['end_range']=startRange;
    // _obj['end_range']=endRange;
    // if(tempConfig){
    //     tempObj['start_time']=start_time;
    //     tempObj['end_time']=(start_time - startTime + endTime * 1).toFixed(2)*1;
    //     tempObj['end_range']=startRange;
    //     tempObj['end_range']=endRange;
    // }
    //
    _obj['copy'] = copy;
    tempConfig && tempObj && (tempObj['copy'] = copy);
    let obj = add_unit(tempConfig ? tempObj : _obj, _obj.start_time, _obj.end_time);
    _list.splice(position + 1, 0, obj);
    if (k === video_len - 1) {

    }
    _config.duration = _config.duration > total ? _config.duration : total;
}

/*
* o:jquery对象；
* */
export function add(o, insert, auto, _render, unit_data) {
    let _config = tempConfig ? tempConfig : cloneConfig(_project_config[_config_key]);
    if (unit_data) {
        addUnit(o, insert, auto, _render, unit_data, '', _config)
    } else if (o.length) {

        let flag = 0, _flag = 0, unit_flag = true;
        let array = [];
        let list = get_list().list;
        for (let i = o.length - 1; i >= 0; i--) {
            let _o = o.eq(i);
            flag = list.length - 1;
            if (o.eq(i).hasClass('mater-subtitle')) {
                let obj = {
                    current: "",
                    end_time: _o.attr('data-endTime') * 1,
                    language: _o.attr('data-language') || '',
                    project_id: _config.project_id,
                    start_time: _o.attr('data-startTime') * 1,
                    text: _o.attr('data-text') || '',
                    text_id: _o.attr('data-mediaId') || ''
                };
                for (let i = 0; i < list.length; i++) {
                    if (list[i].text_id === obj.text_id) {
                        list.splice(i, 1);
                        break;
                    }
                }
                for (let i = 0; i < list.length; i++) {
                    if (list[i].start_time > obj.start_time) {
                        flag = i;
                        break;
                    }
                }
                list.splice(_flag || flag, 0, obj);
                array.unshift(cloneConfig(obj));
            } else {
                unit_flag = false;
                addUnit(o.eq(i), insert, auto, _render, unit_data, tempObj[i], _config)
            }
        }
        let _new = {
            "project_id": _config.project_id,
            "text_list": array
        };
        sub_add(_new);
        // let layers=0;
        // let positions=0;
        // for(let i=0;i<o.length;i++){
        //     let obj=o.eq(i);
        //     let layer=obj.attr('data-layer') * 1;
        //     let position=obj.attr('data-position') * 1;
        //     if(layers===layer){
        //         obj.attr({'data-position':position+positions});
        //         positions++;
        //     }else{
        //         positions=0;
        //     }
        //     addUnit(o.eq(i), insert,auto,_render,unit_data,tempObj[i],_config)
        // }
    }
    _project_config.length = _config_key + 1;
    _project_config.push(_config);
    _config_key++;
    tempConfig = '';
    render();
}

export function dragStop() {
    tempConfig = '';
}

let pre_current_time = '';

//获取实时信息；
export function getVideoPiece(now, pic, silence, paused) {
    let _config = _project_config[_config_key];
    let vl = _config.video_list, al = _config.audio_list;
    vl = vl.concat(al);
    let orderList = [];
    let readyState = false;
    let time = 0;
    for (let i = vl.length - 1; i >= 0; i--) {
        let list = vl[i].obj_list;
        //元件循环
        for (let j = 0; j <= list.length; j++) {
            //预加载
            let o = list[j];
            //当前轨道播放完毕
            if (j === list.length && j > 0) {
                let pre = video_list[list[j - 1].obj_id + '_' + i];
                if (pre && pre.pause && !pre.paused) {
                    pre.pause();
                }
                break;
            }
            if (j < list.length && o.end_time - now > 0) {
                //预加载
                if (now * 1 + 2 - o.start_time >= 0 && now - o.start_time < 0) {
                    // console.info('****preload-pre');
                    let preview = list[j];
                    let video = video_list[preview.obj_id + '_' + i];
                    let speedR = preview.speed ? (preview.speed.value > 0 ? preview.speed.value : -1 / preview.speed.value) : 1;
                    // let speedR=o.speed&&o.speed.value?o.speed.value:1;
                    if (!video) {
                        break;
                    }
                    video.playbackRate = speedR;
                    let current = preview.special.start_range;
                    let isGif = preview.special.media_url && preview.special.media_url.toLocaleLowerCase().indexOf('.gif') !== -1;
                    if (isGif && !isNaN(video.duration)) {
                        video.loop = true;
                        current = current % video.duration;
                    }
                    if (preview.obj_type === 'video' || preview.obj_type === 'audio') {
                        video['keep_pause'] = true;
                        if (video.currentTime !== current || video.readyState < 2) {
                            console.info('ready');
                            video.currentTime = current;
                        }
                    }
                } else if (j + 1 < list.length) {
                    let preview = list[j + 1], present = list[j];
                    let o = preview;
                    if (preview.obj_id !== present.obj_id) {
                        if (now * 1 + 2 - preview.start_time >= 0 && now - preview.start_time < 0) {
                            let video = video_list[preview.obj_id + '_' + i];
                            // let speedR=o.speed&&o.speed.value?o.speed.value:1;
                            let speedR = o.speed ? (o.speed.value > 0 ? o.speed.value : -1 / o.speed.value) : 1;
                            if (!video) {
                                break;
                            }
                            video.playbackRate = speedR;
                            let current = preview.special.start_range;
                            if (!(preview.trans_start && preview.trans_start.bind) || preview.start_time - preview.trans_start.duration / 2 > now) {
                                if (preview.trans_start && preview.trans_start.bind) {
                                    current = preview.special.start_range * 1 + (-preview.trans_start.duration / 2) * speedR;
                                }
                                let isGif = preview.special.media_url && preview.special.media_url.toLocaleLowerCase().indexOf('.gif') !== -1;
                                if (isGif && !isNaN(video.duration)) {
                                    video.loop = true;
                                    current = current % video.duration;
                                }
                                if (preview.obj_type === 'video' || preview.obj_type === 'audio') {
                                    video['keep_pause'] = true;
                                    current = 0 > current ? 0 : current;
                                    if (video.currentTime !== current || video.readyState < 2) {
                                        video.currentTime = current;
                                    }
                                }
                            }
                        }
                    } else {
                        // if (now*1+2 - preview.start_time >= 0&&now - preview.start_time <0) {
                        //     let video = video_list[preview.obj_id + '_' + i+'_trans'];
                        //     if(preview.obj_type==='video'&&!video_list[o.obj_id + '_' + i+'_trans']){
                        //         video_list[o.obj_id + '_' + i+'_trans']=document.createElement('video');
                        //         hls_list[o.obj_id + '_'+ i+'_trans'] = new Hls();
                        //         hls_list[o.obj_id + '_' + i+'_trans'].loadSource(o.special.preview_hls);
                        //         hls_list[o.obj_id + '_' + i+'_trans'].attachMedia(video_list[o.obj_id + '_' + i+'_trans']);
                        //     }
                        //     if(video_list[preview.obj_id + '_' + i+'_trans']&&video_list[preview.obj_id + '_' + i+'_trans'].paused){
                        //          video = video_list[preview.obj_id + '_' + i+'_trans'];
                        //     }else if(video_list[preview.obj_id + '_' + i]&&video_list[preview.obj_id + '_' + i].paused){
                        //         video = video_list[preview.obj_id + '_' + i];
                        // }else if(preview.obj_type==='video'){
                        //     video_list[o.obj_id + '_' + i+'_trans_1']=document.createElement('video');
                        //     hls_list[o.obj_id + '_'+ i+'_trans_1'] = new Hls();
                        //     hls_list[o.obj_id + '_' + i+'_trans_1'].loadSource(o.special.preview_hls);
                        //     hls_list[o.obj_id + '_' + i+'_trans_1'].attachMedia(video_list[o.obj_id + '_' + i+'_trans_1']);
                        //     video=video_list[preview.obj_id + '_' + i+'_trans_1'];
                        // }
                        // let speedR=o.speed&&o.speed.value?o.speed.value:1;
                        // let speedR=o.speed?(o.speed.value>0?o.speed.value:-1/o.speed.value):1;
                        // if(!video){
                        //     break;
                        // }
                        // video.playbackRate=speedR;
                        // let current = preview.special.start_range ;
                        // if(!(preview.trans_start&&preview.trans_start.bind)||preview.start_time-preview.trans_start.duration/2>now){
                        //     if(preview.trans_start&&preview.trans_start.bind){
                        //         current=   preview.special.start_range * 1 + (-preview.trans_start.duration/2) *speedR;
                        //     }
                        //     let isGif=preview.special.media_url&&preview.special.media_url.toLocaleLowerCase().indexOf('.gif')!==-1;
                        //     if(isGif&&!isNaN(video.duration)){
                        //         video.loop=true;
                        //         current=current%video.duration;
                        //     }
                        //     if(preview.obj_type ==='video' || preview.obj_type ==='audio') {
                        //         video['keep_pause'] = true;
                        //         current = 0 > current ? 0 : current;
                        //         if(video.currentTime!==current||video.readyState<2){
                        //             video.currentTime = current;
                        //         }
                        //     }
                        // }
                        // }
                    }
                    //
                    // if(o.obj_type ==='video' || o.obj_type ==='audio'){
                    //     let video = video_list[o.obj_id + '_' + i];
                    //     if(o.obj_id===list[j].obj_id){
                    //         if(!video_list[o.obj_id + '_' + i+'_trans']){
                    //             video_list[o.obj_id + '_' + i+'_trans']=document.createElement('video');
                    //             hls_list[o.obj_id + '_'+ i+'_trans'] = new Hls();
                    //             hls_list[o.obj_id + '_' + i+'_trans'].loadSource(o.special.preview_hls);
                    //             hls_list[o.obj_id + '_' + i+'_trans'].attachMedia(video_list[o.obj_id + '_' + i+'_trans']);
                    //         }
                    //         video = video_list[o.obj_id + '_' + i+'_trans'];
                    //     }
                    //     let speedR=o.speed?(o.speed.value>0?o.speed.value:-1/o.speed.value):1;
                    //     video.playbackRate=speedR;
                    //     let current=o.special.start_range;
                    //     if (Math.abs(current - video.currentTime) > speedR*0.44+0.04) {
                    //         video.currentTime = current;
                    //     }
                    // }
                }

                if (now - o.start_time >= 0) {
                    let video = video_list[o.obj_id + '_' + i];
                    // let speedR=o.speed&&o.speed.value?o.speed.value:1;
                    let speedR = o.speed ? (o.speed.value > 0 ? o.speed.value : -1 / o.speed.value) : 1;
                    if (!video) {
                        break;
                    }
                    video.playbackRate = speedR;
                    let current = o.special.start_range * 1 + (now - o.start_time) * speedR;
                    let isGif = o.special.media_url && o.special.media_url.toLocaleLowerCase().indexOf('.gif') !== -1;
                    if (isGif && !isNaN(video.duration)) {
                        video.loop = true;
                        current = current % video.duration;
                    }
                    if (o.obj_type === 'video' || o.obj_type === 'audio') {
                        video['keep_pause'] = false;
                        if ((Math.abs(current - video.currentTime) >= speedR * 0.44 + 0.04) || (video.paused && paused && Math.abs(current - video.currentTime) > 0.03)) {
                            console.info('***************修正')
                            video.currentTime = current;
                        } else {
                            time = now - (current - video.currentTime);
                        }
                        // (video.paused&&!pic) ? video.play() : '';
                        let _audio_fade_val = 100;
                        if (o.audio_fade && !isGif) {
                            for (let i = 0; i < o.audio_fade.length; i++) {
                                let v = o.audio_fade[i];
                                let ct = video.currentTime;
                                if (v.time_point > ct && i - 1 >= 0) {
                                    let pre = o.audio_fade[i - 1 >= 0 ? i - 1 : 0];
                                    _audio_fade_val = (ct - pre.time_point) / (v.time_point - pre.time_point) * (v.visibility - pre.visibility) + pre.visibility * 1;
                                    break;
                                }
                            }
                        }

                        let _v = silence ? 0 : o.volume.value / 100 * vl[i].volume / 100 * _audio_fade_val / 100;
                        _v = _v >= 0 ? _v <= 1 ? _v : 1 : 0;
                        _v !== video.volume && (video.volume = _v);
                        if ((video.readyState < 2 && !isGif) || (video.readyState < 1 && isGif)) {
                            readyState = true;
                        }
                    } else if (o.obj_type === 'text') {
                        if (o.special.sub_type === 'animation' && video_list[o.obj_id + '_' + i]['lottie']) {
                            let video = video_list[o.obj_id + '_' + i]['lottie'];
                            let _data = video.animationData;
                            let fr = _data.fr;
                            // if(_data&&_data.layers&&_data.layers.length&&o.layers){
                            // _data.layers.map((v,k)=>{
                            // if(o.layers[k]&&v.ty===5){
                            // let param=o.layers[k]['s'];
                            // let font=v.t.d.k[0].s;
                            // for(let i in font){
                            // if(param[i]&&param[i]!==font[i]){
                            // font[i]=param[i];
                            // font={
                            //     "s": 72,
                            //     "f": "STKaitiSC-Black",
                            //     "t": "这是演示文字这是演示文字这是演示文字",
                            //     "j": 0,
                            //     "tr": 0,
                            //     "lh": 86.4,
                            //     "ls": 0,
                            //     "fc": [1, 1, 1]
                            // };
                            // }
                            // }
                            // }
                            // });
                            // }
                            if ((Math.abs(current - video.currentFrame / fr) >= 0.04) || (video.isStoped && paused && Math.abs(current - video.currentFrame / fr) > 0.03)) {
                                let duration = video.getDuration();
                                if (paused) {
                                    video.goToAndStop((current >= duration ? duration : current) * fr, true);
                                } else {
                                    video.goToAndPlay((current >= duration ? duration : current) * fr, true);
                                }
                            } else {
                                time = now - (current - video.currentFrame / fr);
                            }
                            if (video_list[o.obj_id + '_' + i]['lottie'].wrapper.innerHTML !== video_list[o.obj_id + '_' + i]['pre_svg']) {

                                // var svgString = new XMLSerializer().serializeToString($(obj.wrapper.innerHTML)[0]);
                                // var svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
                                // var url = URL.createObjectURL(svg);
                                // img.src = url;

                                let inner = video_list[o.obj_id + '_' + i]['lottie'].wrapper.innerHTML;
                                $(inner).eq(0).css({ writingMode: 'vertical-rl' });
                                let svgString = new XMLSerializer().serializeToString($(inner)[0]);
                                video_list[o.obj_id + '_' + i]['pre_svg'] = inner;
                                let svg = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
                                video_list[o.obj_id + '_' + i].src = URL.createObjectURL(svg);
                                // video_list[o.obj_id + '_' + i].src = "data:image/svg+xml;charset=utf-8,"+svgString;
                            }
                        } else {
                            video_list[o.obj_id + '_' + i].src !== o.special.svg1 ? video_list[o.obj_id + '_' + i].src = o.special.svg1 : '';
                        }
                    }
                    //前半部分有关联过渡，读取前一个块的媒体对象；
                    if (o.trans_start && o.trans_start.bind && o.trans_start.duration / 2 > now - o.start_time) {
                        if (j > 0) {
                            if (list[j - 1].obj_id === list[j].obj_id) {
                                if (list[j - 1].obj_type === 'video' && !video_list[o.obj_id + '_' + i + '_trans'] && o.special.preview_hls) {
                                    video_list[o.obj_id + '_' + i + '_trans'] = document.createElement('video');
                                    hls_list[o.obj_id + '_' + i + '_trans'] = new Hls();
                                    hls_list[o.obj_id + '_' + i + '_trans'].loadSource(o.special.preview_hls);
                                    hls_list[o.obj_id + '_' + i + '_trans'].attachMedia(video_list[o.obj_id + '_' + i + '_trans']);
                                }
                                if (list[j - 1].obj_type === 'video') {
                                    let o = list[j - 1];
                                    let video = video_list[o.obj_id + '_' + i + '_trans'];
                                    if (video) {
                                        // let speedR=o.speed&&o.speed.value?o.speed.value:1;
                                        let speedR = o.speed ? (o.speed.value > 0 ? o.speed.value : -1 / o.speed.value) : 1;
                                        video.playbackRate = speedR;
                                        // console.info((o.special.end_range - o.special.start_range) / (o.end_time-o.start_time))
                                        let current = o.special.start_range * 1 + (now - o.start_time) * speedR;

                                        let isGif = o.special.media_url && o.special.media_url.toLocaleLowerCase().indexOf('.gif') !== -1;
                                        if (isGif) {
                                            let _current = current % video.duration;
                                            if (Math.abs(_current - video.currentTime) > speedR * 0.44 + 0.04) {
                                                video.currentTime = _current;
                                            }
                                            video.volume = 0;
                                            (video.paused && !pic) ? video.play() : '';
                                        } else {
                                            current = video.duration > current ? current : video.duration;
                                            if (current > 0 && current < video.duration) {
                                                if (Math.abs(current - video.currentTime) > speedR * 0.44 + 0.04) {
                                                    video.currentTime = current;
                                                }
                                                video['keep_pause'] = false;
                                                video.volume = 0;
                                            } else {
                                                video['keep_pause'] = true;
                                            }
                                        }
                                        if ((video.readyState < 2 && !isGif) || (video.readyState < 1 && isGif)) {
                                            readyState = true;
                                        }
                                    }
                                } else {
                                    video_list[o.obj_id + '_' + i + '_trans'] = video_list[o.obj_id + '_' + i];
                                }
                                temp_list[list[j - 1].obj_id + '_' + i + '_trans'] = list[j - 1];
                                // orderList.unshift(list[j - 1].obj_id + '_' + i+'_trans')
                                orderList.push(list[j - 1].obj_id + '_' + i + '_trans')
                            } else {
                                if (list[j - 1].obj_type === 'video') {
                                    let o = list[j - 1];
                                    let video = video_list[o.obj_id + '_' + i];
                                    if (video) {
                                        // let speedR=o.speed&&o.speed.value?o.speed.value:1;
                                        let speedR = o.speed ? (o.speed.value > 0 ? o.speed.value : -1 / o.speed.value) : 1;
                                        video.playbackRate = speedR;
                                        // console.info((o.special.end_range - o.special.start_range) / (o.end_time-o.start_time))
                                        let current = o.special.start_range * 1 + (now - o.start_time) * speedR;
                                        let isGif = o.special.media_url && o.special.media_url.toLocaleLowerCase().indexOf('.gif') !== -1;
                                        if (isGif) {
                                            let _current = current % video.duration;
                                            if (Math.abs(_current - video.currentTime) > speedR * 0.44 + 0.04) {
                                                video.currentTime = _current;
                                            }
                                            video.volume = 0;
                                            (video.paused && !pic) ? video.play() : '';
                                        } else {
                                            current = video.duration > current ? current : video.duration;
                                            if (current > 0 && current < video.duration) {
                                                if (Math.abs(current - video.currentTime) > speedR * 0.44 + 0.04) {
                                                    video.currentTime = current;
                                                }
                                                video['keep_pause'] = false;
                                                video.volume = 0;
                                            } else {
                                                video['keep_pause'] = true;
                                            }
                                        }
                                        if ((video.readyState < 2 && !isGif) || (video.readyState < 1 && isGif)) {
                                            readyState = true;
                                        }
                                    }
                                }
                                temp_list[list[j - 1].obj_id + '_' + i] = list[j - 1];
                                // orderList.unshift(list[j - 1].obj_id + '_' + i)
                                orderList.push(list[j - 1].obj_id + '_' + i)
                            }
                        }
                    } else {
                        if (j > 0 && list[j - 1].obj_id !== list[j].obj_id) {
                            let pre = video_list[list[j - 1].obj_id + '_' + i];
                            if (pre && pre.pause && !pre.paused) {
                                pre.pause();
                            }
                        }
                    }
                    temp_list[o.obj_id + '_' + i] = o;
                    // orderList.unshift(o.obj_id + '_' + i);
                    orderList.push(o.obj_id + '_' + i);
                    if (o.trans_end && o.trans_end.bind && o.trans_end.duration / 2 > o.end_time - now) {
                        if (j + 1 < list.length) {
                            if (list[j + 1].obj_id === list[j].obj_id) {
                                if (list[j + 1].obj_type === 'video' && !video_list[o.obj_id + '_' + i + '_trans'] && o.special.preview_hls) {
                                    video_list[o.obj_id + '_' + i + '_trans'] = document.createElement('video');
                                    hls_list[o.obj_id + '_' + i + '_trans'] = new Hls();
                                    hls_list[o.obj_id + '_' + i + '_trans'].loadSource(o.special.preview_hls);
                                    hls_list[o.obj_id + '_' + i + '_trans'].attachMedia(video_list[o.obj_id + '_' + i + '_trans']);
                                }
                                if (list[j + 1].obj_type === 'video') {
                                    let o = list[j + 1];
                                    let video = video_list[o.obj_id + '_' + i + '_trans'];
                                    // let speedR=o.speed&&o.speed.value?o.speed.value:1;
                                    let speedR = o.speed ? (o.speed.value > 0 ? o.speed.value : -1 / o.speed.value) : 1;
                                    video.playbackRate = speedR;
                                    // console.info((o.special.end_range - o.special.start_range) / (o.end_time-o.start_time))
                                    let current = o.special.start_range * 1 + (now - o.start_time) * speedR;
                                    current = 0 > current ? 0 : current;
                                    let isGif = o.special.media_url && o.special.media_url.toLocaleLowerCase().indexOf('.gif') !== -1;
                                    if (isGif) {
                                        let _current = current % video.duration;
                                        if (Math.abs(_current - video.currentTime) > speedR * 0.44 + 0.04) {
                                            video.currentTime = _current;
                                        }
                                        video.volume = 0;
                                        // (video.paused && !pic) ? video.play() : '';
                                    } else {
                                        if (current > 0 && current <= video.duration) {
                                            if (Math.abs(current - video.currentTime) > speedR * 0.44 + 0.04) {
                                                video.currentTime = current;
                                            }
                                            video['keep_pause'] = false;
                                            video.volume = 0;
                                        } else {
                                            video['keep_pause'] = true;
                                            // video.pause ? (!video.paused) ? video.pause() : '' : '';
                                        }
                                    }
                                    if ((video.readyState < 2 && !isGif) || (video.readyState < 1 && isGif)) {
                                        readyState = true;
                                    }
                                } else {
                                    video_list[o.obj_id + '_' + i + '_trans'] = video_list[o.obj_id + '_' + i];
                                }
                                temp_list[list[j + 1].obj_id + '_' + i + '_trans'] = list[j + 1];
                                // orderList.unshift(list[j + 1].obj_id + '_' + i+'_trans')
                                orderList.push(list[j + 1].obj_id + '_' + i + '_trans')
                            } else {
                                if (list[j + 1].obj_type === 'video') {
                                    let o = list[j + 1];
                                    let video = video_list[o.obj_id + '_' + i];
                                    // let speedR=o.speed&&o.speed.value?o.speed.value:1;
                                    let speedR = o.speed ? (o.speed.value > 0 ? o.speed.value : -1 / o.speed.value) : 1;
                                    video.playbackRate = speedR;
                                    // console.info((o.special.end_range - o.special.start_range) / (o.end_time-o.start_time))
                                    let current = o.special.start_range * 1 + (now - o.start_time) * speedR;
                                    current = 0 > current ? 0 : current;
                                    let isGif = o.special.media_url && o.special.media_url.toLocaleLowerCase().indexOf('.gif') !== -1;
                                    if (isGif) {
                                        let _current = current % video.duration;
                                        if (Math.abs(_current - video.currentTime) > speedR * 0.44 + 0.04) {
                                            video.currentTime = _current;
                                        }
                                        video.volume = 0;
                                        // (video.paused && !pic) ? video.play() : '';
                                    } else {
                                        if (current > 0 && current < video.duration) {
                                            if (Math.abs(current - video.currentTime) > speedR * 0.44 + 0.04) {
                                                video.currentTime = current;
                                            }
                                            video['keep_pause'] = false;
                                            video.volume = 0;
                                        } else {
                                            video['keep_pause'] = true;
                                        }
                                    }
                                    if ((video.readyState < 2 && !isGif) || (video.readyState < 1 && isGif)) {
                                        readyState = true;
                                    }
                                }
                                temp_list[list[j + 1].obj_id + '_' + i] = list[j + 1];
                                // orderList.unshift(list[j + 1].obj_id + '_' + i)
                                orderList.push(list[j + 1].obj_id + '_' + i)
                            }
                        }
                    }
                } else {
                    let video = video_list[o.obj_id + '_' + i];
                    if (video && video.pause && !video.paused) {
                        video.pause();
                    }
                    if (j > 0) {
                        let pre = video_list[list[j - 1].obj_id + '_' + i];
                        if (pre && pre.pause && !pre.paused) {
                            pre.pause();
                        }
                    }
                }
                // if(Math.abs(o.end_time - now) >= 0.02 || list.length-j===1){
                break;
                // }else if(Math.abs(o.end_time - now) <= 0.04 && list.length-j>1){
                //     let next = video_list[list[j + 1].obj_id + '_' + i];
                //     if (next&&next.pause&&next.paused) {
                //         next.play();
                //     }
                // }
            }
        }
    }
    if (!readyState) {
        for (let i = 0; i < orderList.length; i++) {
            let video = video_list[orderList[i]];
            if (video && video.paused && video.play && !pic && !video.keep_pause) {
                video.play();
            }
        }
    }
    pre_current_time = now;
    return [orderList, time || now, readyState];
}

export function clipConfig(now, k) {
    now = Math.round(now * 25) / 25;
    let _config = cloneConfig(_project_config[_config_key]);
    let vl = _config.video_list, al = _config.audio_list;
    let focused = $('.pathway .focused');
    vl = vl.concat(al);
    if (focused.length && focused.hasClass('mater-helper')) {
        if (focused.attr('data-subType') === 'animation' || focused.hasClass('mater-subtitle')) return;
        let layer = focused.attr('data-layer') * 1;
        let position = focused.attr('data-position') * 1 + 1;
        let o = vl[layer].obj_list[position];
        if (o.end_time - now > 0.0299) {
            if (now - o.start_time > 0.0299 && o.end_time - o.start_time >= 0.0799) {
                let trans_start = o.trans_start, trans_end = o.trans_end;
                let temp = cloneConfig(o);
                if (trans_end && trans_end.duration) {
                    let _end = o.end_time - (trans_end.bind ? trans_end.duration / 2 : trans_end.duration);
                    if (now > _end) return;
                }
                if (trans_start && trans_start.duration) {
                    let _start = o.start_time * 1 + (trans_start.bind ? trans_start.duration / 2 : trans_start.duration * 1);
                    if (_start > now) return;
                }
                temp['trans_start'] = {};
                o['trans_end'] = {};
                if (now - o.start_time >= 0.4) {
                    o.end_time = now;
                } else {
                    o.end_time = o.start_time * 1 + 0.04
                }
                // let speedR=o.speed&&o.speed.value?o.speed.value:1;
                let speedR = o.speed ? (o.speed.value > 0 ? o.speed.value : -1 / o.speed.value) : 1;
                o.special.end_range = Math.round((o.special.start_range * 1 + (o.end_time - o.start_time) * speedR) * 25) / 25;
                // (o.special.end_range - o.special.start_range) / (temp.duration * 1);
                // o.end_time = o.start_time + o.duration;
                if (o.obj_type === 'text') {
                    temp.obj_id = +new Date() + 'text_' + o.obj_id.split('_')[1];
                }
                temp.start_time = o.end_time;
                if (o.video_fade && o.video_fade.length) {
                    o.video_fade[o.video_fade.length - 1].time_point = o.end_time;
                    temp.video_fade[0].time_point = o.end_time;
                }
                temp.special.start_range = o.special.end_range;
                // temp.duration = temp.duration - o.duration;
                o.audio_fade = [
                    {
                        "time_point": o.special.start_range || 0,  // 相对该视频时间点
                        "visibility": 100,  // 透明度
                        "fade_type": 0,  // 0-视频/图片/文本/背景，1-音频
                    },
                    {
                        "time_point": o.special.end_range || (o.end_time - o.start_time),  // 相对该视频时间点
                        "visibility": 100,  // 透明度
                        "fade_type": 0,  // 0-视频/图片/文本/背景，1-音频
                    }
                ];
                temp.audio_fade = [
                    {
                        "time_point": temp.special.start_range || 0,  // 相对该视频时间点
                        "visibility": 100,  // 透明度
                        "fade_type": 0,  // 0-视频/图片/文本/背景，1-音频
                    },
                    {
                        "time_point": temp.special.end_range || (temp.end_time - temp.start_time),  // 相对该视频时间点
                        "visibility": 100,  // 透明度
                        "fade_type": 0,  // 0-视频/图片/文本/背景，1-音频
                    }
                ];
                vl[layer].obj_list.splice(position + 1, 0, temp);
            }
        }
    } else {
        for (let i = 0; i < vl.length; i++) {
            let list = vl[i].obj_list;
            for (let j = 0; j < list.length; j++) {
                let o = list[j];
                if (o.end_time - now > 0.0299) {
                    if (o.special.sub_type === 'animation' || o.media_type === 'subtitle') break;
                    if (now - o.start_time > 0.0299 && o.end_time - o.start_time >= 0.0799) {
                        let trans_start = o.trans_start, trans_end = o.trans_end;
                        let temp = cloneConfig(o);
                        if (trans_end && trans_end.duration) {
                            let _end = o.end_time - (trans_end.bind ? trans_end.duration / 2 : trans_end.duration);
                            if (now > _end) continue;
                        }
                        if (trans_start && trans_start.duration) {
                            let _start = o.start_time * 1 + (trans_start.bind ? trans_start.duration / 2 : trans_start.duration);
                            if (_start > now) continue;
                        }
                        temp['trans_start'] = {};
                        o['trans_end'] = {};
                        if (now - o.start_time >= 0.04) {
                            o.end_time = now;
                        } else {
                            o.end_time = o.start_time * 1 + 0.04
                        }
                        // let speedR=o.speed&&o.speed.value?o.speed.value:1;
                        let speedR = o.speed ? (o.speed.value > 0 ? o.speed.value : -1 / o.speed.value) : 1;
                        o.special.end_range = Math.round((o.special.start_range * 1 + (o.end_time - o.start_time) * speedR) * 25) / 25;
                        // (o.special.end_range - o.special.start_range) / (temp.duration * 1);
                        // o.end_time = o.start_time + o.duration;
                        if (o.obj_type === 'text') {
                            temp.obj_id = +new Date() + 'text_' + o.obj_id.split('_')[1];
                        }
                        temp.start_time = o.end_time;
                        if (o.video_fade && o.video_fade.length) {
                            o.video_fade[o.video_fade.length - 1].time_point = o.end_time;
                            temp.video_fade[0].time_point = o.end_time;
                        }
                        temp.special.start_range = o.special.end_range;
                        // temp.duration = temp.duration - o.duration;
                        o.audio_fade = [
                            {
                                "time_point": o.special.start_range,  // 相对该视频时间点
                                "visibility": 100,  // 透明度
                                "fade_type": 0,  // 0-视频/图片/文本/背景，1-音频
                            },
                            {
                                "time_point": o.special.end_range,  // 相对该视频时间点
                                "visibility": 100,  // 透明度
                                "fade_type": 0,  // 0-视频/图片/文本/背景，1-音频
                            }
                        ];
                        temp.audio_fade = [
                            {
                                "time_point": temp.special.start_range,  // 相对该视频时间点
                                "visibility": 100,  // 透明度
                                "fade_type": 0,  // 0-视频/图片/文本/背景，1-音频
                            },
                            {
                                "time_point": temp.special.end_range,  // 相对该视频时间点
                                "visibility": 100,  // 透明度
                                "fade_type": 0,  // 0-视频/图片/文本/背景，1-音频
                            }
                        ];
                        list.splice(j + 1, 0, temp);
                    }
                    break;
                }
            }
        }
    }
    if (JSON.stringify(_config) !== JSON.stringify(_project_config[_config_key])) {
        _project_config.length = _config_key + 1;
        _project_config.push(_config);
        tempConfig = '';
        _config_key++;
        render();
    }
}

export function deletePath(k) {
    let _config = cloneConfig(_project_config[_config_key]);
    let len = _config.video_list.length;
    if (k < len) {
        _config.video_list.splice(k, 1)
    } else {
        _config.audio_list.splice(k - len, 1)
    }
    _project_config.length = _config_key + 1;
    _project_config.push(_config);
    tempConfig = '';
    _config_key++;
    render();

}

function maxTransDuration(_list, o, trans) {
    let other = 0;
    if (trans === 'start' && _list[o].trans_end && _list[o].trans_end.duration) {
        other = _list[o].trans_end.bind ? _list[o].trans_end.duration / 2 : _list[o].trans_end.duration;
    } else if (trans === 'end' && _list[o].trans_start && _list[o].trans_start.duration) {
        other = _list[o].trans_start.bind ? _list[o].trans_start.duration / 2 : _list[o].trans_start.duration;
    }
    let max = _list[o].end_time - _list[o].start_time - other;
    return _list[o]['trans_' + trans].bind ? max * 2 : max;
}

export function setTransDuration(k, o, trans, val) {
    let _config = cloneConfig(_project_config[_config_key]);
    let _list = [];
    let video_len = _config.video_list.length;
    if (k < video_len) {
        _list = _config.video_list[k].obj_list;
    } else {
        _list = _config.audio_list[k - video_len].obj_list;
    }
    let origin = _list[o]['trans_' + trans];
    if (origin) {
        let max = maxTransDuration(_list, o, trans);
        if (origin.bind) {
            if (trans === 'start') {
                let ma = maxTransDuration(_list, o - 1, 'end');
                max = ma > max ? max : ma;
                max = val > max ? max : val;
                _list[o - 1].trans_end.duration = Math.round(max * 100) / 100;
            } else {
                let ma = maxTransDuration(_list, o * 1 + 1, 'start');
                max = ma > max ? max : ma;
                max = val > max ? max : val;
                _list[o * 1 + 1].trans_start.duration = Math.round(max * 100) / 100;
            }

        }
        max = val > max ? max : val;
        origin.duration = Math.round(max * 100) / 100;
    }
    _project_config.length = _config_key + 1;
    _project_config.push(_config);
    tempConfig = '';
    _config_key++;
    let pathway = $('.tl-body .pathway-box').find('.pathway');
    pathway.eq(k).html(loadVideo(_list, k));
    _initConfig();

}

export function deleteUnit(dom, trans) {
    let _config = cloneConfig(_project_config[_config_key]);
    let k = dom.attr('data-layer') * 1, o = dom.attr('data-position') * 1 + 1;
    let _list = [];
    let video_len = _config.video_list.length;
    let audio_len = _config.audio_list.length;
    let ids = [];
    if (k < video_len) {
        _list = _config.video_list[k].obj_list;
    } else if (k < audio_len + video_len) {
        _list = _config.audio_list[k - video_len].obj_list;
    } else if (dom.hasClass('mater-subtitle')) {
        _list = _config.text_list[0].obj_list;
        let id = dom.attr('data-mediaId');
        ids.push(id);
        sub_del(ids);
        return;
    }

    if (trans === 'start' || trans === 'end') {
        _list[o]['trans_' + trans] = {};
    } else if (trans === 'shear') {
        let start = 0;
        if (o > 0) {
            start = _list[o - 1].end_time;
        }
        if (_list.length > o + 1) {
            let obj2 = _list[o + 1];
            let short = obj2.start_time - start;
            for (let i = o + 1; i < _list.length; i++) {
                _list[i].start_time = _list[i].start_time - short;
                _list[i].end_time = _list[i].end_time * 1 - short;
            }
        }
        _list.splice(o, 1)
    } else {
        _list.splice(o, 1)
    }
    _project_config.length = _config_key + 1;
    _project_config.push(_config);

    tempConfig = '';
    _config_key++;
    refreshMain(_config);
    let pathway = $('.tl-body .pathway-box').find('.pathway');
    pathway.eq(k).html(loadVideo(_list, k));
    _initConfig();
}

export function deleteUnits(x, shear) {
    let _config = cloneConfig(_project_config[_config_key]);
    let _list = [];
    let video_len = _config.video_list.length;
    let audio_len = _config.audio_list.length;
    let ids = [];
    for (let i = x.length - 1; i >= 0; i--) {
        let v = $(x[i]);
        let k = v.attr('data-layer') * 1, o = v.attr('data-position') * 1 + 1;
        if (k < video_len) {
            _list = _config.video_list[k].obj_list;
        } else if (k < audio_len + video_len) {
            _list = _config.audio_list[k - video_len].obj_list;
        } else if (v.hasClass('mater-subtitle')) {
            _list = _config.text_list[0].obj_list;
            let id = v.attr('data-mediaId');
            ids.push(id);
        }
        if (shear === 'shear') {
            let start = 0;
            if (o > 0) {
                start = _list[o - 1].end_time;
            }
            if (_list.length > o + 1) {
                let obj2 = _list[o + 1];
                let short = obj2.start_time - start;
                for (let i = o + 1; i < _list.length; i++) {
                    _list[i].start_time = _list[i].start_time - short;
                    _list[i].end_time = _list[i].end_time * 1 - short;
                }
            }
        }
        _list.splice(o, 1)
    }

    sub_del(ids);

    _project_config.length = _config_key + 1;
    _project_config.push(_config);
    tempConfig = '';
    _config_key++;
    render();
    // render_subtitle(get_list());
}

export function clearVideoList() {
    clearOnlineList();
}

export function render_subtitle(subs) {
    let config = _project_config[_config_key];
    if (subs) {
        config.text_list = [{
            obj_list: subs.list

        }];
        // let pathway=$('.tl-body .pathway-box').find('.pathway-sub');
        // pathway.eq(0).html(loadSubtitle(subs.list));
        render();
    }
}

export function refreshMain(config) {
    if (main_set) {
        let video_list = config.video_list[config.video_list.length - 1].obj_list;
        let time = 0;
        video_list.map((v, k) => {
            let duration = v.end_time - v.start_time;
            v.start_time = time;
            v.end_time = time = time + duration;
        });
    }
}

export function render() {
    let config = _project_config[_config_key];
    let _pathway = '', _ctrl = '', _text = '';
    let video_len = config.video_list.length;
    let text_list = get_list().list;
    if (text_list) {
        config.text_list = [{
            obj_list: text_list
        }];
    }
    refreshMain(config);
    config.video_list.forEach((v, i) => {
        _pathway += '<div class="pathway ' + (i === config.video_list.length - 1 ? 'main' : '') + '">' + loadVideo(v.obj_list, i, i === config.video_list.length - 1) + ' </div>';
        _ctrl += '<div class="ctrl ' + (i === config.video_list.length - 1 ? 'main no-sor' : '') + '" key="' + i + '">' +
            '<div>' +
            '<div>' +
            '<span class="ico-v ico iconfont icon-yingpiangui ' + (i === config.video_list.length - 1 ? '' : 'icon-tianjiashipin-dianji') + '" > </span>' +
            (i === config.video_list.length - 1 ? '<span class="ico-v ico-b ico iconfont icon-shanchu dis-n"> </span>' : '<span class="ico-v ico-b ico iconfont icon-shanchu" > </span>') +
            // '<span class="ico-v ico-b ico iconfont icon-shanchu"> </span>'+
            // ' <span class="name">' + v.name + '</span>' +
            '<span class="oneClickMute iconfont icon-guanbishengyin1" type="video_list" index="' + i + '" title="一键静音"> </span>' +
            '</div>' +
            '<div class="layer-actions">' +
            '<span class="layer-size"> </span>' +
            '<span class="layer-options"> </span>' +
            '</div>' +
            '</div>' +
            '<div> <div title="' + say('main', 'dragForVol') + '" type="video_list" index="' + i + '"  vol="' + v.volume + '"  class="vol-bar"></div>' +
            '</div>' +
            '</div>';
    });
    config.audio_list.forEach((v, i) => {
        _pathway += '<div class="pathway">' + loadVideo(v.obj_list, i + video_len) + ' </div>';
        _ctrl += '<div class="ctrl no-sor" key="' + (i + video_len) + '"><div><div>' +
            '<span class="ico-v ico iconfont icon-yinle"> </span>' +
            '<span class="ico-v ico-a ico iconfont icon-shanchu"> </span>' +
            '<span class="oneClickMute iconfont icon-guanbishengyin1" type="audio_list" index="' + i + '" title="一键静音"> </span>' +
            // ' <span class="name">' + v.name + '</span>' +
            '</div>' +
            '<div class="layer-actions"><span class="layer-size"> </span><span class="layer-options"> </span></div></div><div> <div title="' + say('main', 'dragForVol') + '" type="audio_list" index="' + i + '"  vol="' + v.volume + '" class="vol-bar"></div></div></div>';
    });
    config.text_list && config.text_list.forEach((v, i) => {
        _pathway += '<div class="pathway pathway-sub">' + loadSubtitle(
            v.obj_list) + ' </div>';
        _ctrl += '<div class="ctrl no-sor" key="' + (i + video_len) + '"><div><div>' +
            '<span class="ico-v ico iconfont icon-zimu-weidianji " style="margin-left: 4px"> </span>' +
            // ' <span class="name">' + v.name + '</span>' +
            '</div>' +
            '<div class="layer-actions"><span class="layer-size"> </span><span class="layer-options"> </span></div></div><div> <div><span class="c-p add-subtitle">添加字幕</span></div></div></div>';
    });
    $('.tl-body .pathway-ctrl').html($(_ctrl))
    $('.tl-body .pathway-box').html($(_pathway))
    _initConfig();
    $('.tl-body .pathway-ctrl').find('.icon-shanchu').each((k, v) => {
        $(v).attr('title', say('main', 'deletePath')).bind('click', () => {
            if (($(v).hasClass('ico-b') && $('.ico-b').length > 1) || $(v).hasClass('ico-a') && $('.ico-a').length > 1) {
                deletePath(k);
            } else if ($(v).hasClass('ico-a')) {
                message.info('至少保留一个音频轨道')
            } else if ($(v).hasClass('ico-b')) {
                message.info('至少保留一个视频轨道')
            }
        })
    });
    $('.tl-body .pathway-ctrl').find('.oneClickMute').each((k, v) => {
        $(v).bind('click', () => {
            changeVolume(v, 0)
        })
    });
    let zoomBar = $('.vol-bar');
    zoomBar.each((k, v) => {
        $(v).slider({
            range: "min",
            value: $(v).attr('vol'),
            min: 0,
            max: 100,
            step: 1,
            change: (event, ui) => {
                changeVolume(v, ui.value)
            }
        });
    });
    zoomBar.find('span').removeAttr('tabIndex');
}

function changeVolume(v, value) {
    let _config = cloneConfig(_project_config[_config_key]);
    let type = $(v).attr('type');
    let i = $(v).attr('index');
    _config[type][i].volume = value;
    _project_config.length = _config_key + 1;
    _project_config.push(_config);
    tempConfig = '';
    _config_key++;
    render();
}

export function changePath(o, t) {
    let _config = cloneConfig(_project_config[_config_key]);
    let s = _config.video_list.length - 1;
    if (o < s && t < s) {
        let item = cloneConfig(_config.video_list[o]);
        _config.video_list.splice(o, 1);
        _config.video_list.splice(t, 0, item);
    } else if (o >= s && t >= s) {
        let item = cloneConfig(_config.audio_list[o - s]);
        _config.audio_list.splice(o - s, 1);
        _config.audio_list.splice(t - s, 0, item);
    }
    _project_config.length = _config_key + 1;
    _project_config.push(_config);
    tempConfig = '';
    _config_key++;
    render();
}

// 添加轨道
export function addPath(type, name) {
    let _config = cloneConfig(_project_config[_config_key]);
    let v = type === 'video';
    let obj = v ? {
        "name": name,  // 名称
        "order": 1,  // 排序
        "volume": 100,
        "duration": 123,
        "lock_track": false,  // 是否锁定
        "obj_list": []
    } : {
            "name": name,
            "order": 1,
            "volume": 100,
            "lock_track": false,
            "obj_list": []
        };
    // v ? _config.video_list.unshift(obj) : _config.audio_list.push(obj);
    if (v) {
        _config.video_list.unshift(obj)
    } else {
        let i = 0;
        for (; i < _config.audio_list.length; i++) {
            if (_config.audio_list[i]['type'] === 'dubbing') {
                break;
            }
        }
        _config.audio_list.splice(i, 0, obj);
    }
    _project_config.length = _config_key + 1;
    _project_config.push(_config);
    tempConfig = '';
    _config_key++;
    render();
}

export function initConfig(func) {

    _initConfig = (solo) => {
        refreshDuration();
        func(solo);
    };
    initInterview();
}

export let duration_list = {
    subtitle: 0
};

export function refreshDuration(name, duration) {
    if (name) {
        duration_list[name] = duration || 0;
    }
    let config = _project_config[_config_key];
    let end = 0;
    let list = config.audio_list.concat(config.video_list);
    list.map((v, k) => {
        let len = v.obj_list.length;
        if (len)
            end = end > v.obj_list[len - 1].end_time ? end : v.obj_list[len - 1].end_time;
    });
    for (let i in duration_list) {
        end = end > duration_list[i] ? end : duration_list[i];
    }

    config.duration = end;
    setSection(0, end);
}

export function next() {
    if (_config_key < _project_config.length - 1) {
        _config_key++;
        render_subtitle(get_list());
    }
}

export function pre() {
    if (_config_key > 0) {
        _config_key--;
        render_subtitle(get_list());
    }
}

export function clear() {
    _config_key = 0;
    _project_config = [cloneConfig(project_config)];
    tempConfig = '';
    tempObj = '';
    tempLayer = 0;
    clearOnlineList();
    temp_list = {};
    section_s = 0;
    section_e = 0;
    pre_config = JSON.stringify(cloneConfig(project_config));
    div = document.createElement('div');
}

export function getConfig(temp) {
    let _config = temp === 'temp' ? tempConfig ? tempConfig : _project_config[_config_key] : temp === 'clone' ? cloneConfig(_project_config[_config_key]) : _project_config[_config_key];

    try {
    } catch (e) {

    }
    return _config;

}

export function getVideoList() {
    return video_list;
}

export function getTempList() {
    return temp_list;
}

export function getStatus() {
    let s = {
        pre: _config_key > 0,
        next: _config_key < _project_config.length - 1,
        name: _project_config[_config_key].name,
        issue: _project_config[_config_key].duration >= 1,
        save: !getPreConfig()
    };
    return s;

}

function pure(config) {
    // config.video_list.map((v,k)=>{
    //     v.obj_list.map((v,k)=>{
    //         if(v.speed&&v.speed.value&&v.speed.value<=0){
    //             v.speed.value=(-1/v.speed.value).toFixed(2)*1;
    //         }
    //     })
    // });
    return config;
}

export function setConfig(config) {
    let _config = pure(config);
    _config['text_info'] = _config['text_info'] || {
        "font_size": 50,
        "status": true,
        "font_color": 'ffffff',
        "font_name": 'FZShuSong-Z01S',
        "background_color": '000000',
        "alpha": 0,
        "position_x": 'middle',  // 水平位置，left, middle, right
        "position_y": 50,  // 底部间距，px
    };
    _project_config = [_config];
    _config_key = 0;
    setPreConfig();
}

export function setConfigList(config) {
    _project_config = config;
    _config_key = config.length - 1;
    setPreConfig();
    render();
}

export function loadMedia(u) {
    if (u.obj_type === 'text') {
        if (u.special.sub_type === 'animation') {
            // if(u.special.media_url){
            u.obj_type = 'video';
            console.info(u)
            u.special.media_url = u.special.preview_mp4;
            // u.special.media_url=get_data((localStorage.setpath||'')+'/dataBase/animation_preview/'+u.obj_id+'.mp4');
            // }
            // switch (u.obj_id){
            //     case 'text_7':u.obj_type='video';u.special.media_url=text_10;break;
            //     case 'text_8':u.obj_type='video';u.special.media_url=text_12;break;
            //     case 'text_9':u.obj_type='video';u.special.media_url=text_13;break;
            // }
        } else {
            switch (u.obj_id) {
                case 'text_1': u.obj_type = 'image'; u.special.media_url = text_1; break;
                case 'text_2': u.obj_type = 'image'; u.special.media_url = text_2; break;
                case 'text_3': u.obj_type = 'image'; u.special.media_url = text_3; break;
                case 'text_4': u.obj_type = 'image'; u.special.media_url = text_4; break;
                case 'text_5': u.obj_type = 'video'; u.special.media_url = text_5; break;
                case 'text_6': u.obj_type = 'video'; u.special.media_url = text_6; break;
            }
        }
    }
    if (u.obj_type === 'transition') {
        u.obj_type = 'video'
        /*  switch (u.special.trans_type) {
             case 'crossfade': u.obj_type = 'video'; u.special.media_url = crossfade; break;
             case 'crossblur': u.obj_type = 'video'; u.special.media_url = crossblur; break;
             case 'fadeblack': u.obj_type = 'video'; u.special.media_url = fadeblack; break;
             case 'fadewhite': u.obj_type = 'video'; u.special.media_url = fadewhite; break;
             case 'rightslide': u.obj_type = 'video'; u.special.media_url = rightslide; break;
             case 'leftslide': u.obj_type = 'video'; u.special.media_url = leftslide; break;
         } */
    }
    loadTheMedia(u, '');
    let isGif = u.special.media_url && u.special.media_url.toLocaleLowerCase().indexOf('.gif') !== -1;
    let result = [video_list[u.obj_id + '_'], u.obj_type, u.obj_id, u.special.audio_preview_img, isGif];
    // if(u.sub_type==='animation'&&video_list[u.obj_id+'_']['lottie']){
    //     result=[video_list[u.obj_id+'_'],u.obj_type,u.obj_id,u.special.audio_preview_img,isGif];
    // }
    return result || '';
}

function loadSubtitle(list) {
    let array = '';
    let layer = _project_config[_config_key].video_list.length + _project_config[_config_key].audio_list.length;
    list.forEach((u, i) => {
        array += '<div data-duration="' + (u.duration || 5) +
            '" data-mediaId="' + u.text_id +
            '" data-textId="' + u.text_id +
            '" data-mediaType="' + 'subtitle' +
            '" data-language="' + u.language +
            '" data-mediaUrl="' + '' +
            '" data-name="' + (u.text ? u.text : '') +
            '" data-text="' + (u.text ? u.text : '') +
            '" data-thumbnail="' + '' +
            '" data-layer="' + layer +
            '" data-startTime="' + (u.start_time ? u.start_time.toFixed(2) * 1 : 0) +
            '" data-startRange="' + (u.start_time ? u.start_time.toFixed(2) * 1 : 0) +
            '" data-endTime="' + (u.end_time ? u.end_time.toFixed(2) * 1 : 0) +
            '" data-endRange="' + (u.end_time ? u.end_time.toFixed(2) * 1 : 0) +
            '" data-position="' + (i - 1) +
            '" class="mater-helper mater-subtitle new ' + (u.obj_type === 'transition' ? 'tran ' : '') + (u.current || '') + '">' +
            (u.sub_type === 'animation' ? '' : '<div class="trim trimL' +
                '">' +
                '</div>' +
                '<div class="trim trimR' +
                '">' +
                '</div>') +
            '<div class="clip-item-thumbs sub">' +
            '<div class="name"' +
            '>' + u.text + ' </div>' +
            ' </div>' +
            '</div>';
        u.current = '';
    });
    return array;
}

function loadVideo(list, layer) {
    let main = _project_config[_config_key].video_list.length - 1 === layer;
    let array = '';
    list.forEach((u, i) => {
        if (u.trans_start && u.trans_start.bind) {
            if (!(i > 0 && list[i - 1].end_time === u.start_time && list[i - 1].trans_end && list[i - 1].trans_end.bind)) {
                u.trans_start = {};
            }
        }
        if (u.trans_end && u.trans_end.bind) {
            if (!(i < list.length - 1 && list[i + 1].start_time === u.end_time && list[i + 1].trans_start && list[i + 1].trans_start.bind)) {
                u.trans_end = {};
            }
        }
        loadTheMedia(u, layer);
        array += '<div data-duration="' + (u.duration || 5) +
            '" data-mediaId="' + u.obj_id +
            '" data-mediaType="' + u.obj_type +
            '" data-mediaUrl="' + (u.special ? u.special.media_url : '') +
            '" data-videoPreviewImg="' + (u.special ? u.special.video_preview_img : '') +
            '" data-audioPreviewImg="' + (u.special ? u.special.audio_preview_img : '') +
            '" data-previewHls="' + (u.special ? u.special.preview_hls : '') +
            '" data-previewMp4="' + (u.special ? u.special.preview_mp4 : '') +
            '" data-previewMp3="' + (u.special ? u.special.preview_mp3 : '') +
            '" data-name="' + (u.name ? u.name : '') +
            '" data-buffer="' + (u.special ? (u.special.buffer || u.special.buffer === 0 ? u.special.buffer : '') : '') +
            // '" data-uploading="' + (u.special?u.special.uploading:'') +
            '" data-thumbnail="' + (u.special ? u.special.thumbnail : '') +
            '" data-uploading="' + (u.special ? (u.special.uploading ? u.special.uploading : '') : '') +
            '" data-transType="' + (u.special ? u.special.trans_type : '') +
            '" data-subType="' + (u.special ? u.special.sub_type : '') +
            '" data-startTime="' + (u.start_time ? u.start_time.toFixed(2) * 1 : 0) +
            '" data-endTime="' + (u.end_time ? u.end_time.toFixed(2) * 1 : 0) +
            '" data-startRange="' + (u.special ? u.special.start_range ? u.special.start_range.toFixed(2) * 1 : 0 : '') +
            '" data-endRange="' + (u.special ? u.special.end_range ? u.special.end_range.toFixed(2) * 1 : u.duration : '') +
            '" data-layer="' + layer +
            '" data-position="' + (i - 1) +
            '" class="mater-helper new ' + (u.obj_type === 'transition' ? 'tran ' : '') + (main ? ' mater-main ' : '') + (u.current || '') + '">' +
            (u.trans_start && u.trans_start.trans_type ? '<div class="trans trans-start' +
                '" data-bind="' + u.trans_start.bind +
                '" data-transType="' + u.trans_start.trans_type +
                '" data-thumbnail="' + u.trans_start.thumbnail +
                '" data-transName="' + u.trans_start.name +
                '" data-duration="' + u.trans_start.duration +
                '">' +
                '</div>' : '') +
            (u.special.sub_type === 'animation' ? '' : '<div class="trim trimL' +
                '">' +
                '</div>' +
                '<div class="trim trimR' +
                '">' +
                '</div>') +
            (u.trans_end && u.trans_end.trans_type ? '<div class="trans trans-end' +
                '" data-bind="' + u.trans_end.bind +
                '" data-transType="' + u.trans_end.trans_type +
                '" data-thumbnail="' + u.trans_end.thumbnail +
                '" data-transName="' + u.trans_end.name +
                '" data-duration="' + u.trans_end.duration +
                '">' +
                '</div>' : '') +
            '<div class="clip-item-thumbs">' +
            '<div class="name"' +
            '> </div>' +
            ' </div>' +
            '</div>';
        u.current = '';
    });
    return array;
}

export function setTranslateSubtitle(media) {
    let _config = cloneConfig(_project_config[_config_key]);
    _project_config.length = _config_key + 1;
    _project_config.push(_config);
    tempConfig = '';
    _config_key++;
    if (media.media_id) {
        let initObj = {
            "name": '主题音乐',
            "order": 1,
            "volume": 100,
            "type": 'dubbing',
            "lock_track": false,
            "obj_list": []
        };
        if (_config.audio_list && JSON.stringify(_config.audio_list).indexOf('dubbing') === -1) {
            _config.audio_list.push(initObj);
        }
        _config.audio_list && _config.audio_list.map((v, k) => {
            if (v['type'] === 'dubbing') {
                _config.audio_list.splice(k, 1, obj);
                refreshDuration();
                let obj = initBgm(_config, media, k, 'dubbing');
                _config.audio_list.splice(k, 1, obj);
            }
        });
    } else {
        _config.audio_list && _config.audio_list.map((v, k) => {
            if (v['type'] === 'dubbing') {
                _config.audio_list.splice(k, 1);
                refreshDuration();
            }
        });
    }
    render();
}

// 文字转语音(替换音频轨道)
/*export function setTranslateAudio(media,start) {
    let _config = cloneConfig(_project_config[_config_key]);
    _project_config.length = _config_key + 1;
    _project_config.push(_config);
    tempConfig = '';
    _config_key++;
    if(media.media_id){
        let initObj = {
            "name": '主题音乐',
            "order": 1,
            "volume": 100,
            "type":'dubbing',
            "lock_track": false,
            "obj_list": []
        };
        if(_config.audio_list&&JSON.stringify(_config.audio_list).indexOf('dubbing') === -1){
            _config.audio_list.push(initObj);
        }
        _config.audio_list&&_config.audio_list.map((v,k)=>{
            if(v['type']==='dubbing'){
                _config.audio_list.splice(k,1,initObj);
                refreshDuration();
                let obj=initTransAudio(_config,media,k,'dubbing',start);
                _config.audio_list.splice(k,1,obj);
            }
        });
    }else{
        _config.audio_list&&_config.audio_list.map((v,k)=>{
            if(v['type']==='dubbing'){
                _config.audio_list.splice(k,1);
                refreshDuration();
            }
        });
    }
    render();
}*/
// 文字转语音()
export function setTranslateAudio(media, start) {
    let _config = cloneConfig(_project_config[_config_key]);
    _project_config.length = _config_key + 1;
    _project_config.push(_config);
    tempConfig = '';
    _config_key++;
    if (media.media_id) {
        let obj = initTransAudio(_config, media, _config.audio_list.length - 1, 'dubbing', start);
        _config.audio_list.push(obj);
    }
    render();
}

// 修改文字转语音配置
function initTransAudio(_config, bgm, k, pathname, start) {
    let obj = {
        "name": 'transAudio',
        "order": 1,
        "volume": 100,
        "type": pathname || 'themeBgm',
        "lock_track": false,
        "obj_list": []
    };
    let u = bgm;
    let duration = (u.duration ? Math.round(u.duration * 25) / 25 : 5);
    u['start_time'] = start || 0;
    u['end_time'] = u['start_time'] + duration;
    u['duration'] = duration;
    u['start_range'] = 0;
    u['end_range'] = duration;
    u['layer'] = k + _config.video_list.length;
    u['position'] = -1;
    u['uploading'] = ((u.media_url && u.media_url.toLocaleLowerCase().indexOf('.mp3') > 0) ? 'can' : 'cannot');
    let _u = cloneConfig(u);
    let piece = add_unit(_u);
    obj.obj_list.push(piece);
    return obj;
}

// 初始化背景音乐配置
function initBgm(_config, bgm, k, pathname, start) {
    let obj = {
        "name": '主题音乐',
        "order": 1,
        "volume": 100,
        "type": pathname || 'themeBgm',
        "lock_track": false,
        "obj_list": []
    };
    let u = bgm;
    let duration = (u.duration ? Math.round(u.duration * 25) / 25 : 5);
    u['start_time'] = start || 0;
    u['end_time'] = u['start_time'] + duration;
    u['duration'] = duration;
    u['start_range'] = 0;
    u['end_range'] = duration;
    u['layer'] = k + _config.video_list.length;
    u['position'] = -1;
    u['uploading'] = ((u.media_url && u.media_url.toLocaleLowerCase().indexOf('.mp3') > 0) ? 'can' : 'cannot');
    let lang = _config.duration % u.duration || u.duration;
    let len = Math.ceil(_config.duration / u.duration) - 1;
    if (pathname) {
        lang = u.duration;
        len = 0;
    }
    for (let i = 0; i < len; i++) {
        let _u = cloneConfig(u);
        _u['start_time'] = u.duration * i;
        _u['end_time'] = _u['start_time'] + duration;
        _u['position'] = i - 1;
        let piece = add_unit(_u, u.duration * i, u.duration * (i + 1));
        obj.obj_list.push(piece)
    }
    let _u = cloneConfig(u);
    _u['start_time'] = u.duration * len;
    _u['end_time'] = _u['start_time'] + lang;
    _u['position'] = len - 1;
    _u.end_range = lang;
    let piece = add_unit(_u, u.duration * len, u.duration * len + lang);
    obj.obj_list.push(piece);
    return obj;
}

export function setTheme(theme) {
    let _config = cloneConfig(_project_config[_config_key]);
    _config['theme_id'] = theme.theme_id;
    _project_config.length = _config_key + 1;
    _project_config.push(_config);
    tempConfig = '';
    _config_key++;
    // if(theme.bgm&&theme.bgm.media_id){
    //     let theme_bgm=true;
    //     _config.audio_list&&_config.audio_list.map((v,k)=>{
    //         if(v['type']==='themeBgm'){
    //             theme_bgm=false;
    //             _config.audio_list.splice(k,1,{
    //                 "name": '主题音乐',
    //                 "order": 1,
    //                 "volume": 100,
    //                 "type":'themeBgm',
    //                 "lock_track": false,
    //                 "obj_list": []
    //             });
    //             refreshDuration();
    //             let obj=initBgm(_config,theme.bgm,k);
    //             _config.audio_list.splice(k,1,obj);
    //         }
    //     });
    //     if(theme_bgm){
    //         let obj=initBgm(_config,theme.bgm,_config.audio_list.length);
    //         _config.audio_list.push(obj);
    //     }
    // }else{
    //     _config.audio_list&&_config.audio_list.map((v,k)=>{
    //         if(v['type']==='themeBgm'){
    //             _config.audio_list.splice(k,1);
    //             refreshDuration();
    //         }
    //     });
    // }
    // if(theme.transition&&theme.transition!=='none'){
    //         let trans_list=[
    //         // {
    //         //     name:'无',
    //         //         trans_type:'none',
    //         // },
    //         // {
    //         //     name:'智能过渡',
    //         //         trans_type:'random',
    //         // },
    //         {
    //             name:'交叉模糊',
    //                 trans_type:'crossblur',
    //         },
    //         {
    //             name:'淡入淡出',
    //                 trans_type:'crossfade',
    //         },
    //         {
    //             name:'淡出白色',
    //                 trans_type:'fadewhite',
    //         },
    //         {
    //             name:'淡出黑色',
    //                 trans_type:'fadeblack',
    //         },
    //         {
    //             name:'左侧滑入',
    //                 trans_type:'leftslide',
    //         },
    //         {
    //             name:'右侧滑入',
    //                 trans_type:'rightslide',
    //         },
    //         ];
    //         trans_list.map((v1,k)=>{
    //             if(v1.trans_type===theme.transition){
    //                 let list=_config.video_list;
    //                 list.map((v2,k)=>{
    //                     let endTime=-1;
    //                     v2.obj_list.map((v3,k)=>{
    //                         /*
    //                         *替换所有转场*/
    //                         let duration=v3.end_time-v3.start_time;
    //                         let bind=v3.start_time===endTime;
    //                         let trans={
    //                             bind:bind,
    //                             name:v1.name,
    //                             trans_type:v1.trans_type,
    //                             thumbnail:'',
    //                             duration:Math.min(1,duration)
    //                         };
    //                         v3.trans_start=trans;
    //                         endTime=v3.end_time;
    //                         let bindE=v2.obj_list.length>k+1&&v2.obj_list[k+1].start_time===endTime;
    //                         let transE={
    //                             bind:bindE,
    //                             name:v1.name,
    //                             trans_type:v1.trans_type,
    //                             thumbnail:'',
    //                             duration:Math.min(1,duration)
    //                         };
    //                         v3.trans_end=transE;
    //                         /*****************/
    //
    //
    //                         /*
    //                         * 只替换既有转场*/
    //                         // if(v3.trans_end&&v3.trans_end.trans_type){
    //                         //     v3.trans_end['name']=v1.name;
    //                         //     v3.trans_end['trans_type']=v1.trans_type;
    //                         // }
    //                         // if(v3.trans_start&&v3.trans_start.trans_type){
    //                         //     v3.trans_start['name']=v1.name;
    //                         //     v3.trans_start['trans_type']=v1.trans_type;
    //                         // }
    //                         /*****************/
    //                         if(k===0) {
    //                             v3.trans_start = {}
    //                         }
    //                         if(k===v2.obj_list.length-1){
    //                             v3.trans_end={}
    //                         }
    //                     })
    //                 });
    //             }
    //         });
    //     if(theme.transition==='random'){
    //         let list=_config.video_list;
    //         list.map((v2,k)=>{
    //             let v1=trans_list[Math.round(Math.random()*5)];
    //             let endTime=-1;
    //             v2.obj_list.map((v3,k)=>{
    //                 /*
    //                 *替换所有转场*/
    //                 let duration=v3.end_time-v3.start_time;
    //                 let bind=v3.start_time===endTime;
    //                 let trans={
    //                     bind:bind,
    //                     name:v1.name,
    //                     trans_type:v1.trans_type,
    //                     thumbnail:'',
    //                     duration:Math.min(1,duration)
    //                 };
    //                 v3.trans_start=trans;
    //                 endTime=v3.end_time;
    //                 v1=trans_list[Math.round(Math.random()*5)];
    //                 let bindE=v2.obj_list.length>k+1&&v2.obj_list[k+1].start_time===endTime;
    //                 let transE={
    //                     bind:bindE,
    //                     name:v1.name,
    //                     trans_type:v1.trans_type,
    //                     thumbnail:'',
    //                     duration:Math.min(1,duration)
    //                 };
    //                 v3.trans_end=transE;
    //                 /*****************/
    //
    //
    //                 // if(v3.trans_start&&v3.trans_start.trans_type){
    //                 //     v3.trans_start['name']=v1.name;
    //                 //     v3.trans_start['trans_type']=v1.trans_type;
    //                 // }
    //                 // v1=trans_list[Math.round(Math.random()*5)];
    //                 // if(v3.trans_end&&v3.trans_end.trans_type){
    //                 //     v3.trans_end['name']=v1.name;
    //                 //     v3.trans_end['trans_type']=v1.trans_type;
    //                 // }
    //                 if(k===0) {
    //                     v3.trans_start = {}
    //                 }
    //                 if(k===v2.obj_list.length-1){
    //                     v3.trans_end={}
    //                 }
    //             })
    //         });
    //     }
    // }else{
    //     let list=_config.video_list;
    //     list.map((v2,k)=>{
    //         v2.obj_list.map((v3,k)=>{
    //             v3.trans_start={};
    //             v3.trans_end={};
    //             /*****************/
    //             /*
    //             * 只替换既有转场*/
    //             // if(v3.trans_end&&v3.trans_end.trans_type){
    //             //     v3.trans_end['name']=v1.name;
    //             //     v3.trans_end['trans_type']=v1.trans_type;
    //             // }
    //             // if(v3.trans_start&&v3.trans_start.trans_type){
    //             //     v3.trans_start['name']=v1.name;
    //             //     v3.trans_start['trans_type']=v1.trans_type;
    //             // }
    //             /*****************/
    //         })
    //     });
    // }
    if (theme.none) {
        _config['theme_id'] = '';

    }
    render();

}

export default configs;
