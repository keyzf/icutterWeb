import React from 'react';
import Logo from "@/components/Logo";
import Account from '@/components/Accout';
import './index.scss';

export default class Top extends React.Component {
    render() {
        return (
            <div className="Top">
                <Logo history={this.props.history} />
                <Account history={this.props.history} />
            </div>
        );
    }
}
