import React from 'react';
import { Select } from 'antd';
import channel from '@/channel';
import say from '@/database/local_language';
import './index.scss'

const Option = Select.Option;

export default class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = { accountnName: '' };
    }

    componentWillMount() {
        channel('get_userInfo', '', (re) => {
            this.setState({ accountnName: re.name || '' })
        }, '', 'info')
    }
    loginout() {
        channel('logout', '', (re) => {
            localStorage.signature = '';
            this.props.history.push('/hub/project');
        }, '', 'info')
    }
    render() {
        const { accountnName } = this.state
        return (
            <div className={`${accountnName ? 'account' : ''}`}>
                {accountnName ? <Select value={accountnName} style={{ width: 120 }} onChange={(val) => {
                    if (val === "loginout") {
                        this.loginout()
                    }
                }}>
                    <Option value="loginout"><span className="ico iconfont icon-fanhui" onClick={() => {
                    }}> </span>{say('main', 'loginout')}</Option>
                </Select> : null}
            </div>
        );
    }
}
