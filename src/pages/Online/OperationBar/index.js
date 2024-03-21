/* 工具栏  轨道上方工具栏 */
import React from 'react';
import $ from 'jquery';
import { Tooltip } from 'antd';
import say from '@/database/local_language';


export default class Top extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
        };
    }

    componentDidMount() {

    }
    render() {
        let configStatus = this.props.getConfigStatus();
        let y = $('.pathway').find('.focused');
        let x = $('.pathway').find('.ui-selected.mater-helper');
        let selected = x.length;
        let focused = y.length;
        let type = '';
        if (focused) {
            type = y.eq(0).attr('data-mediaType');
        }
        return (
            <div className="operation-bar">
                <div>
                    <div className="group">
                        <Tooltip title={say('main', 'lastStep') + '（Ctrl+Z）'} onClick={() => {
                            this.props.pre();
                        }}><span
                            className={"ico iconfont icon-shangyibu ico-pre " + (configStatus.pre ? "use" : 'useless')}> </span></Tooltip>
                        <Tooltip title={say('main', 'nextStep') + '（Ctrl+Shift+Z）'} onClick={() => {
                            this.props.next();
                        }}><span className={"ico iconfont icon-xiayibu ico-next " + (configStatus.next ? "use" : 'useless')}> </span></Tooltip>
                    </div>
                    |
                    {/*<Tooltip title={'波纹剪'} onClick={() => {*/}
                    {/*this.props.shear();*/}
                    {/*}}><span
                            className={"ico iconfont icon-jiandao  clip"}> </span></Tooltip>*/}
                    <div className="group">
                        <Tooltip title={'剪切（S）'} onClick={() => {
                            this.props.clip();
                        }}><span
                            className={"ico iconfont icon-jiandao  clip"}> </span></Tooltip>
                        <Tooltip title={'复制'} onClick={() => {
                            this.props.clone();
                        }}><span
                            className={"ico iconfont icon-copy   " + (focused ? "use" : 'useless')}> </span></Tooltip>
                        <Tooltip title={'删除（delete/backspace）'} onClick={() => {
                            this.props.deleteUnit();
                        }}><span className={"ico iconfont icon-shanchu  " + (focused || selected ? "use" : 'useless')}> </span></Tooltip>
                        <Tooltip title={'裁剪'} onClick={() => {
                            this.props.crop();
                        }}><span
                            className={"ico iconfont icon-caijian1   " + (focused && (type === 'video' || type === 'image') ? "use" : 'useless')}> </span></Tooltip>
                    </div>
                    |
                    <div className="group">
                        <Tooltip title={'高级操作'} onClick={() => {
                            this.props.enterUnitDetail();
                        }}><span
                            className={"ico iconfont icon-gaojicaozuo  " + (focused ? "use" : 'useless')}> </span></Tooltip>
                        <Tooltip title={'语音转文字'} onClick={() => {
                            this.props.trans_audio_to_text();
                        }}><span
                            className={"ico iconfont icon-yuyinzhuanwenzi   " + (focused && ['audio', 'video'].includes(type) ? "use" : 'useless')}> </span></Tooltip>
                        <Tooltip title={'文字转语音'} onClick={() => {
                            if (focused && ["subtitle", "text"].includes(type))
                                this.props.setTransToAudio(true);

                        }}><span
                            className={"ico iconfont icon-wenzizhuanyuyin  " + (focused && ["subtitle", "text"].includes(type) ? "use" : 'useless')}> </span></Tooltip>
                        <Tooltip title={'字幕轨道不支持撤回功能， 请谨慎操作。'}>
                            <span className="ico iconfont icon-bangzhu"/> 
                        </Tooltip>
                    </div>
                </div>
                {this.props.themeConfig && this.props.themeConfig.theme_id ? <div className="theme-name">
                    已使用主题：<span className="name">{this.props.themeConfig.name || ''}</span>
                    <Tooltip title={'不使用主题'}>
                        <span className="close c-gray c-p" onClick={() => {
                            this.props.set_theme('');
                        }}> 取消</span>
                    </Tooltip>
                </div> : ''}
                <div>
                    <Tooltip title={'自动缩放(Ctrl + A)'} onClick={() => {
                        this.props.initRuler();
                    }}><span
                        className={"ico iconfont icon-gundong    "}> </span></Tooltip>
                    <div className="zoom-cnt">
                        <Tooltip title={say('main', 'zoomOut') + '(-)'}>
                            <span className="zoom-out ico iconfont icon-suoxiao"> </span>
                        </Tooltip>
                        <div title={say('main', 'dragTheSlider')} className="zoom-bar"> </div>
                        <Tooltip title={say('main', 'zoomIn') + '(+)'} placement="topRight">
                            <span className="zoom-in ico iconfont icon-fangda"> </span>
                        </Tooltip>
                    </div>
                   {/*  <div className="duration">
                        <span>
                            {this.props.duration}
                        </span>
                    </div> */}
                </div>
            </div>
        );
    }
}
