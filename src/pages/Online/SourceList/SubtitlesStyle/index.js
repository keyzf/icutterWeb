/* 素材列表 字幕样式及其他修改 */
import React from 'react';
import $ from 'jquery';
import { InputNumber, Popover, Select, Slider, Radio, Button } from "antd";
import { SketchPicker } from "react-color";
import { load_fonts } from "@/channel/load_fonts";
import { colorRgba } from "@/utils/handy";
import { getConfig } from "../../trackDetail/online-configs";
import Tip from '@/components/NumTip';
import noneSubtitles from "@/images/noneSubtitles.png";
import model001 from "@/images/model001.png";
import model002 from "@/images/model002.png";
import model003 from "@/images/model003.png";
import model004 from "@/images/model004.png";
import model005 from "@/images/model005.png";
import model006 from "@/images/model006.png";
import model007 from "@/images/model007.png";
import model008 from "@/images/model008.png";
import model009 from "@/images/model009.png";
import model010 from "@/images/model010.png";
import model011 from "@/images/model011.png";
import model012 from "@/images/model012.png";
import './index.scss';

let styleTab = [
    { name: '字体', ico: 'icon-ziti', index: 0 },
    // {name:'显示', ico:'icon-xianshi', index:1},
    { name: '背景', ico: 'icon-beijing', index: 2 },
    { name: '预设样式', ico: 'icon-yangshi', index: 3 }
];
let styleList = [
    { name: '无', src: noneSubtitles, index: 0, attr: { "position_x": "middle", "position_y": 50, "background_color": "000000", "font_color": "ffffff", "font_size": 50, "alpha": 0, "status": true, "font_name": 'FZShuSong-Z01S' } },
    { name: '字幕', src: model001, index: 1, attr: { "position_x": "middle", "position_y": 50, "background_color": "000000", "font_color": "ffffff", "font_size": 70, "alpha": 0, "status": true } },
    { name: '小字幕', src: model002, index: 2, attr: { "position_x": "middle", "position_y": 50, "background_color": "000000", "font_color": "ffffff", "font_size": 30, "alpha": 0, "status": true } },
    { name: '透明背景字幕', src: model003, index: 3, attr: { "position_x": "middle", "position_y": 50, "background_color": "000000", "font_color": "ffffff", "font_size": 70, "alpha": 0.5, "status": true } },
    { name: '透明背景小字幕', src: model004, index: 4, attr: { "position_x": "middle", "position_y": 50, "background_color": "000000", "font_color": "ffffff", "font_size": 60, "alpha": 0.5 } },
    { name: '透明背景大字幕', src: model005, index: 5, attr: { "position_x": "middle", "position_y": 50, "background_color": "000000", "font_color": "ffffff", "font_size": 80, "alpha": 0.5 } },
    { name: '黑底字幕', src: model006, index: 6, attr: { "position_x": "middle", "position_y": 50, "background_color": "000000", "font_color": "ffffff", "font_size": 70, "alpha": 1 } },
    { name: '黑底小字幕', src: model007, index: 7, attr: { "position_x": "middle", "position_y": 50, "background_color": "000000", "font_color": "ffffff", "font_size": 60, "alpha": 1 } },
    { name: '黑底大字幕', src: model008, index: 8, attr: { "position_x": "middle", "position_y": 50, "background_color": "000000", "font_color": "ffffff", "font_size": 80, "alpha": 1 } },
    { name: '大字幕', src: model009, index: 9, attr: { "position_x": "middle", "position_y": 50, "background_color": "000000", "font_color": "ffffff", "font_size": 90, "alpha": 0 } },
    { name: '白底字幕', src: model010, index: 10, attr: { "position_x": "middle", "position_y": 50, "background_color": "ffffff", "font_color": "000000", "font_size": 70, "alpha": 1 } },
    { name: '白底小字幕', src: model011, index: 11, attr: { "position_x": "middle", "position_y": 50, "background_color": "ffffff", "font_color": "000000", "font_size": 60, "alpha": 1 } },
    { name: '白底大字幕', src: model012, index: 12, attr: { "position_x": "middle", "position_y": 50, "background_color": "ffffff", "font_color": "000000", "font_size": 80, "alpha": 1 } },
    /* {name:'渐变背景字幕', src:gradientSubtitles, index:7}*/
];
const Option = Select.Option;
const RadioGroup = Radio.Group;
let text_info = {}
export default class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            styleTab: 0, // 样式的分类（字体typeface， 显示display，背景background，预设样式style）
            font_list: [], // 字体的数组
            value: 2, // 选择语言的默认值(单语言，双语言)
            styleListValue: 0 // 预设样式下，默认选中的样式
        };
    }

    componentWillMount() {
        this.setState({ font_list: load_fonts() });
        let _config = getConfig();
        styleList[0].attr = _config['text_info'];
    }


    componentWillUnmount() {

    }


    componentDidMount() {
        $('.sec-box').mouseup(this.mouseUp);
    }
    // 单选框改变回调
    onChange = (e) => {
        this.setState({
            value: e.target.value,
        });
        let _config = getConfig();
        this.props.playVideo();
    };
    mouseUp = (e) => {
        let canvas = $('#sec4-canvas');
        let h = parseInt(canvas.css('height'))
        let oldTop = $("#subtitles-show").offset() && $("#subtitles-show").offset().top * 1
        let newTop = e.clientY * 1;
        let oldPosition_y = text_info.position_y * 1;
        let newPosition_y = (oldPosition_y - (newTop - oldTop) / h * 1080).toFixed(2);
        newPosition_y = newPosition_y > 1080 ? 1080 : newPosition_y
        newPosition_y = newPosition_y < 0 ? 0 : newPosition_y
        let _config = getConfig();
        _config['text_info']['position_y'] = newPosition_y;
        this.props.playVideo();
    }

    render() {
        text_info = getConfig()['text_info'] || {
            "font_size": 50,
            "status": true,
            "font_color": 'ffffff',
            "font_name": 'FZShuSong-Z01S',
            "background_color": '000000',
            "alpha": 0,
            "position_x": 'middle',  // 水平位置，left, middle, right
            "position_y": 50,  // 底部间距，px
        };
        if (JSON.stringify(this.props.text_info) !== '{}') {
            // styleList[0].attr = this.props.text_info;
        }
        let fontsDom = [];
        this.state.font_list.map((v, k) => {
            fontsDom.push(<Option key={k} value={v.code}>{v.name}</Option>)
        });
        return (
            <div className={'subtitlesStyle-container ' + (this.props.show ? '' : 'hidden')}>
                <div className="subtitlesStyle-left">
                    <ul style={{ marginLeft: 0 }}>
                        {styleTab.map((style, k) => {
                            return (
                                <li key={k} className={this.state.styleTab === style.index ? 'current' : ''} onClick={() => {
                                    this.setState({ styleTab: style.index })
                                }}><span className={'ico iconfont ' + style.ico}> </span><p>{style.name}</p></li>
                            )
                        })}

                    </ul>
                </div>
                <div className="subtitlesStyle-right">
                    {this.state.styleTab === 0
                        ? <div className='subtitlesStyle-typeFace'>
                            <div>
                                <div className="name">
                                    字符
                                </div>
                                <div>
                                    <Select defaultValue={text_info.font_name} style={{ width: 146 }} size={'small'} onChange={(val) => {
                                        let _config = getConfig();
                                        text_info.font_name = val;
                                        _config['text_info'] = text_info;
                                        this.props.playVideo();
                                    }}>
                                        {fontsDom}
                                    </Select>
                                </div>
                            </div>
                            <div>
                                <div className="name">
                                    对齐
                                </div>
                                <div>
                                    <Tip
                                        data={['left', 'middle', 'right']}
                                        width={160}
                                        current={text_info.position_x || 'left'}
                                        setCurrent={(v) => {
                                            let _config = getConfig();
                                            text_info.position_x = v;
                                            _config['text_info'] = text_info;
                                            this.props.playVideo();
                                        }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="name">
                                    颜色
                                </div>
                                <div>
                                    <Popover
                                        trigger="click"
                                        content={
                                            <SketchPicker
                                                color={colorRgba('#' + text_info.font_color, 1)}
                                                disableAlpha={true}
                                                onChangeComplete={(v) => {
                                                    let rgb = v.rgb;
                                                    if (rgb) {
                                                        let _config = getConfig();
                                                        text_info.font_color = v.hex.substr(1);
                                                        _config['text_info'] = text_info;
                                                        this.props.playVideo();
                                                    }
                                                }}
                                            />} >
                                        <div className="color-picker"><div style={{ background: colorRgba('#' + text_info.font_color, 1) }}> </div> </div>
                                    </Popover>
                                </div>
                            </div>
                            <div>
                                <div className="name">
                                    大小
                                </div>
                                <div>
                                    <Slider min={0} max={200} style={{ width: 150 }} onChange={(value) => {
                                        let _config = getConfig();
                                        _config['text_info']['font_size'] = value;
                                        this.props.playVideo();
                                    }} value={text_info.font_size} />
                                    <InputNumber min={0} max={200} size={'small'}
                                        style={{ marginLeft: 10, width: 60 }}
                                        value={text_info.font_size} onChange={(value) => {
                                            let val = value * 1;
                                            if (!isNaN(val)) {
                                                let _config = getConfig();
                                                _config['text_info']['font_size'] = val > 200 ? 200 : val < 0 ? 0 : val;
                                            }
                                            this.props.playVideo();
                                        }}
                                    />
                                </div>
                            </div>
                        </div> : ''}
                    {this.state.styleTab === 1
                        ? <div className='subtitlesStyle-show'>
                            <div>
                                <div>
                                    <RadioGroup onChange={this.onChange} value={this.state.value}>
                                        <Radio value={1}>单语言</Radio>
                                        <Radio value={2}>双语言</Radio>
                                    </RadioGroup>
                                </div>
                            </div>
                        </div>
                        : ''}
                    {this.state.styleTab === 2
                        ? <div className='subtitlesStyle-background'>
                            <div>
                                <div className="name">
                                    背景颜色
                                </div>
                                <div>
                                    <Popover
                                        trigger="click"
                                        content={
                                            <SketchPicker
                                                color={colorRgba('#' + text_info.background_color, text_info.alpha)}
                                                onChangeComplete={(v) => {
                                                    let rgb = v.rgb;
                                                    if (rgb) {
                                                        let _config = getConfig();
                                                        text_info.alpha = rgb.a || 0;
                                                        text_info.background_color = v.hex.substr(1);
                                                        _config['text_info'] = text_info;
                                                        this.props.playVideo();
                                                    }
                                                }}
                                            />} >
                                        <div className="color-picker"><div style={{ background: colorRgba('#' + text_info.background_color, text_info.alpha) }}> </div> </div>
                                    </Popover>
                                </div>
                            </div>
                            <div>
                                <div className="name">
                                    底部距离
                                </div>
                                <div>
                                    <Slider min={0} max={1080} style={{ width: 150 }} onChange={(value) => {
                                        let _config = getConfig();
                                        _config['text_info']['position_y'] = value;
                                        this.props.playVideo();
                                    }} value={text_info.position_y} />
                                </div>
                            </div>
                        </div>
                        : ''}
                    {this.state.styleTab === 3
                        ? <div className='subtitlesStyle-style'>
                            <ul>
                                {styleList.map((item, k) => {
                                    return (
                                        <li key={k}
                                            onClick={() => {
                                                this.setState({ 'styleListValue': item.index });
                                                if (item.attr) {
                                                    let _config = getConfig();
                                                    _config['text_info'] = $.extend(_config['text_info'], item.attr);
                                                    this.props.playVideo();
                                                }
                                            }}>
                                            <div className="pic"><img src={item.src} alt="" />
                                                {this.state.styleListValue === item.index
                                                    ? <span className='current-tip'>
                                                        <span className='ico iconfont icon-duigou'> </span>
                                                    </span>
                                                    : ''}
                                            </div>
                                            <p className="name">{item.name}</p>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                        : ''}
                    <span className='subtitlesStyle-button'>
                        <Button type="primary"
                            onClick={() => {
                                this.props.close();
                            }}
                        >返回</Button>
                    </span>
                </div>
            </div>
        );
    }
}
