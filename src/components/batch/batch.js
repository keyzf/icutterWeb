import React from 'react';
import {Button, Checkbox, message, Radio} from 'antd';

export default class Batch extends React.Component {
    constructor(props) {
        super(props);
        this.state = { batch: false };
    }

    cancelSelect(val) {
        this.props.items.map((v, k) => {
            v['selected'] = val || false;
        });
        this.props.setItems(this.props.items);
    }
    delete(){
        let list = [];
        this.props.items.map((v, k) => {
            if (v.selected) {
                list.push(v.project_id)
            }
        });
        if (list.length) {
            this.props.delItems(list);
        } else {
            message.info('请选择项目')
        }
    }
    render() {
        let items = this.props.items;
        let check_all = items.length;
        for (let i = 0; i < items.length; i++) {
            if (!items[i].selected) {
                check_all = false;
                break;
            }
        }
        return (
            <div className="dis-i-b">
                {this.props.batch ? <div className="flex-center">
                        <Button onClick={()=>{
                            this.cancelSelect();
                            this.props.setBatch(false);
                        }}>取消批量操作</Button>
                        <Checkbox className=" m-0-10"
                                  checked={check_all}
                                  onChange={(e) => {
                                      this.cancelSelect(e.target.checked);
                                  }}
                        >全选
                        </Checkbox>
                        <Radio.Group value={'none'} onChange={(e)=>{
                            let value =e.target.value;
                            switch (value){
                                case 'delete':this.delete();break;
                            }
                        }}>
                            <Radio.Button value="delete"><span className="ico iconfont icon-shanchu"> </span>删除</Radio.Button>
                        </Radio.Group>
                    </div> :
                    <div>
                        <Button onClick={() => {
                            this.props.setBatch(true);
                        }}>批量操作</Button>
                    </div>}
            </div>
        );
    }
}