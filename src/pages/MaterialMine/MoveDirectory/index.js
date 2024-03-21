import React from 'react';
import { Form, Select, Modal } from 'antd';
import channel from "@/channel";

const Option = Select.Option;

class RegistrationForm extends React.Component {
    state = {
        confirmLoading: false,
        id: 0,
        files: [],
    };
    handleChange(value) {
        this.setState({ id: value })
    }
    shouldComponentUpdate(nP, nS) {
        let os = this.props.visible, ns = nP.visible;
        if (ns && !os) {
            channel('get_directory_list', {
                trash: 0
            }, (re) => {
                this.setState({ files: re });
            });
        }
        this.setState({ confirmLoading: false });
        return true;
    }
    render() {
        const { files, confirmLoading, id } = this.state;
        let { visible, data, refresh, items, setItems, index, close } = this.props;
        let itemDom = [<Option key={-1} value={0}>{'根目录'}</Option>];
        files.map((v, k) => {
            itemDom.push(<Option key={k} value={v.id}>{v.name}</Option>)
        });
        return (
            <Modal
                visible={visible}
                title={'移动至'}
                height={260}
                style={{ top: 200 }}
                confirmLoading={confirmLoading}
                onOk={() => {
                    this.setState({ confirmLoading: true });
                    channel('change_directory', 
                        { 
                            new_dir_id: id, 
                            media_id: data.join('|') 
                        }, () => {
                        this.setState({ confirmLoading: false });
                        if (refresh) {
                            refresh();
                        } else {
                            items.splice(index, 1);
                            setItems(items);
                        }
                        close();
                    }, () => {
                        this.setState({ confirmLoading: false });
                    }, 'info')
                }}
                onCancel={close}
            >
                <Select
                    showSearch
                    style={{ width: '80%', left: '10%' }}
                    placeholder="选择一个文件夹"
                    optionFilterProp="children"
                    onChange={this.handleChange.bind(this)}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                    {itemDom}
                </Select>
            </Modal>
        );
    }
}
export default Form.create({})(RegistrationForm);

