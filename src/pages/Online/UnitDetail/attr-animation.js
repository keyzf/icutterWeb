/* 高级操作 动效字幕 */
import React from 'react';
import { Input, Popover, Select} from 'antd';
import { SketchPicker } from 'react-color'
import Lottie from 'lottie-web';
import { load_fonts, install_fonts } from "@/channel/load_fonts";

const Option = Select.Option;


let fonts = load_fonts();
let font_data=[];
fonts.map((v,k)=>{
    font_data.push({
        "origin": 0,
        "fPath": "",
        "fClass": "",
        "fFamily": v.code,
        "fWeight": "",
        "fStyle": "Regular",
        "fName": v.code,
        "ascent": 1
    })
});

export default class Top extends React.Component {
    refresh() {
        let media = this.props.media;
        let video = media['lottie'];
        let _data = video.animationData;
        video.destroy(); // 删除该动画，移除相应的元素标签等。在unmount的时候，需要调用该方法
        let animData = {
            wrapper: video.wrapper,
            renderer: 'svg',
            loop: true,
            prerender: true,
            autoplay: true,
            animationData: _data,
        };
        media['lottie'] = Lottie.loadAnimation(animData);
    }
    list_dom(data){
        let _fonts=[];
        let layers = this.props.layers;
        let set_layers = this.props.set_layers;
        data.layers.map((v, k) => {
            if (v.ty === 5) {
                let font = v.t.d.k[0].s;
                if (layers[k]) {
                    let param = layers[k]['s'] || {};
                    for (let i in font) {
                        if (param[i] && param[i] !== font[i]) {
                            font[i] = param[i];
                        }
                    }
                } else {
                    layers[k] = {
                        ty: 5,
                        s: font
                    };
                }
                let fontsDom = [];
                fonts.map((v, k) => {
                    fontsDom.push(<Option key={k} value={v.code}>{v.name}</Option>)
                });
                let sizeDom = [];
                for(let i=20;i<81;i++){
                    sizeDom.push(<Option key={i} value={i}>{i}</Option>)
                }
                // //字间距
                // let trDom = [];
                // for(let i=0;i<21;i++){
                //     trDom.push(<Option key={i} value={i*20}>{i*20}</Option>)
                // }
                font.tr=0;
                let font_color='RGBA(';
                font.fc.map((v,k)=>{
                    font_color+=(v*255+',');
                });
                font_color+='1)';
                _fonts.push(
                    <li key={k} className="flex-start">
                        <div className="operation animation-edit">
                            <div>
                                <span>
                                    <span>
                                        颜色
                                    </span>
                                    <Popover
                                        trigger="click"
                                        content={
                                            <SketchPicker
                                                color={font_color}
                                                disableAlpha={true}
                                                onChangeComplete={(v)=>{
                                                    let rgb=v.rgb;
                                                    let fc=[];
                                                    if(rgb){
                                                        fc.push((rgb.r/255).toFixed(2)*1);
                                                        fc.push((rgb.g/255).toFixed(2)*1);
                                                        fc.push((rgb.b/255).toFixed(2)*1);
                                                        if (fc !== font.fc) {
                                                            font.fc = fc;
                                                            this.refresh();
                                                            set_layers(fc, 'fc', k);
                                                        }
                                                    }
                                                }}
                                            />} >
                                        <div className="color-picker" style={{width:'60px',height:'22px'}}><div style={{background:font_color,height:'16px'}}> </div> </div>
                                    </Popover>
                                </span>
                                <span>
                                    <span>字体</span>
                                    <Select defaultValue={font.f}  size={'small'} onChange={(val)=>{
                                    if (val !== font.f) {
                                        font.f = val;
                                        this.refresh();
                                        set_layers(val, 'f', k);
                                        setTimeout(()=>{
                                            install_fonts(val);
                                        })
                                    }
                                }}>
                                        {fontsDom}
                                    </Select>
                                </span>
                                <span>
                                    <span>大小</span>
                                    <Select defaultValue={font.s} style={{ width: 60 }}   size={'small'} onChange={(val)=>{
                                    if (val !== font.s) {
                                        font.s = val;
                                        this.refresh();
                                        set_layers(val, 's', k);
                                    }
                                }}>
                                        {sizeDom}
                                    </Select>
                                </span>
                            </div>
                            <div>
                                    {/*<span className="m-10">*/}
                                    {/*<span>*/}
                                        {/*间距*/}
                                    {/*</span>*/}
                                {/*<Select defaultValue={font.tr}  style={{ width: 60 }} size={'small'} onChange={(val)=>{*/}
                                    {/*if (val !== font.tr) {*/}
                                        {/*font.tr = val;*/}
                                        {/*this.refresh();*/}
                                        {/*set_layers(val, 'tr', k);*/}
                                    {/*}*/}
                                {/*}}>*/}
                                    {/*{trDom}*/}
                                {/*</Select></span>*/}
                                <Input value={font.t} onChange={(e) => {
                                    let val = e.target.value;
                                    if (val !== font.t) {
                                        font.t = val;
                                        this.refresh();
                                        set_layers(val, 't', k)
                                    }
                                }}/>
                            </div>
                        </div>
                    </li>);
            }else if(v.ty===1){
                // if (layers[k]) {
                //     v.sc=layers[k]['sc'] || '';
                // } else {
                //     layers[k] = {
                //         ty: 1,
                //         sc: v.sc
                //     };
                // }
                // _fonts.push(
                //     <li key={k} className="flex-start">
                //         <div className="name">{say('main', 'textArea')}</div>
                //         <div className="operation">
                //             <div>
                //                 <Popover
                //                     trigger="click"
                //                     content={
                //                         <SketchPicker
                //                             color={ colorRgba(v.sc,1)}
                //                             disableAlpha={true}
                //                             onChangeComplete={(val)=>{
                //                                 let rgb=val.rgb;
                //                                 if(rgb){
                //                                     if (v.sc !== val.hex) {
                //                                         v.sc = val.hex;
                //                                         this.refresh();
                //                                         set_layers(v.sc, 'sc', k);
                //                                     }
                //                                 }
                //                             }}
                //                         />} >
                //                     <div className="color-picker" style={{width:'50px',height:'20px'}}><div style={{background:'#000',height:'20px',borderRadius:'4px'}}> </div> </div>
                //                 </Popover>
                //             </div>
                //         </div>
                //         <div className="back">
                //         </div>
                //     </li>);
            }else if(v.ty===0){
                let V=v;
                if(data&&data.assets&&data.assets.length&&layers) {
                    data.assets.map((v,k)=>{
                        if(v.id&&v.id===V.refId){
                            _fonts=this.list_dom(v);
                        }
                    });
                }
            }
        });
        return _fonts;
    }
    render() {
        let media = this.props.media;
        let layers = this.props.layers;
        let video = media['lottie'];
        let _data = video.animationData;
        let _fonts = [];
        if (_data && _data.layers && _data.layers.length && layers) {
            _fonts=this.list_dom(_data);
        }
        return (
            <ul className='show'>
                {_fonts}
                </ul>
        );
    }
}