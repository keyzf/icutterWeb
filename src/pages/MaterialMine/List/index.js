import React from 'react';
import { Input, Modal, Tooltip, Progress } from 'antd';
import channel from '@/channel';
import say from '@/database/local_language';
import { getDuration } from "@/utils/handy";
import { confirm } from "@/components/Modal";
import waveform from '@/images/defult_audio.png';
import imgBg from '@/images/img-bg.jpg';
import Detail from '../Detail';
import Mover from '../MoveDirectory';

export default class MaterialList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            show_detail: false,
            show_mover: false,
            mater_detail: {},
            mover_data: [], // 需要移动的文件ID数组
            mover_index: '', // 需要移动到的文件index一个
            confirmLoading: false,
            modalData: {},
        };
    }

    // 重命名
    onOk() {
        const { modalData } =  this.state;
        this.setState({ confirmLoading: true });
        channel('change_name', modalData, (re) => {
            this.setState({ modalId: "", modalVisible: false, confirmLoading: false})
            let items = this.props.items.filter((i) => !i.temp)
            items[modalData.index].name = modalData.name;
            this.props.setItems(items);
        })
    }

    // 预览
    getDetail(item) {
        this.setState({ mater_detail: item, show_detail: true });
    }

    // 删除文件
    del(id, index) {
        let msg = '确定要删除该素材么？';
        confirm(msg, 'trash_media', { media_id: id, action: 1 }, () => {
            let { items } = this.props;
            items.splice(index, 1);
            items = items.filter((i) => !i.temp);
            this.props.setItems(items);
        })
    }

    render() {
        const {
            modalVisible, 
            confirmLoading, 
            modalData,
            show_detail,
            show_mover, 
            mater_detail,
            mover_index,
            mover_data
        } =  this.state;
        const { items } =  this.props;
        let itemsDom = [];
        items.forEach((item, i) => {
            itemsDom.push((item.media_id && !item.uploading) ?
                <li name={i} className='movie-cell hover' key={'material' + i} id={item.media_id}>
                    <div className="img-cell" onClick={() => {
                        this.getDetail(item)
                    }}>
                        <img src={imgBg} alt="" className="stance" />
                        <div>
                            <img src={item.media_type !== 'audio' ? item.thumbnail ? item.thumbnail : '' : waveform} alt="" />
                        </div>
                        <div className="right-bottom-tip">
                            {item.status === 2 || item.status === 5 ? <span className="out_type status status3">{item.status_cn}</span> : null}
                            {item.status === 0 ? <span className="out_type status status1">{item.status_cn}</span> : null}
                            {item.status === 3 ? <span className="out_type status status-blue">{item.status_cn}</span> : null}
                            {item.status === 4 ? <span className="out_type status status-yellow">{item.status_cn}</span> : null}
                            {item.media_type !== 'image' ? <span className="duration">{item.media_type === 'video' ? <span className='ico iconfont icon-yingpiangui'> </span> : <span className='ico iconfont icon-audio'> </span>}{getDuration(item.duration)}</span> : <span className="duration only_ico"><span className='ico iconfont icon-tupianicon'> </span></span>}
                        </div>
                    </div>
                    <div className="info">
                        <p title={item.name} onClick={() => {
                            this.getDetail(item)}}>
                            {item.name}
                        </p>
                        <p>
                            <span>{say('main', 'uploadOn')}：{item.add_time}</span>
                        </p>
                    </div>
                    <div className="ctrl">
                        <Tooltip title={'移动至'} >
                            <p>
                                <span className="ico iconfont icon-yidongzhi"
                                    onClick={() => {
                                        this.setState({ mover_data: item.media_id, mover_index: i, show_mover: true });
                                    }}> </span>
                                <span>|</span>
                            </p>
                        </Tooltip>
                        <Tooltip title={say('main', 'rename')} >
                            <p>
                                <span className="ico iconfont icon-bianji"
                                    onClick={() => {
                                        let modalData = { index: i, media_id: item.media_id, name: item.name, media_type: item.media_type };
                                        this.setState({ modalData: modalData, confirmLoading: false, modalVisible: true });
                                    }}> </span>
                                <span>|</span>
                            </p>
                        </Tooltip>
                        <Tooltip title={say('main', 'delete')} >
                            <p>
                                <span className="ico iconfont icon-shanchu"
                                    onClick={() => {
                                        this.del(item.media_id, i)
                                    }}> </span>
                            </p>
                        </Tooltip>
                    </div>
                </li> : !item.cancel_upload && !item.temp ?
                    <li className="uploadingArea" key={'temp' + item.lastModified + i}>
                        <div className="img-cell">
                            <img src={imgBg} alt="" className="stance" />
                            <div>
                                <img src={item.thumbnail || ''} alt="" />
                            </div>
                            <div className="right-bottom-tip">
                                <span className="status-blue">{(item.percent || item.percent === 0) ? '正在上传' : '准备上传'}</span>
                                {item.media_type !== 'image' && item.duration ? <span className="duration">{getDuration(item.duration)}</span> : ''}
                            </div>
                        </div>
                        <div className="progress">
                            <Progress percent={item.percent ? item.percent : 0} status="active" />
                           {/*  <div className="icoArea">
                                <div onClick={() => {
                                    uploading.pause(item.buffer);
                                }}>
                                    <span className={item.suspend_upload ? "ico iconfont icon-kaishishangchuan" : "ico iconfont icon-zantingshangchuan"}> </span>
                                    <span>{item.suspend_upload ? say('main', 'upload') : say('main', 'pause')}</span>
                                </div>
                                <div onClick={() => {
                                    uploading.cancel(item.buffer);
                                }}>
                                    <span className="ico iconfont icon-quxiaoshangchuan"> </span>
                                    <span>{say('main', 'cancel')}</span>
                                </div>
                            </div> */}
                        </div>
                        <div className="info">
                            <p title={item.name} >{item.name}</p>
                            <p > </p>
                        </div>
                    </li>
                    : <li className="movie-cell" key={'material' + i} onClick={() => item.callBack()}>
                        <div className="img-cell" style={{ textAlign: 'center', height: '190px', lineHeight: "190px", borderBottom: '1px solid #D8D8D8' }}>
                            <span style={{ fontSize: '130px', color: '#1890FF' }} >+</span>
                        </div>
                        <div className="info"><p title={item.name}>{item.name}</p><p></p></div>
                    </li >);
        });
        return (
            <ul className="list material-list">
                {itemsDom}
                <Modal title='重命名'
                    visible={modalVisible}
                    confirmLoading={confirmLoading}
                    style={{ top: 200 }}
                    onOk={() => {
                        this.onOk();
                    }}
                    onCancel={() => {
                        this.setState({ modalVisible: false })
                    }}
                >
                    <p><Input
                        maxLength={30}
                        value={modalData.name}
                        onChange={(e) => {
                            this.state.modalData.name = e.target.value;
                            this.setState({ modalVisible: true })
                        }}
                        onPressEnter={(e) => {
                            if (!confirmLoading)
                                this.onOk();
                        }} /></p>
                </Modal>
                <Detail 
                    visible={ show_detail } 
                    close={() => { this.setState({ show_detail: false }) }} 
                    item={mater_detail} />
                <Mover 
                    visible={ show_mover } 
                    close={() => { this.setState({ show_mover: false }) }} 
                    setItems={this.props.setItems} 
                    items={this.props.items.filter((i) => !i.temp)} 
                    index={mover_index} 
                    data={mover_data} />
            </ul>
        );
    }
}