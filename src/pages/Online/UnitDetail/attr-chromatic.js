/* 高级操作 抠图*/
import React from 'react';
import $ from 'jquery';
import { Tooltip, Slider, InputNumber } from 'antd';
import say from '@/database/local_language';


export default class Top extends React.Component {
    state={
        select_color:'000000'
    }
    componentWillMount(){
        this.state.select_color=this.props.colorkeying.select_color;
    }
    shouldComponentUpdate(nP, nS) {
        (nP.select_color!==this.props.select_color)&&(this.state.select_color=nP.select_color);
        return true;
    }
    render() {
        let colorkeying = this.props.colorkeying;
        let execute = this.props.execute;
        let set_color = this.props.set_color;
        return (<ul className='show'>
                <li>
                    <div className="name">{say('main', 'chooseColor')}</div>
                    <div className="operation choose-color">
                        <div>
                            #<input
                            value={this.state.select_color} id="chroma-c"
                            onChange={(e)=>{
                                let val = e.target.value;
                                this.setState({select_color:val});

                            }} onBlur={(e) => {
                            // if(e.keyCode===13){
                            let type = "^[0-9a-fA-F]{6}$";
                            let re = new RegExp(type);
                            let val = e.target.value;
                            if (val.match(re) !== null) {
                                set_color(val);
                            }
                            this.setState({select_color:colorkeying.select_color});
                            // }
                        }} onKeyDown={(e) => {
                            if (e.keyCode === 13) {
                                let type = "^[0-9a-fA-F]{6}$";
                                let re = new RegExp(type);
                                let val = e.target.value;
                                if (val.match(re) !== null) {
                                    set_color(val);
                                }
                                this.setState({select_color:colorkeying.select_color});
                            }
                        }} className="color-val" type="text"/>
                            <span style={{
                                backgroundColor: '#' + (colorkeying.select_color)
                            }} className="ico-opera show-color"> </span>
                            <Tooltip title='去屏幕吸取颜色'>
                                <span onClick={() => {
                                    $('#sec4-canvas').addClass('choose');
                                }} className="ico-opera ico iconfont icon-xiquyanse"> </span>
                            </Tooltip>
                        </div>
                    </div>
                    <div className="back">
                        <Tooltip title={say('main', 'reset')}>
                       {/* <span onClick={()=>{
                            set_color('');
                        }} className="ico-opera ico iconfont icon-chongzhi">
                        </span>*/}
                        </Tooltip>
                    </div>
                </li>
                <li>
                    <div className="name">{say('main', 'similarColor')}</div>
                    <div className="operation">
                        <div>
                            <Slider min={1} max={100} style={{width: 150}}
                                    onChange={(value) => {
                                        execute(value, 'chroma-s');
                                    }}
                                    value={colorkeying.sensitivity}/>
                            <InputNumber size={'small'} min={1} max={100}
                                         value={colorkeying.sensitivity}
                                         onChange={(value) => {
                                             execute(value, 'chroma-s');
                                         }}
                            />
                        </div>
                    </div>
                    <div className="back">
                        <Tooltip title={say('main', 'reset')}>
                        {/*<span onClick={()=>{
                            execute(1, 'chroma-s');
                        }} className="ico-opera ico iconfont icon-chongzhi">
                        </span>*/}
                        </Tooltip>
                    </div>
                </li>
                <li>
                    <div className="name">{say('main', 'diaphaneity')}</div>
                    <div className="operation">
                        <div>
                            <Slider min={0} max={100} style={{width: 150}}
                                    onChange={(value) => {
                                        execute(value, 'chroma-t');
                                    }}
                                    value={colorkeying.transparency}/>
                            <InputNumber size={'small'} min={0} max={100}
                                         value={colorkeying.transparency}
                                         onChange={(value) => {
                                             execute(value, 'chroma-t');
                                         }}
                            />
                        </div>
                    </div>
                    <div className="back">
                        <Tooltip title={say('main', 'reset')}>
                        {/*<span onClick={()=>{
                            execute(0, 'chroma-t');
                        }} className="ico-opera ico iconfont icon-chongzhi">
                        </span>*/}
                        </Tooltip>
                    </div>
                </li>
            </ul>

        );
    }
}