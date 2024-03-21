/* 视频播放器  目前没有引用 */
import React from 'react';
import videojs from 'video.js'

export default class VideoPlayer extends React.Component {
    componentDidMount() {
        // instantiate Video.js
        this.player = videojs(this.videoNode, this.props, function onPlayerReady() {
            console.log('onPlayerReady', this)
        });
    }

    // destroy player on unmount
    componentWillUnmount() {
        if (this.player) {
            this.player.dispose()
        }
    }


    shouldComponentUpdate(nP, nS) {
        let os = this.props.visible, ns = nP.visible;
        if (ns && !os) {
            this.player.src(nP.sources);
        }
        if (os && !ns) {
            if (this.player) {
                this.player.pause()
            }
        }
        return true;
    }
    // wrap the player in a div with a `data-vjs-player` attribute
    // so videojs won't create additional wrapper in the DOM
    // see https://github.com/videojs/video.js/pull/3856
    render() {
        return (
            <div>
                <div data-vjs-player>
                    <video ref={ node => this.videoNode = node } className="video-js vjs-big-play-centered"> </video>
                </div>
            </div>
        )
    }
}