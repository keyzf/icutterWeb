import React from 'react';
import { Form, Modal, Input, Button } from 'antd';
import VideoPlayer from '@/components/VideoPlayerHls';

const { TextArea } = Input;


class Detail extends React.Component {
    state = {};

    render() {
        const { item, close, visible } = this.props;
        let videoJsOptions = {
            preload: 'auto',  // 预加载
            bigPlayButton: {},  // 大按钮
            autoplay: true,   // 自动播放
            controls: true,  // 是否开启控制栏
            aspectRatio: "16:9",
            width: '50%',
            playbackRates: [1, 1.5, 2], // 播放倍速
            sources: [{
                src: item.media_url,
                type: 'video/mp4'
            }]
        }
        return (
            <Modal
                visible={visible}
                title={null}
                footer={null}
                style={{ top: '10vh' }}
                width={814}
                onCancel={close}>
                <div className="detail" >
                    <div>
                        <div className="detail-left">
                            <div className="detail-title">视频详情</div>
                            {item.status !== 2
                                ? <img id="detail-image" src={item.thumbnail} />
                                : <VideoPlayer id="detail-video" {...videoJsOptions} visible={visible} />}
                            <div><span className="detail-name">作者：</span><span className="detail-val">{item.user}</span></div>
                            <div><span className="detail-name">编辑时间：</span><span className="detail-val">{item.update_time}</span></div>
                        </div>
                        <div className="detail-right">
                            <div><span className="detail-name">标题</span><span className="detail-val">{item.title}</span></div>
                            <div><span className="detail-name">标签</span><span className="detail-val">{item.label}</span></div>
                            <div><span className="detail-name">视频画质</span><span className="detail-val">{item.out_type}</span></div>
                            <div><span className="detail-name">视频比例</span><span className="detail-val">{item.aspect}</span></div>
                            <div className="textArea"><span className="detail-name">视频简介</span><TextArea rows={3} value={item.description} placeholder="请输入简介（1 ~ 300字以内）" /></div>
                        </div>
                    </div>
                    <Button type='primary' onClick={close}>确认</Button>
                </div>
            </Modal >
        );
    }
}
export default Form.create({})(Detail);

