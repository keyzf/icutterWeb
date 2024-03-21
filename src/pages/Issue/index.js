import React from 'react';
import $ from 'jquery';
import Lottie from 'react-lottie';
import { get_data } from "@/channel";

export default class LottieControl extends React.Component {

    constructor(props) {
        super(props);

        // let data=get_data((localStorage.setpath||'')+'/dataBase/text_animation/19.json');
        let data = get_data((localStorage.setpath || '') + '/animate/23/xinhua001.json');
        data.fonts = {
            "list": [
                {
                    "origin": 0,
                    "fPath": "",
                    "fClass": "",
                    "fFamily": "HappyZcool-2016",
                    "fWeight": "",
                    "fStyle": "",
                    "fName": "STSongti-SC-Bold",
                    "ascent": 66.3985960185528
                }
            ]
        };
        this.state = {
            isStopped: false, isPaused: false, option: {
                loop: false,
                autoplay: true,
                animationData: data,
                className: 'lottie',
                rendererSettings: {
                    scaleMode: 'noScale',
                    clearCanvas: false,
                    progressiveLoad: false, // Boolean, only svg renderer, loads dom elements when needed. Might speed up initialization for large number of elements.
                    hideOnTransparent: true, //Boolean, only svg renderer, hides elements when opacity reaches 0 (defaults to true)
                    className: 'some-css-class-name'
                },
            }
        };

        // bodymovin.loadAnimation({
        //     container: element, // the dom element
        //     renderer: 'svg',
        //     loop: true,
        //     autoplay: true,
        //     animationData: animationData, // the animation data
        //     rendererSettings: {
        //         context: canvasContext, // the canvas context
        //         scaleMode: 'noScale',
        //         clearCanvas: false,
        //         progressiveLoad: false, // Boolean, only svg renderer, loads dom elements when needed. Might speed up initialization for large number of elements.
        //         hideOnTransparent: true, //Boolean, only svg renderer, hides elements when opacity reaches 0 (defaults to true)
        //         className: 'some-css-class-name'
        //     }
        // });

    }

