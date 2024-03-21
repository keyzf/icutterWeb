/* 工具栏 轨道上素材裁剪 */
import React from 'react';
import $ from "jquery";
import Cropper from "react-cropper";
import 'cropperjs/dist/cropper.css';

// 定时器
let setIntervalBar = '';
let setIntervalBar2 = '';

export default class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgData:'', // 裁剪图片的地址（不做显示）
            cropObj:{}, // 裁剪完成后的对象
            initCropSize:NaN, // 初始裁剪比例
            cropSize:NaN, // 裁剪比例
            isDiy: false, // 是否是自由比例
            canvasImgHeight: 0, // canvas图像的高度
            canvasImgWidth: 0, // canvas图像的宽度
        };
    }

    componentWillMount() {
        this.state.imgData = this.props.imgData;
        this.state.cropSize = this.props.cropSize;
        this.state.initCropSize = this.props.cropSize;
    }

    componentDidMount() {
        let corpperBox = '';
        setIntervalBar = setInterval(()=>{
            corpperBox = document.getElementsByClassName('cropper-crop-box')[0];
            if(corpperBox){
                clearInterval(setIntervalBar);
                this.createBar(corpperBox);
            }
        },100);
        setIntervalBar2 = setInterval(()=>{
            let img = new Image();
            img.src = this.state.imgData;
            this.state.canvasImgHeight = img.height;
            this.state.canvasImgWidth = img.width;
            if(this.state.canvasImgWidth){
                this.setState({canvasImgWidth:this.state.canvasImgWidth});
                clearInterval(setIntervalBar2);
            }
        },100);
    }
    componentWillUnmount() {
        $('.corpperBox-bar').remove();
    }
    // 生成操作栏
    createBar(corpperBox){
        $('.corpperBox-bar').remove();
        $('.corpperBox-number').remove();

        // 生成宽高
        let divNumber = document.createElement("div");
        divNumber.className='corpperBox-number';
        divNumber.innerText = `${parseInt($(corpperBox).width())} × ${parseInt($(corpperBox).height())}`;
        corpperBox.appendChild(divNumber);
        let divDom = document.createElement("div");

        // 生成操作栏
        divDom.className='corpperBox-bar';
        corpperBox.appendChild(divDom);
        let spanDiyContainer = document.createElement("div");
        let spanHandleContainer = document.createElement("div");
        divDom.appendChild(spanDiyContainer);
        divDom.appendChild(spanHandleContainer);
        let spanIco = document.createElement("span");
        let spanDiy = document.createElement("span");
        let spanCancel = document.createElement("span");
        let spanConfirm = document.createElement("span");
        spanIco.className='spanIco ico iconfont icon-danxuan_xuanzhong m-0-5';
        spanDiy.className='spanDiy';
        spanCancel.className='spanCancel ico iconfont icon-guanbi';
        spanConfirm.className='spanConfirm ico iconfont icon-duigou';
        spanDiy.innerText ='  自定义比例';
        spanDiyContainer.appendChild(spanIco);
        spanDiyContainer.appendChild(spanDiy);
        spanHandleContainer.appendChild(spanCancel);
        spanHandleContainer.appendChild(spanConfirm);
        spanDiyContainer.onclick = this.diyCrop.bind(this);
        spanCancel.onclick = this.cancelCrop.bind(this);
        spanConfirm.onclick = this.confirmCrop.bind(this);
    }

    // 拉去裁剪框时的回调
    crop(cropObj){
        let detail = cropObj.detail;

        let corpperBoxNumber = document.getElementsByClassName('corpperBox-number')[0];
        if(corpperBoxNumber){
            corpperBoxNumber.innerText = `${parseInt(detail.width)} × ${parseInt(detail.height)}`;
            corpperBoxNumber.setAttribute('style', `max-width:${parseInt(detail.width)}`);
        }

        //  处理边界情况
        let div = document.getElementsByClassName('corpperBox-bar')[0];
        if(div){
            // 监视器的宽高
            let height = window.getComputedStyle(document.getElementsByClassName('cropperContainer')[0]).height;
            height = parseInt(height.slice(0,height.length-2));
            let width = window.getComputedStyle(document.getElementsByClassName('cropperContainer')[0]).width;
            width = parseInt(width.slice(0,width.length-2));
            if(detail.width<214&&(height - detail.height - detail.y)<36){
                if((width - detail.width - detail.x)<214){
                    div.setAttribute('style', 'left: auto;right: 0;bottom: 0');
                }else {
                    div.setAttribute('style', 'left: 0;right: auto;bottom: 0');
                }
            }else if(detail.width<214&&(height - detail.height - detail.y)>36){
                if((width - detail.width - detail.x)<214){
                    div.setAttribute('style', 'left: auto;right: 0;bottom: auto');
                }else {
                    div.setAttribute('style', 'left: 0;right: auto;bottom: auto');
                }
            }else if(detail.width>214&&(height - detail.height - detail.y)<36){
                div.setAttribute('style', 'left: auto;right: 0;bottom: 0');
            }else if(detail.width>214&&(height - detail.height - detail.y)>36){
                div.setAttribute('style', 'left: auto;right: 0;bottom: auto');
            }
        }
        this.state.cropObj = detail;
    }

    // 修改data 监视器比例
    filterData(data){
        let newData = {};
        let x = data.x;
        let y = data.y;
        let height = data.height;
        let width = data.width;
        let canvas3 = $('#sec3-canvas')[0];
        let canvas3Width = canvas3.width;
        let canvas3Height = canvas3.height;
        newData.x = (x / canvas3Width).toFixed(4)*1;
        newData.y = (y / canvas3Height).toFixed(4)*1;
        newData.width = (width / canvas3Width).toFixed(4)*1;
        newData.height = (height / canvas3Height).toFixed(4)*1;
        return newData
    }

    // 自定义比例
    diyCrop(){
        this.state.isDiy =!this.state.isDiy;
        let spanIco = document.getElementsByClassName('spanIco')[0];
        if(this.state.isDiy){
            this.setState({cropSize:NaN});
            spanIco.style.color = '#FFD100';
        }else {
            this.setState({cropSize:this.state.initCropSize});
            spanIco.style.color = '#FFFFFF';
        }
        this.cropper.setAspectRatio(this.state.cropSize);
    }

    // 确认裁剪
    confirmCrop(){
        let newData = this.filterData(this.state.cropObj);
        this.props.crop(newData);
        this.props.setShowCropper(false);
    }
    // 取消裁剪
    cancelCrop(){
        this.state.cropObj = {};
        this.props.setShowCropper(false);
    }

    render() {
        return (
            <div  className='cropperContainer'>
                {this.state.canvasImgWidth
                    ? <Cropper
                        className='cropper'
                        ref={cropper => {
                            this.cropper = cropper;
                        }}
                        src={this.state.imgData}
                        viewMode={1} //框的范围 0默认 1 不允许超过图片大小
                        style={{height: this.state.canvasImgHeight, width: this.state.canvasImgWidth}}
                        aspectRatio={this.state.cropSize} // 修改此属性用来选切图的比例 NaN是自由比例
                        guides={true} // 是否显示上面的虚线
                        crop={this.crop.bind(this)}
                        autoCropArea={0.6} // 初始化裁剪框的大小0-1,默认0.8
                    />
                    :''}
            </div>
               );
    }
}
