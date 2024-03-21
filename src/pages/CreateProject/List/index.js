import React from 'react';
import say from '@/database/local_language';
import { confirm } from "@/components/Modal";
import Card1 from "@/components/Card1";

export default class MainList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: {}
        };
    }

    // 单个删除文件
    del(id, index) {
        confirm(say('statement', 'say17'), 'trash_project', { project_id: id, action: 2 }, () => {
            let items = this.props.items;
            items.splice(index, 1);
            items = items.filter((i) => !i.temp);
            this.props.setItems(items);
        });
    }


    render() {
        let items = [];
        const buttons = [{
            name: "删除",
            ico: 'icon-shanchu',
            color: '#F96A6A',
            callBack: (item, index) => {
                this.del(item.project_id, index);
            }
        }]
        this.props.items.forEach((item, i) => {
            if (!item.project_id) {
                items.push(
                    <li key={'project' + i} name={i} key={i} className='movie-cell' onClick={() => {
                        item.callBack();
                    }}>
                        <div className="img-cell" style={{ borderBottom: '1px solid #D8D8D8', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <span style={{ color: '#1890FF', fontSize: '110px' }}>+</span>
                        </div>
                        <div className="info">
                            <p title={item.name}>{item.name}</p>
                            <p />
                        </div>

                    </li>)
                return;
            }
            items.push(
                <Card1 key={i} index={i} item={item} buttons={buttons} imgCallBack={(item) => {
                    this.props.history.push('/online#' + item.project_id)
                }} />);
        });
        return (
            <ul className="list">
                {items}
            </ul>
        );
    }
}