import React from 'react';
import {
    Route,
    Link,
} from 'react-router-dom';
import { Tooltip } from 'antd';
import channel from '@/channel';
import say from '@/database/local_language';
import { FullScreen, fullScreenCallback } from "@/utils/fullScreen";
import Account from '@/components/Accout';

const OldSchoolMenuLink = ({ label, to, activeOnlyWhenExact }) => (
    <Route path={to} exact={activeOnlyWhenExact} children={({ match }) => (
        <li className={match ? 'current' : ''}>

            <Link to={to}><span> </span>{label}</Link>
        </li>
    )} />
);
const logout = () => {
    channel('logout', {}, (re) => {
        localStorage.signature = '';
        window.location.href = (localStorage.setpath || '') + '/index';
    })
};
export default class Top extends React.Component {
    constructor(props) {
        super(props);
        this.state = { fullScreen: false, shortcut: '' };
    }

    componentDidMount() {
        fullScreenCallback((re) => {
            this.setState({ 'fullScreen': re })
        })
    }
    render() {
        let userInfo = this.props.userInfo;
        let configStatus = this.props.getConfigStatus();
        return (
            <div className="top onlineTop">
                <div className="p-a">
                    <Tooltip title={say('main', 'back')} onClick={this.props.goBack}>
                        <span className="goBack">
                            <span className="ico iconfont icon-fanhui"> </span>
                        退出
                        </span>
                    </Tooltip>
                    <span title={configStatus.name} className="projectName" >
                        {(this.props.is_template ? '模板名称：' : '项目名称：') + configStatus.name}
                        <Tooltip title={'重命名'} onClick={() => {
                        this.props.show_rename(configStatus.name);
                        }}>
                           <span className="ico iconfont icon-bianji" style={{marginLeft:4}}/>
                        </Tooltip>
                    </span>
                </div>
                <ul className="tab">
                    <li className="color-w">
                        <Tooltip title={this.props.fullScreen ? say('main', 'exitFullScreen') : say('main', 'fullScreen')} onClick={() => {
                            FullScreen();
                        }}>
                            <span><span className="ico iconfont icon-quanping ico-full"> </span>全屏</span>
                        </Tooltip>
                    </li>
                    <li className="color-w">
                        <Tooltip title={'快捷键'} onClick={() => {
                            this.props.show_shortcut();
                        }}>
                            <span><span className="ico iconfont icon-kuaijiejian ico-shortcut"> </span>快捷键</span>
                        </Tooltip>
                    </li>
                    <li className={configStatus.save ? "color-w" : ""}>
                        <Tooltip title={say('main', 'save') + '（Ctrl+S）'} onClick={this.props.saveConfig}>

                            <span><span className={"ico iconfont icon-baocun ico-save " + (configStatus.save ? "use" : 'useless')}> </span>保存</span>
                        </Tooltip>
                    </li>
                    <li className={configStatus.issue ? "issue can" : 'issue'}>
                        <Tooltip onClick={() => {
                            if (configStatus.issue) {
                                this.props.issueConfig();
                            }
                        }}>
                            <span>{this.props.is_template ? '' : <span className={"ico iconfont icon-fabu ico-save use"}> </span>} {this.props.is_template ? '合成模板' : '合成'}</span>
                        </Tooltip>
                    </li>
                    <li className="color-w">
                        <Account history={this.props.history} />
                    </li>
                    {/*       <li className="more">
                        <Dropdown overlay={<Menu className="dark-menu w-135" onClick={(key)=>{
                            console.info(key)
                            switch (key.key) {
                                case '1':this.props.openColophon();break;
                                case '2':this.props.show_shortcut();break;
                                case '3':break;
                                case '4':this.props.saveAsTempPro(true);break;
                                case '5':this.props.saveAsTempPro(false);break;
                            }
                        }}>
                            <Menu.Item key="1"><span className="ico iconfont icon-lishijilu"> </span>历史版本</Menu.Item>
                            <Menu.Item key="2"><span className="ico iconfont icon-kuaijiejian"> </span>快捷键</Menu.Item>
                            <Menu.Item key="3"><span className="ico iconfont icon-xinshouyindao"> </span>新手引导</Menu.Item>
                            {!this.props.is_template?<Menu.Item key="4"><span className="ico iconfont icon-tianjiashipin-dianji"> </span>保存为模板</Menu.Item>:''}
                            {this.props.is_template?<Menu.Item key="5"><span className="ico iconfont icon-tianjiashipin-dianji"> </span>使用该模板</Menu.Item>:''}
                        </Menu>}>
                            <span className="ico iconfont icon-more"> </span>
                        </Dropdown>

                        <div className="list">

                        </div>
                    </li>*/}
                </ul>
            </div>
        );
    }
}
