import React from 'react';
import say from '@/database/local_language';
import { confirm } from "@/components/Modal";
import Card from '@/components/Card';

export default class MainList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    // 单个删除文件
    del(id, index) {
        let {items, setItems} = this.props
        confirm(say('statement', 'say17'), 'trash_project', { project_id: id, action: 2 }, () => {
            items.splice(index, 1);
            setItems(items);
        });
    }

    render() {
        const { items } = this.props;
        let itemsDom = [];
        const buttons = [{
            name: '编辑',
            callBack: (item) => {
                this.props.history.push('/online#' + item.project_id)
            }
        }, {
            name: '删除',
            callBack: (item, index) => {
                this.del(item.project_id, index)
            }
        }]
        items.forEach((item, i) => {
            itemsDom.push(
                <Card key={i} item={item} index={i} buttons={buttons} imgCallBack={(item) => {
                    this.props.history.push('/online#' + item.project_id)
                }} />);
        });
        return (
            <ul className="List">
                {itemsDom}
            </ul>
        );
    }
}