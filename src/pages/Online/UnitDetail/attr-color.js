/* 高级操作 颜色 */
import React from 'react';
import { Tooltip, Slider, InputNumber } from 'antd';
import say from '@/database/local_language';


export default class Top extends React.Component {

    render() {
        let color = this.props.color;
        let execute = this.props.execute;
        let speed_reset = this.props.speed_reset;

        return (<ul className='show'>
                <li>
                    <div className="name">{say('main', 'brightness')}</div>
                    <div className="operation">
                        <div>
                            <Slider min={-100} max={100} style={{width: 150}}
                                    onChange={(value) => {
                                        execute(value, 'brightness');
                                    }}
                                    value={color.brightness}/>
                            <InputNumber size={'small'} min={-100} max={100}
                                         value={color.brightness}
                                         onChange={(value) => {
                                             execute(value, 'brightness');
                                         }}
                            />
                        </div>
                    </div>
                    <div className="back">
                        <Tooltip title={say('main', 'reset')}>
                       {/* <span onClick={()=>{
                            execute(0, 'brightness');
                        }} className="ico-opera ico iconfont icon-chongzhi">
                        </span>*/}
                        </Tooltip>
                    </div>
                </li>
                <li>
                    <div className="name">{say('main', 'contrast')}</div>
                    <div className="operation">
                        <div>
                            <Slider min={-100} max={100} style={{width: 150}}
                                    onChange={(value) => {
                                        execute(value, 'contrast');
                                    }}
                                    value={color.contrast}/>
                            <InputNumber size={'small'} min={-100} max={100}
                                         value={color.contrast}
                                         onChange={(value) => {
                                             execute(value, 'contrast');
                                         }}
                            />
                        </div>
                    </div>
                    <div className="back">
                        <Tooltip title={say('main', 'reset')}>
                       {/* <span onClick={()=>{
                            execute(0, 'contrast');
                        }} className="ico-opera ico iconfont icon-chongzhi">
                        </span>*/}
                        </Tooltip>
                    </div>
                </li>
                <li>
                    <div className="name">{say('main', 'saturation')}</div>
                    <div className="operation">
                        <div>
                            <Slider min={-100} max={100} style={{width: 150}}
                                    onChange={(value) => {
                                        execute(value, 'saturation');
                                    }}
                                    value={color.saturation}/>
                            <InputNumber size={'small'} min={-100} max={100}
                                         value={color.saturation}
                                         onChange={(value) => {
                                             execute(value, 'saturation');
                                         }}
                            />
                        </div>
                    </div>
                    <div className="back">
                        <Tooltip title={say('main', 'reset')}>
                        {/*<span onClick={()=>{
                            execute(0, 'saturation');
                        }} className="ico-opera ico iconfont icon-chongzhi">
                        </span>*/}
                        </Tooltip>
                    </div>
                </li>
                <li>
                    <div className="name">{say('main', 'hue')}</div>
                    <div className="operation">
                        <div>
                            <Slider min={-180} max={180} style={{width: 150}}
                                    onChange={(value) => {
                                        execute(value, 'hue');
                                    }}
                                    value={color.hue}/>
                            <InputNumber size={'small'} min={-180} max={180}
                                         value={color.hue}
                                         onChange={(value) => {
                                             execute(value, 'hue');
                                         }}
                            />
                        </div>
                    </div>
                    <div className="back">
                        <Tooltip title={say('main', 'reset')}>
                        {/*<span onClick={()=>{
                            execute(0, 'hue');
                        }} className="ico-opera ico iconfont icon-chongzhi">
                        </span>*/}
                        </Tooltip>
                    </div>
                </li>
            </ul>

        );
    }
}