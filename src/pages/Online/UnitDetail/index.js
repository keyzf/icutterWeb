/* 高级操作 入口， 用于分发对应的页面 */
import React from 'react';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/slider';
import 'jquery-ui/ui/effect';
import { message, Button } from 'antd';
import * as Quill from 'quill'  //引入编辑器
import { load_fonts } from "@/channel/load_fonts";
import say from '@/database/local_language';
import {
    render as renderConfig,
    setSection,
    getConfig,
    getVideoList,
} from '../trackDetail/online-configs';
import { refreshSvg } from '../trackDetail/load_unit';
import f0 from '@/images/filter0.png';
import f1 from '@/images/filter1.png';
import f2 from '@/images/filter2.png';
import f3 from '@/images/filter3.png';
import f4 from '@/images/filter4.png';
import f5 from '@/images/filter5.png';
import AttrTrans from './attr-trans';
import AttrSpeed from './attr-speed';
import AttrColor from './attr-color';
import AttrAudio from './attr-audio';
import AttrEffects from './attr-effects';
import AttrChromatic from './attr-chromatic';
import AttrText from './attr-text';
import AttrAnimation from './attr-animation';
import Delogo from './attr-delogo';

let fonts = [];
let render_canvas = '';
let tab = {
    'video': [
        { k: 0, v: '变换', ico: 'icon-jibenbianhuan' },
        { k: 1, v: say('main', 'speed'), ico: 'icon-sudu' },
        { k: 2, v: say('main', 'color'), ico: 'icon-yanse' },
        { k: 3, v: say('main', 'audio'), ico: 'icon-yinpin' },
        { k: 4, v: '模糊', ico: 'icon-mohu' },
        // aaaaaa
        // { k: 5, v: say('main', 'chromatic'), ico: 'icon-kouxiang' },
        { k: 6, v: say('main', 'filter'), ico: 'icon-lvjing' }
    ],
    'audio': [
        { k: 3, v: say('main', 'audio'), ico: 'icon-yinpin' }
    ],
    'text': [
        { k: 7, v: say('main', 'text'), ico: 'icon-jibenbianhuan' },
        { k: 0, v: say('main', 'basicTransfom'), ico: 'icon-jibenbianhuan' }
    ],
    'animation': [
        { k: 8, v: say('main', 'animation'), ico: 'icon-donghua' },
        { k: 0, v: '变换', ico: 'icon-jibenbianhuan' }
    ],
    'image': [
        { k: 0, v: '变换', ico: 'icon-jibenbianhuan' },
        { k: 2, v: say('main', 'color'), ico: 'icon-yanse' },
        { k: 4, v: say('main', 'effects'), ico: 'icon-mohu' },
        // aaaaaa
        // { k: 5, v: say('main', 'chromatic'), ico: 'icon-kouxiang' },
        { k: 6, v: say('main', 'filter'), ico: 'icon-lvjing' }
    ],
};
let effectList = [
    { img: f0, k: 'original', name: say('main', 'original') },
    { img: f1, k: 'monochrome', name: say('main', 'monochrome') },
    { img: f2, k: 'negate', name: say('main', 'negate') },
    { img: f3, k: 'emboss', name: say('main', 'emboss') },
    { img: f4, k: 'vintage', name: say('main', 'vintage') },
    { img: f5, k: 'blur', name: say('main', 'blur') }
];
let lockZoom = false;
let lockVoiceFade = false;
let lockPosition = false;
let lockZoomT = false;
let lockPositionT = false;
let zoomDirection = '';
let lockFade = false;
let lockMove = false;
let selected_start = false;
let selected_end = false;
let halfWidth = 0;
let halfHeight = 0;
let mouseMove = () => {

};
let mouseUp = () => {

};

