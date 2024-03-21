/* 高级操作 文字*/
import React from 'react';
import $ from 'jquery';
import { Tooltip, Slider, InputNumber } from 'antd';
import ReactQuill from 'react-quill';
import { load_fonts } from "@/channel/load_fonts";
import say from '@/database/local_language';


function htmlDecodeByRegExp(str) {
    let s = "";
    if (str.length === 0) return "";
    s = str.replace(/&amp;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&#39;/g, "\'");
    s = s.replace(/&quot;/g, "\"");
    return s;
}
export default class Top extends React.Component {
    componentDidMount() {
        $('.ql-editor')[0].innerHTML = htmlDecodeByRegExp(this.props.special.text);
    }
    render() {
        let special = this.props.special;
        let execute = this.props.execute;
        let handleChange = this.props.handleChange;
        return (<ul className='show'>
            <li className="textEdit">
                <div className="quill-bg">

                </div>
                {/*<SketchPicker disableAlpha='true' />*/}
                <ReactQuill
                    modules={{
                        toolbar: [
                            // [{ 'font': ['SimSun', 'SimHei','Microsoft-YaHei','KaiTi','FangSong','Arial','Times-New-Roman','sans-serif','_zkklt2016','232','serif','test']}],
                            [{ 'font': load_fonts('text') }],
                            ['bold', 'italic', 'underline'],        // toggled buttons
                            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                            [{ 'align': [] }]
                        ]
                    }}
                    onChange={(e) => {
                        handleChange(e);
                    }} />
            </li>
            <li>
                <div className="name">{say('main', 'textArea')}</div>
                <div className="operation">
                    <div>
                        <span>W</span>
                        <InputNumber size={'small'} min={0} max={4000}
                            value={special.position_w}
                            onChange={(value) => {
                                execute(value, 'operationW-t');
                            }}
                        />
                        <span>H</span>
                        <InputNumber size={'small'} min={0} max={2200}
                            value={special.position_h}
                            onChange={(value) => {
                                execute(value, 'operationH-t');
                            }}
                        />
                    </div>
                </div>
                <div className="back">
                    <Tooltip title={say('main', 'reset')}>
                        {/*<span onClick={() => {
                            execute(1920, 'operationW-t');
                            execute(1080, 'operationH-t');
                        }} className="ico-opera ico iconfont icon-chongzhi">
                        </span>*/}
                    </Tooltip>
                </div>
            </li>
            <li>
                <div className="name">{say('main', 'fontSize')}</div>
                <div className="operation">
                    <div>
                        <Slider min={10} max={400} style={{ width: 150 }}
                            onChange={(value) => {
                                execute(value, 'zoomStart-t');
                            }}
                            value={special.font_size} />
                        <InputNumber size={'small'} min={10} max={400}
                            value={special.font_size}
                            onChange={(value) => {
                                execute(value, 'zoomStart-t');
                            }}
                        />
                    </div>
                </div>
                <div className="back">
                    <Tooltip title={say('main', 'reset')}>
                        {/*<span onClick={() => {
                            execute(100, 'zoomStart-t');
                        }} className="ico-opera ico iconfont icon-chongzhi">
                        </span>*/}
                    </Tooltip>
                </div>
            </li>
            <li>
                <div className="name">{say('main', 'lineSpace')}</div>
                <div className="operation">
                    <div>
                        <Slider min={90} max={300} style={{ width: 150 }}
                            onChange={(value) => {
                                execute(value, 'lineHeight-t');
                            }}
                            value={special.line_height} />
                        <InputNumber size={'small'} min={90} max={300}
                            value={special.line_height}
                            onChange={(value) => {
                                execute(value, 'lineHeight-t');
                            }}
                        />
                    </div>
                </div>
                <div className="back">
                    <Tooltip title={say('main', 'reset')}>
                        {/*<span onClick={() => {
                            execute(120, 'lineHeight-t');
                        }} className="ico-opera ico iconfont icon-chongzhi">
                        </span>*/}
                    </Tooltip>
                </div>
            </li>
            <li>
                <div className="name">{say('main', 'wordSpace')}</div>
                <div className="operation">
                    <div>
                        <Slider min={0} max={5} style={{ width: 150 }}
                            onChange={(value) => {
                                execute(value, 'spacing-t');
                            }}
                            value={special.spacing} />
                        <InputNumber size={'small'} min={0} max={5}
                            value={special.spacing}
                            onChange={(value) => {
                                execute(value, 'spacing-t');
                            }}
                        />
                    </div>
                </div>
                <div className="back">
                    <Tooltip title={say('main', 'reset')}>
                        {/*<span onClick={() => {
                            execute(0, 'spacing-t');
                        }} className="ico-opera ico iconfont icon-chongzhi">
                        </span>*/}
                    </Tooltip>
                </div>
            </li>
        </ul>

        );
    }
}