/*  录音  */
import React from 'react';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/slider';
import 'jquery-ui/ui/effect';
import { Form, Checkbox, Modal } from 'antd';
import moment from 'moment';
import uploading from '@/channel/clipFileUpload';
import { getDuration } from "@/utils/handy";

let stream = '';
let mediaRecorder;
let duration = 0;
let _duration = 0;
let blob = '';
let chunks = [];
let audio = document.createElement('audio');
class RegistrationForm extends React.Component {
    state = {
        status: false,
        preview: true,
        paused: true,
        mute: false,
        progress: 0,
        confirmLoading: false,
    }
    componentWillUnmount() {
        stream.stop && stream.stop();
        this.state = {
            status: false,
            preview: false,
            paused: true,
            mute: false,
        };
    }

    shouldComponentUpdate(nP, nS) {
        let os = this.props.visible, ns = nP.visible;
        if (ns && !os) {
            blob = '';
            this.props.playVideo();
        }
        if (!ns && os) {
            audio.pause();
        }
        return true;
    }

    openRecord() {
        let that = this;
        stream.stop && stream.stop();
        this.props.setSilence(true);
        let p = navigator.mediaDevices.getUserMedia({ audio: true });
        chunks = [];
        duration = new Date();
        p.then(function (mediaStream) {
            mediaRecorder = new MediaRecorder(mediaStream);
            mediaRecorder.ondataavailable = function (e) {
                chunks.push(e.data);
            };
            mediaRecorder.start();
            audio.pause();
            that.state.paused = true;
            that.setState({ status: new Date() });
            that.props.pause();
            that.props.setSilence(that.state.mute);
            that.props.set_time_now(that.props.record.time || 0);
            if (that.state.preview) {
                $('#playBtn').click();
            }
            that.plus();
            stream = mediaStream.getTracks()[0];  // if only one media track

            mediaRecorder.onstop = function (e) {
                stream.stop && stream.stop();
                that.props.pause();
                blob = new Blob(chunks, { 'type': 'audio/mp3; codecs=opus' });
                blob['name'] = moment(new Date()).format('YYYY-MM-DD_HH:mm:ss') + '.mp3';
                let url = URL.createObjectURL(blob); //转化成url

                $('.record').find('.opera-slider.opera-volume').slider({ value: 100 });
                audio.volume = 1;
                audio.currentTime = 999999;
                audio.onloadeddata = () => {
                    audio.currentTime = 0;
                    URL.revokeObjectURL(this.src);  // 释放createObjectURL创建的对象
                    that.setState({ status: that.state.status });
                };
                audio.onended = () => {
                    that.props.pause();
                    that.setState({ paused: true });
                };
                audio.src = url;
                _duration = getDuration((+new Date() - +that.state.status) / 1000);
                that.setState({ status: false });
                chunks = [];
                if (!that.props.visible) {
                    blob = '';
                }
            }
        });
        p.catch(function (err) {
            console.log(err.name);
        }); // always check for errors at the end.
    }
    done() {
        const { status, confirmLoading } = this.state;
        if (!status) {
            if (blob) {
                if (!confirmLoading) {
                    this.setState({ confirmLoading: true });
                    uploading.project_id = this.props.project_id;
                    uploading.uploadFile(blob, this.props.record.dir_id || 0, (media_id, duration, buffer) => {
                        this.props.close(media_id, duration, buffer, this.props.record.time || 0, audio.volume);
                        this.setState({ confirmLoading: false });
                    }, () => {
                        this.setState({ confirmLoading: false });
                    });
                }
            } else {
                this.props.close();
                this.setState({ confirmLoading: false });
            }
            this.setState({ paused: true });
            this.props.pause();
            this.props.setSilence(false);
            this.props.set_time_now(this.props.record.time || 0);
        } else {
            this.closeRecord();
        }
    }
    plus(re) {
        const {status} = this.state;
        if (status) {
            this.setState({ status: status });
            setTimeout(() => {
                this.plus();
            }, 1000)
        }
    }
    play_progress(re) {
        if (!audio.paused) {
            this.setState({ progress: audio.currentTime });
            setTimeout(() => {
                this.play_progress();
            }, 300)
        }
    }
    closeRecord() {
        mediaRecorder.stop();
    }

