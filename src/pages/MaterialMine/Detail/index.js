import React from 'react';
import { Form, Modal } from 'antd';
import say from '@/database/local_language';
import { getDuration, getSize } from "@/utils/handy";
import VideoPlayer from '@/components/VideoPlayerHls';

class RegistrationForm extends React.Component {
    state = {};
    render() {
        const {item, visible, close} = this.props;
        let videoJsOptions = {
            preload: 'auto',  // 预加载
            bigPlayButton: {},  // 大按钮
            autoplay: true,   // 自动播放
            controls: true,  // 是否开启控制栏
            aspectRatio: "16:9",
            width: '100%',
            playbackRates: [1, 1.5, 2], // 播放倍速
            sources: [{
                src: item.preview_mp4 || item.preview_mp3 || item.media_url,
                type: 'video/mp4'
            }]
        }
        return (
            <Modal
                visible={visible}
                title={null}
                footer={null}
                style={{ top: '10vh' }}
                width={670}
                onCancel={close}>
                <div className="detailMaterial" >
                    {(item.media_type === 'image' || item.type === 'image') 
                    ? <div className="media"><img id="video1" src={item.thumbnail || item.media_url} /></div> 
                    : <VideoPlayer id="video1" {...videoJsOptions} visible={this.props.visible} />}
                    <div className="info">
                        <div className="heard">
                            <span style={{ margin: '5px 0;display:inline-block' }}>{item.name}</span><br />
                            <span>{say('main', 'uploadOn') + '：' + item.add_time}</span>
                        </div>
                        <div className="body">
                            <ul>
                                <li><span>{say('main', 'type')}：</span>{item.media_type === 'video' ? say('main', 'video') : item.media_type === 'image' ? say('main', 'image') : say('main', 'audio')}</li>
                                {item.media_type !== 'audio' ?
                                    <li><span>{say('main', 'width')}：</span>{item.width}</li> : ''}
                                {item.media_type !== 'image' ?
                                    <li><span>{say('main', 'duration')}：</span>{getDuration(item.duration)}</li> : ''}
                                <li><span>{say('main', 'size')}：</span>{getSize(item.content_length)}</li>
                                {item.media_type !== 'audio' ?
                                    <li><span>{say('main', 'height')}：</span>{item.height}</li> : ''}
                                {item.media_type === 'video' && item.fps ?
                                    <li><span>{say('main', 'fps')}：</span>{(item.fps || '') + ' fps'}</li> : ''}
                                {item.media_type === 'video' && item.aspect ?
                                    <li><span>{say('main', 'aspectRatio')}：</span>{item.aspect}</li> : ''}
                            </ul>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}
export default Form.create({})(RegistrationForm);

