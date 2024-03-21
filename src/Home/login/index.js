import React from 'react';
import $ from 'jquery';
import { message } from 'antd';
import channel from '@/channel';
import './index.scss';

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loginCodeImg: "",
            ticket: ""
        };
    }

    componentWillMount() {
        $(window).scrollTop(0);
        this.getLoginCode();
    }

    getLoginCode (){
        channel('loginCode', '', (re) => {
            let img = "";
            let ticket = "";
            img = re.data && re.data.img;
            ticket = re.data && re.data.ticket;
            this.setState({ loginCodeImg: img, ticket });
        }, '', 'infoMessage')
    }

    login() {
        const { ticket } = this.state;
        let name = $('.username').val();
        let pass = $('.password').val();
        let loginCode = $('.login-code').val();
        if (!name) {
            message.warning('用户名不能为空！');
            return;
        }
        if (!pass) {
            message.warning('密码不能为空！');
            return;
        }
        if (!loginCode) {
            message.warning('验证码不能为空！');
            return;
        }
        channel('login', JSON.stringify({ 
             name: name,
             password: pass,
             randstr: loginCode,
             ticket: ticket,
             }), (re) => {
            localStorage.signature = re;
            localStorage.team = '';
            this.props.history.push('/hub/project');
        }, ()=>{
            this.getLoginCode();
        }, 'infoMessage')
    }
    render() {
        const { loginCodeImg } =  this.state;
        return (
            <div className="login-warp">
                <div className='login-content'>
                    <div className='login-left'></div>
                    <div className='login-right'>
                        <img src="/images/logo.png" height="50" width="auto" />
                        <ul>
                            <li><input className="username" placeholder="手机号/账号" type="text" /></li>
                            <li><input className="password"
                                onKeyDown={(e) => {
                                    if (e.keyCode === 13) {
                                        this.login();
                                    }
                                }}
                                onKeyUp={(e) => {
                                    e.target.value = e.target.value.replace(/[\u4e00-\u9fa5]/ig, '');
                                }}
                                placeholder="密码" type="password" />
                            </li>
                            <li><input className="login-code" placeholder="验证码" type="text"/>
                                <span className="codeImg" onClick={()=>{
                                    this.getLoginCode()
                                }}>
                                    <img src={`data:image/jpeg;base64,${ loginCodeImg }` } alt="点击获取" />
                                </span>
                            </li>
                            <li>
                                <span className="btn" onClick={() => {
                                    this.login();
                                }}>登录
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

