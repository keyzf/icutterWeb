/* 轨道操作 渲染轨道上素材 */
import $ from 'jquery';
import channel from '@/channel';
import {  unit_unLoad as unLoad, unit_initList as initList, unit_callback, set_audio_preview_list, audio_preview_list } from "./unitInfo";
import { getVideoList } from './online-configs'
import waveform from '@/images/waveform.svg';

let unit_length = 10;
let unit_time = 10;
let paddingLength = 4;
unit_callback((re) => {
    re.map((v, k) => {
        let o = unLoad[v.media_id];
        if (v['status'] === 2 || v['status'] === 5) {
            initList[v.media_id] = {};
            delete unLoad[v.media_id];
        }
        if (v['status'] === 1) {
            initList[v.media_id] = {
                videoPreviewImg: v['video_preview_img'] || '',
                audioPreviewImg: v['audio_preview_img'] || '',
            };
            o && o.map((v, k) => {
                unit(v);
            });
            delete unLoad[v.media_id];
        }
    })
});
const unit = (o, _unit_length, _unit_time, status) => {

    unit_length = _unit_length || unit_length;
    unit_time = _unit_time || unit_time;

    //获取基本信息
    let duration = o.attr('data-duration'); // 时长
    let mediaType = o.attr('data-mediaType'); // 用户自己上传的视频素材
    let mediaId = o.attr('data-mediaId');// 视频ID
    let mediaUrl = o.attr('data-mediaUrl');
    let videoPreviewImg = o.attr('data-videoPreviewImg') || '';
    let audioPreviewImg = o.attr('data-audioPreviewImg') || '';
    let isGif = o.attr('data-mediaUrl') && o.attr('data-mediaUrl').toLowerCase().indexOf('.gif') !== -1;
    let uploading = o.attr('data-uploading');
    let name = o.attr('data-name');
    let subType = o.attr('data-subType');
    let thumbnail = o.attr('data-thumbnail');// 视频封面图
    let startTime = o.attr('data-startTime'); // 在轨道上开始位置（时间）
    let endTime = o.attr('data-endTime'); // 在轨道上结束位置
    let startRange = o.attr('data-startRange');// 截取视频开始时间
    let endRange = o.attr('data-endRange');// 截取视频结束时间
    let layer = o.attr('data-layer');// 截取视频结束时间
    // let backImg='url('+(mediaType==='video'?thumbnail:mediaUrl)+')';
    let main = o.hasClass('mater-main');

    if ((mediaType === 'video' && !videoPreviewImg) || (mediaType === 'audio' && !audioPreviewImg)) {
        if (initList[mediaId]) {
            videoPreviewImg = initList[mediaId].videoPreviewImg || '';
            audioPreviewImg = initList[mediaId].audioPreviewImg || '';
        } else {
            unLoad[mediaId] = unLoad[mediaId] || [];
            unLoad[mediaId].push(o);
        }
    }
    let _video_list = getVideoList();
    //判断类型取得背景图url
    let backImg = 'url(' + (mediaType === 'video' ? videoPreviewImg : mediaType === 'audio' ? audioPreviewImg : thumbnail) + ')';
    if (mediaType === 'image' && !thumbnail) {
        backImg = 'url(' + mediaUrl + ')';
    }
    //无持续时间则默认为5秒
    if (mediaType === 'text') {
        if (_video_list[mediaId + '_' + layer]) {
            if (subType === 'animation') {
                backImg = 'url(' + thumbnail + ')';
            } else {
                //     let canvas = document.createElement('canvas');
                //     let ctx = canvas.getContext('2d');
                //     canvas.width=90/_video_list[mediaId + '_' + layer].height*_video_list[mediaId + '_' + layer].width;
                //     canvas.height=90;
                //     ctx.drawImage( _video_list[mediaId + '_' + layer],0,0,canvas.width,canvas.height);
                //     backImg = 'url(' + canvas.toDataURL('image/png')+ ')';
                backImg = 'url(' + _video_list[mediaId + '_' + layer].src + ')';
                (!_video_list[mediaId + '_' + layer].complete) && (_video_list[mediaId + '_' + layer].onload = () => {
                    // canvas.width=90/_video_list[mediaId + '_' + layer].height*_video_list[mediaId + '_' + layer].width;
                    // canvas.height=90;
                    // ctx.drawImage( _video_list[mediaId + '_' + layer],0,0,canvas.width,canvas.height);
                    // let backImg = 'url(' + canvas.toDataURL('image/png')+ ')';
                    // o.find('.clip-item-thumbs').css({'backgroundImage':backImg,'backgroundSize':'auto 100%'})
                    unit(o, unit_length, unit_time, status)
                })
            }
        }
    }
    // let duration_time = endRange?endRange-startRange:5;
    let duration_time = endTime ? endTime - startTime : 5;
    // duration_time = mediaType === 'image'?5:duration_time;
    let rangeWidth = duration_time * unit_length / unit_time - paddingLength;
    if (status !== 'canvas') {
        //取得背景图个数
        let num = Math.ceil(duration_time * unit_length / unit_time / (main ? 90 : 63));
        //背景图和背景定位
        let bgImg = [], bgPos = [];
        //约定300秒内视频2秒一张，超过则均匀取150（实则152）张，取得每张间隔时间
        let unit_weight = duration <= 300 ? 2 : duration / 150;
        let up = Math.round(startRange / duration * num);
        let i = 0;
        let repeat_lock = mediaType === 'image' || mediaType === 'text';
        for (i; i <= num; i++) {
            bgImg.push(backImg);
            bgPos.push((main ? 90 : 63) * i + 'px ' + (-(main ? 50 : 35)) * Math.floor(((main ? 90 : 63) * i * unit_time / unit_length / duration_time * (endRange - startRange) + startRange * 1) / unit_weight) * (repeat_lock ? 0 : 1) + 'px')
        }
        let css = {
            width: duration_time * unit_length / unit_time - paddingLength + 'px',
            backgroundImage: bgImg.join(),
            // backgroundColor:(mediaType==='text'||mediaType==='audio')?'#000':'black',
            backgroundSize: repeat_lock ? ((main ? 90 : 63) + 'px ' + (main ? 50 : 35) + 'px') : ((main ? 90 : 63) + 'px auto'),
            // backgroundSize:'90px 50px',
            backgroundRepeat: isGif ? 'repeat' : 'no-repeat',
            backgroundPosition: bgPos.join()
        };
        // if(uploading){
        //      backImg = 'url(' + thumbnail + ')';
        // }
        // if(mediaType === 'image'|| mediaType === 'text' ){
        // // if(mediaType === 'image'|| mediaType === 'text' ){
        //     css = {
        //         width: duration_time*unit_length/unit_time-10 + 'px',
        //         backgroundImage: backImg,
        //         backgroundColor:'#555',
        //         backgroundRepeat:'repeat'
        //     };
        // }
        // (mediaType !== 'video') ? css['backgroundSize'] = 'auto 100%' : '';
        if (backImg === 'url()') {
            backImg = 'url(' + (mediaType === 'audio' ? waveform : thumbnail) + ')';
            css = {
                width: duration_time * unit_length / unit_time - paddingLength + 'px',
                backgroundImage: backImg,
                // backgroundColor:'#000',
                backgroundSize: (main ? 90 : 63) + 'px ' + (main ? 50 : 35) + 'px',
                backgroundRepeat: 'repeat'
            };
            // css['backgroundSize'] = 'auto 100%';
        }
        let video_obj = _video_list[mediaId + '_' + layer];
        if (mediaType === 'video' && !thumbnail && video_obj) {
            if (video_obj.thumbnail) {
                backImg = 'url(' + _video_list[mediaId + '_' + layer].thumbnail + ')';
                css = {
                    width: duration_time * unit_length / unit_time - paddingLength + 'px',
                    backgroundImage: backImg,
                    // backgroundColor:'#000',
                    backgroundSize: (main ? 90 : 63) + 'px ' + (main ? 50 : 35) + 'px',
                    backgroundRepeat: 'repeat'
                };
                // css['backgroundSize'] = 'auto 100%';
            } else {
                setTimeout(() => {
                    unit(o, unit_length, unit_time, status)
                }, 200)
            }
        }
        o.css({ width: duration_time * unit_length / unit_time + 'px' });
        o.css({ left: startTime * unit_length / unit_time + 'px' });
        o.find('.clip-item-thumbs').css(css);
        let trans_start = o.find('.trans-start');
        let trans_end = o.find('.trans-end');
        if (trans_start.length) {
            let bind = trans_start.attr('data-bind'); //
            // let transType = trans_start.attr('data-transType'); //
            // let thumbnail = trans_start.attr('data-thumbnail');//
            let duration = trans_start.attr('data-duration');
            let transName = trans_start.attr('data-transName');
            // trans_start.css({width:duration*unit_length/unit_time + 'px',left:0,
            //     background: 'url('+thumbnail+') 50% 50% no-repeat',
            //     backgroundColor:'#fff',
            //     backgroundSize:'20px 20px'
            // });
            if (bind === 'false' || !bind) {
                trans_start.css({
                    width: duration * unit_length / unit_time + 'px', left: 0,
                    // background: 'url('+thumbnail+') 50% 50% no-repeat',
                    backgroundColor: '#61bca7',
                    backgroundSize: '20px 20px'
                });
                trans_start.html(transName)
            }
        }
        if (trans_end.length) {
            let bind = trans_end.attr('data-bind'); //
            // let transType = trans_end.attr('data-transType'); //
            // let thumbnail = trans_end.attr('data-thumbnail');//
            let duration = trans_end.attr('data-duration');
            let transName = trans_end.attr('data-transName');
            trans_end.css({
                width: duration * unit_length / unit_time + 'px', right: 0,
                // background: 'url('+thumbnail+') 50% 50% no-repeat',
                backgroundColor: '#61bca7',
                backgroundSize: '20px 20px'
            });
            if (bind && bind !== 'false') {
                trans_end.css({ right: -duration * unit_length / unit_time / 2 - 1 + 'px' })
            }
            trans_end.html(transName)
        }
    }
    let theMain = o.parents('.pathway').hasClass('main') || o.parents('.drag-layer').hasClass('main');
    if (mediaType === 'audio' || theMain) {
        let dote = main ? 10 : 15;
        let polarization = main ? 10 : 18;
        polarization = dote = 16;
        let re = audio_preview_list[mediaId];
        // 绘制音频波形图
        if (re) {
            let canvas = o.find('canvas').length ? o.find('canvas')[0] : document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            $(canvas).css({ width: rangeWidth + 'px', height: '100%' });
            if (theMain) {
                $(canvas).css({ width: rangeWidth + 'px', height: (main ? '16px' : '31px'), marginTop: (main ? '50px' : '35px') });
            }
            let sE = endRange * unit_length / unit_time - 2;
            let sR = parseInt(startRange * unit_length / unit_time);
            let s = re.left.length / (duration * unit_length / unit_time);
            canvas.width = rangeWidth;
            canvas.height = 35;
            ctx.font = "12px Arial";
            ctx.strokeStyle = '#fff';
            ctx.beginPath();
            for (let i = 0; i <= rangeWidth; i++) {
                let l = Math.floor((i + sR) * s);
                ctx.lineWidth = 1;
                ctx.strokeStyle = '#fff';
                let _l = re.left[l] || 0.01;
                let _r = re.right[l] || 0.01;
                ctx.moveTo(i, dote - _l * polarization);
                ctx.lineTo(i, dote + 1);
                ctx.moveTo(i, dote - _r * polarization);
                ctx.lineTo(i, dote + 1);
                // ctx.moveTo(i, dote-_l*polarization);
                // ctx.lineTo(i, dote+1+_r*polarization);
                // ctx.moveTo(i, dote-_l);
                // ctx.lineTo(i, dote+1+_r);
            }
            ctx.stroke(); // 进行绘制
            o.find('canvas').length === 0 ? o.find('.clip-item-thumbs').append($(canvas)) : '';
        } else if (audioPreviewImg && audioPreviewImg !== 'undefined') {
           // 绘制视频波形图
            channel(audioPreviewImg, {}, (re) => {
                set_audio_preview_list(re, mediaId);
                let canvas = o.find('canvas').length ? o.find('canvas')[0] : document.createElement('canvas');
                let ctx = canvas.getContext('2d');
                $(canvas).css({ width: rangeWidth + 'px', height: '100%' });
                if (theMain) {
                    $(canvas).css({ width: rangeWidth + 'px', height: (main ? '16px' : '31px'), marginTop: (main ? '50px' : '35px') });
                }
                let sE = endRange * unit_length / unit_time - 2;
                let sR = parseInt(startRange * unit_length / unit_time);
                let s = re.left.length / (duration * unit_length / unit_time);
                canvas.width = rangeWidth;
                canvas.height = 35;
                ctx.font = "12px Arial";
                ctx.strokeStyle = '#fff';
                ctx.beginPath();
                for (let i = 0; i <= rangeWidth; i++) {
                    let l = Math.floor((i + sR) * s);
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = '#fff';
                    let _l = re.left[l] || 0.01;
                    let _r = re.right[l] || 0.01;
                    ctx.moveTo(i, dote - _l * polarization);
                    ctx.lineTo(i, dote + 1);
                    ctx.moveTo(i, dote - _r * polarization);
                    ctx.lineTo(i, dote + 1);
                    // ctx.moveTo(i, dote-_l*polarization);
                    // ctx.lineTo(i, dote+1+_r*polarization);
                    // ctx.moveTo(i, dote-_l);
                    // ctx.lineTo(i, dote+1+_r);
                }
                ctx.stroke(); // 进行绘制
                o.find('canvas').length === 0 ? o.find('.clip-item-thumbs').append($(canvas)) : '';
            }, () => {
                let canvas = o.find('canvas').length ? o.find('canvas')[0] : document.createElement('canvas');
                $(canvas).css({ width: rangeWidth + 'px', height: '100%' });
                if (theMain) {
                    $(canvas).css({ width: rangeWidth + 'px', height: (main ? '16px' : '31px'), marginTop: (main ? '50px' : '35px') });
                }
                o.find('canvas').length === 0 ? o.find('.clip-item-thumbs').append($(canvas)) : '';
            })
        }
        let nameD = o.find('.name');
        if (nameD.length) {
            nameD.text(name || '')
        }
    }
};
export default unit;
