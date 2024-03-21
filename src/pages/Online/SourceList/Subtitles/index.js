/* 素材列表 添加字幕 */
import React from 'react';
import $ from "jquery";
import { Button, Tooltip, Select, Upload, Modal, message, Slider, notification } from 'antd';
import channel from "@/channel";
import { load_fonts } from "@/channel/load_fonts";
import { unit_unLoad, clearTranslate, refreshData } from "../../trackDetail/translateInfo";
import {
    get_text_list,
    language_list,
    set_current,
    set_list_text,
    sub_change,
    sub_del,
    init_subtitles
} from "../../trackDetail/subtitles-config";
import uploading from "@/channel/clipFileUpload";
import { getConfig } from '../../trackDetail/online-configs';
import {  getTime } from "@/utils/handy";
import './index.scss';

const Option = Select.Option;
const _error = Modal.error; const marks = {
    '-1': '慢',
    0: '正常',
    1: '快',

};
const props = {
    name: 'file',
    accept: '.srt,.ass',
    action: '//jsonplaceholder.typicode.com/posts/',
    headers: {
        authorization: 'authorization-text',
    },
    onChange(info) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};
let audioDom = document.createElement('audio');
audioDom.autoplay = true;
audioDom.onload = () => {
    audioDom.play();
}
let dbLock = true;
export default class Top extends React.Component {
    state = {
        modalVisible: false,
        transAudioVisible: false,
        sub_language: 'zh',
        loading: false,
        speed: 0,
        person: 0,
        language: 'zh',
        font_list: [],
        translate: ['zh', 'en'],
    };
    componentWillUnmount() {
        clearTranslate()
    }
    componentWillMount() {
        this.setState({ font_list: load_fonts() });
        init_subtitles(this.props.project_id);
        refreshData(this.props.refreshData);
    }
    // 文字转语音
    toVoice() {
        let list = this.props.subtitles_config.list || [];
        let y = $('.pathway').find('.focused');
        let currentTextId = y.eq(0).attr('data-mediaId') || '';
        let start = -1;
        let text = '';
        if (currentTextId.indexOf('text') !== -1) {
            let temp = getConfig();
            let video_list = []
            temp['video_list'] && temp['video_list'].map((v) => video_list = video_list.concat(v.obj_list || []))
            let currentText = video_list && video_list.filter((v) => v['obj_id'] === currentTextId)
            currentText = currentText && currentText[0];
            if (currentText) {
                text = this.getText(currentText.special.text);
                start = currentText.start_time;
            }
        }
        let ids = [];
        let lan = 'zh';
        if(currentTextId){
          list = list.filter((item)=> item.text_id === currentTextId)
        }
        list.map((v, k) => {
            if (v.text ) {
                if (start === -1) {
                    start = v.start_time;
                }
                ids.push(v.text_id);
                lan = v.language || lan;
            }
        });
        if (!ids.length && !text) {
            message.info('当前没有文字内容！');
            return;
        }
        for (let i in unit_unLoad) {
            if (unit_unLoad[i].type === 'audio') {
                // message.info('已经有文字转语音任务在执行，请稍后');
                notification.warning({
                    duration: 5,
                    message: '请稍后',
                    description: '已经有文字转语音任务在执行',
                });
                return;
            }
        }
        message.info('已下发文字转语音任务，请稍后');
        // this.setState({transAudioVisible: false});
        this.props.setTransToAudio(false);
        if (currentTextId.indexOf('text') !== -1) {
            channel('trans_str_to_audio',
                JSON.stringify({
                    projectId: this.props.project_id,
                    str: text,
                    speed: this.state.speed,
                    person: this.state.person,
                }), (re) => {
                    unit_unLoad[re.taskId] = { taskId: re.taskId, type: 'audio', start: start }
                }, '', 'all')
        } else {
            channel('trans_text_to_audio',
                JSON.stringify({
                    projectId: this.props.project_id,
                    textId: ids.join('|'),
                    language: lan,
                    speed: this.state.speed,
                    person: this.state.person,
                    volume: 5,
                    pitch: 4,
                }), (re) => {
                    unit_unLoad[re.taskId] = { taskId: re.taskId, type: 'audio', start: start }
                }, '', 'all')
        }
    }
    htmlDecodeByRegExp(str) {
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
    // 获取文字内容
    getText(textDom) {
        let div = document.createElement('div');
        let text = '';
        div.innerHTML = this.htmlDecodeByRegExp(textDom);
        function _cloneConfig(config) {
            for (let i = 0; i < config.length; i++) {
                let the = config[i];
                if (the.nodeType === 3) {
                    text += the.textContent;
                } else if (the.nodeType === 1) {
                    _cloneConfig(the.childNodes);
                }
            }
        }
        _cloneConfig(div.childNodes);
        return text;

    }
    render() {
        let _st_text = [];
        let array = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        array.length = 18;
        let _sub_list = this.props.subtitles_config.list;
        let _sub_current = this.props.subtitles_config.current;
        let sub_language_dom = [];
        let selectedSub_language_dom = [];
        language_list.map((v, k) => {
            if (v.selected) {
                selectedSub_language_dom.push(<Option key={k} value={v.language}>{v.desc}</Option>)
            }
            sub_language_dom.push(<Option key={k} value={v.language}>{v.desc}</Option>)
        });
        let second_language_dom = [];
        let languages_obj = {};
        language_list.map((v, k) => {
            if (this.state.translate[0] !== v.language) {
                second_language_dom.push(<Option key={k} value={v.language}>{v.desc}</Option>)
            }
            languages_obj[v.language] = v.selected;
        });


        if (_sub_list.length) {
            _sub_list.map((v, k) => {
                _st_text.push(<div key={k} className={k === _sub_current ? 'current' : ''} onMouseDown={() => {
                    set_current(k);
                }}>
                    <div className="left">
                        {getTime(v.start_time * 1 || 0) + '~' + getTime(v.end_time || 5)}
                    </div>
                    <div className="right">
                        {v.chinese_id ?
                            <textarea className="chinese" name={v.chinese_id}
                                value={v.chinese}
                                onFocus={() => {
                                    set_current(k);
                                }}
                                onChange={(e) => {
                                    set_list_text(e.target.value, v.chinese_id);
                                }} onBlur={(e) => {
                                    sub_change(v, '', 'chinese')
                                }}
                                type="text" /> : ''
                        }
                        <textarea className={v.chinese_id ? 'chinese otherLanguages' : ''} name={v.text_id}
                            value={v.text}
                            onFocus={() => {
                                set_current(k);
                            }}
                            onChange={(e) => {
                                set_list_text(e.target.value, v.text_id);
                            }} onBlur={(e) => {
                                sub_change(v)
                            }}
                            type="text" />
                        <span onClick={() => {
                            sub_del([v.text_id]);
                        }} type="close-circle" className="ico ">X </span>
                    </div> </div>);
            });
        }
        let fontsDom = [];
        this.state.font_list.map((v, k) => {
            fontsDom.push(<Option key={k} value={v.code}>{v.name}</Option>)
        });
        let _upload2 = <Tooltip className='hover-box' type="upload"
            onClick={() => {
                $('#file').click();
            }}>
            <span className="dis-hover ico iconfont icon-shangchuan c-p" > </span>
            <span className="on-hover">上传字幕</span>
        </Tooltip>;
        let _upload = <Upload {...props}>
            <Tooltip className='hover-box'
                onClick={() => {
                    //$('#file').click();
                }}>
                <span className="dis-hover ico iconfont icon-shangchuan c-p" > </span>
                <span className="on-hover">上传字幕</span>
            </Tooltip>
        </Upload>;
        // let _transFile=<Tooltip className='hover-box'
        //                      onClick={() => {
        //                          if(!this.props.subtitles_config.list.length){
        //                              _error({
        //                                  title: '当前还没有字幕',
        //                                  style:{top:200}
        //                              });
        //                              return;
        //                          }
        //                          this.props.setTransToAudio(true);
        //                          // this.setState({transAudioVisible:true});
        //                          // this.toVoice();
        //                      }}>
        //     <span className="dis-hover ico iconfont icon-wenzizhuanyuyin c-p"> </span>
        //     <span className="on-hover">文字转语音</span>
        // </Tooltip>;
        let _textToSpeech = <Tooltip className='hover-box'
            onClick={() => {
                if (!this.props.subtitles_config.list.length) {
                    _error({
                        title: '当前还没有字幕',
                        style: { top: 200 }
                    });
                    return;
                }
                this.props.setTransToAudio(true);
                // this.setState({transAudioVisible:true});
                // this.toVoice();
            }}>
            <span className="dis-hover ico iconfont icon-wenzizhuanyuyin c-p"> </span>
            <span className="on-hover">文字转语音</span>
        </Tooltip>;
        let _translate = <Tooltip className='hover-box'
            onClick={() => {
                if (!this.props.subtitles_config.list.length) {
                    _error({
                        title: '当前还没有字幕',
                        style: { top: 200 }
                    });
                    return;
                }
                this.setState({ modalVisible: true });
            }}>
            <span className="dis-hover ico iconfont icon-fanyi c-p"> </span>
            <span className="on-hover">翻译与对照</span>
        </Tooltip>;
        let _addSubtitle = <Tooltip className='hover-box'
            onClick={() => {
                if (dbLock) {
                    dbLock = false;
                    this.props.subtitles_change();
                    setTimeout(() => {
                        dbLock = true;
                    }, 400)
                }
            }}>
            <span className="dis-hover ico iconfont icon-tianjiazimu c-p"> </span>
            <span className="on-hover">添加字幕</span>
        </Tooltip>;
        return (
            <div className="material-main subtitles-column" style={this.props.visible ? { visibility: 'visible' } : { visibility: 'hidden', width: 0, maxWidth: 0, overflow: 'hidden' }}>
                <div className="material-main-right">
                    <div className="material-main-select select">
                        <div className="c-p">
                            <div style={{ position: 'absolute', 'zIndex': '-1', marginLeft: '-888px', paddingLeft: '30px', width: '300px', opacity: 0 }} ><input onChange={() => {
                                uploading.upload(0 || 0, this.props.project_id, this.props.group_id)
                            }} type="file" id="file" multiple /></div>
                            {/*_upload*/}
                            {/*{_transFile}*/}
                            {_textToSpeech}
                            {/*{_translate}*/}
                            {_addSubtitle}
                        </div>
                        <div>
                            {/*{selectedSub_language_dom.length*/}
                            {/*?<Select className='subtitleSelect m-10' value={this.state.sub_language} style={{ width: 78 }} size={'small'} onChange={(val)=>{*/}
                            {/*get_text_list(val);*/}
                            {/*this.setState({sub_language:val})}}>*/}
                            {/*{selectedSub_language_dom}*/}
                            {/*</Select>*/}
                            {/*:''}*/}
                            {/*<Select className='subtitleSelect m-10' value={this.state.sub_language} style={{ width: 78 }} size={'small'} onChange={(val)=>{
                                get_text_list(val);
                                this.setState({sub_language:val})}}>
                                {sub_language_dom}
                            </Select>*/}
                            <span className='subtitlesStyle c-p'
                                onClick={() => {
                                    if (!this.props.subtitles_config.list.length) {
                                        _error({
                                            title: '当前还没有字幕',
                                            style: { top: 200 }
                                        });
                                        return;
                                    }
                                    this.props.setShowStyle();

                                }}>
                                <span className='ico iconfont icon-yangshi'> </span>
                                <span>样式</span>
                            </span>
                        </div>
                    </div>
                    <div className="material-main-box">
                        <div className="subtitles-content-box">
                            <div className="material-main-list subtitles-content subtitles">
                                {_st_text}
                                {!_sub_list.length
                                    ?
                                    <span className="hasnone subtitles-kong c-p"
                                        onClick={() => {
                                            if (dbLock) {
                                                dbLock = false;
                                                this.props.subtitles_change();
                                                setTimeout(() => {
                                                    dbLock = true;
                                                }, 400)
                                            }
                                        }}>
                                        <svg className="logo icon" aria-hidden="true">
                                            <use xlinkHref="#icon-zimukong_"> </use>
                                        </svg>
                                        <p>
                                            <span>您还没有字幕请点击添加字幕</span>
                                        </p>
                                    </span>
                                    : ""}
                            </div>
                            {this.props.subtitles_config.list.length ?
                                <div className="subtitles-add subtitles-add-only" onClick={() => {
                                    if (dbLock) {
                                        dbLock = false;
                                        this.props.subtitles_change();
                                        setTimeout(() => {
                                            dbLock = true;
                                        }, 400)
                                    }
                                }}>
                                    <div className="right">
                                        单击这里粘贴或输入字幕
                                    </div>
                                </div> : ''}
                        </div>
                    </div>
                </div>
                <Modal title=''
                    className='subtitles-modal btn-black'
                    visible={this.state.modalVisible}
                    style={{ height: 336, width: 711 }}
                    footer={[
                        <Button key="submit" type="primary" loading={this.state.loading} onClick={() => {
                            channel('translate', { src_language: this.state.translate[0], dst_language: this.state.translate[1], project_id: this.props.project_id }, (re) => {
                                get_text_list(this.state.translate[1], this.state.translate[0]);
                                this.setState({ sub_language: this.state.translate[1] });
                                this.setState({ modalVisible: false });
                                language_list.map((language) => {
                                    if (language.language === this.state.translate[0] || language.language === this.state.translate[1]) {
                                        language['selected'] = true;
                                    }
                                })
                            }, '', 'all');
                        }}>翻译</Button>,
                        <Button style={{ opacity: languages_obj[this.state.translate[0]] && languages_obj[this.state.translate[1]] ? 1 : 0.6 }} key="back" type="primary" onClick={() => {
                            if (languages_obj[this.state.translate[0]] && languages_obj[this.state.translate[1]]) {
                                get_text_list(this.state.translate[1], this.state.translate[0]);
                                this.setState({ sub_language: this.state.translate[1] });
                                this.setState({ modalVisible: false })
                            }
                        }}>对照</Button>
                    ]}
                    onCancel={() => {
                        this.setState({ modalVisible: false })
                    }}
                >
                    <div className="flex-around m-10-0">
                        <div>源语言：
                            <Select defaultValue={language_list[0].language}
                                style={{ width: 184 }}
                                onChange={(val) => {
                                    this.state.translate[0] = val;
                                    this.setState({ translate: this.state.translate });
                                }}>
                                {sub_language_dom}
                            </Select></div>
                        <div>目标语言：
                            <Select
                                defaultValue={language_list[1].language}
                                style={{ width: 220 }}
                                /* mode="multiple"*/
                                onChange={(val) => {
                                    this.state.translate[1] = val;
                                    this.setState({ translate: this.state.translate });
                                }}>
                                {second_language_dom}
                            </Select>
                        </div>
                    </div>
                </Modal>
                <Modal title=''
                    className='trans-audio-modal btn-black'
                    visible={this.props.transToAudio ? true : false}
                    style={{ height: 432, width: 711 }}
                    footer={[
                        <Button key="submit" type="primary" loading={this.state.loading} onClick={() => {
                            this.toVoice();
                        }}>保存</Button>,
                        <Button style={{ opacity: languages_obj[this.state.translate[0]] && languages_obj[this.state.translate[1]] ? 1 : 0.6 }} key="back" onClick={() => {
                            this.props.setTransToAudio(false);
                        }}>取消</Button>
                    ]}
                    onCancel={() => {
                        this.props.setTransToAudio(false);
                    }}
                >
                    <div className="flex-around m-10-0">
                        <div className="title">
                            <span>
                                文字转语音
                            </span>
                            <span className="border"> </span>
                        </div>
                        <div className="box">
                            <div className="name">
                                配音模板
                            </div>
                            <div className="list">
                                <div className={this.state.person === 0 ? 'current' : ' '} onMouseEnter={() => {
                                    // audioDom.src=(localStorage.setpath||'')+'/images/text2audio/putongnansheng.mp3';
                                    // audioDom.play();
                                }} onClick={() => {
                                    this.setState({ person: 0 })
                                }}>
                                    <svg aria-hidden="true">
                                        <use xlinkHref="#icon-putongnansheng-weixuanzhong"> </use>
                                    </svg>
                                    <svg className="use" aria-hidden="true">
                                        <use xlinkHref="#icon-putongnansheng-xuanzhong"> </use>
                                    </svg>
                                    <span>
                                        女声
                                    </span>
                                </div>
                                <div className={this.state.person === 1 ? 'current' : ' '} onMouseEnter={() => {
                                    // audioDom.src=(localStorage.setpath||'')+'/images/text2audio/putongnvsheng.mp3';
                                    // audioDom.play();
                                }} onClick={() => {
                                    this.setState({ person: 1 })
                                }}>
                                    <svg aria-hidden="true">
                                        <use xlinkHref="#icon-putongnvsheng-weixuanzhong"> </use>
                                    </svg>
                                    <svg className="use" aria-hidden="true">
                                        <use xlinkHref="#icon-putongnvsheng-xuanzhong"> </use>
                                    </svg>
                                    <span>
                                        男声
                                    </span>
                                </div>
                            </div>
                            <div className="tail">
                                <div className="name">
                                    朗读速度
                                </div>
                                <div className="bar">
                                    <Slider min={-1} max={1} marks={marks} step={1} value={this.state.speed} onChange={(v) => {
                                        this.setState({ speed: v });
                                    }} />
                                </div>
                            </div>
                        </div>

                    </div>
                </Modal>
            </div>
        );
    }
}
