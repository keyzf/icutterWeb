import React from 'react';
import { Modal, Input } from 'antd';
import channel from '@/channel';
import { download } from "@/utils/handy";
import { confirm } from "@/components/Modal";
import Detail from '../Detail';
import IssueModel from '../IssueModel';
import Card from '@/components/Card';

let detailsButton = null;
let delButton = null;
let renameButton = null;
let downloadButton = null;

export default class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            issue: {},
            modalVisible: false, // 是否显示重命名弹窗
            show_detail: false, // 是否显示视频详情
            currentItem: {},
            modalId: '',
            modalText: '',
        };
    }
    componentWillMount() {
        detailsButton = {
            name: '详情',
            callBack: (item) => {
                this.showDetail(item);
            }
        }
        delButton = {
            name: '删除',
            callBack: (item, index) => {
                confirm('确定要删除该影片么？',
                    'trash_publish',
                    { pub_id: item.media_id, action: 2 },
                    () => {
                        this.props.items.splice(index, 1);
                        this.props.setItems(this.props.items);
                    }
                );
            }
        };
        renameButton = {
            name: '重命名',
            callBack: (item, index) => {
                this.setState({ modalId: item.media_id, modalText: item.title, modalVisible: true })
            }
        };
        downloadButton = {
            name: '下载',
            callBack: (item) => {
                download(item.media_url, item.title)
            }
        };
    }

    // 重命名
    onOk() {
        channel('change_name', {
            pub_id: this.state.modalId,
            name: this.state.modalText,
            media_type: 'movie'
        }, (re) => {
            this.props.items.map((item) => {
                if (item.media_id === this.state.modalId) {
                    item.name = this.state.modalText;
                }
            });
            this.props.setItems(this.props.items);
            this.setState({ modalId: '', modalText: '', modalVisible: false });
        })
    }

    // 发布
    issue(v) {
        this.setState({
            issue: {
                show: true,
                layer: 0,
                detail: {},
                project_id: '',
                projectArray: v
            }
        });
    }

    // 预览
    showDetail(item) {
        this.state.currentItem = item;
        this.setState({ show_detail: true });
    }

    render() {
        let items = [];

        let buttons = null;
        this.props.items.forEach((item, i) => {
            switch (item.status) {
                case 0: item['status_cn'] = '等待合成'; item['statusColor'] = "#46B059"; buttons = [delButton]; break;
                case 1: item['status_cn'] = '正在合成'; item['statusColor'] = "#BBCADC"; buttons = [delButton]; break;
                case 2: item['status_cn'] = '合成完成'; buttons = [detailsButton, delButton, renameButton, downloadButton]; break;
                case 3: item['status_cn'] = '合成失败'; item['statusColor'] = "rgba(242,93,98,.7)"; buttons = [delButton]; break;
            }
            items.push(
                <Card key={i} item={item} index={i} buttons={buttons} imgCallBack={(item) => {
                    this.showDetail(item);
                }} />);
        });
        return (
            <ul className="List">
                {items}
                <Detail visible={this.state.show_detail} close={() => { this.setState({ show_detail: false }) }} item={this.state.currentItem} />
                <Modal title='重命名'
                    visible={this.state.modalVisible}
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
                        value={this.state.modalText}
                        onChange={(e) => {
                            this.setState({ modalText: e.target.value })
                        }}
                        onPressEnter={(e) => {
                            this.onOk();
                        }} /></p>
                </Modal>
                <IssueModel close={() => {
                    this.setState({ issue: {} });
                }} history={this.props.history}
                    issue={this.state.issue} />
            </ul>
        );
    }
}
