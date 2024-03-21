/* 视频播放器 */
import React, { Component } from 'react';
import VideoJsForReact from 'videojs-for-react';

class App extends Component {
    constructor() {
        super()
        this.state = {
            videoJsOptions: {
                preload: 'auto',  // 预加载
                bigPlayButton: {},  // 大按钮
                autoplay: true,   // 自动播放
                controls: true,  // 是否开启控制栏
                width: 800,   // 播放器宽度
                height: 600,  // 播放器高度
                playbackRates: [1, 1.5, 2], // 播放倍速
                sources: [  // 视频源
                    {
                        // src: 'http://yunxianchang.live.ujne7.com/vod-system-bj/44_176_20170224113626af3a75cd-3508-4bc3-b51f-366fca3c7e39.m3u8',
                        src: 'https://livetfi.onvideo.cn/onvideo/live/355757baf17841dc/list.m3u8',
                        type: 'application/x-mpegURL',
                        label: 'HLS1',
                        withCredentials: false,
                        res: 960
                    }, {
                        src: 'http://192.168.199.197:5000/nodeJS%E8%A7%86%E9%A2%914.mp4',
                        type: 'video/mp4',
                        label: 'MP4',
                        res: 1080
                    }
                ]
            }
        }
    }

    shouldComponentUpdate(nP, nS) {
        let os = this.props.visible, ns = nP.visible;
        if (ns && !os) {
            this.videoNode.player.src(nP.sources);
        }
        if (os && !ns) {
            this.videoNode.player.pause()
        }
        return true;
    }

    render() {
        return (
            <div className="player">
                <VideoJsForReact  ref={ node => this.videoNode = node }
                    sourceChanged={(player) => console.log(player)}
                    onReady={(player) =>{
                        // console.log('准备完毕', player)
                    }}
                    {...this.props}
                >
                </VideoJsForReact>
            </div>
        )
    }
}

export default App;