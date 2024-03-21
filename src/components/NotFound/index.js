import React, { Component } from 'react';
import { Button } from 'antd';
import img from '@/images/404.png';

class NotFound extends Component {
    backHome = () => {
        this.props.history.replace('/')
    }

    render() {
        return (
            <div
                style={{
                    textAlign: 'center',
                    height: '100%',
                    background: '#ececec',
                    overflow: 'hidden'
                }}
            >
                <img style={{ width: 450, marginTop: 100 }} src={img} alt="404" />
                <p style={{ marginTop: 50 }}>
                    <Button type="primary" onClick={this.backHome}>返回首页</Button>
                </p>
            </div>
        )
    }
}

export default NotFound
