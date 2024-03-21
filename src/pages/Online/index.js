import React from 'react';
import $ from 'jquery';
import 'jquery-ui';
import 'jquery-ui/ui/widgets/resizable';
import 'jquery-ui/ui/widgets/selectable';
import 'jquery-ui/ui/widgets/draggable';
import 'jquery-ui/ui/widgets/sortable';
import 'jquery-ui/ui/widgets/droppable';
import 'jquery-ui/ui/widgets/slider';
import { message, Tooltip, Modal, Input, Radio, notification, Select, Dropdown, Menu } from 'antd';
import GLTransitions from "gl-transitions";
import channel, { get_data } from '@/channel';
import uploadingMain from '@/channel/clipFileUpload';
import { unit_unLoad, clearTranslate, initInterview } from "./trackDetail/translateInfo";
import { video_list as o_list } from "./trackDetail/unitInfo";
import { load_fonts } from "@/channel/load_fonts";
import { getUserInfo, refresh as refreshInfo } from "@/channel/userInfo";
import say from '@/database/local_language';
import { requestAnimationFrame } from '@/utils/handy';
import { getTransition } from "@/utils/gl";
import { getTime, getParam } from "@/utils/handy";
import { reversi } from "@/utils/effects";
import { FullScreen, fullScreenCallback } from "@/utils/fullScreen";
import {  get_list, set_current, config as subtitles_config, set_refresh, sub_change, sub_del } from "./trackDetail/subtitles-config";
import {
    test as testConfig,
    add as addUnit,
    addPath as addPath,
    clear as clearConfig,
    render as renderConfig,
    pre as preStep,
    next as nextStep,
    deleteUnit as deleteUnitConfig,
    deleteUnits as deleteUnitsConfig,
    getStatus,
    dragStart,
    changePath,
    clearVideoList,
    getPreConfig,
    setPreConfig,
    getSection,
    loadMedia,
    testTrim,
    interAudio,
    addTrim,
    render_subtitle,
    getConfig,
    clipConfig,
    getVideoList,
    getTempList,
    setTransDuration,
    setConfig,
    getVideoPiece,
    initConfig,
    setTheme
} from './trackDetail/online-configs';
import { confirm } from "@/components/Modal";
import Loading from "@/components/Loading";
import renderUnit from './trackDetail/render-unit';
import { msg } from "@/components/Info";
import logo from '@/images/300x300.png';
import stagerLogo from '@/images/stagerLogo.png';
import waveform from '@/images/waveform.svg';
import Top from './OnlineTop';
import OperationBar from './OperationBar';
import Shortcut from '@/components/Shortcut';
import UnitDetail from './UnitDetail';
import Colophon from './Colophon';
import IssueModel from './Issue';
import OnlineM from './SourceList';
import Record from './Record';
import Dialog from '@/components/Dialog';
import Crop from "./Crop";


