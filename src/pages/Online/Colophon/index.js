/* online 历史版本 */
import React from 'react';
import 'jquery-ui/ui/widgets/slider';
import 'jquery-ui/ui/effect';
import { Button, message, Modal } from 'antd';
import channel from "@/channel";

export default class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            colophon:{},
            items:[],
            version_id:'',
        };
    }

    componentWillMount() {

    }

    handleChange(value) {

    }

    componentWillUnmount() {
        let state = {
            colophon:{},
            items:[],
            version_id:'',

        };
        for (let i in state) {
            this.state[i] = state[i]
        }
    }

    componentDidMount() {

    }

    shouldComponentUpdate(nP, nS) {
        let os = this.props.colophon.show, ns = nP.colophon.show;
        if (ns && !os) {
            channel('get_project_version_list',{project_id:this.props.project_id},(re)=>{
                this.setState({items:re});
            },()=>{
                let pre=[
                    // {
                    //     'version_id': 'c11111111311',
                    //     'description': 'xxx',
                    //     'thumbnail': 'http://xxx/image/thumbnail.png',
                    //     'add_time': '2019-01-29 12:12:12'
                    // },
                    // {
                    //     'version_id': 'c1111111111',
                    //     'description': 'xxx',
                    //     'thumbnail': 'http://xxx/image/thumbnail.png',
                    //     'add_time': '2019-01-29 12:12:12'
                    // }
                ];
                this.setState({items:pre});
            },'info')
        }
        if (os && !ns) {
            this.state = {
                colophon:{},
                items:[],
                version_id:'',

            };
        }
        return true;
    }
    enterTrack(){
        let that=this;

        if(this.state.version_id){
            Modal.confirm({
                title: '提示',
                content:'是否保存当前项目配置为历史版本？',
                style:{
                    top:200
                },
                maskClosable:true,
                okText:'保存',
                cancelText:'不保存',
                onOk() {
                    channel('save_project_version',{project_id:that.props.project_id,description:'指定历史版本并使用后留下的版本'},()=>{
                        channel('use_project_version',{version_id:that.state.version_id},()=>{
                            that.props.history.push('/load');
                            that.props.history.push('/online#'+that.props.project_id);
                        },'','info')
                    },()=>{
                        that.props.history.push('/load');
                        that.props.history.push('/online#'+that.props.project_id);
                    },'info')
                },
                onCancel(){
                        channel('use_project_version',{version_id:that.state.version_id},()=>{
                            that.props.history.push('/load');
                            that.props.history.push('/online#'+that.props.project_id);
                        },'','info')
                }
            })
        }else{
            message.info('未选择历史版本');
        }
    }
    render() {
        let listDom=[];
        this.state.items.map((v,k)=>{
            let dom=(
                <div className={this.state.version_id===v.version_id?'cell current':'cell'} onClick={()=>{
                    this.setState({version_id:v.version_id});
                }}>
                    <div className="checked" >
                        <div className="angle"> </div>
                        <span className="ico iconfont icon-quanxuan"> </span>
                    </div>
                    <div className="portrait">
                        <img
                            src={v.photograph}
                            alt="portrait"/>
                    </div>
                    <div className="detail">
                        <div>
                            <div className="name">
                                创建人：

                            </div>
                            <div className="content">
                                {v.username}

                            </div>
                        </div>
                        <div>
                            <div className="name">
                                创建时间：
                            </div>
                            <div className="content">
                                {v.add_time}
                            </div>
                        </div>

                    </div>

                </div>);
            listDom.push(dom);
        });
        return (
            <div className={'unit-detail colophon ' + ( this.props.colophon.show ? '' : 'hidden')}>
                <div className="close-unit-detail" onClick={()=>{
                    this.props.close();
                }}>
                    收起
                    <span className="ico iconfont icon-latiao"> </span>
                </div>
                <div className="unit-content">
                    <div className="colophon colophon-box">
                        <div className="colophon-title">
                            <span className="ico iconfont icon-lishijilu"> </span><span>历史版本</span>

                        </div>
                        <div className="colophon-list">
                            {listDom}
                            {/*<div className="cell current">*/}
                                {/*<div className="checked" >*/}
                                    {/*<div className="angle"> </div>*/}
                                    {/*<span className="ico iconfont icon-quanxuan"> </span>*/}
                                {/*</div>*/}
                                {/*<div className="portrait">*/}
                                    {/*<img*/}
                                        {/*src="http://testapi.onvideo.cn/data/media/1/1/video/1152886848373560/custom.jpg"*/}
                                        {/*alt="portrait"/>*/}

                                {/*</div>*/}
                                {/*<div className="detail">*/}
                                    {/*<div>*/}
                                        {/*<div className="name">*/}
                                            {/*创建人：*/}

                                        {/*</div>*/}
                                        {/*<div className="content">*/}
                                            {/*我*/}

                                        {/*</div>*/}
                                    {/*</div>*/}
                                    {/*<div>*/}
                                        {/*<div className="name">*/}
                                            {/*创建时间：*/}
                                        {/*</div>*/}
                                        {/*<div className="content">*/}
                                            {/*2018-10-26   15:28:37*/}
                                        {/*</div>*/}
                                    {/*</div>*/}

                                {/*</div>*/}

                            {/*</div>*/}

                        </div>
                        <div className="colophon-feet">
                            <Button style={{width:'100px'}} className="btn-black" onClick={this.enterTrack.bind(this)}   type="primary">
                                进入轨道
                            </Button>
                            <Button style={{width:'100px'}} className="btn-black" onClick={()=>{
                                this.props.close();
                            }}   type="">
                                取消
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}