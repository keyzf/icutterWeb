/* 全局  输入框右侧字数提示 */
import React from 'react';
export default class Tip extends React.Component {
    constructor(props) {
        super(props);
        this.state = {batch: false};
    }

    cancelSelect(val) {
        this.props.items.map((v, k) => {
            v['selected'] = val || false;
        });
        this.props.setItems(this.props.items);
    }
    render() {
        let list=[];
        this.props.data.map((v,k)=>{
            let ico='zuoduiqi';
            switch (v){
                case 'left':ico='zuoduiqi';break;
                case 'middle':ico='juzhongduiqi';break;
                case 'right':ico='youduiqi';break;
            }
            list.push(
                <div key={k} className={v===this.props.current?'current c-p':'c-p'} onClick={()=>{
                    this.props.setCurrent(v);
                }}>
                    <span className={"ico iconfont icon-"+ico}> </span>
                </div>)
        });
        return (
            <div className="little-tip" style={{width:this.props.width?(this.props.width+'px'):'100%'}}>
                {list}
            </div>
        );
    }
}