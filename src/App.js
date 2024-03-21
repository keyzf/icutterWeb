import React, { Component } from 'react';
import { Layout } from 'antd';
import Routes from './routes';
import routesConfig from '@/routes/config';
import SiderCustom from '@/components/SiderCustom';
import Top from '@/components/Top';

const { Content } = Layout

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: {}
        };
    }

    render() {
        const isCreate = this.props.history.location.pathname.indexOf('/hub') >= 0;
        return (
            <Layout style={{ minHeight: '100%' }}>
                <Top history={this.props.history} />
                <Layout>
                    {isCreate && <SiderCustom menus={routesConfig.menus} />}
                    <Layout style={{ marginLeft: isCreate ? 248 : 0 }}>
                        <Content>
                            <Routes />
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}

export default App