    // componentDidMount() {
    //     $('.record').find('.opera-slider.opera-volume').slider({
    //         orientation: "horizontal",
    //         range: "min",
    //         min: 1,
    //         max: 100,
    //         value: 100,
    //         step: 1,
    //         slide: function (event, ui) {
    //             audio.volume=ui.value/100;
    //         },
    //         create: (e, u) => {
    //             $(e.target).find('.ui-slider-handle').removeAttr('tabIndex')
    //         },
    //         change: (e, u) => {
    //             // // console.info(e)
    //             // // console.info(u)
    //         }
    //     });
    // }
    cancel() {
        const { status } = this.state;
        if (status) {
            this.closeRecord();
        }
        blob = '';
        this.props.close();
        this.setState({ confirmLoading: false, paused:true });
        this.props.pause();
        this.props.setSilence(false);
        this.props.set_time_now(this.props.record.time || 0);
    }
    render() {
        const { status, paused, confirmLoading, preview, mute } = this.state
        return (
            <Modal
                visible={this.props.visible}
                title={'录音'}
                style={{ top: '10vh' }}
                confirmLoading={confirmLoading}
                width={670}
                onOk={() => {
                    this.done();
                }}
                onCancel={() => {
                    this.cancel();
                }}
            >
                <div className="detailMaterial" >
                    <div className="media">
                        <canvas id="sec5-canvas">
                        </canvas>
                    </div>
                    <div className="record-ctrl">
                        <div className="t-a-r">
                            <Checkbox className=" m-0-10" 
                                disabled={status}
                                checked={preview}
                                onChange={(e) => {
                                    this.setState({ preview: e.target.checked })
                                }}
                            >同时预览
                            </Checkbox>
                            <Checkbox className=" m-0-10" 
                                disabled={status}
                                checked={mute}
                                onChange={(e) => {
                                    this.setState({ mute: e.target.checked })
                                }}
                            >预览静音
                            </Checkbox>
                        </div>
                        <div className="attention">
                            {status ?
                                <span className="ico iconfont icon-zanting_" onClick={() => {
                                    this.closeRecord()
                                }}>
                                </span> :
                                <span className="ico iconfont icon-luyin" onClick={() => {
                                    this.openRecord()
                                }}>
                                </span>}
                        </div>
                        <div className="preview">
                            {status ? <p> <span>{getDuration((+new Date() - +status) / 1000)}</span></p> :
                                blob ? <div>
                                    <p><span className="name">{blob['name'] || ''}</span>
                                        <span onClick={() => {
                                            blob = '';
                                            audio.pause();
                                            this.props.pause();
                                            this.setState({ paused: true, status: status});
                                        }} className="ico iconfont icon-shanchu"> </span>
                                    </p>
                                    <p>
                                        <span onClick={() => {
                                            if (!status) {
                                                if (paused) {
                                                    this.setState({ paused: false });
                                                    this.props.pause();
                                                    this.props.setSilence(false);
                                                    setTimeout(() => {
                                                        this.props.set_time_now(this.props.record.time || 0);
                                                        $('#playBtn').click();
                                                        audio.currentTime = 0;
                                                        this.play_progress();
                                                        audio.play();
                                                    })
                                                } else {
                                                    audio.pause();
                                                    this.props.pause();
                                                    this.setState({ paused: true })
                                                }
                                            }
                                        }} className={ paused ? "ico iconfont icon-bofang" : "ico iconfont icon-zanting" }> </span>
                                        <span className="progress">
                                            <span className="handler" style={{ width: (audio.currentTime / audio.duration * 100 || 0) + '%' }}>

                                            </span>
                                        </span>
                                        <span>{_duration}</span></p>
                                    <p className="opera-slider opera-volume">
                                    </p>
                                </div> : ''}
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}
export default Form.create({})(RegistrationForm);

