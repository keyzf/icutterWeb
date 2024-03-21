/* 高级操作 去logo */
import React from 'react';
import $ from 'jquery';
import 'jquery-ui';
import 'jquery-ui/ui/widgets/draggable';
import say from '@/database/local_language';
import { getDuration, cloneConfig } from "@/utils/handy";

let _start = false;
let _index = -1;
let intervalLock = false;
let mouseMove = () => {

};
let mouseUp = () => {

};

export default class Delogo extends React.Component {
    constructor(props) {
        super(props);
        this.state = { currentTime: 0, list: [], media: '', paused: true, power: 1 };
    }

    shouldComponentUpdate(nP, nS) {
        let os = this.props.setting.show, ns = nP.setting.show;
        if (ns && !os) {
            this.state.media = nP.media;
            //power 为监视器比例，默认为1（16：9）；1920/1080为9：16；
            // this.state.power=1920/1080;
            this.state.list = cloneConfig(nP.list);
            if (this.state.list.length) {
                this.state.list && this.state.list.map((v, k) => {
                    v.logo_x = Math.round(v.logo_x * nP.media_info.width);
                    v.logo_y = Math.round(v.logo_y * nP.media_info.height);
                    v.logo_width = Math.round(v.logo_width * nP.media_info.width);
                    v.logo_height = Math.round(v.logo_height * nP.media_info.height);
                })
            }
            (this.state.media.volume || this.state.media.volume === 0) && (this.state.media.volume = 1);
            (this.state.media.currentTime || this.state.media.currentTime === 0) && (this.state.media.currentTime = this.props.special.start_range || 0);
            let canvas = $('.video-box .video')[0];
            canvas.width = 1920;
            canvas.height = 1080;
            this.draw();
        }
        if (os && !ns) {
            clearInterval(intervalLock);
            if (this.state.media) {
                this.setState({ currentTime: this.state.media.currentTime });
                this.state.media.pause && this.state.media.pause();
            }
        }
        return true;
    }
    play() {
        let that = this;
        let info = this.props.media_info;
        if (info.type === 'video' && this.state.media.paused) {
            let canvas = $('.video-box .video')[0];
            let ctx = canvas.getContext('2d');
            let start = that.props.special.start_range;
            let end = that.props.special.end_range;
            if (this.state.media.currentTime === end) {
                this.state.media.currentTime = start;
            }
            intervalLock = setInterval(() => {
                let current = that.state.media.currentTime;
                if (current < start) {
                    that.state.media.currentTime = start;
                }
                if (current >= end) {
                    that.state.media.currentTime = end;
                    clearInterval(intervalLock);
                    this.state.media.pause();
                }
                ctx.drawImage(this.state.media, info.halfWidth, info.halfHeight, 1920 - info.halfWidth * 2, 1080 - info.halfHeight * 2);
                that.setState({ currentTime: this.state.media.currentTime });
            }, 1000 / 60);
            this.state.media.play();
        } else {
            clearInterval(intervalLock);
            that.setState({ currentTime: this.state.media.currentTime })
            this.state.media.pause();
        }
    }
    draw() {
        let info = this.props.media_info;
        let canvas = $('.video-box .video')[0];
        let ctx = canvas.getContext('2d');
        if (info.type === 'video') {
            if (this.state.media.readyState >= 3) {
                ctx.drawImage(this.state.media, info.halfWidth, info.halfHeight, 1920 - info.halfWidth * 2, 1080 - info.halfHeight * 2);

            } else {
                this.state.media.oncanplay = () => {
                    ctx.drawImage(this.state.media, info.halfWidth, info.halfHeight, 1920 - info.halfWidth * 2, 1080 - info.halfHeight * 2);
                }
            }
            this.setState({ currentTime: this.state.media.currentTime })
        } else {
            if (this.state.media.complete) {
                ctx.drawImage(this.state.media, info.halfWidth, info.halfHeight, 1920 - info.halfWidth * 2, 1080 - info.halfHeight * 2);
            } else {
                this.state.media.onload = () => {
                    ctx.drawImage(this.state.media, info.halfWidth, info.halfHeight, 1920 - info.halfWidth * 2, 1080 - info.halfHeight * 2);
                }
            }
            this.setState({ currentTime: this.state.media.currentTime || 0 })
        }
    }
    componentWillUnmount() {
        let state = {
        };
        for (let i in state) {
            this.state[i] = state[i]
        }
        $(window).unbind('mousemove', mouseMove);
        $(window).unbind('mouseup', mouseUp);
        $('.de-logo').appendTo('.unit-detail ');
    }
    del() {
        if (_index !== -1) {
            this.state.list.splice(_index, 1);
            if (_index !== 0 || this.state.list.length === 0) {
                _index--;
            }
            this.setState({ currentTime: this.state.media.currentTime || 0 })
        }
    }
    close() {
        _index = -1;
        _start = false;
        this.state.paused = true;
        this.state.media.pause ? this.state.media.pause() : '';
        this.props.close();

    }

