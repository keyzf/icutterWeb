/* 高级操作 速度 */
import React from 'react';
import { Select } from 'antd';
import say from '@/database/local_language';

const { Option } = Select;

export default class Top extends React.Component {

    render() {
        let speed = this.props.speed;
        let execute = this.props.execute;
        let speed_reset = this.props.speed_reset;

        return (<ul className='show'>
            <li>
                <div className="name">{say('main', 'speed')}</div>
                <div className="operation">
                    <div>
                        <Select value={speed.value} style={{ width: 60 }} onChange={(value) => {
                            execute(value, 'speedV')
                        }}>
                            <Option value="2">2</Option>
                            <Option value="1">1</Option>
                            <Option value="-2">-2</Option>
                        </Select>
                    </div>
                </div>
                <div className="back">
                    {/*<span onClick={speed_reset} title={say('main', 'reset')}
                              className="ico-opera ico iconfont icon-chongzhi"> </span>*/}
                </div>
            </li>
        </ul>

        );
    }
}