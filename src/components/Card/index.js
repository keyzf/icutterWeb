import React from 'react';
import { Button } from 'antd';
import say from '@/database/local_language';
import { getDuration } from '@/utils/handy';
import imgBg from '@/images/img-bg.jpg';
import listImg from '@/images/defult_pro.png';
import './index.scss'
export default class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { item, index, buttons } = this.props
        return (
            <li key={'card' + index} id={item.project_id} name={index} className='card_item'>
                <div className="card_img" onClick={() => {
                    this.props.imgCallBack && this.props.imgCallBack(item, index)
                }}>
                    <img src={imgBg} alt="" />
                    <div>
                        <img src={item.thumbnail || listImg} alt="" />
                    </div>
                    {item.out_type
                        ? <div className="card_tip left-top-tip">
                            <span className="card_text">{item.out_type}</span>
                        </div>
                        : null
                    }

                    <div className="card_tip left-bottom-tip">
                        <span className="card_text">{getDuration(item.duration)}</span>
                    </div>
                    {item.status && item.status !== 2
                        ? <div className="card_tip right-bottom-tip" style={{ background: item.statusColor }}>
                            <span className="card_text">{item.status_cn}</span>
                        </div>
                        : null}
                </div>
                <div className="card_info">
                    <div title={item.name || item.title} style={{ color: '#101010', fontSize: '16px', fontWeight: '500' }}>{item.name || item.title}</div>
                    <div style={{ color: '#888888', fontSize: '14px' }}>
                        <span>{say('main', 'lastModified') + '：' + item.update_time}</span>
                    </div>
                    <div className='card_button'>
                        {buttons && buttons.map((button, i) => {
                            return (
                                <Button size="small" key={i} onClick={() => {
                                    button.callBack(item, index)
                                }}>{button.name}</Button>
                            )

                        })}
                    </div>
                </div>
            </li>
        );
    }
}