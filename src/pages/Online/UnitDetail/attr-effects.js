/* 高级操作  模糊*/
import React from 'react';
import { Button, Tooltip, Slider, InputNumber } from 'antd';
import say from '@/database/local_language';

export default class Top extends React.Component {

    render() {
        let specialeffect = this.props.specialeffect;
        let execute = this.props.execute;
        let openDelogo = this.props.openDelogo;
        let setDeLogo = this.props.setDeLogo;

        return (<ul className='show'>
            <li>
                <div className="name">{say('main', 'blurryVideo')}</div>
                <div className="operation">
                    <div>
                        <span className="start">{say('main', 'XAxis')}</span>
                        <Slider min={0} max={100} style={{ width: 150 }}
                            onChange={(value) => {
                                execute(value, 'vague-x');
                            }}
                            value={specialeffect.vague_x} />
                        <InputNumber size={'small'} min={-100} max={100}
                            value={specialeffect.vague_x}
                            onChange={(value) => {
                                execute(value, 'vague-x');
                            }}
                        />
                    </div>
                    <div>
                        <span className="start">{say('main', 'YAxis')}</span>
                        <Slider min={0} max={100} style={{ width: 150 }}
                            onChange={(value) => {
                                execute(value, 'vague-y');
                            }}
                            value={specialeffect.vague_y} />
                        <InputNumber size={'small'} min={-100} max={100}
                            value={specialeffect.vague_y}
                            onChange={(value) => {
                                execute(value, 'vague-y');
                            }}
                        />
                    </div>
                </div>
                <div className="back">
                    <Tooltip title={say('main', 'reset')}>
                        {/*<span onClick={()=>{
                            execute(0, 'vague-x');
                            execute(0, 'vague-y');
                        }} className="ico-opera ico iconfont icon-chongzhi">
                        </span>*/}
                    </Tooltip>
                </div>
            </li>
            <li>
                <div className="name">{say('main', 'deLogo')} </div>
                <div className="operation" style={{ width: '300px', justifyContent: 'left', alignItems: 'start' }}>
                    <Button onClick={() => {
                        openDelogo();
                    }}>修改</Button>
                </div>
                <div className="back">
                    <Tooltip title={say('main', 'reset')}>
                        {/*<span onClick={()=>{
                            setDeLogo([]);
                        }} className="ico-opera ico iconfont icon-chongzhi">
                        </span>*/}
                    </Tooltip>
                </div>
            </li>
        </ul>

        );
    }
}