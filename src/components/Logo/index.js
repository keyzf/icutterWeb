import React from 'react';
import './index.scss';


export default class Logo extends React.Component {
    render() {

        return (<div className="Logo c-r" onClick={() => {
            this.props.history.push("/")
        }}>
            <img src={localStorage.logo ? localStorage.setpath + localStorage.logo : '/images/logo.png'} alt="" />
        </div>);
    }
}