    draw() {
        let canvas = $('#canvass')[0];
        let ctx = canvas.getContext('2d');
        let img = document.createElement('img');
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, 400, 400);
            // ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        setInterval(() => {
            let obj = this.lottieNode.anim;
            // console.info(obj.wrapper.innerHTML)
            //        anim.goToAndStop(100*Math.random(), true);
            let svgString = new XMLSerializer().serializeToString($(obj.wrapper.innerHTML)[0]);
            // console.info(svgString)
            let svg = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
            let url = URL.createObjectURL(svg);
            img.src = url;
        }, 600)
    }

    setFont() {
        // let config=cloneConfig(animationData)
        // console.info(this.lottieNode)
        this.lottieNode.options.animationData.fonts = {
            "list": [
                {
                    "origin": 0,
                    "fPath": "",
                    "fClass": "",
                    "fFamily": "楷体",
                    "fWeight": "",
                    "fStyle": "",
                    "fName": "STSongti-SC-Bold",
                    "ascent": 66.3985960185528
                }
            ]
        };
        let obj = this.lottieNode.anim;
        console.info(obj.getDuration());
        let time = obj.currentFrame;

        let font = {
            "status": "success",
            "result": [{
                "url": "https://testapi.onvideo.cn/data/media/system/fonts/Cn_FangSong.ttf",
                "code": "FZFangSong-Z02S",
                "name": "方正仿宋简体",
                "language": "Cn"
            }, {
                "url": "https://testapi.onvideo.cn/data/media/system/fonts/Cn_HeiTi.ttf",
                "code": "FZHei-B01S",
                "name": "方正黑体简体",
                "language": "Cn"
            }, {
                "url": "https://testapi.onvideo.cn/data/media/system/fonts/Cn_KaiTi.ttf",
                "code": "FZKai-Z03S",
                "name": "方正楷体简体",
                "language": "Cn"
            }, {
                "url": "https://testapi.onvideo.cn/data/media/system/fonts/Cn_JianTi.ttf",
                "code": "FZShuSong-Z01S",
                "name": "方正书宋简体",
                "language": "Cn"
            }, {
                "url": "https://testapi.onvideo.cn/data/media/system/fonts/Cn_KuaiLeTi.ttf",
                "code": "HappyZcool-2016",
                "name": "站酷快乐体2016",
                "language": "Cn"
            }, {
                "url": "https://testapi.onvideo.cn/data/media/system/fonts/Cn_GaoDuanHei.ttf",
                "code": "zcool-gdh",
                "name": "站酷高端黑",
                "language": "Cn"
            }, {
                "url": "https://testapi.onvideo.cn/data/media/system/fonts/Cn_KuHei.ttf",
                "code": "HuXiaoBo_KuHei",
                "name": "站酷酷黑",
                "language": "Cn"
            }, {
                "url": "https://testapi.onvideo.cn/data/media/system/fonts/En_Adrip.ttf",
                "code": "a dripping marker",
                "name": "a dripping marker",
                "language": "En"
            }, {
                "url": "https://testapi.onvideo.cn/data/media/system/fonts/En_AspireDemiBold.ttf",
                "code": "Aspire",
                "name": "Aspire",
                "language": "En"
            }, {
                "url": "https://testapi.onvideo.cn/data/media/system/fonts/En_Champignon.ttf",
                "code": "Champignon",
                "name": "Champignon",
                "language": "En"
            }, {
                "url": "https://testapi.onvideo.cn/data/media/system/fonts/En_GreatVibes.ttf",
                "code": "Great Vibes",
                "name": "Great Vibes",
                "language": "En"
            }, {
                "url": "https://testapi.onvideo.cn/data/media/system/fonts/En_RegencieLightAlt.ttf",
                "code": "Regencie Alt",
                "name": "Regencie Alt LightAlt",
                "language": "En"
            }, {
                "url": "https://testapi.onvideo.cn/data/media/system/fonts/En_TruenoBdOl.ttf",
                "code": "TruenoBdOl",
                "name": "Trueno Bold Outline",
                "language": "En"
            }, {
                "url": "https://testapi.onvideo.cn/data/media/system/fonts/En_TruenoRg.ttf",
                "code": "TruenoRg",
                "name": "Trueno",
                "language": "En"
            }]
        };
        obj.loadSegments = () => {
            console.info('loadSegments')
            obj.goToAndStop(time, true);
        }
        obj.complete = () => {
            console.info('complete')
            obj.goToAndStop(time, true);
        }
        // this.setState({option:this.lottieNode.options.animationData});
        // console.info(time)

        obj.onComplete = () => {
            obj.goToAndStop(time, true);
        };
        console.info(this.lottieNode);
        // config.fonts={
        //     "list": [
        //         {
        //             "origin": 0,
        //             "fPath": "",
        //             "fClass": "",
        //             "fFamily": "黑体",
        //             "fWeight": "",
        //             "fStyle": "Bold",
        //             "fName": "STSongti-SC-Bold",
        //             "ascent": 66.3985960185528
        //         }
        //     ]
        // };
        // console.info(config)
        this.lottieNode.anim.setParams(this.lottieNode.options.animationData);
        // this.lottieNode.setParams(this.lottieNode.options.animationData)
    }

    componentDidMount() {
        this.draw();
    }

    render() {
        const buttonStyle = {
            display: 'block',
            margin: '10px auto'
        };

        return <div style={{ backgroundColor: 'gray' }}>
            <canvas className="some-css-class-name" width={1000} height={300} id="canvass">

            </canvas>
            <Lottie ref={node => this.lottieNode = node} id="lottie" options={this.state.option}
                height={300}
                width={1000}
                isStopped={this.state.isStopped}
                isPaused={this.state.isPaused} />
            <button style={buttonStyle} onClick={() => this.setState({ isStopped: true })}>stop</button>
            <button style={buttonStyle} onClick={() => this.setState({ isStopped: false })}>play</button>
            <button style={buttonStyle} onClick={() => this.setState({ isPaused: !this.state.isPaused })}>pause</button>
            <button style={buttonStyle} onClick={this.setFont.bind(this)}>字体</button>
        </div>
    }
}