const Option = Select.Option;
let multiple = 2;
let time_unit = 10;
let maxLength = 90;
let project_id = '0';
let is_template = 0;
let timeoutLock = '';
let play_lock = '';
let renderPicLock = '';
let _render_path_lock = [0, 0];
let video_list = {};
let doubleClick = false;
let orderList = [];
let level = 0;
let logoImg;
let zoomLock = false;
let pre_time = 0;
let auto_save;
let save_lock = false;
let trimL = false;
let trimR = false;
let dbLock = true;
let mediaMoveLock = false;
let stager_logo = '';
let currentMedia = '';
let ctrl_width = 140;
let dragGrid = 36;
let currentDom = '';
let mediaLoading = '';
let silence = '';
let error_config = '';
let refreshScrollBar = () => {

};
let verify_list = {
    title: /[^\w\u4E00-\u9FA5〈〉《》。 ，、：；？！‘’“”′.,﹑:;?!'"+\-*=<_#$&%^·-—…\/@￥¥-…√ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ×÷±／≈≡≠＜＞≤≥∏º％‰℅°℃℉″㎡㎥āáǎàŌÓǑÒūúǔùīíǐìēéěèêǖǘǚǜü]/g,
    title_start: /^[^\w\u4E00-\u9FA5《“]/,
    label: /[^\w\u4E00-\u9FA5〈〉《》。，、：；？！‘’“”′.,﹑:;?!'"+\-*=<_#$&%^·-—…\/@￥¥-…√ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ×÷±／≈≡≠＜＞≤≥∏º％‰℅°℃℉″㎡㎥āáǎàŌÓǑÒūúǔùīíǐìēéěèêǖǘǚǜü]/g,

};
let pre_used_list = '';
let audiotThumbnail = document.createElement('img');
audiotThumbnail.crossOrigin = "anonymous";
audiotThumbnail.src = waveform;

let _canvas0 = document.createElement('canvas');
let windowResize = () => {

};
let div = document.createElement('div');
let Main = React.createClass({
    getInitialState() {
        return {
            userInfo: getUserInfo(),
            auto_indent: true,
            items: [],
            files: [],
            fileName: '',
            label: [],
            duration: 0,
            paused: true,
            record: {},
            transition: '',
            // show_record:true,
            path_box: 0,
            meal: {},
            currentArea: '',
            currentAreaId: '',
            theLogoUrl: '',
            modalVisible: false, // 是否显示添加轨道弹窗
            newTemplateVisible: false,
            modalType: 'video',
            confirmLoading: false,
            themeConfig: {},
            modalTitle: '添加轨道',
            modalText: '',
            message: {},
            can_publish: true,
            themeName: '主题名称',
            subtitles_config: { current: -1, list: [] },
            subtitles_show: false,
            fullScreen: false,
            loadingMedia: false,
            saveTemplate: false,
            unit_detail: {},
            loaded: true,
            issue: {},
            used_list: {},
            screen_scale: '16:9',
            loadingSnap: {},
            play_lock: true,
            show_shortcut: false, // 是否显示快捷键
            show_rename: false, // 是否显示重命名
            new_name: false, // 重命名的新名字
            newTemplateText: '',
            transToAudio: false,
            refreshDialog: '',
            colophon: {},
            currentMediaDuration: 0,
            _pathway: [],//轨道dom
            _ctrl: [],//轨道控制dom
            unit_length: 10,//刻度尺中单位长度，以像素计量
            unit_time: 1,//刻度尺中单位时间，以秒计量
            unit_scale: 1,//缩放倍数
            time_line_start: 0,//0位置时间针，像素
            time_line_now: 0,//当前位置时间针，秒
            newFile: '',
            delete: '',
            max_time: 50,
            imgData: '', // 裁剪图片的地址（不做显示）
            showCropper: false, // 是否显示裁剪框
            cropperSize: 16 / 9, // 监视器比例
            showSubtitlesStyle: false// 字幕样式是否显示
        };
    },

    componentDidMount() {
        let that = this;
        let href = window.location.href.toLocaleLowerCase();
        this.initLogo();
        let bType = localStorage.bType;
        if (bType !== 'Chrome' && href.toLocaleLowerCase().indexOf('online') > 0) {
            msg('推荐使用Chrome');
        }
        let param = this.props.location.state;
        if (param) {
            let sum_v = 0, sum_a = 0, sum_p = 0;
            let sort = {}; let _upload_str = ''; let _import_str = '';
            param.map((v, k) => {
                if ([0, 1, 2, 5].indexOf(v.status) >= 0) {
                    if (v.times) {
                        sort[v.times] = v;
                    } else {
                        sort['999'] = v;
                    }
                } else if (v.status === 3) {
                    _upload_str += v.name + ';';
                } else if (v.status === 4) {
                    _import_str += v.name + ';';
                } else {
                    sort['999'] = v;
                }
            });
            if (_upload_str) {
                notification.warning({
                    duration: null,
                    message: '以下素材未上传完成，需手动拼接：',
                    description: _upload_str,
                });
            }
            if (_import_str) {
                notification.warning({
                    duration: null,
                    message: '以下素材未导入完成，需手动拼接：',
                    description: _import_str,
                });
            }
            for (let i in sort) {
                let u = sort[i];
                let duration = (u.duration ? parseInt(u.duration * 25) / 25 : 5);
                let isCan = false;
                if (u.media_type === 'image') {
                    isCan = true;
                } else if (u.preview_hls) {
                    isCan = true;
                } else if (u.media_url && u.media_url.toLocaleLowerCase().indexOf('.hls') > 0) {
                    isCan = true;
                }
                u['start_time'] = u.media_type === 'audio' ? sum_a : sum_v;
                u['end_time'] = u['start_time'] + duration;
                u['duration'] = duration;
                u['start_range'] = 0;
                u['end_range'] = duration;
                u['layer'] = u.media_type === 'audio' ? 2 : 1;
                u['position'] = sum_p;
                u['uploading'] = isCan ? 'can' : 'cannot';
                addUnit('', '', 0, '', u);
                sum_p++;
                u.media_type === 'audio' ? sum_a += duration : sum_v += duration;
            }
        }
        this.renderPath('render');
        this.shortcutInit();
        // this.recyleUnit();
        this.playVideo();
        this.save_config('pre');
        this.showLoading();
        let _config = getConfig();
        let _sum = 1;
        _config.video_list.map((v, k) => {
            v.obj_list.map((v, k) => {
                _sum += 1;
            })
        });
        setTimeout(() => {
            this.closeLoading();
        }, _sum * 1000);
        $('.progress').bind('mousedown', (e) => {
            mediaMoveLock = true;
            if (e.currentTarget === e.target && currentMedia[0]) {
                currentMedia[0].currentTime = (currentMedia[0].duration || 0) * e.offsetX / ($('.progress').width() - 2);
                // if(currentMedia[0]['lottie']){
                //     let _media=currentMedia[0]['lottie'];
                //     _media.goToAndStop(currentMedia[0].currentTime*10,true);
                //     if(_media.wrapper.innerHTML!==currentMedia[0]['pre_svg']){
                //         let inner=_media.wrapper.innerHTML;
                // $(inner).eq(0).css({writingMode: 'vertical-rl'});
                // let svgString = new XMLSerializer().serializeToString($(inner)[0]);
                // currentMedia[0]['pre_svg']=inner;
                // let svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
                // currentMedia[0].src = URL.createObjectURL(svg);
                // }
                // }
                this.setState({ 'paused': true });
                that.playMedia('once');
            }
        });
        fullScreenCallback((re) => {
            this.setState({ 'fullScreen': re });
            this.exitFullScreen();
        });
        refreshScrollBar = this.initScrollBar();
        $(".tl-wrapper .pathway-ctrl").sortable({
            cancel: '.no-sor',
            zIndex: 999,
            helper: 'clone',
            start: function (event, ui) {
                let _config = getConfig();
                let video_len = _config.video_list.length - 1;
                let way = $('.pathway-box .pathway').eq(ui.helper.attr('key') * 1);
                ui.helper.html(ui.helper.clone())
                    .attr('vKeys', video_len).addClass('dragBorder').removeClass('ctrl')
                    .css({ 'overflow': 'hidden', width: '100%' })
                    .append(way.clone().removeClass('visibility-h'));
                way.addClass('visibility-h').siblings().removeClass('visibility-h');
            },
            change: (e, u) => {
                let key0 = u.helper.attr('key');
                let vKeys = u.helper.attr('vKeys');
                let key = u.placeholder.index();
                let way = $('.pathway-box .visibility-h');
                let ways = $('.pathway-box .pathway');
                let key2 = way.index();
                let key1 = key > key0 ? key - 1 : key;
                if ((key0 < vKeys && key1 < vKeys) || (key0 >= vKeys && key1 >= vKeys)) {
                    u.helper.removeClass('dis')
                } else {
                    u.helper.addClass('dis')
                }
                if (key1 > 0) {
                    if (key1 > key2) {
                        ways.eq(key1).after(way);
                    } else {
                        ways.eq(key1 - 1).after(way);
                    }
                } else {
                    if (key2 !== 0) {
                        ways.eq(0).before(way);
                    }
                }
            },
            stop: (e, u) => {
                let key0 = u.item.attr('key');
                let vKeys = u.item.attr('vKeys');
                let way = $('.pathway-box .visibility-h');
                let key = way.index();
                changePath(key0, key);
            }

        });
        $(".pathway-box").sortable({ cancel: ".pathway-box .pathway", zIndex: 999, items: ".pathway-ctrl .ctrl" });

        windowResize = () => {
            if (this.props.history.location.pathname === '/online') {
                this.setState({ path_box: parseFloat($('.tl-wrapper').css('width')) - ctrl_width });
                this.refreshRuler();
                refreshScrollBar();
            }
        };
        $(".control-box .path").selectable({
            cancel: ".trans,.trim", filter: ".mater-helper", delay: 0, distance: 3,
            stop: function (event, ui) {
                that.setState({ currentArea: that.state.currentArea })
            }
        }).bind('click', () => {
            $('textarea:focus').blur();
        });

        // $( ".pathway-box" ).selectable( "option", "filter", "li" );

        $(window).bind('resize', windowResize);
        currentMedia = '';
        auto_save = setInterval(() => {
            that.save_config('auto');
        }, 3000);
        $('.contentMenu').onclick = (event) => {
            window.event ? window.event.cancelBubble = true : event.stopPropagation();
            window.event ? window.event.returnValue = false : event.preventDefault();
        };

        $('.source-list').delegate('.can-del', 'contextmenu', (event) => {
            // let et=$(event.currentTarget);
            // let mediaId=et.attr('data-mediaId');

            // this.del('trash_media',{media_id:item.media_id,action:2},()=>{
            //     $('#'+item.media_id).css('display','none');
            //     this.setState({delete:''})
            // });
            // if(mediaId){
            currentDom = $(event.currentTarget);
            $('.contentMenu').css({
                left: event.clientX + $(document).scrollLeft(),
                top: event.clientY + $(document).scrollTop(), display: 'block'
            });
            // }
            window.event ? window.event.cancelBubble = true : event.stopPropagation();
            window.event ? window.event.returnValue = false : event.preventDefault();
        }).delegate('.mater', 'mousedown', (e) => {
            let et = $(e.currentTarget);
            if (et.hasClass('current')) return;
            et.addClass('current').siblings().removeClass('current');
            let mediaType = et.attr('data-mediaType');
            let mediaId = et.attr('data-mediaId');
            let previewMp4 = et.attr('data-previewMp4');
            let previewHls = et.attr('data-previewHls');
            let audioPreviewImg = et.attr('data-audioPreviewImg');
            let transType = et.attr('data-transType');
            let subType = et.attr('data-subType');
            let media_url = et.attr('data-mediaUrl');
            let previewMp3 = et.attr('data-previewMp3');
            let thumbnail = et.attr('data-thumbnail');
            let uploading = et.attr('data-uploading');
            let buffer = et.attr('data-buffer');
            let videoPreviewImg = et.attr('data-videoPreviewImg');
            let duration = et.attr('data-duration') * 1;
            // let uploading=et.hasClass('uploading');
            let obj = {
                "obj_type": mediaType,  // 用户自己上传的视频素材
                "obj_id": mediaId || '',  // 视频ID
                "special": {  // 该对象特有属性
                    "preview_hls": previewHls || '',  // 预览URL（低码率）
                    "preview_mp3": previewMp3 || '',  // 预览URL（低码率）
                    "preview_mp4": previewMp4 || '',  // 预览URL（低码率）
                    "media_url": media_url || '',  // 预览URL（低码率）
                    "trans_type": transType,  // 预览URL（低码率）
                    "sub_type": subType,  // 预览URL（低码率）
                    "uploading": uploading,  // 预览URL（低码率）
                    "buffer": buffer,  // 预览URL（低码率）
                    // "video_preview_img": videoPreviewImg,  // 视频缩略图
                    "audio_preview_img": audioPreviewImg || '',  // 音频缩略图
                    "thumbnail": thumbnail || '',  // 视频封面图
                    // "start_range": startRange,  // 截取视频开始时间
                    // "end_range": endRange,  // 截取视频结束时间
                }
            };
            if (currentMedia && currentMedia[0].pause) {
                currentMedia[0].pause();
                currentMedia[0].currentTime = 0;
            }
            currentMedia = loadMedia(obj);
            if (!currentMedia[0]) {
                currentMedia = '';
                return;
            }
            this.setState({ 'paused': true });
            this.playMedia('once');
            that.setState({ 'currentMediaDuration': getTime(duration) });
        });

        let $material = $('.material'), $control = $('.control .pathway-box'), $left = 0,
            $playBtn = $('#playBtn');
        $(".observation .reveal #player-container").resizable({
            aspectRatio: 16 / 9,
            minHeight: 270,
            maxHeight: document.body.scrollHeight - 360,
            maxWidth: document.body.scrollWidth * 0.6,
            handles: "w",
            create: function (event, ui) {
                let h = document.body.scrollHeight - 360,
                    w = document.body.scrollWidth / 32 * 9;
                h = h > w ? w : h;
                $(event.target).css({ width: h / 9 * 16 + 'px', height: h + 'px' });
                $(event.target).find('.ui-resizable-w').attr('title', say('main', 'resizePreviewWindow'));
                $(".main-area .control").css({ top: h + 120 });
                $('#player-container').css({ height: h, width: h / 9 * 16 });
                // $('.material-main-left').css({maxHeight: h-20+'px'});
                // $('.time-line .line').css({height: document.body.scrollHeight - h - 126})
                $('.unit-detail .unit-right').css({
                    width: h / 9 * 16 + 'px',
                    height: document.body.scrollHeight - h + 'px'
                });
                // that.setState({max_time:(document.body.scrollWidth-ctrl_width)/that.state.unit_length*that.state.unit_time})
            },
            resize: function (event, ui) {
                // 关闭裁剪
                that.state.showCropper = false;
                $(".observation .reveal #player-container").css("left", "");
                $(".main-area .control").css({ top: ui.size.height + 125 });
                // $('.time-line .line').css({height: document.body.scrollHeight - ui.size.height - 126});
                $('#player-container').css({ height: ui.size.height, width: ui.size.width })
                // $('.material-main-left').css({maxHeight: ui.size.height-20+'px'});
                $('.unit-detail .unit-right').css({
                    height: document.body.scrollHeight - ui.size.height,
                    width: ui.size.width
                })
            }, stop(event, ui) {
                that.playVideo();

            }
        });
        $('.main-area .line').draggable({
            axis: "x",
            cancel: ".clip", // 点击一个图标不会启动拖拽
            snapTolerance: 30,
            drag: function (e, u) {
                let c = u.offset.left - $('.path').offset().left;
                // if((c-that.state.time_line_start)/that.state.unit_length*that.state.unit_time> getSection().e ){
                //     that.set_time_line_now(that.state.time_line_now);
                //     that.setState({time_line_now: len});
                // }else{
                //     that.set_time_line_now(c);
                // }
                that.set_time_line_now(c);
            },
            containment: "parent"
        });
        $control.droppable({
            accept: ".mater,.mater-helper",
            scope: "maters",
            tolerance: "pointer",
            scroll: true,
            activeClass: "custom-state-active",
            over: function (t, n) {
                n.helper.addClass('license');
                // if (!n.draggable.parents('.material').length) {
                //     n.draggable.draggable("option", "grid", [1, dragGrid]);
                // }
            },
            out: function (t, n) {
                n.helper.removeClass('license');
                n.draggable.draggable("option", "grid", false);
            },
            drop: function (event, ui) {
                if (ui.helper.find('.red').length > 0) return;
                if (ui.helper.find('.yellow').length && !ui.helper.find('.yellow').hasClass('focused')) return;
                let son = ui.helper.find('.mater-helper');
                if ((!son) || !son.length) return;
                let max_time = 0;
                let top = Math.round((son.offset().top - $(this).offset().top) / dragGrid);
                if (top < 0) {
                    return;
                }
                let layers = 0;
                let last_time = 0;
                son.map((k, v) => {
                    let o = son.eq(k);
                    let duration = o.attr('data-duration');
                    let startTime = o.attr('data-startTime') * 1;
                    let endTime = o.attr('data-endTime') * 1;
                    let position = o.attr('data-position') * 1;
                    let offset = o.offset();
                    let left = offset.left - $(this).offset().left - that.state.time_line_start;
                    let start_time = Math.round(left / that.state.unit_length * that.state.unit_time * 25) / 25;
                    let top = Math.round((offset.top - $(this).offset().top) / dragGrid);

                    if (that.state.auto_indent) {
                        let _config = getConfig('temp');
                        let _list = [];
                        let video_len = _config.video_list.length;
                        let audio_len = _config.audio_list.length;
                        if (top < 0) {
                            return;
                        } else if (top <= video_len) {
                            top = Math.min(video_len - 1, top);
                            _list = _config.video_list[top].obj_list;
                        } else if (top <= video_len + audio_len) {
                            top = top - 1;
                            _list = _config.audio_list[top - video_len].obj_list;
                        } else {
                            top = top - 1;
                        }
                        if (position + 1 < _list.length) {
                            let start = _list[position + 1].start_time;
                            if (Math.abs(start_time - startTime + endTime - start) < that.state.unit_time / 1) {
                                start_time = start - endTime + startTime
                            }
                        }
                        if (position > -1 && _list[position]) {
                            let end = _list[position].end_time;
                            if (Math.abs(end - start_time) < that.state.unit_time / 1) {
                                start_time = end;
                            }
                        } else if (position === -1) {
                            if (Math.abs(start_time) < that.state.unit_time / 1) {
                                start_time = 0;
                            }
                        }
                        let layer = top.toFixed(0) * 1;
                        if (layers === layer) {
                            if (position > -1 && _list[position]) {
                                let end = _list[position].end_time;
                                last_time = Math.max(last_time, end);
                            }
                            if (Math.abs(start_time - last_time) < that.state.unit_time / 1) {
                                start_time = last_time;
                            }
                            last_time = (start_time - startTime + endTime).toFixed(2) * 1;
                        } else {
                            layers = layer;
                            last_time = (start_time - startTime + endTime).toFixed(2) * 1;
                        }
                    }
                    let duration_end = start_time - startTime + endTime;
                    o.attr({
                        'data-startTime': start_time.toFixed(2) * 1,
                        'data-endTime': (start_time - startTime + endTime).toFixed(2) * 1,
                        'data-layer': top.toFixed(0) * 1
                    });
                    if (duration_end > that.state.max_time) {
                        max_time = duration_end;
                    }
                });
                let yellow_obj = ui.helper.find('.yellow.focused');
                if (yellow_obj.length > 0) {
                    $('.clipChoose').css({
                        left: event.clientX + $(document).scrollLeft(),
                        top: event.clientY + $(document).scrollTop(), display: 'block'
                    })
                    let y_temp = ui.helper.clone();
                    y_temp.css({
                        // left: event.clientX + $(document).scrollLeft(),
                        // top: event.clientY + $(document).scrollTop()
                    });
                    $('.temp-yellow').append(y_temp);
                    let options = $('.clipChoose >span');
                    if (yellow_obj.hasClass('onlyChoose')) {
                        options.eq(0).attr({ 'disabled': 'disabled' }).addClass('dis');
                        options.eq(1).attr({ 'disabled': '' }).removeClass('dis');
                    } else if (yellow_obj.hasClass('replace')) {
                        options.eq(0).attr({ 'disabled': 'disabled' }).addClass('dis');
                        options.eq(1).attr({ 'disabled': 'disabled' }).addClass('dis');
                    } else {
                        options.eq(0).attr({ 'disabled': '' }).removeClass('dis');
                        options.eq(1).attr({ 'disabled': '' }).removeClass('dis');
                    }
                    return
                }
                addUnit(son, '', that.state.auto_indent ? that.state.unit_time / that.state.unit_length : 0);
                if (max_time > that.state.max_time) {
                    that.setState({ unit_scale: max_time * that.state.unit_scale / that.state.max_time });
                    that.setState({ max_time: max_time + 50 });
                    $('.zoom-bar').slider("option", "value", that.state.unit_scale);
                    that.initPathWidth();
                    refreshScrollBar();
                }
            }
        });
        $playBtn.on('click', function () {
            if (that.state.play_lock) {
                that.state.play_lock = false;
                if (currentMedia) {
                    that.playMedia();
                } else {
                    let section = getSection();
                    let left = that.state.time_line_now - that.state.time_line_start;
                    let now = left / that.state.unit_length * that.state.unit_time;
                    if (section.e && section.e - now < 1 / 60 + 0.04) {
                        console.info(section.s, that.state.time_line_start)
                        now = section.s;
                        that.set_time_line_now(now / that.state.unit_time * that.state.unit_length + that.state.time_line_start);
                    }
                    that.setState({ 'paused': !that.state.paused });
                    that.playVideo('goOn');
                }
                play_lock = setTimeout(() => {
                    that.state.play_lock = true;
                }, 40);
            } else {
                clearTimeout(play_lock);
                play_lock = setTimeout(() => {
                    that.state.play_lock = true;
                }, 40);
            }
        });
        $('.control').delegate('.add-subtitle', 'click', () => {
            if (dbLock) {
                dbLock = false;
                this.subtitles_change();
                setTimeout(() => {
                    dbLock = true;
                }, 400)
            }
        });
    },

    // 打开历史记录
    openColophon() {
        this.setState({
            colophon: {
                show: true,
                layer: 1,
                position: 1
            }
        });
    },

    // 关闭历史版本
    closeColophon() {
        this.setState({ colophon: {} })
    },

    recyleUnit() {
        let re = $('#player-container').find('.recycle');
        re.droppable({
            accept: ".mater-helper",
            scope: "maters",
            over: function (t, n) {
                re.addClass('pass');
            },
            out: function (t, n) {
                re.removeClass('pass');
            },
            drop: function (event, ui) {
                re.removeClass('pass');
                re.removeClass('show');
                let o = ui.draggable;
                deleteUnitConfig(o.attr('data-layer') * 1, o.attr('data-position') * 1 + 1);
            }
        });
    },

    // 显示快捷键
    show_shortcut() {
        this.setState({
            show_shortcut: {
                setting: 'show',
                title: '重命名',
                close: () => {
                    this.setState({ show_shortcut: '' })
                },
                form: (
                    <ul>
                        <li><input id="rename" style={{ width: '280px', float: 'none' }} type="text" /></li>
                        <li>
                            <span className="btn" onClick={() => {
                            }}>{say('main', 'confirm')}</span>
                            <span className="btn" onClick={() => {
                                this.setState({ show_shortcut: '' })
                            }}>{say('main', 'cancel')}</span>
                        </li>
                    </ul>)
            }
        })
    },

      // 显示重命名
    show_rename(name) {
       this.setState({new_name:name,show_rename:true})
    },

    // 显示添加轨道弹窗
    addNewPath() {
        this.state.confirmLoading = false;
        this.setState({ modalVisible: true });
    },

    // 添加轨道点击确定
    onOk() {
        this.setState({ confirmLoading: true });
        addPath(this.state.modalType, this.state.modalText || (this.state.modalType === 'video' ? '图像轨' : '音频轨'));
        this.state.modalText = '';
        this.state.modalType = 'video';
        this.setState({ modalVisible: false })
    },

    // 剪切
    clip() {
        let left = this.state.time_line_now - this.state.time_line_start;
        let now = left / this.state.unit_length * this.state.unit_time;
        clipConfig(now);
    },

    //波纹剪
    shear() {
        this.deleteUnit('shear')
    },

    // 删除
    deleteUnit(shear) {
        if ($('.textEdit')[0]) return;
        // 关闭裁剪
        this.setState({ showCropper: false });
        this.playVideo();
        if (this.state.unit_detail.show) {
            this.setState({ unit_detail: {} });
        };
        let y = $('.pathway').find('.focused');
        let x = $('.pathway').find('.ui-selected.mater-helper');
        if (y.hasClass('mater-helper')) {
            deleteUnitConfig(y, shear);
        } else if (y.hasClass('trans')) {
            let o = y.parents('.mater-helper').eq(0);
            let trans = y.hasClass('trans-end') ? 'end' : 'start';
            deleteUnitConfig(o, trans);
        } else if (x.length) {
            deleteUnitsConfig(x, shear);
        } else if (this.state.subtitles_config.current >= 0 && $('.subtitles-path').find('.current').length > 0) {
            sub_del([$('.subtitles-path').find('.current').attr('name')]);
        }
        $('.focus').css({ 'display': 'none' })

    },

    // 裁剪
    crop(cropObj) {
        if (this.state.unit_detail.show) {
            this.setState({ unit_detail: {} });
        };
        let y = $('.pathway').find('.focused');
        if (!y.length) return;
        if (y && y[0] && y[0]['attributes']) {
            let type = y[0]['attributes']['data-mediatype']['value'];
            if (type === 'video' || type === 'image') {
                let mediaid = y[0]['attributes']['data-mediaid']['value'];
                let layer = y[0]['attributes']['data-layer']['value'];
                let temp = getTempList()[mediaid + '_' + layer];
                if (temp && cropObj) {
                    temp['crop'] = cropObj;
                    //this.playVideo('area', mediaid + '_' + layer,'crop');
                } else {
                    this.setState({ 'showCropper': true });
                    // 判断指针是否在本视频内 (如果在不跳,如果不在跳到视频第一秒)
                    let startTime = y[0]['attributes']['data-starttime']['value'] * 1;
                    let endTime = y[0]['attributes']['data-endtime']['value'] * 1;
                    let nowTime = (this.state.time_line_now - this.state.time_line_start) / this.state.unit_length * this.state.unit_time;
                    if (nowTime < startTime || nowTime > endTime) {
                        let c = y.offset().left - ctrl_width;
                        this.set_time_line_now(c + 0.12 / this.state.unit_time * this.state.unit_length, true);
                    }
                    this.cropperDraw(temp, mediaid + '_' + layer);
                }
                //$('.focus').css({'display': 'none'})
            } else {
                message.info('文件格式不支持裁剪！！！');
            }
        } else {
            message.info('请选择视频！！！');
        }

    },

    // 设置裁剪框是否显示
    setShowCropper(bol) {
        this.setState({ showCropper: bol });
        this.playVideo();
    },

    // 语音转文字
    trans_audio_to_text() {
        let y = $('.pathway').find('.focused');
        if (!y.length) {
            return;
        }
        let media_type = y.attr('data-mediaType');
        let media_id = y.attr('data-mediaId');
        let start_range = y.attr('data-startRange');
        let end_range = y.attr('data-endRange');
        let start_time = y.attr('data-startTime');
        let end_time = y.attr('data-endTime');
        if (media_type === 'audio' || media_type === 'video') {
            for (let i in unit_unLoad) {
                if (unit_unLoad[i].type === 'text') {
                    notification.warning({
                        duration: 5,
                        message: '请稍后',
                        description: '已经有语音转文字任务在执行',
                    });
                    return;
                }
            }
            channel('get_media_status', { media_id: media_id }, (re) => {
                if (re && re[0].status === 1) {
                    message.info('已下发语音转文字任务，请稍后');
                    channel('trans_audio_to_text', { materialId: media_id, start: start_range, end: end_range, projectId: project_id }, (re) => {
                        unit_unLoad[re.taskId] = { taskId: re.taskId, type: 'text', start_time: start_time, end_time: end_time, project_id: project_id }
                    }, () => {

                    }, 'all')
                } else {
                    message.info('请等待素材转码完成后再执行语音转文字');
                }
            });
        } else {
            message.info('所选素材类型不正确');
        }
    },

    // 高级操作
    enterUnitDetail() {
        // 关闭裁剪
        this.setState({ showCropper: false });
        this.playVideo();
        let y = $('.pathway').find('.focused');
        if (y.hasClass('mater-subtitle')) {
            let c = y.offset().left - ctrl_width;
            this.set_time_line_now(c + 0.12 / this.state.unit_time * this.state.unit_length);
            $('.material-top li').eq(5).click();
            setTimeout(() => {
                $('.material-main-left li').eq(0).click();
                this.playVideo();
                // setTimeout(()=>{
                // $('.subtitles-content .current textarea').focus();
                // })
            });
        } else if (y.hasClass('mater-helper')) {
            this.setState({
                unit_detail: {
                    show: true,
                    layer: y.attr('data-layer') * 1,
                    position: y.attr('data-position') * 1
                }
            });
        } else if (y.hasClass('trans')) {
            let o = y.parents('.mater-helper').eq(0);
            let trans = y.hasClass('trans-end') ? 'end' : 'start';
            let duration = Math.round(y.attr('data-duration') * 100) / 100;
            let name = y.attr('data-transName');
            this.setState({
                transition: {
                    setting: 'show',
                    type: 'transition',
                    width: 400,
                    height: 160,
                    title: name || say('main', 'transitions'),
                    close: () => {
                        this.setState({ transition: '' })
                    },
                    form: (
                        <ul>
                            <li>
                                <span>{say('main', 'duration')}：</span><input id="trans-duration"   onChange={(e) => {
                                    // this.setState({refreshDialog:e.target.value});
                                }
                                } type="text" />
                            </li>
                            <li>
                                <button className="btn-s" onClick={() => {
                                    let val = $('#trans-duration').val().trim();
                                    if(!val || isNaN(val)){
                                        message.info("请输入正确的转场时长");
                                        return;
                                    }
                                    if(val>10){
                                        message.info("转场时长最长10秒");
                                        return;
                                    }
                                    if(val<1){
                                        message.info("转场时长最短1秒");
                                        return;
                                    }
                                    val = parseFloat(val);
                                    val = val > 10 ? 10 : val < 1 ? 1 : Math.ceil(val * 25) / 25;
                                    setTransDuration(o.attr('data-layer') * 1, o.attr('data-position') * 1 + 1, trans, val);
                                    this.setState({ transition: '' })
                                }}>{say('main', 'confirm')}
                                </button>
                                <button className="btn-s" onClick={() => {
                                    this.setState({ transition: '' })
                                }}>{say('main', 'cancel')}
                                </button>
                            </li>
                        </ul>)
                }
            });
            setTimeout(() => {
                $('#trans-duration').val(duration)
            })
        }
        $('.focus').css({ 'display': 'none' })
    },

    // 关闭高级操作
    closeUnitDetail() {
        this.setState({ unit_detail: {} })
    },

    // 裁剪插入
    joinClip() {
        let y = $('.temp-yellow').find('.yellow');
        if (!y.hasClass('onlyChoose') && !y.hasClass('replace')) {
            if (y.length > 0) {
                addUnit(y.eq(0))
                // renderUnit(y.clone());
            }
            $('.path .hidden').remove();
            $('.temp-yellow').empty();
            $('.clipChoose').css({ 'display': 'none' })
        }
    },

    // 后移插入
    joinInsert() {
        let y = $('.temp-yellow').find('.yellow');
        if (!y.hasClass('replace')) {
            if (y.length > 0) {
                addUnit(y.eq(0), 'insert');
                // renderUnit(y.clone());
            }
            $('.path .hidden').remove();
            $('.temp-yellow').empty();
            $('.clipChoose').css({ 'display': 'none' })
        }
    },

    // 替换
    replaceUnit() {
        let y = $('.temp-yellow').find('.yellow');
        if (y.length > 0) {
            addUnit(y.eq(0), 'replace');
            // renderUnit(y.clone());
        }
        $('.path .hidden').remove();
        $('.temp-yellow').empty();
        $('.clipChoose').css({ 'display': 'none' })
    },

    // 全屏
    fullReveal() {
        $('.reveal').appendTo('.full-cnt');
        this.playVideo();
        if (!this.state.fullScreen) {
            FullScreen()
        }
        $('body').css({ 'overflow': 'hidden' });
    },

    // 退出全屏
    exitFullScreen() {
        if ((!this.state.fullScreen) && $('.full-cnt .reveal').length !== 0 && $('.observation .reveal').length === 0) {
            $('.reveal').appendTo('.observation');
            this.playVideo();
            if ($('.observation .reveal').length > 1) {
                $('.observation .reveal').eq(1).remove();
            }
            $('body').css({ 'overflow': 'auto' });
        }
    },

    // 初始化logo
    initLogo() {
        let img = document.getElementById('stagerLogo');
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        stager_logo = canvas;
        img.onload = () => {
            setTimeout(() => {
                canvas.width = img.width;
                canvas.height = img.height;
                context.drawImage(img, 0, 0);
                context.font = "36px FZShuSong-Z01S";
                context.textAlign = 'center';
                context.shadowBlur = 2;
                context.textAlign = "left";
                context.shadowColor = "black";
                context.fillStyle = '#fff';
                context.fillText(localStorage.user_id || '123456', 188, 142);
                stager_logo = canvas;
            });
        };
    },

    // 关闭合成
    closeIssue() {
        this.setState({ issue: {} });
        $('.reveal').appendTo('.observation');
        $('#editor').css('display', 'block');
        $('.onlineTop > .tab').css('display', 'inline-flex');
        $('.onlineTop > .p-a').find('.projectName').css('display', 'inline-flex');
        $('.onlineTop > .p-a').find('.goBack').html("<span class='ico iconfont icon-fanhui m-0-5'></span>退出");
        $('.onlineTop > .p-a').find('.goBack').css({ 'margin': '0 20px', "color": "#ffd100" });
        $(".pathway-box .pathway").css("margin-left", 0);
        // initConfig();
        windowResize();
        this.state.time_line_start = 0;
        this.set_time_now(0);

        // $('.vision').css('height',parseFloat($('.vision').css('width'))/16*9+36+'px')
    },

    // 点击合成按钮
    issue_config() {
        if (is_template) {
            this.saveAsTempPro(true);
        } else {
            this.save_config('save', () => {
                this._issue_config();
            });
        }
    },

    // 点击合成按钮后的处理
    _issue_config() {
        this.closeUnitDetail();
        // if(!this.state.can_publish){
        //     message.info(say('info','say3'));
        //     return;
        // }

        let _config = getConfig('clone');
        if (_config.duration < 1) {
            return;
        }
        $('#editor').css('display', 'none');
        $('.onlineTop > .tab').css('display', 'none');
        $('.onlineTop > .p-a').find('.projectName').css('display', 'none');
        $('.onlineTop > .p-a').find('.goBack').html("<span class='ico iconfont icon-shangyibu m-10'></span>返回操作台");
        $('.onlineTop > .p-a').find('.goBack').css({ 'margin-left': '88px' });
        let that = this;
        let img = document.createElement('img');
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        img.crossOrigin = "anonymous";
        _config.project_id = project_id;
        _config.video_list.map((v, k) => {
            v.obj_list.map((v1, k1) => {
                if (v1.special) {
                    // v1.special['thumbnail']='';
                    // v1.special['video_preview_img']='';
                }
                if (v1.obj_type === 'text') {
                    if (v1.special.sub_type === 'animation') {
                        this.text_flame_text(v1, o_list[v1.obj_id + '_' + k]);
                        v1.special.svg1 = '';
                        v1.special.svg = '';
                    } else {
                        img.src = v1.special.svg1;
                        canvas.width = v1.special.position_w;
                        canvas.height = v1.special.position_h;
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        v1.special.svg = canvas.toDataURL('image/png').replace(/^data:image\/\w+;base64,/, "");
                    }
                }
            })
        });
        _config.auto_indent = this.state.auto_indent;
        // _config.labels = _config.labels.join('|')?_config.labels:[];
        that.setState({
            issue: {
                show: true,
                layer: 0,
                name: getConfig().name,
                label: getConfig().label,
                description: getConfig().description,
                project_id: project_id,
                position: 0
            }
        });
        let reveal = $('.reveal');
        reveal.appendTo('.vision');
        $('.vision').css('height', document.body.scrollWidth * 0.45 / 16 * 9 + 36 + 'px');
        save_lock = true;
        // _config.portrait =reveal.hasClass('vertical');
        // _config.aspect =reveal.hasClass('vertical')?'9:16':'16:9';
        if (reveal.hasClass('vertical')) {
            _config.aspect = '9:16';
        } else if (reveal.hasClass('vertical-11')) {
            _config.aspect = '1:1';
        } else if (reveal.hasClass('vertical-43')) {
            _config.aspect = '4:3';
        } else {
            _config.aspect = '16:9';
        }
        channel('save_project_config', JSON.stringify(_config), (re) => {
            project_id = re.project_id || '879879870';
            this.state.can_publish = re.can_publish || true;
            save_lock = false;
            that.setState({
                issue: {
                    show: that.state.issue.show || true,
                    layer: 0,
                    issue: true,
                    project_id: project_id,
                    position: 0
                }
            });
            $('.reveal').appendTo('.vision');
            $('.vision').css('height', document.body.scrollWidth * 0.45 / 16 * 9 + 36 + 'px')

        }, () => {

        }, 'info');
    },

    // 干什么的不知道， 好像和动效字幕有关系
    text_flame_text(u, o) {
        let animationData = get_data(u.special.media_url || u.special.json_url);
        let fonts = load_fonts();
        let font_data = [];
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
        animationData.fonts = {
            "list": font_data
        };
        animationData.layers.map((v, k) => {
            if (v.ty === 5) {
                let font = v.t.d.k[0].s;
                if (u.layers && u.layers[k]) {
                    let param = u.layers[k]['s'] || {};
                    for (let i in font) {
                        if (param[i] && param[i] !== font[i]) {
                            font[i] = param[i];
                        }
                    }
                    if (!param.f) {
                        console.info('********');
                        console.info(font.f)
                        font.f = font_data[0].fName;
                    }
                } else {
                    console.info('********');
                    console.info(font.f)
                    font.f = font_data[0].fName;
                }
            } else if (v.ty === 0) {
                let V = v;
                animationData.assets.map((v, k) => {
                    if (v.id && v.id === V.refId) {
                        v.layers.map((v, k) => {
                            if (v.ty === 5) {
                                let font = v.t.d.k[0].s;
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
                                        console.info('********');
                                        console.info(font.f)
                                        font.f = font_data[0].fName;
                                    }
                                } else {
                                    console.info('********');
                                    console.info(font.f)
                                    font.f = font_data[0].fName;
                                }
                            }
                        })
                    }
                })
            }
        });
        u.flame_text = animationData;
        // u.flame_text={assets:[],layers:[]};
        // let video=o['lottie'];
        // let data={};
        // if(video)data=video.animationData;
        // if(data.assets&&data.assets.length)
        // data.assets.map((_v, _k) => {
        //         u.flame_text.assets.push({layers:[]});
        //         _v.layers.map((v,k)=>{
        //             if (v.ty === 5) {
        //                 let font = v.t.d.k[0].s;
        //                 u.flame_text.assets[_k].layers.push({
        //                     t:{
        //                         d:{
        //                             k:[{s:font}]
        //                         }
        //                     }
        //                 });
        //             }else{
        //                 u.flame_text.assets[_k].layers.push('');
        //             }
        //         })
        //     });
        // if(data.layers&&data.layers.length)
        //     data.layers.map((v, k) => {
        //         if (v.ty === 5) {
        //             let font = v.t.d.k[0].s;
        //             u.flame_text.layers.push({
        //                 t:{
        //                     d:{
        //                         k:[{s:font}]
        //                     }
        //                 }
        //             });
        //         }else{
        //             u.flame_text.layers.push('');
        //         }
        //     });
    },

    set_text_info(obj) {
        // let _config = getConfig();
    },

    // 快捷键初始化 绑定一些事件
    shortcutInit() {
        if (document.addEventListener) {
            document.addEventListener("keydown", this.fnKeyup, false);
            document.addEventListener("mousedown", this.mousedown, false);
            document.addEventListener("click", this.fnClick, false);
            document.addEventListener("mousemove", this.mouseMove, false);
            document.addEventListener("mouseup", this.mouseUp, false);
        }
        else {
            document.attachEvent("onkeydown", this.fnKeyup);
            document.attachEvent("onmousedown", this.mousedown);
            document.attachEvent("onclick", this.fnClick);
            document.attachEvent("mousemove", this.mouseMove);
            document.attachEvent("onmouseup", this.mouseUp);
        }

    },

    // 处理快捷键 键盘
    fnKeyup(event) {
        let e = window.event || event;
        // if(this.state.unit_detail.show) return;

        if ((e.ctrlKey || e.metaKey) && e.shiftKey && event.keyCode === 83) {// s 下载配置信息
            this.down_config();
        }
        if (this.state.issue.show) return;
        if (this.state.show_record) return;
        let name = e.target.nodeName;
        if ((name === 'INPUT' && e.target.className !== 'ant-radio-input') || name === 'TEXTAREA') {
            return;
        }
        if ((e.target.nodeName !== 'INPUT' || e.target.className === 'ant-radio-input') && e.target.className !== 'ql-editor') {
            // if(e.keyCode===13&&this.state.guide.setting){
            // $('.guide .auto-btn').click();
            // }
            if (this.state.paused) {
                console.info(event.keyCode);
                if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
                    switch (event.keyCode) {
                        case 90: this.toNext(); break; // z 重做
                        // case 83:this.down_config();break; // s 下载配置信息
                        default: return;
                    }
                    window.event ? window.event.cancelBubble = true : e.stopPropagation();
                    window.event ? window.event.returnValue = false : e.preventDefault();

                } else if (e.ctrlKey || e.metaKey) {
                    switch (event.keyCode) {
                        case 83: this.save_config(); break; // s 保存
                        case 68: this.shear(); break; // s 保存
                        case 90: this.toPre(); break; // z 回撤
                        case 65: this.initRuler(); break; //A 轨道自适应
                        case 37: this.time_line_pre(60); break;//左 退秒
                        case 39: this.time_line_next(60); break;// 右 进秒
                        case 38: this.time_line_pre(10); break;//左 退帧
                        case 40: this.time_line_next(10); break;//右 进帧
                        case 81: this.state.subtitles_show && (this.subtitles_change()); break;// q 加字幕
                        // case 84:this.subtitles_change();break; // q 加字幕
                        default: return;
                    }
                    window.event ? window.event.cancelBubble = true : e.stopPropagation();
                    window.event ? window.event.returnValue = false : e.preventDefault();
                } else {
                    switch (event.keyCode) {
                        case 83: this.clip(); break;//s 剪切
                        case 46: this.deleteUnit(); break;//delete 删除
                        case 8: this.deleteUnit(); break;//delete 删除
                        case 37: this.time_line_pre(1); break;//左 退秒
                        case 39: this.time_line_next(1); break;//右 进秒
                        case 38: this.time_line_pre(1 / 25); break;//左 退帧
                        case 40: this.time_line_next(1 / 25); break;//右 进帧
                        case 35: this.toEnd(); break;// 跳到结束
                        case 36: this.toBegin(); break;// 跳到开始
                        case 189: $('.zoom-out').click(); break;//-zoom out
                        case 109: $('.zoom-out').click(); break;//-zoom out
                        case 187: $('.zoom-in').click(); break;//+zoom in
                        case 107: $('.zoom-in').click(); break;//+zoom in
                        case 32: $('#playBtn').click(); break;//空格
                        default: return;
                    }
                    window.event ? window.event.cancelBubble = true : e.stopPropagation();
                    window.event ? window.event.returnValue = false : e.preventDefault();
                }
            } else {
                if (event.keyCode === 32) {
                    $('#playBtn').click();
                    window.event ? window.event.cancelBubble = true : e.stopPropagation();
                    window.event ? window.event.returnValue = false : e.preventDefault();
                }
            }
        }
    },

    // 快捷键鼠标抬起
    mouseUp(event) {
        let et = $(event.target);
        mediaMoveLock = false;
        //焦点离开素材列表里的素材和播放区域
        if (et.parents('.reveal').length === 0 && et.parents('.mater').length === 0 && !et.hasClass('mater')) {
            $('.material-main-list .mater').removeClass('current');
            if (currentMedia) {
                if (currentMedia[0].pause) {
                    currentMedia[0].pause();
                    currentMedia[0].currentTime = 0;
                }
                // if(currentMedia[0]['lottie']){
                //     let _media=currentMedia[0]['lottie'];
                //     if(_media.goToAndStop){
                //         _media.goToAndStop(0,true);
                //     }
                // }
                currentMedia = '';
                this.playVideo();
            }
        }
        //对元件的边的拖拽结束
        if ((trimR || trimL) && $('.focused.mater-helper').length) {
            trimL = false;
            trimR = false;
            let et = $('.focused.mater-helper');
            addTrim(et);
        }
    },

    // 快捷键 点击
    fnClick(event) {
        let e = window.event || event;
        let et = $(event.target);
        let name = event.target.nodeName;
        let mater_par = et.parents('.mater-helper');
        let mater_has = et.hasClass('mater-helper');
        let mater_helper = mater_par.length ? mater_par : mater_has.length ? mater_has : '';
        if (et.parents('.pathway').length !== 0 || et.hasClass('pathway')) {
            //若没有触发焦点，移除元件焦点
            if ((e.ctrlKey || e.metaKey)) {
                if (mater_helper) {
                    if (!mater_helper.hasClass('new-selected')) {
                        mater_helper.removeClass('ui-selected');
                    } else {
                        mater_helper.removeClass('new-selected');
                    }
                } else {
                    $('.pathway .focused').removeClass('focused');
                }
            } else {
                $('.mater-helper.ui-selected').removeClass('ui-selected');
                if (mater_helper) {
                    // mater_helper.hasClass('focused')?mater_helper.removeClass('focused'):mater_helper.addClass('focused');
                }
            }
        }
    },

    // 快捷键 鼠标按下
    mousedown(event) {
        let e = window.event || event;
        let et = $(event.target);
        let name = event.target.nodeName;
        let mater_par = et.parents('.mater-helper');
        let mater_has = et.hasClass('mater-helper');
        let mater_helper = mater_par.length ? mater_par : mater_has.length ? mater_has : '';
        //输入框return
        if ((name === 'INPUT' && event.target.className !== 'ant-radio-input') || name === 'TEXTAREA') {
            return;
        }
        console.info('***99');
        //未点击播放区域和素材则移除焦点，停止预览
        if (et.parents('.reveal').length === 0 && et.parents('.mater').length === 0 && !et.hasClass('mater')) {
            console.info('***299');
            $('.material-main-list .mater').removeClass('current');
            if (currentMedia) {
                if (currentMedia[0].pause) {
                    currentMedia[0].pause();
                    currentMedia[0].currentTime = 0;
                }
                currentMedia = '';
                this.playVideo();
            }
        }
        if (et.parents('.pathway').length !== 0) {
            // $('.pathway').find('.mater-helper').removeClass('focused');
        }
        //在控制区域
        if (et.parents('.control').length !== 0) {
            //关闭元件详情
            this.closeUnitDetail();
            // 关闭裁剪
            this.setState({ showCropper: false });
            this.playVideo();
        }
        //取消插入状态
        if (et.parents('.clipChoose').length === 0) {
            $('.temp-yellow').find('.yellow').remove();
            $('.mater-helper.hidden').removeClass('hidden').removeClass('ui-draggable-dragging');
            $('.path .hidden').css({ 'visibility': 'visible' });
            $('.clipChoose').css({ 'display': 'none' })
        }
        //右键删除素材按钮隐藏
        if (et.parents('.contentMenu').length === 0) {
            $('.contentMenu').hide();
        }
        //字幕退出选中 状态
        // if (et.parents('.subtitles-path').length === 0&&et.parents('.control-box').length) {
        //     set_current(-1);
        // }
        //转场退出选中状态
        if (et.parents('.focus').length === 0 && et.parents('.control-box').length && !et.hasClass('focused')) {
            $('.pathway').find('.trans').removeClass('focused');
            $('.focus').css({ 'display': 'none' })
        }
        // if (et.parents('.reveal').length === 0) {
        //暂停
        if ((et.parents('.reveal').length === 0) && et.parents('.unit-detail').length === 0 && !this.state.issue.show && !this.state.show_record) {
            if (!currentMedia) {
                // this.setState({'paused': true});
                this.state.paused = true;
            }
        }
        //元件操作tip隐藏
        if (et.parents('.focus').length === 0 && et.parents('.focused').length === 0 && !et.hasClass('focused')) {
            $('.focus').css({ 'display': 'none' })
        }
        if (et.hasClass('trimL')) {
            trimL = true;
            trimR = false;
        } else if (et.hasClass('trimR')) {
            trimR = true;
            trimL = false;
        } else {
            trimL = false;
            trimR = false;
        }
        //在控制区域
        if (et.parents('.control').length !== 0) {
            //关闭元件详情
            this.state.unit_detail = {};
        }
        if (et.parents('.pathway').length !== 0 || et.hasClass('pathway')) {
            //若没有触发焦点，移除元件焦点
            if ((e.ctrlKey || e.metaKey)) {
                if (mater_helper) {
                    if (mater_helper.hasClass('ui-selected') || mater_helper.hasClass('focused')) {
                        // mater_helper.removeClass('ui-selected');
                        // mater_helper.removeClass('focused');
                    } else {
                        mater_helper.addClass('ui-selected');
                        mater_helper.addClass('new-selected');
                        $('.pathway .focused').addClass('ui-selected').removeClass('focused');
                    }
                } else {
                    $('.pathway .focused').removeClass('focused');
                }
            } else {
                //元件退出选中状态
                if (et.parents('.focus').length === 0 && et.parents('.unit-detail').length === 0 && et.parents('.reveal').length === 0 && !et.hasClass('trim') && et.parents('.time-line').length === 0) {
                    $('.pathway').find('.mater-helper').removeClass('focused');
                    $('.focus').css({ 'display': 'none' })
                }
                if (et.parents('.focused').length === 0 && !et.hasClass('focused')) {
                    $('.pathway .focused').removeClass('focused');
                }
                if (et.parents('.ui-selected').length === 0 && !et.hasClass('ui-selected')) {
                    $('.control').find('.ui-selected').removeClass('ui-selected');
                }
                //添加焦点
                if (et.parents('.mater-helper').length !== 0 || et.hasClass('mater-helper')) {
                    if (et.hasClass('trans')) {
                        et.addClass('focused');
                    } else {
                        if (et.hasClass('mater-helper')) {
                            et.addClass('focused')
                        } else {
                            et.parents('.mater-helper').addClass('focused');
                        }
                        let y = $('.pathway').find('.focused');
                        if (y.hasClass('mater-subtitle')) {
                            set_current((y.attr('data-position') * 1 || 0) + 1);
                        }
                    }
                    let o = et.hasClass('mater-helper') ? et : et.parents('.mater-helper');
                    //操作小tip
                    // $('.focus').css({
                    //     left: event.clientX + $(document).scrollLeft() - event.offsetX - 4,
                    //     top: event.clientY +$(document).scrollTop() - event.offsetY - 26,
                    //     display: 'block'
                    // });
                    if (doubleClick === event.target) {
                        this.enterUnitDetail();
                    }
                    doubleClick = event.target;
                    setTimeout(() => {
                        doubleClick = false;
                    }, 300)
                }
            }
        }
        if (et.parents('.focus').length === 0 && et.parents('.focused').length === 0 && !et.hasClass('focused')) {
            $('.focus').css({ 'display': 'none' })
        }
        if (!this.state.showCropper) {
            this.setState({ currentArea: this.state.currentArea })
        }
        // this.setState({currentArea:this.state.currentArea})

    },

    // 截取发布时的缩略图
    getSnapshot(func, num) {
        let n = num || 1;
        let album = [];

        // this.showLoading();
        let section = getSection();
        let time = Math.round(Math.random() * section.e);
        this.set_time_now(time);
        let canvas = $('#sec4-canvas')[0];

        let canv = document.createElement('canvas');
        let ctx = canv.getContext('2d');
        let right = canvas.width > canvas.height;
        canv.width = right ? 854 : 480;
        canv.height = 480;
        switch (this.state.screen_scale) {
            case '16:9': canv.width = 854; break;
            case '4:3': canv.width = 640; break;
            case '1:1': canv.width = 480; break;
            case '9:16': canv.height = 854; canv.width = 480; break;
        }

        this.state.paused = false;
        this.setState({
            loadingSnap: {
                setting: 'show',
                width: 400,
                status: 'loading',
                height: 220,
                title: say('statement', 'say25'),
                // close: () => {
                //     this.setState({loadingSnap: ''})
                // }
            }
        });
        silence = true;
        this.playVideo('goOn');
        let sensitization = setInterval(() => {
            if (n < 1) {
                this.state.loadingSnap = {};
                this.state.newFile = {};
                this.setState({ 'paused': true });
                clearInterval(sensitization);
                setTimeout(() => {
                    silence = false;
                }, 300);
                func(album);
            } else {
                n -= 1;
                let backImg = '';
                try {
                    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, canv.width, canv.height);
                    backImg = canv.toDataURL('image/png');
                } catch (e) {

                }
                album.push(backImg);
                if (this.state.paused) {
                    this.playVideo('goOn');
                }
                let time = Math.round(Math.random() * section.e);
                this.state.time_line_start = 0;
                this.set_time_now(time);
            }
        }, 1000)
    },
    /**
     * 保存轨道信息
     * @param  {String}} auto  （save调接口，pre，auto不调接口，pre修改location.hash）
     */
    save_config(auto, func) {
        if (!this.state.loaded) {
            return;
        }
        let _config = getConfig('clone');
        let that = this;
        _config.project_id = project_id;
        let reveal = $('.reveal');
        // _config.portrait =reveal.hasClass('vertical');
        // _config.aspect =reveal.hasClass('vertical')?'9:16':'16:9';
        if (reveal.hasClass('vertical')) {
            _config.aspect = '9:16';
        } else if (reveal.hasClass('vertical-11')) {
            _config.aspect = '1:1';
        } else if (reveal.hasClass('vertical-43')) {
            _config.aspect = '4:3';
        } else {
            _config.aspect = '16:9';
        }
        let url = window.location.href;
        let group_id = getParam(url, 'group_id') || '';
        if (!save_lock) {
            save_lock = true;
            if (auto === 'save' || !getPreConfig()) {
                if (!this.state.issue.show) {
                    _config.video_list.map((v, k) => {
                        v.obj_list.map((v1, k1) => {
                            if (v1.special) {
                                // v1.special['thumbnail']='';
                                // v1.special['video_preview_img']='';
                            }
                            if (v1.obj_type === 'text') {
                                v1.special.svg1 = '';
                                v1.special.svg = '';
                            }
                        })
                    });
                }
                if (JSON.stringify(_config) === error_config || this.state.unit_detail.show) {
                    save_lock = false;
                    return;
                }
                channel('save_project_config', JSON.stringify(_config), (re) => {
                    project_id = re.project_id;
                    this.state.can_publish = re.can_publish;
                    setPreConfig();
                    (!this.state.unit_detail.show) && (that.setState({ message: {} }));
                    window.location.hash = '#' + project_id + (group_id ? '?group_id=' + group_id : '');
                    save_lock = false;
                    func && func();
                    // setTimeout(() => {
                    //     that.setState({message: {}})
                    // }, 1000)
                }, (re) => {
                    error_config = JSON.stringify(_config);
                    save_lock = false;
                    // that.setState({message: {msg: re.result||'保存失败'}});
                    save_lock = false;
                    // setTimeout(() => {
                    //     that.setState({message: {}})
                    // }, 1000)
                });
            } else if (auto !== 'auto') {
                that.setState({ message: { msg: say('main', 'saved') } });
                window.location.hash = '#' + project_id + (group_id ? '?group_id=' + group_id : '');
                setTimeout(() => {
                    that.setState({ message: {} })
                }, 1000);
                save_lock = false;
                func && func();
            } else {
                save_lock = false;
            }
        }
    },

    // 下载配置信息
    down_config() {
        let _config = getConfig();
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(_config)));
        element.setAttribute('download', 'config.json');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    },

    /**
     * 根据时间指针跳转到相应位置
     * @param  {Number} time(s)
     */
    reSite(time) {
        let timeNow = time / this.state.unit_time * this.state.unit_length;
        let scrollPane = $(".pathway-box");
        let scrollContent = scrollPane.find('.pathway');
        let contentW = scrollContent.width();
        //时间刻度后的内容区域大于外框的1/2&&时间刻度在外框的大于1/2处；
        if ((contentW - timeNow > scrollPane.width() / 2) && (timeNow + this.state.time_line_start > scrollPane.width() / 2)) {
            let leftVal = scrollPane.width() / 2 - timeNow;
            this.state.time_line_start = leftVal;
            this.set_time_line_now(timeNow + this.state.time_line_start);
            scrollContent.css('marginLeft', Math.floor(leftVal));
            let remainder = scrollPane.width() - contentW;
            let percentage = remainder === 0 ? 0 : Math.round(leftVal / remainder * 100);
            $(".scroll-bar").slider("value", percentage);
            this.refreshRuler();
        } else if (timeNow + this.state.time_line_start <= 0) {
            if (timeNow > scrollPane.width() / 2) {
                let leftVal = scrollPane.width() / 2 - timeNow;
                this.state.time_line_start = leftVal;
                this.set_time_line_now(timeNow + this.state.time_line_start);
                scrollContent.css('marginLeft', Math.floor(leftVal));
                let remainder = scrollPane.width() - contentW;
                let percentage = remainder === 0 ? 0 : Math.round(leftVal / remainder * 100);
                $(".scroll-bar").slider("value", percentage);
                this.refreshRuler();
            } else {
                this.state.time_line_start = 0;
                this.set_time_line_now(timeNow);
                scrollContent.css('marginLeft', 0);
                $(".scroll-bar").slider("value", 0);
                this.refreshRuler();
            }
        } else if (timeNow + this.state.time_line_start >= scrollPane.width()) {
            let leftVal = scrollPane.width() - contentW;
            this.state.time_line_start = leftVal;
            this.set_time_line_now(timeNow + this.state.time_line_start);
            scrollContent.css('marginLeft', Math.floor(leftVal));
            $(".scroll-bar").slider("value", 100);
            this.refreshRuler();
        } else {
            this.set_time_line_now(timeNow + this.state.time_line_start);
        }
    },

    // 跳到开始
    toBegin() {
        this.setState({ 'paused': true });
        let section = getSection();
        // this.set_time_now(section.s);
        this.reSite(section.s)
    },

    // 跳到结束
    toEnd() {
        this.setState({ 'paused': true });
        let section = getSection();
        // this.set_time_now(section.e);
        this.reSite(section.e)
    },

    /**
    * 指针向右进n距离
    * @param  {Number} n
    */
    time_line_next(n) {
        let section = getSection();
        let left = this.state.time_line_now - this.state.time_line_start;
        let now = left / this.state.unit_length * this.state.unit_time;
        now += (n || 1 / 60);
        if (section.e && section.e - now >= 0 && now >= section.s) {
            this.set_time_line_now(now / this.state.unit_time * this.state.unit_length + this.state.time_line_start)
        }
    },

    /**
    * 指针向左进n距离
    * @param  {Number} n
    */
    time_line_pre(n) {
        let section = getSection();
        let left = this.state.time_line_now - this.state.time_line_start;
        let now = left / this.state.unit_length * this.state.unit_time;
        now -= (n || 1 / 60);
        if (section.e && section.e - now >= 0 && now >= section.s) {
            this.set_time_line_now(now / this.state.unit_time * this.state.unit_length + this.state.time_line_start)
        } else {
            this.set_time_line_now(0)
        }
    },

    // 加载项目id
    loading_project_id() {
        if (project_id && project_id !== 0 && project_id !== '0') return
        setTimeout(() => {
            this.loading_project_id();
        }, 1000)
    },

    // 获取主题
    get_theme(theme_id) {
        if (theme_id) {
            channel('get_theme_config', { theme_id: theme_id }, (re) => {
                this.setState({ themeConfig: re });
                this.refs.OnlineM.renderData()
            }, () => {
                this.setState({ themeConfig: {} });
                this.refs.OnlineM.renderData()
            }, 'info')
        } else {
            this.setState({ themeConfig: {} });
            setTimeout(() => {
                this.refs.OnlineM.renderData()
            })
        }
    },

    // 设置主题
    set_theme(theme_id) {
        if (theme_id) {
            channel('get_theme_config', { theme_id: theme_id }, (re) => {
                setTheme(re);
                this.setState({ themeConfig: re });
                this.refs.OnlineM.renderData()
            }, () => {
                setTheme({ none: true });
                this.setState({ themeConfig: {} });
                this.refs.OnlineM.renderData()
            }, 'info')
        } else {
            setTheme({ none: true });
            this.setState({ themeConfig: {} });
            setTimeout(() => {
                this.refs.OnlineM.renderData()
            })
        }
    },

    // 刷新资源列表(OnlineM数据)
    refresh_used_list(config) {
        let conf = config || getConfig();
        let list = {};
        if (conf && conf.video_list) {
            conf.video_list.map((v, k) => {
                v.obj_list.map((_v, _k) => {
                    list[_v.obj_id] = true;
                })
            })
        }
        if (conf && conf.audio_list) {
            conf.audio_list.map((v, k) => {
                v.obj_list.map((_v, _k) => {
                    list[_v.obj_id] = true;
                })
            })
        }
        this.setState({ used_list: list });
        let json = JSON.stringify(list);
        if (json !== pre_used_list) {
            pre_used_list = json;
            this.refs.OnlineM.renderData()
        }
    },
    componentWillMount() {
        let url = window.location.href;
        initInterview();
        const msg = getParam(url, 'msg');
        if (msg) message.info(decodeURI(msg));
        project_id = getParam(url, 'online') || '0';
        let group_id = getParam(url, 'group_id') || '';
        localStorage.xinhua_group = group_id;
        multiple = 2;
        time_unit = 10;
        maxLength = 90;
        _render_path_lock = [0, 0];
        initConfig((solo) => {
            $(".pathway-box .pathway").css("margin-left", this.state.time_line_start || 0 + "px");
            // !solo&&(this.refreshRuler());
            let _config = getConfig();
            this.state.max_time = _config.duration + 50;
            this.refreshRuler();
            this.initPathWidth();
            this.refresh_used_list();
            this.playVideo();
        });
        this.loading_project_id();
        refreshInfo((re) => {
            this.setState({ userInfo: re });
        });
        if (project_id && project_id != 0) {
            this.state.loaded = false;
            localStorage.projectName = '';
            channel('get_project_config', { project_id: project_id }, (re) => {
                project_id = re.project_id;
                is_template = re.is_template;
                re.theme_id && this.get_theme(re.theme_id);
                let text_list = get_list().list;
                re['text_info'] = re['text_info'] || {
                    "font_size": 50,
                    "status": false,
                    "font_color": 'ffffff',
                    "font_name": 'FZShuSong-Z01S',
                    "background_color": '000000',
                    "alpha": 0,
                    "position_x": 'middle',  // 水平位置，left, middle, right
                    "position_y": 0,  // 底部间距，px
                };
                re['text_info'].status = true;
                re['text_list'] = re['text_list'] || [  // 视频轨道列表
                    {
                        "name": "字幕轨",  // 名称
                        "order": 1,  // 排序
                        "volume": 100,
                        "duration": 0,
                        "update_time": "2017-08-02 12:21:12",  // 最近更新时间
                        "lock_track": false,  // 是否锁定
                        "obj_list": text_list
                    }];
                this.state.can_publish = re.can_publish;
                setConfig(re);
                this.state.loaded = true;
                project_id = re.project_id;
                let reveal = $('.reveal');
                this.state.subtitles_show = re.text_info.status;
                // this.state.subtitles_show=false;


                switch (re.aspect) {
                    case '16:9': this.state.cropperSize = 16 / 9; this.state.screen_scale = '16:9'; break;
                    case '4:3': reveal.addClass('vertical-43'); this.state.cropperSize = 4 / 3; this.state.screen_scale = '4:3'; break;
                    case '1:1': reveal.addClass('vertical-11'); this.state.cropperSize = 1; this.state.screen_scale = '1:1'; break;
                    case '9:16': reveal.addClass('vertical'); this.state.cropperSize = 9 / 16; this.state.screen_scale = '9:16'; break;
                }
                // 初始化时监视器的比例
                // if(re.portrait){
                //     this.state.cropperSize = 9 / 16;
                // }else {
                //     this.state.cropperSize = 16 / 9;
                // }
                this.renderPath('return');


                // channel('save_project_config', JSON.stringify(_config), (response) => {
                //     channel('get_project_config', {project_id: window.location.hash.split('#')[1] || '0'}, (re) => {
                //         this.state.can_publish=re.can_publish;
                //         setConfig(re);
                //         project_id = re.project_id;
                //         let reveal=$('.reveal');
                //         this.state.subtitles_show=re.text_info.status;
                //         // this.state.subtitles_show=false;
                //         re.portrait?reveal.addClass('vertical'):reveal.removeClass('vertical');
                //         this.renderPath('return');
                //     },()=>{
                //         this.renderPath('return');
                //     })
                // },(re)=>{
                //     this.state.can_publish=re.can_publish;
                //     setConfig(re);
                //     project_id = re.project_id;
                //     let reveal=$('.reveal');
                //     this.state.subtitles_show=re.text_info.status;
                //     // this.state.subtitles_show=false;
                //     re.portrait?reveal.addClass('vertical'):reveal.removeClass('vertical');
                //     this.renderPath('return');
                // });
            }, (data) => {
                this.renderPath('return');
            }, 'info');
        } else {
            getConfig().name = localStorage.projectName || say('main', 'MyProject');
            this.renderPath('return');
        }
        set_refresh((config) => {
            this.state.subtitles_config = config || {
                current: 0,
                list: []
            };
            render_subtitle(config);
        });
    },
    componentWillUnmount() {
        error_config = '';
        clearInterval(auto_save);
        clearTranslate();
        refreshScrollBar = () => { };
        set_refresh(() => {

        });
        let video_list = getVideoList();
        for (let i in video_list) {
            if (video_list[i].pause && !video_list[i].paused) {
                video_list[i].pause();
            }
            if (video_list[i].destroy) {
                video_list[i].destroy();
            }
        }
        clearConfig();
        pre_used_list = '';
        let state = {
            userInfo: {},
            auto_indent: true,
            items: [],
            files: [],
            fileName: '',
            duration: 0,
            paused: true,
            record: {},
            path_box: 0,
            meal: {},
            currentArea: '',
            currentAreaId: '',
            transition: '',
            message: {},
            can_publish: true,
            subtitles_config: { current: 0, list: [] },
            subtitles_show: false,
            main_set: true,
            fullScreen: false,
            themeConfig: {},
            loadingMedia: false,
            unit_detail: {},
            screen_scale: '16:9',
            issue: {},
            loadingSnap: {},
            refreshDialog: '',
            currentMediaDuration: 0,
            _pathway: [],//轨道dom
            _ctrl: [],//轨道控制dom
            unit_length: 10,//刻度尺中单位长度，以像素计量
            unit_time: 1,//刻度尺中单位时间，以秒计量
            unit_scale: 1,//缩放倍数
            time_line_start: 0,//0位置时间针，像素
            time_line_now: 0,//当前位置时间针，秒
            newFile: '',
            delete: '',
            max_time: 50
        };
        for (let i in state) {
            this.state[i] = state[i]
        }
        $(window).unbind("resize", windowResize);
        if (document.addEventListener) {
            document.removeEventListener("keydown", this.fnKeyup, false);
            document.removeEventListener("mousedown", this.mousedown, false);
            document.removeEventListener("click", this.fnClick, false);
            document.removeEventListener("mousemove", this.mouseMove, false);
            document.removeEventListener("mouseup", this.mouseUp, false);
        }
        else {
            document.detachEvent("onkeydown", this.fnKeyup);
            document.detachEvent("onmousedown", this.mousedown);
            document.detachEvent("onclick", this.fnClick);
            document.detachEvent("mousemove", this.mouseMove);
            document.detachEvent("onmouseup", this.mouseUp);
        }
    },

    // 刷新时间尺
    refreshRuler(reset) {
        let _config = getConfig();
        let multiple = 2;
        this.setState({ 'duration': getTime(_config.duration) });
        let ruler = $('.ruler');
        if (ruler.length < 1) return;
        let canvas_ruler = ruler[0];
        let context_ruler = canvas_ruler.getContext('2d');
        canvas_ruler.width = parseFloat(ruler.css('width')) * multiple;
        canvas_ruler.height = parseFloat(ruler.css('height')) * multiple;
        let _length = this.state.unit_length;//基础单位长度
        let _scale = this.state.unit_scale;//基础放大倍数
        let _time = this.state.unit_time;//基础单位时间
        let _max_time = this.state.max_time;//项目最大时间长度
        let _path_box = this.state.path_box;
        let max_scale = _max_time * 10 / _path_box;
        let _max_scale = _max_time / 90;
        let t1 = 7 / _scale * _max_scale;
        if (reset) {
            let _time_scale = [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 30, 60, 120, 300, 600, 1200, 1800, 3600, 7200, 10800, 21600];
            for (let i = 0; i < _time_scale.length; i++) {
                if (_time_scale[i] >= t1) {
                    _time = _time_scale[i] / 10;
                    break;
                }
            }
        }
        let _start = Math.floor(this.state.time_line_start) * (-1) / _length * _time;
        let _start_len = Math.floor(this.state.time_line_start) % (_length * 10);
        let _start_time = Math.floor(this.state.time_line_start) * (-1) / _length * _time % (_time * 10);
        if (reset) {
            _length = (10 * _scale * _time / _max_scale).toFixed(4) * 1;
            this.setState({ unit_time: _time });
            this.setState({ unit_length: _length });
        }
        context_ruler.font = 12 * multiple + "px Arial";
        context_ruler.beginPath();
        context_ruler.lineCap = "round";
        context_ruler.strokeStyle = "#888";
        for (let i = 0; i <= 300; i++) {
            context_ruler.lineWidth = 1;
            let y = i % 5 === 0 ? i % 10 === 0 ? 28 : 31 : 33;
            let len = Math.ceil(i * _length + _start_len);
            context_ruler.moveTo(len * multiple, multiple * y);
            context_ruler.lineTo(len * multiple, multiple * 35);
        }
        context_ruler.stroke(); // 进行绘制
        context_ruler.beginPath();
        context_ruler.lineCap = "round";
        context_ruler.strokeStyle = "#000";
        for (let i = 0; i <= 300; i++) {
            context_ruler.lineWidth = 1;
            let y = i % 5 === 0 ? i % 10 === 0 ? 28 : 30 : 32;
            let len = Math.ceil(i * _length + _start_len);
            if (i % 10 === 0) {
                context_ruler.fillStyle = '#999';
                context_ruler.textAlign = 'center';
                context_ruler.fillText(getTime(_start + _time * i - _start_time), len * multiple, 19 * multiple);
                context_ruler.moveTo(len * multiple + 1, multiple * y);
                context_ruler.lineTo(len * multiple + 1, multiple * 35);
            }
        }
        context_ruler.stroke(); // 进行绘制
    },
    initPathWidth() {
        $('.pathway').css({ width: this.state.max_time * this.state.unit_length / this.state.unit_time });
        this.setState({ path_box: parseFloat($('.tl-wrapper').css('width')) - ctrl_width });
        $('.pathway .mater-helper').each((k, v) => {
            renderUnit($(v), this.state.unit_length, this.state.unit_time, true);
            if ($(v).hasClass('new')) {
                this.setDrag($(v))
            }
        })
    },
    initScrollBar() {
        let that = this;
        //滚动面板部分
        let scrollPane = $(".pathway-box"),
            scrollContent = $(".pathway");
        //创建滑块
        let zoomBar = $('.zoom-bar').slider({
            range: "min",
            value: 1,
            min: 1,
            max: 100,
            step: 0.1,
            slide: function (event, ui) {
                // let len = that.state.unit_length, time = that.state.unit_time, scale = ui.value;
                let pre_scale = that.state.unit_scale;
                // let scrollContent = scrollPane.find('.pathway');
                // that.state.time_line_start = that.state.time_line_now/pre_scale*ui.value;
                // let total=(that.state.time_line_now-that.state.time_line_start)/pre_scale*ui.value;
                // let _now=total+that.state.time_line_start;
                // if(ui.value>pre_scale){
                //     if(_now>=scrollPane.width()/2){
                //         that.state.time_line_now=scrollPane.width()/2;
                //         that.state.time_line_start=scrollPane.width()/2-total;
                //         scrollContent.css("margin-left", scrollPane.width()/2-total);
                //     }else{
                //         that.state.time_line_now=_now;
                //     }
                // }
                that.state.time_line_now = (that.state.time_line_now - that.state.time_line_start) / pre_scale * ui.value;
                that.setState({ unit_scale: ui.value })
                that.refreshRuler(true);
                that.initPathWidth();
                resetValue();
                sizeScrollbar();
                reflowContent();
            }
        });
        $('.zoom-in').bind('click', function () {
            if (zoomLock) {
                return;
            }
            zoomLock = true;
            setTimeout(() => {
                zoomLock = false;
            }, 300);
            let value = $('.zoom-bar').slider("option", "value");
            if (value >= 100) return;
            $('.zoom-bar').slider("option", "value", value * 1 + 0.1);
            that.setState({ unit_scale: value * 1 + 0.1 })
            that.refreshRuler(true);
            that.initPathWidth();
            resetValue();
            sizeScrollbar();
            reflowContent();
        });
        $('.zoom-out').bind('click', function () {
            if (zoomLock) {
                return;
            }
            zoomLock = true;
            setTimeout(() => {
                zoomLock = false;
            }, 300);
            let value = $('.zoom-bar').slider("option", "value");
            if (value <= 1) return;
            $('.zoom-bar').slider("option", "value", value * 1 - 0.1);
            that.setState({ unit_scale: value * 1 - 0.1 })
            that.refreshRuler(true);
            that.initPathWidth();
            resetValue();
            sizeScrollbar();
            reflowContent();
        });
        zoomBar.find('span').removeAttr('tabIndex');
        let scrollbar = $(".scroll-bar").slider({
            slide: function (event, ui) {
                let marginLeft = 0;
                let scrollContent = scrollPane.find('.pathway');
                if (scrollContent.width() > scrollPane.width()) {
                    marginLeft = Math.round(
                        ui.value / 100 * (scrollPane.width() - scrollContent.width())
                    );
                }
                scrollContent.css("margin-left", marginLeft + "px");
                let pre_start = that.state.time_line_start;
                that.state.time_line_start = marginLeft;
                that.state.time_line_now = marginLeft - pre_start + that.state.time_line_now;
                that.refreshRuler();
            }
        });
        //追加要处理的图标
        let handleHelper = scrollbar.find(".ui-slider-handle")
            .mousedown(function () {
                scrollbar.width(handleHelper.width());
            })
            .mouseup(function () {
                scrollbar.width("100%");
            }).removeAttr('tabIndex')
            // .append("<span class='ui-icon ui-icon-grip-dotted-vertical'></span>")
            .wrap("<div class='ui-handle-helper-parent'></div>").parent();

        //由于滑块手柄滚动，改变要隐藏的溢出部分
        scrollPane.css("overflow", "hidden");
        //根据要滚动距离按比例定义滚动条和手柄的尺寸
        function sizeScrollbar() {
            scrollbar.width("100%");
            let scrollContent = scrollPane.find('.pathway');
            let remainder = scrollContent.width() - scrollPane.width();
            let proportion = remainder / scrollContent.width();
            let handleSize = scrollbar.width() - (proportion * scrollbar.width());
            scrollbar.find(".ui-slider-handle").css({
                width: handleSize,
                "margin-left": -handleSize / 2
            });
            handleHelper.width("").width(scrollbar.width() - handleSize);
        }

        //基于滚动内容位置，重置滑块的值
        function resetValue() {
            let scrollContent = scrollPane.find('.pathway');
            let remainder = scrollPane.width() - scrollContent.width();
            let leftVal = scrollContent.css("margin-left") === "auto" ? 0 :
                parseInt(scrollContent.css("margin-left"));
            let percentage = remainder === 0 ? 0 : Math.round(leftVal / remainder * 100);
            scrollbar.slider("value", percentage);
        }

        //如果滑块是 100%，且窗口变大，则显示内容
        function reflowContent() {
            let scrollContent = scrollPane.find('.pathway');
            let showing = scrollContent.width() + parseInt(scrollContent.css("margin-left"), 10);
            let gap = scrollPane.width() - showing;
            if (gap > 0) {
                let pre = that.state.time_line_start;
                that.state.time_line_start = parseInt(scrollContent.css("margin-left"), 10) + gap;
                // that.state.time_line_now = that.state.time_line_now + that.state.time_line_start-pre;
                scrollContent.css("margin-left", parseInt(scrollContent.css("margin-left"), 10) + gap);
                that.refreshRuler();
            }
        }

        //初始化滚动条大小
        setTimeout(sizeScrollbar, 10);//safari 超时
        return function () {
            resetValue();
            sizeScrollbar();
            reflowContent();
        }
    },
    set_time_line_now(len, single, noRenderCanvas) {
        clearTimeout(renderPicLock);
        // len=len>0?len:0;
        if (len < 0) {
            this.state.time_line_start = this.state.time_line_start - len > 0 ? 0 : this.state.time_line_start - len;
            $(".pathway-box .pathway").css("margin-left", this.state.time_line_start || 0 + "px");
            this.refreshRuler();
            len = 0;
        }
        this.setState({ time_line_now: len });
        renderPicLock = setTimeout(() => {
            // 不渲染canvas
            if (!noRenderCanvas) {
                this.playVideo(single || '');
            }
        }, 20)
    },
    set_time_now(time) {
        let len = time / this.state.unit_time * this.state.unit_length + this.state.time_line_start;
        if (this.state.time_line_now !== len) {
            this.set_time_line_now(len)
        }
    },
    setDrag(o) {
        let that = this;
        let $control = $('.control .pathway-box');
        o.removeClass('new');
        if (o.attr('data-mediaType') === 'transition') return;
        o.draggable({
            appendTo: ".flex-column",
            cancel: ".trans,.trim", // 点击一个图标不会启动拖拽
            scope: "maters",
            scroll: false,
            // helper:'clone',
            snapMode: 'inner',
            snap: '.mater-helper,.pathway',
            snapTolerance: that.state.auto_indent ? 10 : 0,
            cursor: "move",
            helper: (e, u) => {
                let parent = $(document.createElement('div'));
                let path = $('.pathway-box .pathway');
                let start = false;
                let sum = [];
                parent.css({ marginLeft: '-' + o.css('left') });
                path.map((k, v) => {
                    let son = path.eq(k).find('.mater-helper.ui-selected');
                    if (!son.length) {
                        son = path.eq(k).find('.mater-helper.focused');
                    }
                    if (son.length) {
                        son.addClass('ui-draggable-dragging');
                    }
                    if (son.length && !start) {
                        parent.css({ marginTop: -(o.attr('data-layer') - son.attr('data-layer')) * dragGrid + 'px' });
                        start = true;
                    }
                    if (start) {
                        let par = $(document.createElement('div'));
                        par.addClass('drag-layer');
                        if (path.eq(k).hasClass('main')) {
                            par.addClass('main');
                        }
                        son.map((k, v) => {
                            par.append(son.eq(k).clone());
                        });
                        if (son.length) {
                            for (let i = 0; i < sum.length; i++) {
                                let par = $(document.createElement('div'));
                                par.addClass('drag-layer');
                                if (sum[i]) {
                                    par.addClass('main');
                                }
                                parent.append(par);
                            }
                            sum = [];
                            parent.append(par);
                        } else {
                            if (path.eq(k).hasClass('main')) {
                                sum.push(true)
                            } else {
                                sum.push(false)
                            }
                        }
                    }
                });
                parent.find('.ui-selected.focused').removeClass('focused');
                return parent
            },
            start: function (event, ui) {
                let son = ui.helper.find('[data-mediaType=audio]');
                son.map((k, v) => {
                    renderUnit(son.eq(k), that.state.unit_length, that.state.unit_time, 'canvas');
                });
                let son1 = ui.helper.find('.mater-main');
                son1.map((k, v) => {
                    renderUnit(son1.eq(k), that.state.unit_length, that.state.unit_time, 'canvas');
                });
                // let son='';
                $('.focus').css({ 'display': 'none' });
                if (!event.altKey) {
                    let path = $('.pathway-box .pathway');
                    path.find('.mater-helper.ui-selected').addClass('hidden');
                    $(event.target).addClass('hidden');
                }
                dragStart(ui.helper, (event.altKey));
            },
            drag: function (event, ui) {
                if (ui.helper.hasClass('license')) {
                    let son = ui.helper.find('.mater-helper');
                    let _left = 99999;
                    son.map((k, v) => {
                        let obj = son.eq(k);
                        let start_time = obj.attr('data-startTime');
                        let end_time = obj.attr('data-endTime');
                        let offset = obj.offset();
                        let top = offset.top - $control.offset().top;
                        let $left = offset.left - $control.offset().left;
                        _left = Math.min(_left, $left);
                        setTimeout(() => {
                            // if ($left >= 0) {
                            //     that.set_time_line_now($left, 'recycle');
                            // }
                            let left = $left - that.state.time_line_start;
                            let now = left / that.state.unit_length * that.state.unit_time;
                            testConfig(obj, now, now - start_time + end_time * 1, Math.round(top / dragGrid), that.state.auto_indent ? that.state.unit_time / that.state.unit_length : 0);

                        })
                    });
                    setTimeout(() => {
                        if (_left >= 0) {
                            that.set_time_line_now(_left, 'recycle');
                        }
                    })
                }
            },
            stop: function (event, ui) {
                let o = $(ui.helper);
                that.set_time_line_now(that.state.time_line_now);
                let son = $('.pathway-box .mater-helper.ui-selected');
                if (!son.length) {
                    son = $('.pathway-box .mater-helper.focused');
                }
                if (!$(ui.helper).find('.yellow.focused').length) {
                    // son.eq(0).addClass('hidden')
                    son.map((k, v) => {
                        let o = son.eq(k);
                        if (o.hasClass('hidden')) {
                            if (o.hasClass('yellow')) {
                                o.addClass('hidden')
                            } else if (o.hasClass('red')) {
                                o.removeClass('hidden')
                            } else if (o.hasClass('license')) {
                                o.remove();
                            } else {
                                o.removeClass('hidden').removeClass('ui-draggable-dragging');
                            }
                        }
                    });
                }
                if ($(ui.helper).find('.yellow.focused').length) {
                    // son.eq(0).addClass('hidden')
                }
                $('.flex-column >.ui-draggable-handle').remove();
            }
        })
    },
    mouseMove(event) {
        let focus = $('.focused.mater-helper');
        let sub_type = focus.attr('data-subType');
        if (mediaMoveLock && currentMedia) {
            let num = event.clientX + $(document).scrollLeft() - $('.progress').offset().left;
            currentMedia[0] && (currentMedia[0].currentTime = (currentMedia[0].duration || 0) * (num > 0 ? num : 0) / ($('.progress').width() - 2));
            this.setState({ 'paused': true });
            this.playMedia('once');
        }
        if (focus.length) {
            let len = (event.clientX + $(document).scrollLeft() - ctrl_width);
            let time = (len - this.state.time_line_start) / this.state.unit_length * this.state.unit_time;
            if (sub_type === 'animation') {
                trimL = trimR = false;
            }
            if (trimL || trimR) {
                ('004')
                this.set_time_line_now(len);
            }
            if (trimL) {
                testTrim(focus, time, 'left')
            } else if (trimR) {
                testTrim(focus, time, 'right')
            } else {
                return;
            }
            renderUnit(focus, this.state.unit_length, this.state.unit_time, true);
        }
    },
    // 初始化时间尺
    initRuler() {
        // console.info('init');
        // $(".pathway-box .pathway").css("margin-left", this.state.time_line_start || 0 + "px");
        // // !solo&&(this.refreshRuler());
        // let _config=getConfig();
        // this.state.max_time=_config.duration+50;
        // this.refreshRuler();
        // this.initPathWidth();
        // this.refresh_used_list();
        // this.playVideo();
        // refreshScrollBar();

        // this.state.time_line_now =(this.state.time_line_now-this.state.time_line_start)/this.state.unit_scale;
        $('.zoom-bar').slider("option", "value", 1);
        // this.set_time_now(0)
        this.setState({ unit_scale: 1 });
        setTimeout(() => {
            this.refreshRuler(true);
            setTimeout(() => {
                this.initPathWidth();
                refreshScrollBar();
            })
        })
        // refreshScrollBar();

    },

    // 获取素材的按画布比例缩放的宽高，坐标和原始宽高
    getMediaShape(media, type, w, h) {
        let width = w, height = h, halfWidth = 0, halfHeight = 0, positionX = 0,
            positionY = 0;
        if (type === 'video') {
            width = media.videoWidth;
            height = media.videoHeight;
            // 如果是gif 高度/2
            if (currentMedia[4]) height = height / 2;
        } else if (type === 'image') {
            width = media.width;
            height = media.height;
        } else if (type === 'text') {
            // width = temp[i].special.position_w * canvas.width / 1920;
            // height = temp[i].special.position_h * canvas.height / 1080;
            // positionX = temp[i].special.position_x * canvas.width / 1920;
            // positionY = temp[i].special.position_y * canvas.height / 1080;
        }
        let sw = width, sh = height;
        if (type !== 'text') {
            if (width / height > (w > h ? 16 / 9 : 9 / 16)) {
                halfHeight = (h - height * w / width) / 2
            } else {
                halfWidth = (w - width * h / height) / 2
            }
            width = w;
            height = h;
        } else {
            halfHeight = (h - height) / 2;
            halfWidth = (w - width) / 2;
            width = w;
            height = h;
        }
        return { w: width, h: height, x: halfWidth, y: halfHeight, sw: sw, sh: sh };

    },

    // 播放视频
    playVideo(single, a, b) {
        if (currentMedia) {
            this.playMedia('once');
            return;
        }
        if (single === 'area') {
            this.state.currentArea = b;
            this.state.currentAreaId = a;
            if (!this.state.paused) {
                this.setState({ 'paused': true });
                let video_list = getVideoList();
                for (let i in video_list) {
                    if (video_list[i].pause && !video_list[i].paused) {
                        video_list[i].pause();
                    }
                }
                setTimeout(() => {
                    this.renderCanvas('single')
                }, 100);
                return;
            }
        }
        if (this.state.paused) {
            let video_list = getVideoList();
            for (let i in video_list) {
                if (video_list[i].pause && !video_list[i].paused) {
                    // video标签的暂停
                    video_list[i].pause();
                }
            }
        }
        if ((!this.state.paused) && (single === 'area' || !single)) {
            return;
        }
        let canvas = $('#sec4-canvas')[0];
        let preview_record = $('#sec5-canvas')[0];
        if (preview_record && this.state.show_record) {
            canvas = preview_record;
        }
        if (!canvas) {
            let video_list = getVideoList();
            for (let i in video_list) {
                if (video_list[i].pause && !video_list[i].paused) {
                    video_list[i].pause();
                }
            }
            clearVideoList();
            return;
        }
        clearTimeout(timeoutLock);
        let video_list = getVideoList();
        let section = getSection();
        let left = this.state.time_line_now - this.state.time_line_start;
        let now = (left / this.state.unit_length * this.state.unit_time).toFixed(6) * 1;
        if ((!this.state.paused) && single) {
            if (this.state.newFile.setting) {
                for (let i in video_list) {
                    if (video_list[i].pause && !video_list[i].paused) {
                        video_list[i].pause();
                    }
                }
            } else {
                let _time = +new Date();
                let balance = _time - pre_time;
                if (balance > 0 && balance < 200) {
                    now += balance / 1000;
                }
                pre_time = _time;
                if (section.s && now < section.s) {
                    now = section.s;
                }
                if (section.e && section.e - now < 0.01) {
                    for (let i in video_list) {
                        if (video_list[i].pause && !video_list[i].paused) {
                            video_list[i].pause();
                        }
                    }
                    this.setState({ 'paused': true });
                    return;
                }
                let re = getVideoPiece(now, '', silence, this.state.paused);
                re && (orderList = re[0]);
                if (re && re[2]) {
                    // requestAnimationFrame(this.renderCanvas);
                    for (let i in video_list) {
                        if (video_list[i].pause && !video_list[i].paused && video_list[i].readyState > 1) {
                            video_list[i].pause();
                        }
                    }
                    setTimeout(() => {
                        this.playVideo(single, a, b);
                    }, 1000 / 10);
                    // // this.showLoading();
                    mediaLoading = setTimeout(() => {
                        this.setState({ 'loadingMedia': true });
                    }, 1000);
                    return;
                } else {
                    clearTimeout(mediaLoading);
                }
                let timeNow = (now < re[1] ? re[1] : now) / this.state.unit_time * this.state.unit_length;
                let scrollPane = $(".pathway-box");
                let scrollContent = scrollPane.find('.pathway');
                let contentW = scrollContent.width();
                if ((contentW - timeNow > scrollPane.width() / 2) && (timeNow + this.state.time_line_start > scrollPane.width() / 2)) {
                    let leftVal = scrollPane.width() / 2 - timeNow;
                    this.state.time_line_start = leftVal;
                    this.set_time_line_now(timeNow + this.state.time_line_start);
                    scrollContent.css('marginLeft', Math.floor(leftVal));
                    let remainder = scrollPane.width() - contentW;
                    let percentage = remainder === 0 ? 0 : Math.round(leftVal / remainder * 100);
                    $(".scroll-bar").slider("value", percentage);
                    this.refreshRuler();
                } else if (timeNow <= -this.state.time_line_start) {
                    if (timeNow > scrollPane.width() / 2) {
                        let leftVal = scrollPane.width() / 2 - timeNow;
                        this.state.time_line_start = leftVal;
                        this.set_time_line_now(timeNow + this.state.time_line_start);
                        scrollContent.css('marginLeft', Math.floor(leftVal));
                        let remainder = scrollPane.width() - contentW;
                        let percentage = remainder === 0 ? 0 : Math.round(leftVal / remainder * 100);
                        $(".scroll-bar").slider("value", percentage);
                        this.refreshRuler();
                    } else {
                        this.state.time_line_start = 0;
                        this.set_time_line_now(timeNow);
                        scrollContent.css('marginLeft', 0);
                        $(".scroll-bar").slider("value", 0);
                        this.refreshRuler();
                    }
                } else {
                    this.set_time_line_now(timeNow + this.state.time_line_start, '', true);
                    // this.set_time_line_now(timeNow + this.state.time_line_start);
                }
            }
            requestAnimationFrame(this.renderCanvas);
            requestAnimationFrame(this.playVideo);
        } else if (this.state.paused && (single === 'area' || !single)) {
            if (((section.s && now <= section.s) || (section.e && section.e - now < 0)) && this.state.unit_detail.show) {
                now = section.s + 1 / 60;
                this.set_time_line_now(now / this.state.unit_time * this.state.unit_length + this.state.time_line_start)
            }
            if (section.s && now <= section.s) {
                now = section.s + 1 / 60;
            } else if (section.e && section.e - now < 0.01) {
                now = section.e - 1 / 60;
            }
            let re = getVideoPiece(now, true, silence, this.state.paused);
            re && (orderList = re[0]);
            this.setState({ paused: true });
            setTimeout(() => {
                requestAnimationFrame(this.renderCanvas);
            }, 1000 / 10);
            return;
        } else if (single === 'recycle') {
            // $('#player-container').find('.recycle').addClass('show');
            return;
            // } else {
            //     $('#player-container').find('.recycle').removeClass('show');
        }
        timeoutLock = setTimeout(() => {
            let video_list = getVideoList();
            for (let i in video_list) {
                if (video_list[i] && video_list[i].pause && !video_list[i].paused) {
                    video_list[i].pause();
                }
            }
        }, 40);
    },

    /**
     * 播放素材
     * @param  {String}  once 是否只播放一次？
     * */
    playMedia(once) {
        let media = currentMedia[0],
            type = currentMedia[1];
        if (once && !this.state.paused) {
            return;
        }

        /*
        * animation render*/
        // if(currentMedia[0]['lottie']){
        //     let _media=currentMedia[0]['lottie'];
        //     media.duration=_media.getDuration();
        //     type='image';
        // }


        let canvas = $('#sec4-canvas')[0];
        let context = canvas.getContext('2d');
        let audioPreview = '';
        if (media.readyState !== 1) {
            canvas.width = $(canvas).width();
            canvas.height = $(canvas).height();
            context.fillStyle = "#000";
            context.fillRect(0, 0, canvas.width, canvas.height);
        }
        if ((type === 'video' || type === 'audio' || media['lottie']) && once !== 'once') {
            this.state.paused = !this.state.paused;
            media.onended = () => {
                this.setState({ 'paused': true });
            }
        }
        if (type === 'audio' && currentMedia[3]) {
            let h = canvas.height;
            let w = canvas.width;
            audioPreview = true;
            channel(currentMedia[3], {}, (re) => {
                let len = re.left.length;
                context.font = "14px Arial";
                context.strokeStyle = '#e9e9e9';
                context.beginPath();
                for (let i = 0; i <= w; i++) {
                    let l = Math.floor(len / w * i);
                    context.lineWidth = 1;
                    context.strokeStyle = '#c6c6c6';
                    let _l = re.left[l] || 0.01;
                    let _r = re.right[l] || 0.01;
                    context.moveTo(i, h / 2 - _l * h / 4);
                    context.lineTo(i, h / 2 + 1);
                    context.moveTo(i, h / 2 - _r * h / 4);
                    context.lineTo(i, h / 2 + 1);
                    // context.moveTo(i, h/2-_l*h/4);
                    // context.lineTo(i, h/2+_r*h/4);
                    // context.moveTo(i, h/2-_l*h/4);
                    // context.lineTo(i, h/2+_r*h/4);
                }
                context.stroke(); // 进行绘制
            }, () => {
                audioPreview = false;
            })
        }
        if (((type === 'video' || type === 'audio') && media.readyState < 2) || (type === 'image' && !media.complete)) {
            if (media.readyState < 1 && !this.state.loadingMedia) {
                this.setState({ 'loadingMedia': true });
            }
            this.setState({ 'paused': this.state.paused });
            // (media.currentTime)&&(media.currentTime=0);
            media[(type === 'video' || type === 'audio') ? 'oncanplay' : 'onload'] = () => {
                this.setState({ 'loadingMedia': false });
                if ((!currentMedia) || currentMedia[0] !== media) {
                    media.pause ? media.pause() : '';
                    if (media['lottie']) {
                        // media['lottie'].pause?media['lottie'].pause():'';
                    }
                    return
                }
                let shape = this.getMediaShape(media, type, canvas.width, canvas.height);
                if (once) {
                    if (media && !audioPreview) {
                        if (type === 'audio') {
                            context.drawImage(type === 'audio' ? audiotThumbnail : media, 0, 0, canvas.width, canvas.height);
                        } else {
                            context.drawImage(type === 'audio' ? audiotThumbnail : media, 0, 0, shape.sw, shape.sh, shape.x, shape.y, shape.w - shape.x * 2, shape.h - shape.y * 2);
                        }

                        // context.drawImage(type==='audio'?audiotThumbnail:media,shape.x, shape.y , shape.w - shape.x * 2, shape.h - shape.y * 2);
                    }
                    this.setState({ 'paused': true });
                    return;
                }
                media.play ? media.play() : '';
                // console.info(media['lottie']);
                // if(media['lottie']){
                // console.info(media['lottie']);
                // console.info(media['lottie'].play);
                // media['lottie'].play?media['lottie'].play():'';
                // }
                let func = () => {
                    if (this.state.paused) {
                        media.pause ? media.pause() : '';
                        // if(media['lottie']){
                        //     media['lottie'].pause?media['lottie'].pause():'';
                        // }
                        this.setState({ 'paused': true });
                        return;
                    } else {
                        if (media && !audioPreview) {
                            canvas.width = $(canvas).width();
                            canvas.height = $(canvas).height();
                            context.fillStyle = "#000";
                            context.fillRect(0, 0, canvas.width, canvas.height);
                            let shape = this.getMediaShape(media, type, canvas.width, canvas.height);
                            try {
                                if (type === 'audio') {
                                    context.drawImage(type === 'audio' ? audiotThumbnail : media, 0, 0, canvas.width, canvas.height);
                                } else {
                                    context.drawImage(type === 'audio' ? audiotThumbnail : media, 0, 0, shape.sw, shape.sh, shape.x, shape.y, shape.w - shape.x * 2, shape.h - shape.y * 2);
                                }
                            } catch (e) {

                            }
                            // context.drawImage(type==='audio'?audiotThumbnail:media,0,0,shape.sw, shape.sh,shape.x, shape.y , shape.w - shape.x * 2, shape.h - shape.y * 2);
                            // context.drawImage(type==='audio'?audiotThumbnail:media,shape.x, shape.y , shape.w - shape.x * 2, shape.h - shape.y * 2);
                        }
                        this.setState({ 'paused': false });
                    }
                    requestAnimationFrame(func);
                };
                func();
            }
        } else {
            let shape = this.getMediaShape(media, type, canvas.width, canvas.height);
            if (once) {
                if (media && !audioPreview) {
                    try {
                        if (type === 'audio') {
                            context.drawImage(type === 'audio' ? audiotThumbnail : media, 0, 0, canvas.width, canvas.height);
                        } else {
                            context.drawImage(type === 'audio' ? audiotThumbnail : media, 0, 0, shape.sw, shape.sh, shape.x, shape.y, shape.w - shape.x * 2, shape.h - shape.y * 2);
                        }
                    } catch (e) {

                    }
                    // context.drawImage(type==='audio'?audiotThumbnail:media,shape.x, shape.y , shape.w - shape.x * 2, shape.h - shape.y * 2);
                }
                this.setState({ 'paused': true });
                return;
            }
            if (type === 'video' || type === 'audio' || media['lottie']) {
                if (this.state.paused) {
                    media.pause ? media.pause() : '';
                    // if(media['lottie']){
                    //     media['lottie'].pause?media['lottie'].pause():'';
                    // }
                } else {
                    media.play ? media.play() : '';
                    // if(media['lottie']){
                    //     media['lottie'].play?media['lottie'].play():'';
                    // }
                }
            }
            let func = () => {
                if (this.state.paused) {
                    media.pause ? media.pause() : '';
                    if (media && !audioPreview) {
                        canvas.width = $(canvas).width();
                        canvas.height = $(canvas).height();
                        context.fillStyle = "#000";
                        context.fillRect(0, 0, canvas.width, canvas.height);
                        let shape = this.getMediaShape(media, type, canvas.width, canvas.height);
                        if (type === 'audio') {
                            context.drawImage(type === 'audio' ? audiotThumbnail : media, 0, 0, canvas.width, canvas.height);
                        } else {
                            context.drawImage(type === 'audio' ? audiotThumbnail : media, 0, 0, shape.sw, shape.sh, shape.x, shape.y, shape.w - shape.x * 2, shape.h - shape.y * 2);
                        }
                    }
                    this.setState({ 'paused': true });
                    return;
                } else {
                    if (media && !audioPreview) {
                        canvas.width = $(canvas).width();
                        canvas.height = $(canvas).height();
                        context.fillStyle = "#000";
                        context.fillRect(0, 0, canvas.width, canvas.height);
                        let shape = this.getMediaShape(media, type, canvas.width, canvas.height);
                        if (type === 'audio') {
                            context.drawImage(type === 'audio' ? audiotThumbnail : media, 0, 0, canvas.width, canvas.height);
                        } else {
                            context.drawImage(type === 'audio' ? audiotThumbnail : media, 0, 0, shape.sw, shape.sh, shape.x, shape.y, shape.w - shape.x * 2, shape.h - shape.y * 2);
                        }
                        // if(media['lottie']){
                        //     let _media=media['lottie'];
                        //         let inner=_media.wrapper.innerHTML;
                        // $(inner).eq(0).css({writingMode: 'vertical-rl'});
                        // let svgString = new XMLSerializer().serializeToString($(inner)[0]);
                        // media['pre_svg']=inner;
                        // let svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
                        // media.src = URL.createObjectURL(svg);
                        // video_list[o.obj_id + '_' + i].src = "data:image/svg+xml;charset=utf-8,"+svgString;
                        // }
                    }
                    this.setState({ 'paused': false });
                }
                requestAnimationFrame(func);
            };
            func();
        }
    },
    /**
     * 删除素材
     * @param  {String}  media_id 素材id
     * @param  {String}  type   类型（项目素材，我的素材，媒资素材）
     */
    deleteMedia(media_id, type) {
        if (media_id) {
            if (type === 'get_project_material') {
                let data = {
                    media_id: media_id,
                    project_id: project_id
                };
                localStorage.stager ? data.action = 2 : '';
                confirm(
                    '确定将该素材从媒体中删除吗？',
                    media_id ? 'delete_project_material' : '',
                    data,
                    () => {
                        this.refs.OnlineM.refreshing();
                    }
                );
            } else if (type === 'get_media_list') {
                let data = {
                    media_id: media_id,
                    action: 1
                };
                localStorage.stager ? data.action = 2 : '';
                confirm(
                    '确定要删除该素材吗？',
                    media_id ? 'trash_media' : '',
                    data,
                    () => {
                        this.refs.OnlineM.refreshing();
                    }
                );
            }
        } else {
            let id = currentDom.attr('data-mediaId');
            let buffer = currentDom.attr('data-buffer');
            if (currentDom.hasClass('project-mater')) {
                let data = {
                    media_id: id,
                    project_id: project_id
                };
                localStorage.stager ? data.action = 2 : '';
                confirm(
                    '确定将该素材从媒体中删除吗？',
                    id ? 'delete_project_material' : '',
                    data,
                    () => {
                        currentDom.hide();
                        if (buffer || buffer === 0) {
                            uploadingMain.cancel(buffer * 1);
                        }
                    }
                );
            } else {
                let data = {
                    media_id: id,
                    action: 1
                };
                localStorage.stager ? data.action = 2 : '';
                confirm(
                    '确定要删除该素材吗？',
                    id ? 'trash_media' : '',
                    data,
                    () => {
                        currentDom.hide();
                        if (buffer || buffer === 0) {
                            uploadingMain.cancel(buffer * 1);
                        }
                    }
                );
            }
            $('.contentMenu').hide();
        }
    },

    // 显示loading
    showLoading() {
        this.setState({
            newFile: {
                setting: 'show',
                width: 400,
                status: 'loading',
                height: 220,
                title: ' ',
                close: () => {
                    this.setState({ newFile: '' })
                }
            }
        });
    },
    // 关闭loading
    closeLoading() {
        this.setState({ newFile: '' })
    },
    // 渲染画布
    renderCanvas(re) {
        console.info('render');
        if (re === 're' && !this.state.paused) return;
        // 主画布
        let canvasObj = $('#sec4-canvas').eq(0),
            canvas = canvasObj[0],
            // 辅助画布用来做一些素材的高级操作
            canvas1 = $('#sec3-canvas')[0],
            preview_record = $('#sec5-canvas')[0],  // 这个画布是干什么的？
            video_list = getVideoList(), // 轨道上所有素材的canvas dom
            temp_list = getTempList(), // 当前时刻所有轨道上所有素材的详细信息
            timeLinePoint = ((this.state.time_line_now - this.state.time_line_start) / this.state.unit_length * this.state.unit_time).toFixed(2) * 1;
        if (preview_record && this.state.show_record) {
            canvas = preview_record;
        }
        if (!canvas) {
            for (let i in video_list) {
                if (video_list[i].pause && !video_list[i].paused) {
                    video_list[i].pause();
                }
            }
            clearVideoList();
            return;
        }

        // orderList 当前时刻所有轨道上的素材id
        // 顺序表orderList,根据顺序取数据渲染
        // 绘制分两部分，先使用预处理画布将图像做模糊等滤镜处理，然后将预处理画布绘制到主画布上，并且在绘制前做变换类处理
        for (let i = 0; i < orderList.length; i++) {
            let t_id = orderList[i], // 顺序ID
                temp = temp_list[t_id], //属性查询
                tVideo = video_list[t_id]; // 视频查询
            if (['video', 'audio'].includes(temp.obj_type)) {
                if (!tVideo || tVideo.readyState < 2) {
                    this.setState({ 'loadingMedia': true });
                    setTimeout(() => {
                        this.renderCanvas('re');
                    }, 1000 / 10);
                    return;
                }
            }
        }
        this.state.newFile = {};
        this.state.loadingMedia && (this.setState({ 'loadingMedia': false }));
        // 自由文字拖拽框
        let river = $('#sec4-canvas-show')[0],
            context = canvas.getContext('2d'),
            context1 = canvas1.getContext('2d'),
            _context0 = _canvas0.getContext('2d');
        let left = this.state.time_line_now - this.state.time_line_start;
        let now = (left / this.state.unit_length * this.state.unit_time).toFixed(2) * 1;
        canvas.width = $(canvas).width();
        canvas.height = $(canvas).height();
        canvas1.width = $(canvas).width();
        canvas1.height = $(canvas1).height();
        // _canvas0.width = $(canvas).width();
        // 处理前后两个素材一样转场没有效果， 所以把转场画布的宽度减小来增加区别
        _canvas0.width = $(canvas).width() * 0.9;
        _canvas0.height = $(canvas1).height();
        context.fillStyle = "#000";
        context.fillRect(0, 0, canvas.width, canvas.height);

        let canvas_scale = canvas.height / 1080;
        let canvas_scale_width = canvas.height * this.state.cropperSize;
        for (let i = 0; i < orderList.length; i++) {
            let t_id = orderList[i],// 顺序id
                temp = temp_list[t_id], //属性查询
                tVideo = video_list[t_id], // 视频查询
                isGif = false,
                cropObj = temp.crop || {}; // 计算完剪裁的数值
            if (!tVideo) {
                continue;
            }
            let width = canvas_scale_width, height = canvas.height, halfWidth = 0, halfHeight = 0, positionX = 0,
                positionY = 0;
            context1.clearRect(0, 0, canvas1.width, canvas1.height);
            if (temp.obj_type === 'video') {
                let tspecial = temp.special;
                if (tspecial.media_url && tspecial.media_url.toLowerCase().indexOf('.gif') !== -1) {
                    isGif = true;
                }
                width = tVideo.videoWidth;
                height = tVideo.videoHeight;
                if (isGif) height = height / 2;
            } else if (temp.obj_type === 'image') {
                width = tVideo.width;
                height = tVideo.height;
            } else if (temp.obj_type === 'text') {
                width = temp.special.position_w * canvas_scale;
                height = temp.special.position_h * canvas_scale;
                positionX = temp.special.position_x * canvas_scale;
                positionY = temp.special.position_y * canvas_scale;
                // let scale=canvas.height/1080;
                // width = temp[i].special.position_w  *scale;
                // height = temp[i].special.position_h *scale;
                // positionX = temp[i].special.position_x*scale;
                // positionY = temp[i].special.position_y  *scale;

            } else if (temp.obj_type === 'audio') {
                continue;
            } else {
                width = canvas_scale_width;
                height = canvas.height;
            }
            if (temp.obj_type !== 'text') {
                // // if (width / height > 16 / 9) {
                // if (width / height > canvas.width / canvas.height) {
                //     halfHeight = (canvas.height - height * canvas.width / width) / 2
                // } else {
                //     halfWidth = (canvas.width - width * canvas.height / height) / 2
                // }
                // width = canvas.width;
                // height = canvas.height;
                //裁剪缩放
                // if (width / height > 16 / 9) {
                if (width / height > this.state.cropperSize) {
                    halfHeight = (canvas.height - height * canvas_scale_width / width) / 2
                } else {
                    halfWidth = (canvas_scale_width - width * canvas.height / height) / 2
                }
                width = canvas_scale_width;
                height = canvas.height;
            } else {
                //裁剪缩放
                // halfHeight = (canvas.height - height) / 2;
                // halfWidth = (canvas_scale_width - width ) / 2;
                if (width / height > this.state.cropperSize) {
                    halfHeight = (canvas.height - height * canvas_scale_width / width) / 2
                } else {
                    halfWidth = (canvas_scale_width - width * canvas.height / height) / 2
                }
                width = canvas_scale_width;
                height = canvas.height;
            }
            let globalAlpha = 1;
            let θ = 0, sX = 1, sY = 1, left = 0, top = 0;
            let trans = temp.transform;
            let fade = temp.video_fade;
            let speed = temp.speed;
            let volume = temp.volume;
            let pv = temp.pvolume;
            let effects = temp.effects;
            let color = temp.color;
            let specialeffect = temp.specialeffect;
            let deLogo = temp.delogo;
            let colorkeying = temp.colorkeying;
            if (trans) {
                let duration = temp.end_time - temp.start_time;
                if (trans.rotation) {
                    θ = temp.transform.rotation;
                }
                switch (trans.flip) {
                    case 0:
                        sX = 1;
                        sY = 1;
                        break;
                    case 1:
                        sX = -1;
                        break;
                    case 2:
                        sY = -1;
                        break;
                    case 3:
                        sX = -1;
                        sY = -1;
                        break;
                }
                if (trans.start_scale) {
                    if ((trans.end_scale || trans.end_scale === 0) && trans.end_scale !== trans.start_scale) {
                        let s = trans.start_scale * 1 + (trans.end_scale - trans.start_scale) * (now - temp[i].start_time) / duration;
                        sX *= s;
                        sY *= s;
                    } else {
                        sX *= trans.start_scale;
                        sY *= trans.start_scale;
                    }
                }
                if (trans.start_position_x || trans.start_position_x === 0) {
                    if (trans.end_position_x !== trans.start_position_x) {
                        let s = trans.start_position_x * 1 + (trans.end_position_x - trans.start_position_x) * (now - temp.start_time) / duration;
                        left += s * canvas_scale;
                    } else {
                        left += trans.start_position_x * canvas_scale;
                    }
                }
                if (trans.start_position_y || trans.start_position_y === 0) {
                    if (trans.end_position_y !== trans.start_position_y) {
                        let s = trans.start_position_y * 1 + (trans.end_position_y - trans.start_position_y) * (now - temp.start_time) / duration;
                        top += s * canvas_scale;
                    } else {
                        top += trans.start_position_y * canvas_scale;
                    }
                }
            }
            if (fade && fade.length) {
                let sf = fade[0].visibility, ef = fade[fade.length - 1].visibility;
                if (sf !== ef) {
                    let duration = temp.end_time - temp.start_time;
                    let s = sf * 1 + (ef - sf) * (now - temp.start_time) / duration;
                    globalAlpha = s / 100;
                } else {
                    globalAlpha = fade[0].visibility / 100;
                }
            } else {
                globalAlpha = 1;
            }
            let filter = '';
            let use = false;  // 是否使用辅助canvas， canvas3是辅助，做图像的处理
            if (color) {
                let b = 1, c = 1, s = 1;
                b = color.brightness < 0 ? color.brightness / 100 : color.brightness / 20;
                c = color.contrast < 0 ? color.contrast / 100 : color.contrast / 20;
                s = color.saturation < 0 ? color.saturation / 100 : color.saturation / 20;
                filter += 'hue-rotate(' + color.hue + 'deg) brightness(' + (b + 1) + ') saturate(' + (s + 1) + ') contrast(' + (c + 1) + ')';
            }
            switch (effects) {
                case 'negate':
                    filter += ' invert(1)';
                    break;//负片
                case 'monochrome':
                    filter += ' grayscale(1)';
                    break;//黑白
                case 'vintage':
                    filter += ' sepia(1)';
                    break;//怀旧
                case 'blur':
                    filter += ' blur(5px)';
                    break;//模糊
            }
            canvas1.width = width - halfWidth * 2;
            canvas1.height = height - halfHeight * 2;
            if (canvas1.width <= 0 || canvas1.height <= 0) {
                continue;
            }
            if (['video', 'image'].includes(temp.obj_type) || (temp.obj_type === 'text' && tVideo)) {
                context1.drawImage(tVideo, 0, 0, canvas1.width, canvas1.height)
            }
            if (effects === 'emboss') {
                reversi(context1, canvas1, effects);
                use = true;
            }

            // 去logo 通过logo部位局部剪裁从新绘制并模糊处理
            if (deLogo && deLogo.length) {
                deLogo.map((v, k) => {
                    let specialeffect = v;
                    if (specialeffect.logo_width && specialeffect.logo_height) {
                        //屏幕为基准；
                        if (specialeffect.logo_width > 1 || specialeffect.logo_height > 1) {
                            specialeffect.logo_x = (specialeffect.logo_x / 1920).toFixed(4) * 1;
                            specialeffect.logo_y = (specialeffect.logo_y / 1080).toFixed(4) * 1;
                            specialeffect.logo_width = (specialeffect.logo_width / 1920).toFixed(4) * 1;
                            specialeffect.logo_height = (specialeffect.logo_height / 1080).toFixed(4) * 1;
                        }
                        reversi(context1, canvas1, 'blur', 15, 15, specialeffect.logo_x * canvas1.width, specialeffect.logo_y * canvas1.height,
                            specialeffect.logo_width * canvas1.width, specialeffect.logo_height * canvas1.height, 0, 0, 0, tVideo);
                        use = true;
                    }
                })
            }
            if (isGif) {
                let _canvas = document.createElement('canvas');
                let _context = _canvas.getContext('2d');
                _canvas.width = tVideo.videoWidth || _canvas.width;
                _canvas.height = tVideo.videoHeight || _canvas.height;
                _context.drawImage(tVideo, 0, 0, _canvas.width, _canvas.height);
                context1.drawImage(_canvas, 0, 0, tVideo.videoWidth, tVideo.videoHeight / 2, 0, 0, canvas1.width, canvas1.height)
                reversi(context1, canvas1, 'isGif', 0, 0, 0, 0, canvas1.width, canvas1.height, 0, 0, 0, _canvas);
                use = true;
            }
            if (specialeffect) {
                if (specialeffect.vague_x || specialeffect.vague_y) {
                    reversi(context1, canvas1, 'blur', specialeffect.vague_x * canvas.width / (canvas.width > canvas.height ? 1920 : 1080), specialeffect.vague_y * canvas.height / (canvas.width > canvas.height ? 1080 : 1920));
                    use = true;
                }
                if (specialeffect.logo_width && specialeffect.logo_height) {
                    // //以屏幕为基准；
                    // reversi(context1, canvas1, 'blur', 15, 15, specialeffect.logo_x / 4-halfWidth, specialeffect.logo_y / 4-halfHeight, specialeffect.logo_width / 4, specialeffect.logo_height / 4);
                    reversi(context1, canvas1, 'blur', 15, 15, specialeffect.logo_x * canvas1.width, specialeffect.logo_y * canvas1.height,
                        specialeffect.logo_width * canvas1.width, specialeffect.logo_height * canvas1.height);
                    use = true;
                }
            }
            if (colorkeying) {
                let c = colorkeying.select_color, s = colorkeying.sensitivity, t = colorkeying.transparency;
                if (c) {
                    reversi(context1, canvas1, 'chroma', 0, 0, 0, 0, canvas1.width, canvas1.height, c, s, t);
                    use = true;
                }
                // filter+=' drop-shadow(16px 16px 10px #'+c+')';
            }
            context.filter = filter || 'none';
            context.setTransform(1, 0.0, 0, 1, 0, 0);
            if (trans && trans.blurred) {
                let _filter = context.filter;
                context.filter = 'blur(10px)';
                if (['video', 'image'].includes(temp.obj_type)) {
                    context.drawImage(tVideo, -halfHeight / canvas1.height * canvas1.width, -halfWidth / canvas1.width * canvas1.height, width + halfHeight / canvas1.height * canvas1.width * 2, height + halfWidth / canvas1.width * canvas1.height * 2)
                }
                context.filter = _filter;
            }
            let trans_start = temp.trans_start, trans_end = temp.trans_end;
            //过渡开始
            /*     if(trans_start){
                     let trans_duration=trans_start.bind?trans_start.duration/2:trans_start.duration*1;
                     if(temp.start_time*1+trans_duration>now){
                         let scale=(now-(temp.start_time*1+trans_duration-trans_start.duration))/trans_start.duration;
                         console.info(trans_start.trans_type)
                         switch (trans_start.trans_type){
                             case 'crossfade':globalAlpha=globalAlpha*scale;break;
                             case 'crossblur':
                                 // context1.rotate(θ * Math.PI / 180);
                                 globalAlpha=globalAlpha*scale;
                                 reversi(context1, canvas1, 'blur',100*(1-scale), 0);
                                 // context1.setTransform(1, 0.0, 0, 1, canvas.width,canvas.height);
                                 use = true;break;
                             case 'fadeblack':globalAlpha=(trans_start.bind&&scale<0.5)?0:1;break;
                             case 'fadewhite':globalAlpha=(trans_start.bind&&scale<0.5)?0:1;break;
                             case 'rightslide':context.translate(canvas.width*(1-scale),0);break;
                             case 'leftslide':context.translate(-canvas.width*(1-scale),0);break;
                             case 'toperase':context.translate(0,-canvas.height*(1-scale));break;
                             case 'bottomerase':context.translate(0,canvas.height*(1-scale));break;
                             case 'lefterase':context.translate(-canvas.width*(1-scale),0);break;
                             case 'righterase':context.translate(canvas.width*(1-scale),0);break;
                         }
                     }
                 }*/
            //过渡结束
            /*      if(trans_end){
                      let trans_duration=trans_end.bind?trans_end.duration/2:trans_end.duration*1;
                      if(temp[i].end_time*1-trans_duration<now){
                          let scale=(now-(temp[i].end_time*1-trans_duration))/trans_end.duration;
                          switch (trans_end.trans_type){
                              case 'crossfade':globalAlpha=globalAlpha*(1-scale);break;
                              case 'crossblur':
                                  // context1.rotate(θ * Math.PI / 180);
                                  globalAlpha=globalAlpha*(1-scale);
                                  reversi(context1, canvas1, 'blur',100*scale, 0);
                                  // context1.setTransform(1, 0.0, 0, 1, canvas.width,canvas.height);
                                  use = true;break;
                              case 'fadeblack':globalAlpha=(trans_end.bind&&scale>0.5)?0:1;break;
                              case 'fadewhite':globalAlpha=(trans_end.bind&&scale>0.5)?0:1;break;
                              case 'rightslide':context.translate(-canvas.width*scale,0);break;
                              case 'leftslide':context.translate(canvas.width*scale,0);break;
                          }
                      }``
                  }*/
            if (trans_start) {
                let trans_duration = trans_start.bind ? trans_start.duration / 2 : trans_start.duration * 1;
                if (temp.start_time * 1 + trans_duration > now) {
                    use = true;
                    let scale = (now - (temp.start_time * 1 + trans_duration - trans_start.duration)) / trans_start.duration;
                   // 单个素材，素材前端有转场，没有拼接素材  清空_canvas0转场画布
                    if (!trans_start.bind) {
                        _canvas0.width = canvas1.width;
                        _canvas0.height = canvas1.height;
                        _context0.clearRect(0, 0, canvas1.width, canvas1.height);

                    }
                    canvas1 = getTransition(_canvas0, canvas1, canvas1.width, canvas1.height, scale, trans_start.trans_type);
                }
            }
            if (trans_end) {
                let trans_duration = trans_end.bind ? trans_end.duration / 2 : trans_end.duration * 1;
                if (temp.end_time * 1 - trans_duration < now) {
                    use = true;
                    let scale = (now - (temp.end_time * 1 - trans_duration)) / trans_end.duration;
                    // 两个素材拼接，_canvas0转场画布渲染前面的素材
                    if (trans_end.bind) {
                        _context0.drawImage(canvas1, 0, 0, canvas1.width, canvas1.height);
                        continue;
                        // canvas1=getTransition(_canvas0,canvas1,canvas1.width,canvas1.height,scale);
                    } else { // 单个素材，素材后端有转场，没有拼接素材  清空_canvas0转场画布
                        _canvas0.width = canvas1.width-100;
                        _canvas0.height = canvas1.height;
                        _context0.clearRect(0, 0, canvas1.width, canvas1.height);
                        canvas1 = getTransition(canvas1, _canvas0, canvas1.width, canvas1.height, scale, trans_end.trans_type);
                    }
                } ``
            }
            context.translate(canvas.width / 2 + left, height / 2 + top);
            context.rotate(θ * Math.PI / 180);
            context.scale(sY.toFixed(6) * 1, sX.toFixed(6) * 1);
            context.translate(-canvas.width / 2, -height / 2);
            if (river && this.state.unit_detail.show && t_id === this.state.currentAreaId) {
                river.height = $(river).height();
                river.width = river / 1080 * 1920;
                let x1, y1, x2, y2;
                let x0 = Math.abs(sX.toFixed(6)), y0 = Math.abs(sY.toFixed(6));
                x1 = width / 2 - y0 * (width / 2 - halfWidth);
                y1 = height / 2 - x0 * (height / 2 - halfHeight);
                x2 = width / 2 + y0 * (width / 2 - halfWidth);
                y2 = height / 2 + x0 * (height / 2 - halfHeight);
                $(river).css({
                    left: x1 + left - (width - canvas.width) / 2 + 'px',
                    top: y1 + top + 'px',
                    transform: 'rotate(' + θ + 'deg)',
                    width: width - x1 * 2 + 'px',
                    height: height - y1 * 2 + 'px',
                });
                let l_t = 'nw-resize', l_b = 'ne-resize', r_t = 'nw-resize', r_b = 'ne-resize';

                switch (Math.round((θ + 360 - 22) / 45) % 4) {
                    case 0: l_t = 'nw-resize'; l_b = 'ne-resize'; r_t = 'nw-resize'; r_b = 'ne-resize'; break;
                    case 1: l_t = 'n-resize'; l_b = 'e-resize'; r_t = 'n-resize'; r_b = 'e-resize'; break;
                    case 2: l_t = 'ne-resize'; l_b = 'nw-resize'; r_t = 'ne-resize'; r_b = 'nw-resize'; break;
                    case 3: l_t = 'e-resize'; l_b = 'n-resize'; r_t = 'e-resize'; r_b = 'n-resize'; break;
                }
                $(river).find('.l-t').css({ cursor: l_t });
                $(river).find('.l-b').css({ cursor: l_b });
                $(river).find('.r-b').css({ cursor: r_t });
                $(river).find('.r-t').css({ cursor: r_b });
            }
            context.globalAlpha = globalAlpha;
            // 主渲染
            if (cropObj && JSON.stringify(cropObj) !== '{}') {
                let scale = canvas.height / 1080;
                if ((cropObj.width * canvas1.width) / (cropObj.height * canvas1.height) > 16 / 9) {
                    halfHeight = (canvas.height - (cropObj.height * canvas1.height) * scale * 1920 / (cropObj.width * canvas1.width)) / 2
                } else {
                    halfWidth = (scale * 1920 - (cropObj.width * canvas1.width) * canvas.height / (cropObj.height * canvas1.height)) / 2
                }
                width = scale * 1920;
                height = canvas.height;
                if (['video', 'image'].includes(temp.obj_type) || (temp.obj_type === 'text' && tVideo)) {
                    context.drawImage(canvas1, canvas1.width * cropObj.x, canvas1.height * cropObj.y, canvas1.width * cropObj.width, canvas1.height * cropObj.height, halfWidth + positionX - (width - canvas.width) / 2, halfHeight + positionY, width - halfWidth * 2, height - halfHeight * 2)
                };
            } else {
                if (['video', 'image'].includes(temp.obj_type) || (temp.obj_type === 'text' && tVideo)) {
                    context.drawImage(use ? canvas1 : tVideo, halfWidth + positionX - (width - canvas.width) / 2, halfHeight + positionY, width - halfWidth * 2, height - halfHeight * 2)
                };
            }
            /*       if(trans_start){
                       let trans_duration=trans_start.bind?trans_start.duration/2:trans_start.duration*1;
                       if(temp.start_time*1+trans_duration>now){
                           let scale=(now-temp.start_time*1)/trans_duration;
                           if(scale>=0){
                               switch (trans_start.trans_type){
                                   case 'fadeblack':
                                       context.setTransform(1, 0.0, 0, 1, 0, 0);
                                       context.globalAlpha=globalAlpha*(1-scale);
                                       context.fillStyle = "#000";
                                       context.fillRect(0, 0, canvas.width, canvas.height);break;
                                   case 'fadewhite':
                                       context.setTransform(1, 0.0, 0, 1, 0, 0);
                                       context.globalAlpha=globalAlpha*(1-scale);
                                       context.fillStyle = "#fff";
                                       context.fillRect(0, 0, canvas.width, canvas.height);break;
                               }
                           }
                       }
                   }*/
            /*    if(trans_end){
                    let trans_duration=trans_end.bind?trans_end.duration/2:trans_end.duration*1;
                    if(temp.end_time*1-trans_duration<now){
                        let scale=(now-(temp.end_time*1-trans_duration))/trans_duration;
                        if(scale<=1){
                            switch (trans_end.trans_type){
                                case 'fadeblack':
                                    context.setTransform(1, 0.0, 0, 1, 0, 0);
                                    context.globalAlpha=context.globalAlpha*scale;
                                    context.fillStyle = "#000";
                                    context.fillRect(0, 0, canvas.width, canvas.height);break;
                                case 'fadewhite':
                                    context.setTransform(1, 0.0, 0, 1, 0, 0);
                                    context.globalAlpha=context.globalAlpha*scale;
                                    context.fillStyle = "#fff";
                                    context.fillRect(0, 0, canvas.width, canvas.height);break;
                            }
                        }
                    }
                }*/
        }
        // 字幕渲染
        if (this.state.subtitles_show && !canvasObj.hasClass('snapshot')) {
            let sub_list = this.state.subtitles_config.list;
            if (sub_list.length) {
                let text_info = getConfig()['text_info'] || {
                    "font_size": 50,
                    "status": true,
                    "font_color": 'ffffff',
                    "font_name": 'FZShuSong-Z01S',
                    "background_color": '000000',
                    "alpha": 0,
                    "position_x": 'middle',  // 水平位置，left, middle, right
                    "position_y": 0,  // 底部间距，px
                };
                // text_info.font_color='ffffff';
                // text_info.background_color='000000';
                // text_info.font_name='FZShuSong-Z01S';
                let font_size = text_info.font_size * canvas_scale * canvas.width / canvas_scale_width;
                let font_color = '#' + text_info.font_color;
                let background_color = '#' + text_info.background_color;
                let globalAlpha = text_info.alpha;
                let position_x = text_info.position_x;
                let position_y = text_info.position_y * canvas_scale;

                let textAlign = 'center';
                let textSiteX = canvas.width / 2;
                switch (position_x) {
                    case 'left': textAlign = 'left'; textSiteX = canvas.width / 20; break;
                    case 'middle': textAlign = 'center'; break;
                    case 'right': textAlign = 'right'; textSiteX = canvas.width / 20 * 19; break;
                }
                context.filter = 'none';
                context.setTransform(1, 0.0, 0, 1, 0, 0);
                context.font = font_size + "px " + text_info.font_name;
                context.beginPath();
                font_size *= 1.2;
                sub_list.map((v, k) => {
                    if (v.text && v.start_time <= now && v.end_time >= now) {
                        let lineWidth = 0;
                        let last = 0;
                        // let array=[];
                        // for(let i=0;i<v.text.length;i++){
                        //     lineWidth+=context.measureText(v.text[i]).width;
                        //     if(lineWidth>canvas.width/10*9){
                        //         array.push(v.text.substring(last,i));
                        //         lineWidth=0;
                        //         last=i;
                        //     }
                        //     if(i===v.text.length-1){
                        //         array.push(v.text.substring(last,i+1));
                        //     }
                        // }
                        let array = v.text.split('\n');
                        let river = $('#subtitles-show')[0];
                        if (river) {
                            let line = v.text.split('').filter((t) => t == '\n').length + 1
                            let width = $(canvas).width();
                            let height = font_size * line;
                            $(river).width(width);
                            $(river).height(height);
                            $(river).css({
                                left: '0px',
                                top: $(canvas).height() - height - position_y + 'px',
                            });
                        }
                        context.fillStyle = background_color;
                        context.globalAlpha = globalAlpha;
                        // context.fillRect(0,canvas.height-position_y-array.length*font_size-font_size*0.2,canvas.width,array.length*font_size+font_size*0.4);
                        context.fillRect(0, canvas.height - position_y - array.length * font_size, canvas.width, array.length * font_size);
                        context.lineWidth = 1;
                        context.fillStyle = font_color;
                        context.textAlign = textAlign;
                        context.textBaseline = "bottom";
                        context.globalAlpha = 1;

                        context.shadowOffsetX = 2; // 阴影Y轴偏移
                        context.shadowOffsetY = 2; // 阴影X轴偏移
                        context.shadowBlur = 2; // 模糊尺寸
                        context.shadowColor = 'rgba(0, 0, 0, 1)'; // 颜色
                        array.map((v, k) => {
                            context.fillText(v, textSiteX, canvas.height - position_y - (array.length - k - 1) * font_size);
                        });
                    }
                });
                context.stroke(); // 进行绘制
            }
        }
        //水印
        if (this.state.issue.show && document.getElementById('theLogoUrl')) {
            context.filter = 'none';
            let img = document.getElementById('theLogoUrl');
            context.setTransform(1, 0.0, 0, 1, 0, 0);
            context.globalAlpha = 0.8;
            if (localStorage.miniMark) {
                context.drawImage(img, canvas.width * 0.70, canvas.height * 0.05, canvas.width * 0.25, img.height / img.width * canvas.width * 0.25);
            } else {
                context.drawImage(img, canvas.width * 0.55, canvas.height * 0.05, canvas.width * 0.4, img.height / img.width * canvas.width * 0.4);
            }
        }
        // if ((!localStorage.stager)&&!level) {
        //     context.filter = 'none';
        //     let img = document.getElementById('logoImg');
        //     context.setTransform(1, 0.0, 0, 1, 0, 0);
        //     context.globalAlpha = 0.8;
        //     if(localStorage.miniMark){
        //         context.drawImage(img, canvas.width * 0.70, canvas.height * 0.05, canvas.width * 0.25, img.height / img.width * canvas.width * 0.25);
        //     }else{
        //         context.drawImage(img, canvas.width * 0.55, canvas.height * 0.05, canvas.width * 0.4, img.height / img.width * canvas.width * 0.4);
        //     }
        // }
        // if (localStorage.stager) {
        //     let column=$('.reveal').hasClass('vertical');
        //     context.filter = 'none';
        //     let img = document.getElementById('stagerLogo');
        //     context.setTransform(1, 0.0, 0, 1, 0, 0);
        //     context.globalAlpha = 0.6;
        //     let x=canvas.width * (column?0.7:0.85),
        //         y=canvas.height * (column?0.9:0.85),
        //         w=canvas.width *  (column?0.3:0.15),
        //         h=img.height / img.width * canvas.width * (column?0.3:0.15);
        //     context.drawImage(stager_logo, x,y,w,h);
        // }
    },
    transform(val) {
        let reveal = $('.reveal');
        reveal.removeClass('vertical');
        reveal.removeClass('vertical-11');
        reveal.removeClass('vertical-43');
        switch (val) {
            case '16:9': this.state.cropperSize = 16 / 9; this.state.screen_scale = '16:9'; break;
            case '4:3': reveal.addClass('vertical-43'); this.state.cropperSize = 4 / 3; this.state.screen_scale = '4:3'; break;
            case '1:1': reveal.addClass('vertical-11'); this.state.cropperSize = 1; this.state.screen_scale = '1:1'; break;
            case '9:16': reveal.addClass('vertical'); this.state.cropperSize = 9 / 16; this.state.screen_scale = '9:16'; break;
        }
        this.save_config('save');
        this.playVideo();
    },
    clone() {
        // 关闭裁剪
        this.setState({ showCropper: false });
        this.playVideo();
        if (this.state.unit_detail.show) {
            this.setState({ unit_detail: {} });
        };
        let y = $('.pathway').find('.focused').eq(0);
        if (y.hasClass('mater-helper')) {
            // y.attr('data-position',y.attr('data-position') * 1 + 1);
            addUnit(y, 'copy');
            // cloneConfig(y,shear);
            // }else if(this.state.subtitles_config.current>=0&&$('.subtitles-path').find('.current').length>0){
            //     sub_del([$('.subtitles-path').find('.current').attr('name')]);
        }
        // $('.focus').css({'display': 'none'})
    },
    // 退出
    goBack() {
        if (this.state.issue.show) {
            this.closeIssue();
            this.refreshRuler();
        } else {
            let path = '/hub/project';
            switch (is_template) {
                case 0: path = '/hub/project'; break;
                case 1: path = '/hub/template/mine'; break;
                case 2: path = '/hub/template/library'; break;
            }
            this.props.history.push(path);
        }
    },

    setTransToAudio(f) {
        this.setState({ transToAudio: f || false })
    },
    _pause() {
        this.setState({ paused: true });
    },

    renderPath(str) {
        str === 'return' ? _render_path_lock[1] = 1 : '';
        str === 'render' ? _render_path_lock[0] = 1 : '';
        if (_render_path_lock[0] && _render_path_lock[1]) {
            let _config = getConfig();

            if (_config.duration > this.state.max_time) {
                this.state.unit_scale = _config.duration * this.state.unit_scale / this.state.max_time;
                this.state.max_time = _config.duration + 50;
                try {
                    $('.zoom-bar').slider("option", "value", this.state.unit_scale);
                }
                catch (e) {

                }
            }
            renderConfig();
            refreshScrollBar();
            this.initRuler();
            // this.initPathWidth();
            // this.refreshRuler();
        }
    },

    _setSilence(sil) {
        silence = sil;
    },

    subtitles_change(obj) {
        if (obj) {

        } else {
            let start = (this.state.time_line_now - this.state.time_line_start) / this.state.unit_length * this.state.unit_time;
            start = Math.max(Math.floor(start * 25) / 25, 0);
            let list = get_list().list;
            let end = start + 5;
            let current = 0;
            for (let i = 0; i < list.length; i++) {
                let s = list[i].start_time;
                let e = list[i].end_time;
                if (start <= s && start >= current && s - current >= 3) {
                    if (s - current >= 5) {
                        if (s - start < 5) {
                            start = s - 5;
                            end = s;
                        }
                    } else {
                        start = current;
                        end = s;
                    }
                    break;
                } else {
                    current = e;
                    if (current > start) {
                        start = e;
                        end = e * 1 + 5;
                    }
                }
            }
            sub_change({
                project_id: project_id,
                text_id: '',
                start_time: start,
                end_time: end,
                text: ''
            }, true)
        }

    },
    _record(dir_id) {
        silence = true;
        this.state.show_record = true;
        this.setState({
            record: {
                show: true,
                time: (this.state.time_line_now - this.state.time_line_start) / this.state.unit_length * this.state.unit_time,
                dir_id: dir_id
            }
        })
    },
    _closeRecord(media_id, duration, buffer, start_time, volume) {
        if (media_id) {
            interAudio(buffer, media_id, start_time, duration, volume);
        }
        this.setState({ show_record: false })
    },
    componentWillUpdate() {
        // this.refreshRuler();
        // this.initPathWidth();

    },
    saveAsTempPro(template) {
        let labels = getConfig()['label'];
        this.state.label = labels && labels.join('|') ? labels : [];
        this.state.saveTemplate = template;
        this.setState({ newTemplateVisible: true })
    },
    issueTemplate(project_id) {
        channel('get_project_config', { project_id: project_id }, (re) => {
            re.label = this.state.label;
            let img = document.createElement('img');
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            img.crossOrigin = "anonymous";
            re.video_list.map((v, k) => {
                v.obj_list.map((v1, k1) => {
                    if (v1.special) {
                        // v1.special['thumbnail']='';
                        // v1.special['video_preview_img']='';
                    }
                    if (v1.obj_type === 'text') {
                        if (v1.special.sub_type === 'animation') {
                            this.text_flame_text(v1, o_list[v1.obj_id + '_' + k]);
                            v1.special.svg1 = '';
                            v1.special.svg = '';
                        } else {
                            img.src = v1.special.svg1;
                            canvas.width = v1.special.position_w;
                            canvas.height = v1.special.position_h;
                            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                            v1.special.svg = canvas.toDataURL('image/png').replace(/^data:image\/\w+;base64,/, "");
                        }
                    }
                })
            });
            channel('save_project_config', JSON.stringify(re), (res) => {
                channel('generate_movie', JSON.stringify(
                    {
                        name: re.name,
                        label: this.state.label,
                        project_id: res.project_id,
                        description: re.description || '',
                        language: {
                            empty: true
                        },
                        out_type: ['480P'],
                        thumbnail: '',
                        directory_id: 0,
                        plat_user_list: []
                    }), (re) => {
                        message.info('合成模板成功！');
                        this.closeLoading();
                        this.setState({ newTemplateVisible: false });
                        if (is_template && this.state.saveTemplate) {
                            this.props.history.push('/template/mine');
                        }
                    }, (re) => {
                        message.info('合成模板失败！');
                        this.closeLoading();
                        this.setState({ newTemplateVisible: false });
                    }, 'info')
            }, () => {
                message.info('合成模板失败！');
                this.closeLoading();
                this.setState({ newTemplateVisible: false });
            }, 'info');
        }, () => {
            message.info('合成模板失败！');
            this.closeLoading();
            this.setState({ newTemplateVisible: false });
        }, 'info');
    },
    createTempPro() {
        /*
        * POST  /video/ajax/copy_project/
            参数：project_id  项目/模板ID
                 name        新的项目/模板名称
                 dst_type    复制生成对象的类型：0-项目，1-模板
            */

        if (!this.state.saveTemplate) {
            channel('copy_project', { project_id: project_id, name: this.state.newTemplateText || '我的项目', dst_type: 0 }, (re) => {
                this.props.history.push('/load');
                this.props.history.push('/online#' + re.project_id);
            }, '', 'info')
        } else {
            if ((!this.state.label) || this.state.label.length === 0) {
                message.info('请输入标签！');
                return;
            }
            this.showLoading();
            if (is_template) {
                this.issueTemplate(project_id);
            } else {
                channel('copy_project', { project_id: project_id, name: this.state.newTemplateText || '我的模板', dst_type: 1 }, (re) => {
                    this.issueTemplate(re.project_id);
                }, () => {
                    message.info('保存模板失败！');
                    this.closeLoading();
                    this.setState({ newTemplateVisible: false });
                }, 'info')
            }
        }
    },
    toPre() {
        preStep();
        this.get_theme(getConfig().theme_id || '');
    },
    toNext() {
        nextStep();
        this.get_theme(getConfig().theme_id || '');
    },
    //  获取canvas 图片路径
    getCanvasImg() {
        let canvas = $('#sec3-canvas')[0];
        let image = new Image();
        image.src = canvas.toDataURL("image/png");
        this.state.imgData = $(image).attr("src");
    },
    // 画裁剪的画布
    cropperDraw(temp, id) {
        setTimeout(() => {
            getVideoPiece(this.state.time_line_now / 10, true, silence, this.state.paused);
        });
        let video_list = getVideoList();
        let width = 0;
        let height = 0;
        let halfWidth = 0;
        let halfHeight = 0;
        let canvas4 = $('#sec4-canvas')[0];
        let context4 = canvas4.getContext('2d');
        let canvas3 = $('#sec3-canvas')[0];
        let context3 = canvas3.getContext('2d');
        if (video_list[id].tagName.toLowerCase() === 'video') {
            width = video_list[id].videoWidth;
            height = video_list[id].videoHeight;
        } else if (video_list[id].tagName.toLowerCase() === 'img') {
            width = video_list[id].width;
            height = video_list[id].height;
        }
        if (video_list[id].tagName.toLowerCase() !== 'text') {
            if (width / height > canvas4.width / canvas4.height) {
                halfHeight = (canvas4.height - height * canvas4.width / width) / 2;
                halfWidth = 0;
            } else {
                halfWidth = (canvas4.width - width * canvas4.height / height) / 2;
                halfHeight = 0;
            }
            width = canvas4.width;
            height = canvas4.height;
        }
        context3.clearRect(0, 0, canvas3.width, canvas3.height);
        context4.clearRect(0, 0, canvas4.width, canvas4.height);
        canvas3.width = width - halfWidth * 2;
        canvas3.height = height - halfHeight * 2;
        canvas4.width = width;
        canvas4.height = height;
        //$('.reveal').removeClass('vertical');
        context4.drawImage(video_list[id], halfWidth, halfHeight, width - halfWidth * 2, height - halfHeight * 2);
        context3.drawImage(video_list[id], halfWidth, halfHeight, width - halfWidth * 2, height - halfHeight * 2);
        // 获取图片地址
        this.getCanvasImg();
    },
    render() {
        let subtitlesShow = this.state.showSubtitlesStyle && !this.state.colophon.show && !this.state.unit_detail.show
        return (
            <div className="flex-column">
                <img style={{ display: 'none' }} id="logoImg" src={logo} alt="" />
                <img style={{ display: 'none' }} id="stagerLogo" src={stagerLogo} alt="" />
                <Top issueConfig={this.issue_config} saveConfig={() => {
                }} fullScreen={this.state.fullScreen}
                    goBack={this.goBack}
                    getConfigStatus={getStatus}
                    is_template={is_template}
                    show_shortcut={() => {
                        this.show_shortcut();
                    }}
                    show_rename={(name) => {
                        this.show_rename(name);
                    }}
                    project_id={project_id}
                    saveAsTempPro={this.saveAsTempPro}
                    openColophon={this.openColophon}
                    history={this.props.history}
                    guide={this.guide}
                    pre={this.toPre} next={this.toNext}
                    userInfo={this.state.userInfo} />
                <div id="editor" className="main-area">
                    <div style={{ height: '50px' }}> </div>
                    <div className="observation">
                        <div className="material">
                            <OnlineM ref='OnlineM'
                                setTransToAudio={this.setTransToAudio}
                                transToAudio={this.state.transToAudio}
                                history={this.props.history}
                                deleteMedia={this.deleteMedia}
                                unit_time={this.state.unit_time}
                                unit_length={this.state.unit_length}
                                group_id={localStorage.team || localStorage.xinhua_group || ''}
                                showLoading={this.showLoading}
                                project_id={project_id}
                                subtitles_config={this.state.subtitles_config}
                                closeLoading={this.closeLoading}
                                used_list={this.state.used_list}
                                set_theme={this.set_theme}
                                theme_config={this.state.themeConfig}
                                set_time_line_now={this.set_time_line_now}
                                subtitles_change={this.subtitles_change}
                                playVideo={this.playVideo}
                                set_text_info={this.set_text_info}
                                auto_indent={this.state.auto_indent}
                                location={this.props.location}
                                record={this._record}
                                time_line_start={this.state.time_line_start}
                                setShowSubtitlesStyle={(showSubtitlesStyle) => {
                                    this.setState({ showSubtitlesStyle })
                                }}
                            />
                            <UnitDetail playVideo={this.playVideo} close={this.closeUnitDetail}
                                set_time_now={this.set_time_now}
                                unit_detail={this.state.unit_detail} />
                            <Colophon playVideo={this.playVideo} close={this.closeColophon}
                                set_time_now={this.set_time_now}
                                project_id={project_id}
                                history={this.props.history}
                                colophon={this.state.colophon} />
                        </div>
                        <div className="reveal">
                            {/*<GLTransitions progress={0.5}*/}
                            {/*from={(<img src="https://gl-transitions.com/static/media/hBd6EPoQT2C8VQYv65ys_White_Sands.de8f675e.jpg"*/}
                            {/*alt=""/>)}*/}
                            {/*to={(<img src={'https://gl-transitions.com/static/media/barley.d6f24c9d.jpg'}/>) }*/}
                            {/*transition={{*/}
                            {/*name: 'doorway',*/}
                            {/*author: 'd',*/}
                            {/*license: 'MIT',*/}
                            {/*glsl: 'doorway',*/}
                            {/*}}/>*/}
                            <div id="player-container">
                                <canvas id="sec3-canvas" width="480" height="270"> </canvas>
                                <canvas id="sec4-canvas" width="480" height="270"> </canvas>
                                {this.state.unit_detail.show && !this.state.colophon.show ?
                                    <div className="sec-box">
                                        <div id="sec4-canvas-show" >
                                            <div className="l-t"> </div>
                                            <div className="l-b"> </div>
                                            <div className="r-t"> </div>
                                            <div className="r-b"> </div>
                                        </div>
                                    </div> : ''}
                                <div className="sec-box" style={{ display: subtitlesShow ? "" : "none" }}>
                                    <div id="subtitles-show" >
                                        <div className="l-t"> </div>
                                        <div className="l-b"> </div>
                                        <div className="r-t"> </div>
                                        <div className="r-b"> </div>
                                    </div>
                                </div>
                                {this.state.loadingMedia ?
                                    <div className="card">
                                        <Loading />
                                        {/* <span className="whirly-loader">{say('main','waiting')}…</span> */}
                                    </div> : ''}
                                {this.state.showCropper
                                    ? <Crop
                                        imgData={this.state.imgData}
                                        crop={this.crop}
                                        setShowCropper={this.setShowCropper}
                                        cropSize={this.state.cropperSize}
                                    />
                                    : ''}
                                <div className="progress" style={currentMedia && (currentMedia[1] === 'video' || currentMedia[1] === 'audio') ? { zIndex: 2 } : { zIndex: -1, bottom: '-35px' }}><span style={{ left: currentMedia ? currentMedia[0].currentTime / currentMedia[0].duration * 99 + '%' : 0, height: currentMedia && currentMedia[1] === 'audio' ? '1000px' : '100%' }}> </span> </div>
                                <div className="recycle"> </div>
                            </div>
                            <div className="control-bar" onClick={() => {
                                this.setState({ 'showCropper': false })
                                this.playVideo();
                            }}>
                                <div className="time-cnt">
                                    {currentMedia ? <span>{getTime(currentMedia[0].currentTime || 0)}</span> :
                                        <span>{getTime((this.state.time_line_now - this.state.time_line_start) / this.state.unit_length * this.state.unit_time)}</span>}
                                    <span>/</span>
                                    {currentMedia ? <span>{getTime(currentMedia[0].duration || (currentMedia[1] === 'image' ? 0 : this.state.currentMediaDuration))}</span> :
                                        <span>{this.state.duration}</span>}
                                </div>
                                <div className="play-cnt">
                                    <span title={say('main', 'toStart') + "（Home）"} className="ico iconfont icon-houtui" onClick={() => {
                                        this.toBegin();
                                    }}>  </span><span title={say('main', 'pause/play') + "（Space）"} id="playBtn"
                                        className={'ico iconfont icon-' + (this.state.paused ? 'bofang' : 'zanting')}>  </span>
                                    <span title={say('main', 'toEnd') + "（End）"} className="ico iconfont icon-qianjin" onClick={() => {
                                        this.toEnd();
                                    }}>  </span>
                                </div>
                                <div className="full-ctrl">
                                    <Select className={'screen-scale'} value={this.state.screen_scale} size={'small'} style={{ width: 90 }} onChange={(val) => {
                                        this.transform(val);
                                    }}>
                                        <Option value="16:9"><span className="icon iconfont icon--2"> </span>16:9</Option>
                                        <Option value="4:3"><span className="icon iconfont icon--"> </span>4:3</Option>
                                        <Option value="1:1"><span className="icon iconfont icon--1"> </span>1:1</Option>
                                        <Option value="9:16"><span className="icon iconfont icon--3"> </span>9:16</Option>
                                    </Select>
                                    {/*<span title={say('main','switch')} className="transition ico iconfont icon-pingmufanzhuan-" onClick={this.transform}>*/}

                                    {/*</span>*/}
                                    <span title={say('main', 'fullScreenPlay')} className="fullScreen ico iconfont icon-quanping" onClick={this.fullReveal}>

                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <OperationBar
                        getConfigStatus={getStatus}
                        setTransToAudio={this.setTransToAudio}
                        transToAudio={this.state.transToAudio}
                        is_template={is_template}
                        show_shortcut={() => {
                            this.show_shortcut();
                        }}
                        shear={this.shear}
                        initRuler={this.initRuler}
                        clip={this.clip}
                        clone={this.clone}
                        enterUnitDetail={this.enterUnitDetail}
                        deleteUnit={this.deleteUnit}
                        set_theme={this.set_theme}
                        themeConfig={this.state.themeConfig}
                        trans_audio_to_text={this.trans_audio_to_text}
                        crop={this.crop}
                        setShowCropper={this.setShowCropper}
                        duration={this.state.duration}
                        history={this.props.history}
                        pre={this.toPre} next={this.toNext}
                    />
                    <div className="control">
                        <div className="control-box">
                            <div className="timer">
                                <div className="pathway-ctrl">
                                    <Dropdown overlay={<Menu className="" onClick={(key) => {
                                        addPath(key.key, '轨道');
                                    }}>
                                        {/*<Menu.Item key="1"><span className="ico iconfont icon-lishijilu"> </span>历史版本</Menu.Item>*/}
                                        <Menu.Item key="video"><span className="ico iconfont icon-tianjiashipin-dianji"> </span>添加视频轨</Menu.Item>
                                        <Menu.Item key="audio"><span className="ico iconfont icon-yinle"> </span>添加音频轨</Menu.Item>
                                    </Menu>}>
                                        <span className="ico iconfont icon-tianjiaguidao" >
                                            {/*<span className="ant-select-arrow"><b> </b></span>*/}
                                        </span>
                                    </Dropdown>
                                    <Tooltip title={say('main', 'adsorption')} >
                                        <span className={this.state.auto_indent ? 'ico iconfont icon-citie-dianji c-r' : 'ico iconfont icon-citie-dianji'}
                                            onClick={() => {
                                                $('.material-main-list .mater').draggable({ snapTolerance: this.state.auto_indent ? 0 : 10 });
                                                $('.pathway .mater-helper').draggable({ snapTolerance: this.state.auto_indent ? 0 : 10 });
                                                this.setState({ auto_indent: !this.state.auto_indent })
                                            }}>  </span>
                                    </Tooltip>
                                    {/*<Tooltip title={this.state.main_set?'主轨道锁':'主轨道锁'} >*/}
                                    {/*<span  className={this.state.main_set?'ico iconfont icon-suotouguan c-r':'ico iconfont icon-suotouguan'} onClick={()=>{*/}
                                    {/*let text_info=getConfig()['text_info']||{*/}
                                    {/*"font_size": 50,*/}
                                    {/*"status":true,*/}
                                    {/*"font_color": 'ffffff',*/}
                                    {/*"font_name": 'FZShuSong-Z01S',*/}
                                    {/*"background_color": '000000',*/}
                                    {/*"alpha": 0,*/}
                                    {/*"position_x": 'middle',  // 水平位置，left, middle, right*/}
                                    {/*"position_y": 0,  // 底部间距，px*/}
                                    {/*};*/}
                                    {/*// text_info.status=!this.state.main_set;*/}
                                    {/*this.setState({main_set:!this.state.main_set})*/}
                                    {/*}}> </span>*/}
                                    {/*</Tooltip>*/}
                                    {/*<Tooltip title={this.state.subtitles_show?'隐藏字幕':'显示字幕'} >*/}
                                    {/*<span  className={this.state.subtitles_show?'ico iconfont icon-zimu c-r':'ico iconfont icon-zimu'} onClick={()=>{*/}
                                    {/*let text_info=getConfig()['text_info']||{*/}
                                    {/*"font_size": 50,*/}
                                    {/*"status":true,*/}
                                    {/*"font_color": 'ffffff',*/}
                                    {/*"font_name": 'FZShuSong-Z01S',*/}
                                    {/*"background_color": '000000',*/}
                                    {/*"alpha": 0,*/}
                                    {/*"position_x": 'middle',  // 水平位置，left, middle, right*/}
                                    {/*"position_y": 0,  // 底部间距，px*/}
                                    {/*};*/}
                                    {/*text_info.status=!this.state.subtitles_show;*/}
                                    {/*this.playVideo();*/}
                                    {/*this.setState({subtitles_show:!this.state.subtitles_show})*/}
                                    {/*}}> </span>*/}
                                    {/*</Tooltip>*/}
                                    {/*<span className="box">{'轨道设置'} <span className="mini"> </span>*/}
                                    {/*<ul>*/}
                                    {/*<li onClick={() => {*/}
                                    {/*// this.getMediaType('all')*/}
                                    {/*}}>全部收缩</li>*/}
                                    {/*<li onClick={() => {*/}
                                    {/*// this.getMediaType('video')*/}
                                    {/*}}>全部展开</li>*/}
                                    {/*</ul></span>*/}
                                </div>
                                <div className="time-line">
                                    <canvas className="ruler" onClick={(event) => {
                                        let l = event.clientX - ctrl_width + $(document).scrollLeft();
                                        this.set_time_line_now(l >= 0 ? l : 0);
                                    }}> </canvas>
                                    <div className="line" title={say('main', 'pointer')} style={{
                                        left: this.state.time_line_now,
                                        display: this.state.time_line_now < 0 ? 'none' : ''
                                    }}>
                                        <div className="timer">
                                            <span
                                                className="timeShow">{getTime((this.state.time_line_now - this.state.time_line_start) / this.state.unit_length * this.state.unit_time)}</span>
                                            <span className="ico iconfont icon-jiandao clip" onClick={this.clip}> </span>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="tl-body">
                                <div className="tl-wrapper">
                                    <div className="pathway-ctrl">
                                        {this.state._ctrl}
                                        {/*    <div className="ctrl">
                                            <div>
                                                <div><span className="ico-v"> </span> <span className="name">我的视频</span>
                                                </div>
                                                <div><span>显</span><span>操</span></div>
                                            </div>
                                            <div>
                                            </div>
                                        </div>*/}
                                    </div>
                                    <div className="path" style={{ width: this.state.path_box }}>
                                        <div className="pathway-box">
                                            {this.state._pathway}
                                            {/*          <div className="pathway"
                                                 style={{width: this.state.max_time * this.state.unit_length / this.state.unit_time}}> </div>*/}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="footer">
                        <div className="save-txt">
                            {this.state.message.msg || ''}
                        </div>
                        <div className="tl-scroll">
                            <div className="scroll-bar"> </div>
                        </div>
                    </div>
                    <div className="temp-yellow"> </div>
                    <div className="menu-cnt">
                        <div className="clipChoose">
                            <span onClick={this.joinClip}>{say('main', 'trimToFit')}</span>
                            <span onClick={this.joinInsert}> {say('main', 'insertAndPush')}</span>
                            <span className="replace" onClick={this.replaceUnit}> {'替换'}</span>
                        </div>
                        <div className="contentMenu"><span onClick={() => {
                            this.deleteMedia('')
                        }}>{say('main', 'delete')}</span>
                            {/*<span onClick={this.joinInsert}> {say('main','insertAndPush')}</span>*/}
                        </div>
                        <div className="focus">
                            <span title={say('main', 'openTheDetail')} className="ico iconfont icon-bianji" onClick={() => {
                                this.enterUnitDetail();
                            }}> </span>
                            <span title={say('main', 'delete') + ' Delete'} className="ico iconfont icon-shanchu" onClick={this.deleteUnit}> </span>
                        </div>
                    </div>
                    <div className="full-cnt">

                    </div>
                </div>
                <Dialog setting={this.state.newFile} refresh={this.state.refreshDialog} />
                <Dialog setting={this.state.transition} />
                <Dialog setting={this.state.loadingSnap} />
                <Dialog setting={this.state.delete} />
                <Modal title={this.state.modalTitle}
                    visible={this.state.modalVisible}
                    confirmLoading={this.state.confirmLoading}
                    style={{ top: 200 }}
                    onOk={() => {
                        this.onOk();
                    }}
                    onCancel={() => {
                        this.setState({ modalVisible: false })
                    }}
                >
                    <p>
                        <Input
                            maxLength={30}
                            placeholder={'轨道名称'}
                            value={this.state.modalText}
                            onChange={(e) => {
                                this.setState({ modalText: e.target.value })
                            }}
                            onPressEnter={(e) => {
                                if (!this.state.confirmLoading)
                                    this.onOk();
                            }} /></p>
                    <div>
                        <Radio.Group
                            value={this.state.modalType} onChange={(e) => {
                                this.setState({ modalType: e.target.value })
                            }}>
                            <Radio value="video">图像轨道</Radio>
                            <Radio value="audio">音频轨道</Radio>
                        </Radio.Group>
                    </div>
                </Modal>
                <IssueModel screen_scale={this.state.screen_scale} is_template={is_template} meal={this.state.meal} playVideo={this.playVideo} getSnapshot={this.getSnapshot} close={this.closeIssue} history={this.props.history}
                    issue={this.state.issue} />
                {/*<Detail visible={this.state.show_detail} close={()=>{this.setState({show_detail:false})}} data={this.state.detail}/>*/}
                <Record
                    record={this.state.record}
                    setSilence={this._setSilence}
                    set_time_now={this.set_time_now}
                    close={this._closeRecord}
                    playVideo={this.playVideo}
                    pause={this._pause}
                    project_id={project_id}
                    visible={this.state.show_record}
                    data={this.state.detail}
                />
                <Shortcut setting={this.state.show_shortcut} />
                <Modal title={this.state.saveTemplate ? '合成模板' : '新建项目'}
                    visible={this.state.newTemplateVisible}
                    style={{ top: 200 }}
                    onOk={() => {
                        this.createTempPro();
                    }}
                    onCancel={() => {
                        this.setState({ newTemplateVisible: false })
                    }}
                >

                    {is_template && this.state.saveTemplate ? ''
                        :
                        <p className="dis-flex flex-a-c flex-j-c"><span >名称：</span><Input
                            style={{ width: 350 }}
                            placeholder="请输入名称"
                            onBlur={(e) => {
                                this.state.newTemplateText = e.target.value;
                            }}
                            onPressEnter={(e) => {
                                this.createTempPro(e.target.value);
                            }} /></p>}

                    <p className="h-20"> </p>
                    {this.state.saveTemplate ?
                        <p className="dis-flex flex-a-c flex-j-c"><span >标签：</span>
                            <Select
                                style={{ width: 350 }}
                                mode="tags"
                                placeholder={say('verify', 'say2')}
                                notFoundContent=""
                                value={this.state.label}
                                maxLength={8}
                                onChange={(val) => {
                                    let clone = [];
                                    val.map((v) => {
                                        let _v = v.replace(/\s+/g, '').replace(verify_list.label, '').substr(0, 8);
                                        if (_v && clone.length < 3 && clone.indexOf(_v) === -1)
                                            clone.push(_v);
                                    });
                                    this.state.label = clone;
                                    this.setState({ newTemplateVisible: this.state.newTemplateVisible })
                                }}
                            // tokenSeparators={[',']}
                            >
                            </Select>
                        </p> : ''}
                </Modal>
                <Modal
                    title={"重命名"}
                    visible={this.state.show_rename}
                    okText="确认"
                    cancelText="取消"
                    style={{ top: 200 }}
                    onOk={() => {
                        let {new_name} = this.state;
                        new_name = new_name.trim();
                        if (!new_name) {
                            message.info("名称不能为空");
                            return;
                        }
                        let data = {
                            project_id: project_id,
                            new_name: new_name,
                          };
                        channel("change_projectName", data, (re) => {
                           let configStatus = getConfig();
                           configStatus.name = new_name;
                            setConfig(configStatus); 
                            // 重命名
                            this.setState({ show_rename: false });
                          });
                    }}
                    onCancel={() => {
                        this.setState({ show_rename: false });
                    }}
                    >
                        <p>
                            <Input
                            maxLength={30}
                            value={this.state.new_name}
                            onChange={(e) => {
                                this.setState({ new_name: e.target.value });
                            }}
                            />
                        </p>
                        </Modal>
            </div>
        )
    }
});


export default Main;