export default class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: tab.video,
            name: say('main', 'basicTransfom'),
            media: '',
            change: true,
            media_info: {},
            delgo: {},
            update: '',
            obj: {},
            index: 0
        };
    }

    componentWillMount() {
        let font_list = load_fonts();
        let Font = Quill.import('formats/font');
        font_list.map((v, k) => {
            fonts.push(v.code);
        });
        Font.whitelist = fonts; //将字体加入到白名单
        Quill.register(Font, true);
    }

    handleChange(value) {
        this.state.obj.special.text = value;
        this.refreshParam();
    }

    componentWillUnmount() {
        let state = {
            tab: tab.video,
            delgo: {},
            media_info: {},
            media: '',
            name: say('main', 'basicTransfom'),
            change: true,
            update: '',
            obj: {},
            index: 0
        };
        for (let i in state) {
            this.state[i] = state[i]
        }
        $(window).unbind('mousemove', mouseMove);
        $(window).unbind('mouseup', mouseUp);
    }

    _execute(value, name) {
        let re = '';
        if (typeof (value) === 'undefined') {
            re = true;
        }
        if (typeof (value) === 'number') {
            let obj = this.state.obj;
            let val = parseFloat(value * 1);
            switch (name) {
                case 'zoomStart':
                    obj.transform.start_scale = (val > 5 ? 5 : val < 0.01 ? 0.01 : val).toFixed(2) * 1;
                    re = val === 0 ? '' : obj.transform.start_scale;
                    break;
                case 'zoomEnd':
                    obj.transform.end_scale = (val > 5 ? 5 : val < 0.01 ? 0.01 : val).toFixed(2) * 1;
                    re = val === 0 ? '' : obj.transform.end_scale;
                    break;
            }
            this.refreshParam();
        }
        if (!isNaN(value) && value !== '') {
            let obj = this.state.obj;
            let val = parseFloat(value * 1);
            switch (name) {
                case 'flip':
                    obj.transform.flip = val;
                    break;
                case 'rotation':
                    obj.transform.rotation = parseInt(((val - 180) % 360 + 360) % 360 - 180);
                    break;
                case 'operationStartX':
                    obj.transform.start_position_x = parseInt(val);
                    break;
                case 'operationStartY':
                    obj.transform.start_position_y = parseInt(val);
                    break;
                case 'operationEndX':
                    obj.transform.end_position_x = parseInt(val);
                    break;
                case 'operationEndY':
                    obj.transform.end_position_y = parseInt(val);
                    break;
                case 'speedV':
                    this.setSpeed(val);
                    break;
                case 'zoomStart-t':
                    obj.special.font_size = parseInt(val > 400 ? 400 : val < 10 ? 10 : val);
                    break;
                case 'operationW-t':
                    obj.special.position_w = parseInt(val > 4000 ? 4000 : val < 0 ? 0 : val);
                    break;
                case 'operationH-t':
                    obj.special.position_h = parseInt(val > 2200 ? 2200 : val < 0 ? 0 : val);
                    break;
                case 'lineHeight-t':
                    obj.special.line_height = parseInt(val > 300 ? 300 : val < 90 ? 90 : val);
                    break;
                case 'spacing-t':
                    obj.special.spacing = (val > 5 ? 5 : val < -1 ? -1 : val).toFixed(2) * 1;
                    break;
                case 'fadeStart':
                    obj.video_fade[0].visibility = parseInt((val > 100 ? 100 : val < 0 ? 0 : val));
                    break;
                case 'fadeEnd':
                    obj.video_fade[1].visibility = parseInt((val > 100 ? 100 : val < 0 ? 0 : val));
                    break;
                case 'voiceFadeStart':
                    this._setAudioFade(((val > 5 ? 5 : val < 0 ? 0 : val).toFixed(1) * 1), 's');
                    break;
                case 'voiceFadeEnd':
                    this._setAudioFade(((val > 5 ? 5 : val < 0 ? 0 : val).toFixed(1) * 1), 'e');
                    break;
                case 'brightness':
                    obj.color.brightness = parseInt((val > 100 ? 100 : val < -100 ? -100 : val));
                    break;
                case 'contrast':
                    obj.color.contrast = parseInt((val > 100 ? 100 : val < -100 ? -100 : val));
                    break;
                case 'saturation':
                    obj.color.saturation = parseInt((val > 100 ? 100 : val < -100 ? -100 : val));
                    break;
                case 'hue':
                    obj.color.hue = parseInt((val > 180 ? 180 : val < -180 ? -180 : val));
                    break;
                case 'volumeStart':
                    obj.volume.value = parseInt((val > 100 ? 100 : val < 0 ? 0 : val));
                    break;
                case 'vague-x':
                    obj.specialeffect.vague_x = parseInt((val > 100 ? 100 : val < 0 ? 0 : val));
                    break;
                case 'vague-y':
                    obj.specialeffect.vague_y = parseInt((val > 100 ? 100 : val < 0 ? 0 : val));
                    break;
                case 'chroma-s':
                    obj.colorkeying.sensitivity = parseInt((val > 100 ? 100 : val < 1 ? 1 : val));
                    break;
                case 'chroma-t':
                    obj.colorkeying.transparency = parseInt((val > 100 ? 100 : val < 0 ? 0 : val));
                    break;
            }
            this.refreshParam();
        }
        return re;
    }

    setSpeed(val) {
        let newVal = val;
        let speed = parseInt(newVal);
        let obj = this.state.obj;
        obj.speed.value = speed;
        let _end = Math.round((obj.start_time + (this.state.obj.special.end_range - this.state.obj.special.start_range) * (speed > 0 ? 1 / speed : -speed)) * 25) / 25;
        let poor = _end - obj.end_time;
        obj.end_time = _end;
        setSection(obj.start_time, obj.end_time);
        let props = this.props.unit_detail;
        if (props.layer || props.layer === 0) {
            let _config = getConfig();
            let len = _config.video_list.length;
            let path = props.layer < len ? _config.video_list[props.layer] : _config.audio_list[props.layer - len];
            let obj = path.obj_list[props.position + 1];
            let total = obj.end_time;
            if (path.obj_list.length > props.position + 2) {
                let obj2 = path.obj_list[props.position + 2];
                let short = obj.end_time - obj2.start_time;
                short = Math.max(short, poor);
                for (let i = props.position + 2; i < path.obj_list.length; i++) {
                    path.obj_list[i].start_time = path.obj_list[i].start_time * 1 + short;
                    total = path.obj_list[i].end_time = path.obj_list[i].end_time * 1 + short;
                }
            }
            _config.duration = total > _config.duration ? total : _config.duration;
            renderConfig();
        }
    }

    openDelogo() {
        if (this.state.obj.special) {
            this.setState({
                delgo: {
                    show: true,

                }
            })
        }
    }

    closeDelogo() {
        this.setState({ delgo: {} })

    }

    setDeLogo(list) {
        // this.state.media_info
        let w = this.state.media_info.width;
        let h = this.state.media_info.height;
        if (list.length) {
            list && list.map((v, k) => {
                v.logo_x = (v.logo_x / w).toFixed(4) * 1;
                v.logo_width = (v.logo_width / w).toFixed(4) * 1;
                v.logo_y = (v.logo_y / h).toFixed(4) * 1;
                v.logo_height = (v.logo_height / h).toFixed(4) * 1;
            });
        }
        this.state.obj.delogo = list || [];
        this.refreshParam();
    }

    save() {
        let props = this.props.unit_detail;
        if (props.layer || props.layer === 0) {
            let _config = getConfig();
            let len = _config.video_list.length;
            let path = props.layer < len ? _config.video_list[props.layer] : _config.audio_list[props.layer - len];
            let obj = path.obj_list[props.position + 1];
            let total = obj.end_time;
            if (path.obj_list.length > props.position + 2) {
                let obj2 = path.obj_list[props.position + 2];
                let short = obj.end_time - obj2.start_time;
                for (let i = props.position + 2; i < path.obj_list.length; i++) {
                    path.obj_list[i].start_time = path.obj_list[i].start_time * 1 + short;
                    total = path.obj_list[i].end_time = path.obj_list[i].end_time * 1 + short;
                }
            }
            _config.duration = total > _config.duration ? total : _config.duration;
            renderConfig();
        }
    }

    toStart() {
        selected_start = true;
        selected_end = false;
        let obj = this.state.obj;
        this.props.set_time_now(obj.start_time);
        this.refreshParam();
    }
    toEnd() {
        selected_end = true;
        selected_start = false;
        let obj = this.state.obj;
        this.props.set_time_now(obj.end_time);
        this.refreshParam();
    }
    _setAudioFade(value, status) {
        let _fade = this.state.obj.audio_fade;
        let _duration = (this.state.obj.special.end_range - this.state.obj.special.start_range) / 2;
        value = value > _duration ? _duration : value;
        let _onePiece = [{
            "time_point": this.state.obj.special.start_range,  // 相对该视频时间点
            "visibility": 100,  // 音量
            "fade_type": 0,  // 0-视频/图片/文本/背景，1-音频
        }];
        let _twoPiece = [{
            "time_point": this.state.obj.special.end_range,  // 相对该视频时间点
            "visibility": 100,  // 音量
            "fade_type": 0,  // 0-视频/图片/文本/背景，1-音频
        }];
        if (status === 's') {
            if (value) {
                _onePiece = [{
                    "time_point": this.state.obj.special.start_range,  // 相对该视频时间点
                    "visibility": 0,  // 音量
                    "fade_type": 0,  // 0-视频/图片/文本/背景，1-音频
                }, {
                    "time_point": (this.state.obj.special.start_range + value).toFixed(2) * 1,  // 相对该视频时间点
                    "visibility": 100,  // 音量
                    "fade_type": 0,  // 0-视频/图片/文本/背景，1-音频
                }]
            }
            if (_fade.length >= 3 && _fade[_fade.length - 2].visibility !== _fade[_fade.length - 1].visibility) {
                _twoPiece = [
                    _fade[_fade.length - 2],
                    _fade[_fade.length - 1]
                ]
            }
            if (!lockVoiceFade) {
                _twoPiece = [{
                    "time_point": (this.state.obj.special.end_range - value).toFixed(2) * 1,  // 相对该视频时间点
                    "visibility": 100,  // 音量
                    "fade_type": 0,  // 0-视频/图片/文本/背景，1-音频
                }, {
                    "time_point": this.state.obj.special.end_range,  // 相对该视频时间点
                    "visibility": 0,  // 音量
                    "fade_type": 0,  // 0-视频/图片/文本/背景，1-音频
                }];
            }
        } else {
            if (_fade.length > 2 && _fade[0].visibility !== _fade[1].visibility) {
                _onePiece = [
                    _fade[0],
                    _fade[1]
                ];
            }
            if (value) {
                _twoPiece = [
                    {
                        "time_point": (this.state.obj.special.end_range - value).toFixed(2) * 1,  // 相对该视频时间点
                        "visibility": 100,  // 音量
                        "fade_type": 0,  // 0-视频/图片/文本/背景，1-音频
                    }, {
                        "time_point": this.state.obj.special.end_range,  // 相对该视频时间点
                        "visibility": 0,  // 音量
                        "fade_type": 0,  // 0-视频/图片/文本/背景，1-音频
                    }
                ];
            }
        }
        this.state.obj.audio_fade = _onePiece.concat(_twoPiece);
        this.refreshParam();

    }

    componentDidMount() {
        let that = this;
        setTimeout(() => {
            $('.ql-editor')
        });
        $('#sec4-canvas').bind('click', (ev) => {
            let o = document.getElementById('sec4-canvas');
            if ($(o).hasClass('choose')) {
                let w = o.width, h = o.height, x, y;
                if (ev.layerX || ev.layerX === 0) {
                    x = ev.layerX;
                    y = ev.layerY;
                } else if (ev.offsetX || ev.offsetX === 0) { // Opera
                    x = ev.offsetX;
                    y = ev.offsetY;
                }
                x = x / parseInt($(o).css('width')) * w;
                y = y / parseInt($(o).css('height')) * h;
                let ctx = o.getContext('2d');
                try {
                    ctx.getImageData(x, y, 1, 1);
                } catch (e) {
                    message.warning('该界面中包含未导入完成素材，请手动输入六位数色值');
                    return
                }
                let image = ctx.getImageData(x, y, 1, 1);
                let color = '';
                image.data.map((v, k) => {
                    color += (v < 16 ? '0' + v.toString(16) : v.toString(16));
                });
                that.state.obj.colorkeying.select_color = color.substr(0, 6);
                that.refreshParam();
            }
        });
        $('.reveal').delegate('#sec4-canvas-show', 'mousedown', (e) => {
            lockMove = false;
            lockMove = true;
            let et = $(e.target);
            if (this.state.index === 0 || this.state.index === 7 || this.state.index === 8) {
                if (et.hasClass('r-b')) {
                    zoomDirection = '0';
                } else if (et.hasClass('l-b')) {
                    zoomDirection = '1';
                } else if (et.hasClass('l-t')) {
                    zoomDirection = '2';
                } else if (et.hasClass('r-t')) {
                    zoomDirection = '3';
                } else {
                    zoomDirection = '';
                }
            }
        });

        mouseMove = (e) => {
            if (lockMove) {
                let obj = this.state.obj;
                let canvas = $('#sec4-canvas');
                let w = parseInt(canvas.css('width')), h = parseInt(canvas.css('height'));
                let _x = e.originalEvent.movementX * (w > h ? 1920 : 1080) / w;
                let _y = e.originalEvent.movementY * (w > h ? 1080 : 1920) / h;
                if (this.state.index === 0 || this.state.index === 7 || this.state.index === 8) {
                    let trans = obj.transform;
                    /*旋转缩放支持*/
                    if (zoomDirection) {
                        let width = 1920, height = 1080;
                        let temp = this.state.media;
                        let canvas = $('#sec4-canvas');
                        let w = parseInt(canvas.css('width')), h = parseInt(canvas.css('height'));
                        let halfWidth = 0, halfHeight = 0;
                        if (temp) {
                            if (obj.obj_type === 'video') {
                                width = temp.videoWidth;
                                height = temp.videoHeight;
                            } else if (obj.obj_type === 'image') {
                                width = temp.width;
                                height = temp.height;
                            }
                            if (width / height > (w > h ? 16 / 9 : 9 / 16)) {
                                halfHeight = ((w > h ? 1080 : 1920) - height * (w > h ? 1920 : 1080) / width) / 2;
                                halfWidth = 0;
                            } else {
                                halfWidth = ((w > h ? 1920 : 1080) - width * (w > h ? 1080 : 1920) / height) / 2;
                                halfHeight = 0;
                            }
                        }
                        //原媒体对角线角度加旋转角度；
                        let _angleA = Math.atan(height / width) / Math.PI * 180 + (trans.rotation || 0) + zoomDirection * 90;
                        //斜边长度
                        let _w_2 = w - halfWidth * 2, _h_2 = h - halfHeight * 2;
                        let _scale = (w > h ? 1920 : 1080) / w / 1.5;
                        let _edge = Math.sqrt(_w_2 * _w_2 + _h_2 * _h_2) / 2;
                        if (this.state.index === 7) {
                            let edge = _edge * trans.start_scale;
                            //旋转后x轴坐标
                            let _x_2 = Math.cos(_angleA / 180 * Math.PI) * edge + _x / _scale;
                            let _y_2 = Math.sin(_angleA / 180 * Math.PI) * edge + _y / _scale;
                            let _n_rotation = Math.sqrt(_x_2 * _x_2 + _y_2 * _y_2) / _edge;
                            let __scale = Math.max(_n_rotation / trans.start_scale, 0);
                            obj.special.position_w = Math.round(__scale * obj.special.position_w);
                            obj.special.position_h = Math.round(__scale * obj.special.position_h);
                        } else {
                            if (lockZoom) {
                                if (!selected_end) {
                                    selected_start = true;
                                    this.props.set_time_now(obj.start_time);
                                    let edge = _edge * trans.start_scale;
                                    //旋转后x轴坐标
                                    let _x_2 = Math.cos(_angleA / 180 * Math.PI) * edge + _x / _scale;
                                    let _y_2 = Math.sin(_angleA / 180 * Math.PI) * edge + _y / _scale;
                                    let _n_rotation = Math.sqrt(_x_2 * _x_2 + _y_2 * _y_2) / _edge;
                                    trans.start_scale = (_n_rotation > 5 ? 5 : _n_rotation).toFixed(2) * 1;
                                } else {
                                    this.props.set_time_now(obj.end_time);
                                    let edge = _edge * trans.end_scale;
                                    //旋转后x轴坐标
                                    let _x_2 = Math.cos(_angleA / 180 * Math.PI) * edge + _x / _scale;
                                    let _y_2 = Math.sin(_angleA / 180 * Math.PI) * edge + _y / _scale;
                                    let _n_rotation = Math.sqrt(_x_2 * _x_2 + _y_2 * _y_2) / _edge;
                                    trans.end_scale = (_n_rotation > 5 ? 5 : _n_rotation).toFixed(2) * 1;
                                }
                            } else {
                                let edge = _edge * trans.start_scale;
                                //旋转后x轴坐标
                                let _x_2 = Math.cos(_angleA / 180 * Math.PI) * edge + _x / _scale;
                                let _y_2 = Math.sin(_angleA / 180 * Math.PI) * edge + _y / _scale;
                                let _n_rotation = Math.sqrt(_x_2 * _x_2 + _y_2 * _y_2) / _edge;
                                trans.start_scale = (_n_rotation > 5 ? 5 : _n_rotation).toFixed(2) * 1;
                                trans.end_scale = trans.start_scale;
                            }
                        }
                    } else {
                        if (lockPosition) {
                            if (!selected_end) {
                                selected_start = true;
                                this.props.set_time_now(obj.start_time);
                                trans.start_position_x = trans.start_position_x + e.originalEvent.movementX * (w > h ? 1920 : 1080) / w;
                                trans.start_position_y = trans.start_position_y + e.originalEvent.movementY * (w > h ? 1080 : 1920) / h;
                            } else {
                                this.props.set_time_now(obj.end_time);
                                trans.end_position_x = trans.end_position_x + e.originalEvent.movementX * (w > h ? 1920 : 1080) / w;
                                trans.end_position_y = trans.end_position_y + e.originalEvent.movementY * (w > h ? 1080 : 1920) / h;
                            }
                        } else {
                            trans.end_position_x = trans.start_position_x = trans.start_position_x + e.originalEvent.movementX * (w > h ? 1920 : 1080) / w;
                            trans.end_position_y = trans.start_position_y = trans.start_position_y + e.originalEvent.movementY * (w > h ? 1080 : 1920) / h;

                        }
                    }
                }
                this.refreshParam();
            }
        }
        mouseUp = (e) => {
            if (lockMove) {
                lockMove = false;
                if (this.state.index === 0 || this.state.index === 7 || this.state.index === 8) {
                    let trans = this.state.obj.transform;
                    trans.start_position_x = Math.round(trans.start_position_x);
                    trans.end_position_x = Math.round(trans.end_position_x);
                    trans.start_position_y = Math.round(trans.start_position_y);
                    trans.end_position_y = Math.round(trans.end_position_y);
                    this.refreshParam();
                }
                this.refreshParam();
            }
        }
        $(window).bind('mousemove', mouseMove);
        $(window).bind('mouseup', mouseUp);
    }

    shouldComponentUpdate(nP, nS) {
        let os = this.props.unit_detail.show, ns = nP.unit_detail.show;
        if (ns && !os) {
            let props = nP.unit_detail;
            if (props.layer || props.layer === 0) {
                let _config = getConfig();
                let len = _config.video_list.length;
                let path = props.layer < len ? _config.video_list[props.layer] : _config.audio_list[props.layer - len];
                let index = props.position + 1;
                let obj = path.obj_list[index];
                this.state.obj = obj;
                this.tab = tab[obj.special['sub_type'] === 'animation' ? 'animation' : obj.obj_type];
                if (!this.tab) {
                    this.props.close();
                    return;
                }
                if (obj.special['sub_type'] === 'animation') {
                    nP.set_time_now(obj.start_time + 2);
                } else {
                    setSection(obj.start_time, obj.end_time);
                }
                this.state.name = this.tab[0].v;
                this.state.index = this.tab[0].k;
                if (obj.obj_type === 'video' || obj.obj_type === 'image' || obj.special['sub_type'] === 'animation') {
                    let width = 1920, height = 1080;
                    let temp = this.state.media = getVideoList()[obj.obj_id + '_' + props.layer];
                    if (temp) {
                        let canvas = $('#sec4-canvas');
                        let w = parseInt(canvas.css('width')), h = parseInt(canvas.css('height'));
                        if (obj.obj_type === 'video') {
                            width = temp.videoWidth;
                            height = temp.videoHeight;
                        } else if (obj.obj_type === 'image') {
                            width = temp.width;
                            height = temp.height;
                        }
                        if (width / height > (w > h ? 16 / 9 : 9 / 16)) {
                            halfHeight = ((w > h ? 1080 : 1920) - height * (w > h ? 1920 : 1080) / width) / 2;
                            halfWidth = 0;
                        } else {
                            halfWidth = ((w > h ? 1920 : 1080) - width * (w > h ? 1080 : 1920) / height) / 2;
                            halfHeight = 0;
                        }
                    }
                    {
                        let width = 1920, height = 1080;
                        let _halfHeight = halfHeight, _halfWidth = halfWidth;
                        let w = 1920, h = 1080;
                        if (obj.obj_type === 'video') {
                            width = temp.videoWidth;
                            height = temp.videoHeight;
                        } else if (obj.obj_type === 'image') {
                            width = temp.width;
                            height = temp.height;
                        }
                        if (width / height > (w > h ? 16 / 9 : 9 / 16)) {
                            _halfHeight = ((w > h ? 1080 : 1920) - height * (w > h ? 1920 : 1080) / width) / 2;
                            _halfWidth = 0;
                        } else {
                            _halfWidth = ((w > h ? 1920 : 1080) - width * (w > h ? 1080 : 1920) / height) / 2;
                            _halfHeight = 0;
                        }
                        this.state.media_info = {
                            halfHeight: _halfHeight,
                            halfWidth: _halfWidth,
                            width: 1920 - _halfWidth * 2,
                            height: 1080 - _halfHeight * 2,
                            type: obj.obj_type,
                            mediaUrl: obj.special.preview_mp4 || obj.special.media_url
                        }
                    }
                }
            } else {
                setSection(0, getConfig().duration)
            }
            if (this.state.obj.transform) {
                lockZoom = this.state.obj.transform.end_scale !== this.state.obj.transform.start_scale;
                lockPosition = this.state.obj.transform.end_position_x !== this.state.obj.transform.start_position_x || this.state.obj.transform.end_position_y !== this.state.obj.transform.start_position_y;
            }
            if (this.state.obj.obj_type === 'text') {
                lockZoomT = this.state.obj.special.end_font_size !== this.state.obj.special.start_font_size;
                lockPositionT = this.state.obj.special.end_position_x !== this.state.obj.special.start_position_x || this.state.obj.special.end_position_y !== this.state.obj.special.start_position_y;
            }
            if (this.state.obj.video_fade) {
                lockFade = this.state.obj.video_fade && this.state.obj.video_fade.length > 1;
            }
            let _audio_fade = this.state.obj.audio_fade;
            if (_audio_fade) {
                lockVoiceFade = _audio_fade.length === 3 || (_audio_fade.length === 4 && (_audio_fade[1].time_point - _audio_fade[0].time_point !== _audio_fade[3].time_point - _audio_fade[2].time_point));
            }
            this.props.playVideo('area', this.state.obj.obj_id + '_' + props.layer, this.state.index === 4 ? 'delogo' : 'trans');
            let obj = this.state.obj;
            if (obj.obj_type === 'video' || obj.obj_type === 'image') {
                let width = 1920, height = 1080;
                let temp = getVideoList()[obj.obj_id + '_' + props.layer];
                if (temp) {
                    let canvas = $('#sec4-canvas');
                    let w = parseInt(canvas.css('width')), h = parseInt(canvas.css('height'));

                    if (obj.obj_type === 'video') {
                        width = temp.videoWidth;
                        height = temp.videoHeight;
                    } else if (obj.obj_type === 'image') {
                        width = temp.width;
                        height = temp.height;
                    }
                    if (width / height > (w > h ? 16 / 9 : 9 / 16)) {
                        halfHeight = ((w > h ? 1080 : 1920) - height * (w > h ? 1920 : 1080) / width) / 2;
                        halfWidth = 0;
                    } else {
                        halfWidth = ((w > h ? 1920 : 1080) - width * (w > h ? 1080 : 1920) / height) / 2;
                        halfHeight = 0;
                    }
                }
            }
        }
        if (os && !ns) {
            this.state.index = -1;
            setSection(0, getConfig().duration)
        }
        return true;
    }

    refreshParam(change) {
        if (this.state.obj.transform) {
            if (!lockZoom) {
                this.state.obj.transform.end_scale = this.state.obj.transform.start_scale;
            }
            if (!lockPosition) {
                this.state.obj.transform.end_position_x = this.state.obj.transform.start_position_x;
                this.state.obj.transform.end_position_y = this.state.obj.transform.start_position_y;
            }
            if (!(lockZoom || lockPosition)) {
                selected_end = false;
                selected_start = false;
            }
        }
        if (this.state.obj.obj_type === 'text') {
            refreshSvg(this.state.obj.special)
        }

        if (this.state.obj.video_fade) {
            if (!lockFade) {
                this.state.obj.video_fade.length = 1;
            }
        }
        $('#sec4-canvas').removeClass('choose');
        this.setState({ change: true });
        clearTimeout(render_canvas);
        if (change) {
            render_canvas = setTimeout(() => {
                this.props.playVideo('area', this.state.obj.obj_id + '_' + this.props.unit_detail.layer, this.state.index === 4 ? 'delogo' : 'trans');
            }, 300)
        } else {
            this.props.playVideo('area', this.state.obj.obj_id + '_' + this.props.unit_detail.layer, this.state.index === 4 ? 'delogo' : 'trans');
        }
    }
    render() {
        let tabs = [];
        let obj = this.state.obj;
        if (this.tab) {
            for (let i = 0; i < this.tab.length; i++) {
                let o = this.tab[i];
                tabs.push(<li className={o.k === this.state.index ? 'current' : ''} onClick={(e) => {
                    if ((o.k === 4 || o.k === 5) && (!this.state.media || !this.state.media.crossOrigin)) {
                        message.warning('该素材未导入完成，不支持' + o.v + '设置');
                    } else {
                        this.state.index = o.k;
                        this.state.name = o.v;
                        let rive = $('.sec-box');
                        if ((this.state.index === 0 || this.state.index === 7 || this.state.index === 8) && rive.length) {
                            rive.show();
                        } else {
                            rive.hide();
                        }
                        this.refreshParam();
                    }
                }} key={'detailTab' + i} name={o.k}>
                    <span className={'ico iconfont ' + o.ico}> </span>
                    <p>{o.v}</p>
                </li>)
            }
        }
        let effects = [];
        for (let i = 0; i < effectList.length; i++) {
            effects.push(<li key={'effect' + i} onClick={() => {
                if (effectList[i].k === 'emboss' && (!this.state.media || !this.state.media.crossOrigin)) {
                    message.warning('该素材未导入完成，不支持浮雕滤镜')
                } else {
                    this.state.obj.effects = effectList[i].k;
                    this.setState({ obj: this.state.obj });
                    this.props.playVideo();
                }
            }}><div className='pic'>
                    <img src={effectList[i].img}
                        alt="" />
                    {this.state.obj.effects === effectList[i].k
                        ? <span className='current-tip'>
                            <span className='ico iconfont icon-duigou'> </span>
                        </span>
                        : ''}

                </div>
                <p><span>{effectList[i].name}</span></p>
            </li>)
        }
        return (
            <div className={'unit-detail-only ' + (this.props.unit_detail.show ? '' : 'unit-detail-only hidden')}>
                <div className="unit-content">
                    <div className="unit-top">
                        <ul>
                            {tabs}
                        </ul>
                    </div>
                    <div className="editBox">
                        <div className="unit-body">
                            {this.state.index === 0 && this.state.obj.transform && this.state.obj.video_fade ?
                                <AttrTrans
                                    execute={this._execute.bind(this)}
                                    transform={this.state.obj.transform}
                                    start_scale={this.state.obj.transform.start_scale}
                                    end_scale={this.state.obj.transform.end_scale}
                                    video_fade={this.state.obj.video_fade}
                                    lockZoom={lockZoom}
                                    type={this.state.obj.obj_type}
                                    lockPosition={lockPosition}
                                    lockFade={lockFade}
                                    selected_start={selected_start}
                                    selected_end={selected_end}
                                    to_start={this.toStart.bind(this)}
                                    to_end={this.toEnd.bind(this)}
                                    set_blurred={(value) => {
                                        let obj = this.state.obj;
                                        obj.transform.blurred = value || false;
                                        this.refreshParam();
                                        return value
                                    }}
                                    zoom_animate={() => {
                                        if (lockZoom) {
                                            this.state.obj.transform.end_scale = this.state.obj.transform.start_scale;
                                            lockZoom = false;
                                        } else {
                                            lockZoom = true;
                                        }
                                        this.refreshParam();
                                    }}
                                    zoom_reset={() => {
                                        let obj = this.state.obj;
                                        obj.transform.start_scale = 1;
                                        obj.transform.end_scale = 1;
                                        lockZoom = false;
                                        this.refreshParam();
                                    }}
                                    position_animate={() => {
                                        if (lockPosition) {
                                            this.state.obj.transform.end_position_x = this.state.obj.transform.start_position_x;
                                            this.state.obj.transform.end_position_y = this.state.obj.transform.start_position_y;
                                            lockPosition = false;
                                        } else {
                                            lockPosition = true;
                                        }
                                        this.refreshParam();
                                    }}
                                    position_reset={() => {
                                        let obj = this.state.obj;
                                        obj.transform.start_position_x = 0;
                                        obj.transform.start_position_y = 0;
                                        obj.transform.end_position_x = 0;
                                        obj.transform.end_position_y = 0;
                                        lockPosition = false;
                                        this.refreshParam();
                                    }}
                                    fade_animate={() => {
                                        if (this.state.obj.video_fade.length < 2) {
                                            this.state.obj.video_fade[0].time_point = this.state.obj.start_time;
                                            this.state.obj.video_fade.push({
                                                "time_point": this.state.obj.end_time,  // 相对该视频时间点
                                                "visibility": this.state.obj.video_fade[0].visibility,  // 透明度
                                                "fade_type": 0,  // 0-视频/图片/文本/背景，1-音频
                                            });
                                            lockFade = true;
                                        } else {
                                            this.state.obj.video_fade.length = 1;
                                            lockFade = false;
                                        }
                                        this.refreshParam();
                                    }}
                                    fade_reset={() => {
                                        let obj = this.state.obj;
                                        obj.video_fade[0].visibility = 100;
                                        lockFade = false;
                                        obj.video_fade[obj.video_fade.length - 1].visibility = 100;
                                        this.refreshParam();
                                    }}
                                /> : ''}
                            {this.state.index === 1 && this.state.obj.speed ?
                                <AttrSpeed
                                    execute={this._execute.bind(this)}
                                    speed={this.state.obj.speed}
                                    speed_reset={() => {
                                        this.setSpeed(1);
                                    }}
                                /> : ''}
                            {this.state.index === 2 && this.state.obj.color ?
                                <AttrColor
                                    execute={this._execute.bind(this)}
                                    color={this.state.obj.color}
                                /> : ''}
                            {this.state.index === 3 && this.state.obj.volume && this.state.obj.audio_fade ?
                                <AttrAudio
                                    execute={this._execute.bind(this)}
                                    volume={this.state.obj.volume}
                                    audio_fade={this.state.obj.audio_fade}
                                    lockVoiceFade={lockVoiceFade}
                                    fade_animate={() => {
                                        let _obj = this.state.obj;
                                        let _fade = this.state.obj.audio_fade;
                                        if ((!_fade) || (_fade.length < 3) || _fade[0].visibility === _fade[1].visibility) {
                                            this.state.obj.audio_fade = [{
                                                "time_point": this.state.obj.special.start_range,  // 相对该视频时间点
                                                "visibility": 100,  // 透明度
                                                "fade_type": 0,  // 0-视频/图片/文本/背景，1-音频
                                            }, {
                                                "time_point": this.state.obj.special.end_range,  // 相对该视频时间点
                                                "visibility": 100,  // 透明度
                                                "fade_type": 0,  // 0-视频/图片/文本/背景，1-音频
                                            }];
                                        } else {
                                            let _duration = _obj.special.end_range - obj.special.start_range;
                                            let _start = _fade[1].time_point - _fade[0].time_point;
                                            _fade[2].time_point = (_duration - _start > _duration / 2 ? _duration - _start : _duration / 2) + _fade[0].time_point;
                                            let _o = {
                                                "time_point": this.state.obj.special.end_range,  // 相对该视频时间点
                                                "visibility": 0,  // 透明度
                                                "fade_type": 0,  // 0-视频/图片/文本/背景，1-音频
                                            }
                                            if (_fade.length === 3) {
                                                _fade.push(_o);
                                            } else {
                                                _fade[3] = _o;
                                            }
                                        }
                                        if (lockVoiceFade) {
                                            lockVoiceFade = false;
                                        } else {
                                            lockVoiceFade = true;
                                        }
                                        this.refreshParam();
                                    }}
                                    fade_reset={() => {
                                        this.state.obj.audio_fade = [{
                                            "time_point": this.state.obj.special.start_range,  // 相对该视频时间点
                                            "visibility": 100,  // 透明度
                                            "fade_type": 0,  // 0-视频/图片/文本/背景，1-音频
                                        }, {
                                            "time_point": this.state.obj.special.end_range,  // 相对该视频时间点
                                            "visibility": 100,  // 透明度
                                            "fade_type": 0,  // 0-视频/图片/文本/背景，1-音频
                                        }];
                                        lockVoiceFade = false;
                                        this.refreshParam();
                                    }}
                                /> : ''}
                            {this.state.index === 4 && this.state.obj.specialeffect ?
                                <AttrEffects
                                    execute={this._execute.bind(this)}
                                    specialeffect={this.state.obj.specialeffect}
                                    lockVoiceFade={lockVoiceFade}
                                    openDelogo={this.openDelogo.bind(this)}
                                    setDeLogo={this.setDeLogo.bind(this)}
                                /> : ''}
                            {this.state.index === 5 && this.state.obj.colorkeying ?
                                <AttrChromatic
                                    execute={this._execute.bind(this)}
                                    set_color={(val) => {
                                        this.state.obj.colorkeying.select_color = val;
                                        this.refreshParam();
                                    }}
                                    colorkeying={this.state.obj.colorkeying}
                                    select_color={this.state.obj.colorkeying.select_color}
                                /> : ''}
                            {this.state.index === 6 ? <ul className='filter show'>
                                {effects}
                            </ul> : ''}
                            {this.state.index === 7 && this.state.obj.special ?
                                <AttrText
                                    execute={this._execute.bind(this)}
                                    handleChange={this.handleChange.bind(this)}
                                    special={this.state.obj.special}
                                /> : ''}
                            {this.state.index === 8 && this.state.media ?
                                <AttrAnimation
                                    media={this.state.media}
                                    execute={this._execute.bind(this)}
                                    set_layers={(val, path, k) => {
                                        let layers = this.state.obj.layers;
                                        if (layers.length - 1 < k) {
                                            layers.length = k + 1;
                                            this.state.obj.layers[k]['ty'] = 5;
                                            this.state.obj.layers[k]['s'] = {};
                                        }
                                        if (path === 'sc') {
                                            this.state.obj.layers[k]['ty'] = 1;
                                            this.state.obj.layers[k]['sc'] = val;
                                        } else {
                                            this.state.obj.layers[k]['s'][path] = val;
                                        }
                                        this.refreshParam('change');
                                    }}
                                    layers={this.state.obj.layers}
                                /> : ''}

                        </div>
                        <div className="close-unit-detail">
                            {this.state.index === 8 ? '' :
                                <Button className='unit-reset' type="primary" onClick={() => {
                                    let obj = this.state.obj;
                                    switch (this.state.index) {
                                        case 0:
                                            obj.transform.rotation = 0;
                                            obj.transform.flip = 0;
                                            obj.video_fade.length = 1;
                                            obj.video_fade[0].visibility = 100;
                                            obj.transform.start_position_x = 0;
                                            obj.transform.start_position_y = 0;
                                            obj.transform.end_position_x = 0;
                                            obj.transform.end_position_y = 0;
                                            obj.transform.start_scale = 1;
                                            obj.transform.end_scale = 1;
                                            obj.transform.blurred = false;
                                            lockFade = false;
                                            lockPosition = false;
                                            lockZoom = false;
                                            break;
                                        case 1:
                                            this.setSpeed(1);
                                            break;
                                        case 2:
                                            obj.color.brightness = 0;
                                            obj.color.contrast = 0;
                                            obj.color.saturation = 0;
                                            obj.color.hue = 0;
                                            break;
                                        case 3:
                                            obj.volume.value = 100;
                                            this.state.obj.audio_fade = [{
                                                "time_point": this.state.obj.special.start_range,  // 相对该视频时间点
                                                "visibility": 100,  // 音量
                                                "fade_type": 0,  // 0-视频/图片/文本/背景，1-音频
                                            }, {
                                                "time_point": this.state.obj.special.end_range,  // 相对该视频时间点
                                                "visibility": 100,  // 音量
                                                "fade_type": 0,  // 0-视频/图片/文本/背景，1-音频
                                            }];
                                            lockVoiceFade = false;
                                            break;
                                        case 4:
                                            obj.specialeffect.vague_x = 0;
                                            obj.specialeffect.vague_y = 0;
                                            obj.specialeffect.logo_x = 0;
                                            obj.specialeffect.logo_y = 0;
                                            obj.specialeffect.logo_width = 0;
                                            obj.specialeffect.logo_height = 0;
                                            this.setDeLogo([]);
                                            break;
                                        case 5:
                                            obj.colorkeying.select_color = '';
                                            obj.colorkeying.sensitivity = 1;
                                            obj.colorkeying.transparency = 0;
                                            break;
                                        case 6:
                                            this.state.obj.effects = 'original';
                                            break;
                                        case 7:
                                            obj.special.font_size = 100;
                                            obj.special.line_height = 120;
                                            obj.special.spacing = 0;
                                            obj.special.position_x = 0;
                                            obj.special.position_y = 0;
                                            obj.special.position_w = 1920;
                                            obj.special.position_h = 1080;
                                            obj.special.text = '';
                                            $('.ql-editor').html('<p></p>');
                                            break;
                                    }
                                    this.refreshParam();
                                }}>{say('main', 'allCancel')}</Button>}
                            <Button type="primary" onClick={() => {
                                this.props.close();
                            }}>
                                确定
                            </Button>
                        </div>

                    </div>
                </div>
                <Delogo media={this.state.media}
                    special={this.state.obj.special || {}}
                    list={obj.delogo || []}
                    setDeLogo={(list) => {
                        this.setDeLogo(list);
                    }}
                    media_info={this.state.media_info} close={() => {
                        this.closeDelogo();
                    }} setting={this.state.delgo} />
            </div>
        );
    }
}