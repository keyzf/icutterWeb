/* 全局方法 路由全局配置及配置一级路由 */
import React from 'react'
import {
    Route,
    BrowserRouter as Router,
    Switch,
} from 'react-router-dom';
import Loadable from 'react-loadable';
import { ConfigProvider } from 'antd';
import 'antd/dist/antd.css';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { createBrowserHistory } from 'history';
import 'video.js/dist/video-js.css';
import './css/style-blue.scss';
import { set_refresh } from "@/channel/local_language";
import uploading from '@/channel/clipFileUpload';
import Login from './Home/login';
import Load from './pages/Load';
import into from './pages/Enter';
import App from './App'
import './css/iconfont/iconfont';


const history = createBrowserHistory();
let re = '';
let delay = 300;
let unloadMsg = '有文件在上传中，确认退出吗?';
window.onbeforeunload = onbeforeunload_handler;
function onbeforeunload_handler() {
    if (uploading.getCourse()) {
        return unloadMsg;
    }
}
const Issue = Loadable({
    loader: () => import('./pages/Issue'),
    loading: () => <div>Loading...</div>,
    delay: delay,
});
const Online = Loadable({
    loader: () => import('./pages/Online'),
    loading: () => <div>Loading...</div>,
});
setTimeout(() => {
    Online.preload();
    Issue.preload();
}, 600);
function routeFilter(dom, props) {
    if (!localStorage.signature) {
        history.push('/login');
        return <Login {...props} />
    } else {
        return dom
    }
}
export default class BasicExample extends React.Component {
    componentDidMount() {
        set_refresh(() => {
            this.setState({ re: true })
        })
    }
    render() {
        return (
            <ConfigProvider locale={zhCN} >
                <Router basename={localStorage.setpath ? localStorage.setpath + '/' : '/'} history={history} re={re}>
                    <Switch>
                        {/*根路径*/}
                        <Route exact path="/" render={(props) => {
                            let dom = '';
                            if (localStorage.pure && localStorage.signature) {
                                dom = (<App  {...props} />)
                            } else if (localStorage.pure) {
                                dom = (<Login  {...props} />)
                            }
                            return dom
                        }} />
                        <Route path="/login" component={Login} />
                        {/*中间件*/}
                        <Route path="/enter" component={into} />
                        <Route path="/load" component={Load} />
                        {/*视频编辑系统*/}
                        <Route path="/online" render={(props) => routeFilter(<Online  {...props} />, props)} />
                        <Route path="/issue" render={(props) => routeFilter(<Issue  {...props} />, props)} />
                        <Route path="/hub" component={App} />
                    </Switch>
                </Router>
            </ConfigProvider>
        );
    }
}