    componentDidMount() {
        let that = this;
        $('.de-logo').appendTo('body');
        let canvas = $('.video-box .video')[0];
        canvas.width = 1920;
        canvas.height = 1080;
        let videoBox = $('.de-logo .video-box');
        videoBox.bind('mousedown', (e) => {
            console.info(this.props.media_info);
            let et = $(e.target);
            if (et.hasClass('video')) {
                _start = 'create';
                if (this.state.list.length < 5) {
                    _index = this.state.list.length;
                    this.state.list.push({
                        logo_x: (e.offsetX * 2 - this.props.media_info.halfWidth) * this.state.power,
                        logo_y: (e.offsetY * 2 - this.props.media_info.halfHeight) * this.state.power,
                        logo_width: 0,
                        logo_height: 0,
                    });
                }
            } else if (et.hasClass('cell')) {
                _start = 'move';
                _index = et.attr('name') * 1;
            } else if (et.hasClass('l-t')) {
                _start = 'l-t';
                _index = et.parent().attr('name') * 1;
            } else if (et.hasClass('l-b')) {
                _start = 'l-b';
                _index = et.parent().attr('name') * 1;
            } else if (et.hasClass('r-t')) {
                _start = 'r-t';
                _index = et.parent().attr('name') * 1;
            } else if (et.hasClass('r-b')) {
                _start = 'r-b';
                _index = et.parent().attr('name') * 1;
            }
            // let obj={
            //     logo_x:e.offsetX*(this.props.media>h?1920:1080)/w-halfWidth,
            //     logo_y:e.offsetY*(w>h?1080:1920)/h-halfHeight,
            // };

        });
        mouseMove = (e) => {
            if (_index !== -1 && this.props.setting.show) {
                let _obj = this.state.list[_index];
                let _x = e.originalEvent.movementX * 2 * this.state.power, _y = e.originalEvent.movementY * 2 * this.state.power;
                let obj = cloneConfig(_obj);
                let _w = this.props.media_info.halfWidth, _h = this.props.media_info.halfHeight;
                switch (_start) {
                    case 'create':
                        obj.logo_width = obj.logo_width + _x;
                        obj.logo_height = obj.logo_height + _y;
                        // if(obj.logo_width+_x<0){
                        //     _start='l-b';
                        // }
                        // if(obj.logo_height+_y<0){
                        //     _start=_start==='l-b'?'l-t':'r-t';
                        // }
                        break;
                    case 'move':
                        obj.logo_x = obj.logo_x + _x;
                        obj.logo_y = obj.logo_y + _y;
                        break;
                    case 'l-t':
                        obj.logo_x = obj.logo_x + _x;
                        obj.logo_width = obj.logo_width - _x;
                        obj.logo_y = obj.logo_y + _y;
                        obj.logo_height = obj.logo_height - _y;
                        // if(obj.logo_width-_x<0){
                        //     _start='r-t';
                        // }
                        // if(obj.logo_height-_y<0){
                        //     _start=_start==='r-t'?'r_b':'l_b';
                        // }
                        break;
                    case 'l-b':
                        obj.logo_x = obj.logo_x + _x;
                        obj.logo_width = obj.logo_width - _x;
                        obj.logo_height = obj.logo_height + _y;
                        // if(obj.logo_width-_x<0){
                        //     _start='r-b';
                        // }
                        // if(obj.logo_height+_y<0){
                        //     _start=_start==='r-b'?'r_t':'l_t';
                        // }
                        break;
                    case 'r-t':
                        obj.logo_width = obj.logo_width + _x;
                        obj.logo_y = obj.logo_y + _y;
                        obj.logo_height = obj.logo_height - _y;
                        // if(obj.logo_width+_x<0){
                        //     _start='l-t';
                        // }
                        // if(obj.logo_height-_y<0){
                        //     _start=_start==='l-t'?'l_b':'r_b';
                        // }
                        break;
                    case 'r-b':
                        obj.logo_width = obj.logo_width + _x;
                        obj.logo_height = obj.logo_height + _y;
                        // if(obj.logo_width+_x<0){
                        //     _start='l-b';
                        // }
                        // if(obj.logo_height+_y<0){
                        //     _start=_start==='l-b'?'l-t':'r-t';
                        // }
                        break;
                }
                // if(obj.logo_width<0){
                //     obj.logo_x=obj.logo_x+obj.logo_width;
                //     obj.logo_width=-obj.logo_width;
                // }
                // if(obj.logo_height<0){
                //     obj.logo_y=obj.logo_y+obj.logo_height;
                //     obj.logo_height=-obj.logo_height;
                // }
                if (obj && obj.logo_x >= 0 && (obj.logo_x + obj.logo_width) / this.state.power <= 1920 - _w * 2 && obj.logo_width >= 0) {
                    this.state.list[_index] = {
                        logo_x: obj.logo_x,
                        logo_y: _obj.logo_y,
                        logo_width: obj.logo_width,
                        logo_height: _obj.logo_height,
                    }
                }
                if (obj && obj.logo_y >= 0 && (obj.logo_y + obj.logo_height) / this.state.power <= 1080 - _h * 2 && obj.logo_height >= 0) {
                    this.state.list[_index] = {
                        logo_x: this.state.list[_index].logo_x,
                        logo_y: obj.logo_y,
                        logo_width: this.state.list[_index].logo_width,
                        logo_height: obj.logo_height,
                    }
                }
                this.setState({ currentTime: this.state.media.currentTime || 0 })
            }
        };
        mouseUp = (e) => {
            _start = false;
            if (_index !== -1 && this.props.setting.show) {
                let _obj = this.state.list[_index];
                if (_obj && (_obj.logo_height <= 0 || _obj.logo_width <= 0)) {
                    this.del();
                } else {
                    this.state.list[_index] = {
                        logo_x: Math.round(_obj.logo_x),
                        logo_y: Math.round(_obj.logo_y),
                        logo_width: Math.round(_obj.logo_width),
                        logo_height: Math.round(_obj.logo_height),
                    }
                }
            }
        };
        $(window).bind('mousemove', mouseMove);
        $(window).bind('mouseup', mouseUp);
        $('.de-logo .drop').draggable({
            axis: "x",
            snapTolerance: 30,
            drag: function (e, u) {
                that.state.media.currentTime = u.position.left / 278 * (that.props.special.end_range - that.props.special.start_range) + (that.props.special.start_range || 0);
                that.draw();
            },
            containment: "parent"
        });
    }
    render() {
        let ctrl = false;
        if (this.props.media_info.type === 'video') {
            ctrl = this.state.media;
        }
        let dom = [];
        let halfW = this.props.media_info ? this.props.media_info.halfWidth : 0, halfH = this.props.media_info ? this.props.media_info.halfHeight : 0;
        this.state.list.map((v, k) => {
            dom.push(<div key={k} className={k === _index ? 'cell current' : 'cell'} name={k} style={{ left: (v.logo_x / this.state.power + halfW) / 2 + 'px', top: (v.logo_y / this.state.power + halfH) / 2 + 'px', width: v.logo_width / 2 / this.state.power + 'px', height: v.logo_height / 2 / this.state.power + 'px' }}>
                <div className="l-t"> </div>
                <div className="l-b"> </div>
                <div className="r-t"> </div>
                <div className="r-b"> </div>
            </div>)

        });
        return (
            <div className={this.props.setting.show ? 'de-logo' : 'de-logo none'}>
                <div className="shadow" onClick={() => {
                    this.close();
                }}>

                </div>
                <div className="box">
                    <div className="title">
                        <span>{say('main', 'deLogo')}</span><span className="close" onClick={() => {
                            this.close();
                        }}> </span>
                    </div>
                    <div className="video-box">
                        <canvas className="video">

                        </canvas>
                        {dom}
                    </div>
                    {this.props.media_info.type === 'image' ? <div className="ctrl">
                    </div> : <div className="ctrl">
                            <div>{getDuration(ctrl.currentTime - this.props.special.start_range || 0) + '/' + getDuration(this.props.special.end_range - this.props.special.start_range || 1)}</div>
                            <div><span className={this.state.media.paused ? "ico iconfont icon-bofang" : "ico iconfont icon-zanting"} onClick={() => {
                                this.play();
                            }}> </span></div>
                            <div>
                                <div className="drop-box" >
                                    <span className="drop" style={{ left: (ctrl.currentTime - this.props.special.start_range || 0) / (this.props.special.end_range - this.props.special.start_range || 1) * 278 }}>

                                    </span>
                                </div>
                            </div>
                        </div>}
                    <div className="list">
                        <span>
                            请在视频中选择要模糊处理的区域。
                        </span>
                        <span onClick={() => {
                            this.props.setDeLogo(this.state.list);
                            this.close();
                        }} className="btn">
                            {say('main', 'confirm')}
                        </span>
                        <span onClick={() => {
                            this.close();
                        }} className="btn">
                            {say('main', 'cancel')}
                        </span>
                        <span onClick={() => {
                            this.del();
                        }} className={this.state.list.length ? 'btn' : 'btn gray'}>
                            {say('main', 'delete')}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}