import React from 'react';
import say from '@/database/local_language'
import Loading from "@/components/Loading";
export default class Dialog extends React.Component {
    render() {
        let win = this.props.setting || {};
        if (win && win.status && win.status === 'loading') {
            // win.title='';
            win.form = (
                <div className="cell" >
                    <span>{say('main', 'waiting')}…</span>
                    <div className="card">
                        <Loading />
                    </div>
                </div>);
        }
        if (win && !win.form) {
            win.form = (
                <ul>
                    <li>{win.msg}</li>
                    <li>
                        <span className="btn" onClick={win.close}>{say('main', 'confirm')}</span>
                    </li>
                </ul>);
        }
        return (
            <div name={this.props.refresh} className={"dialog " + win.setting} style={{ zIndex: win && win.status && win.status === 'loading' ? 9999 : 999 }}>
                <div className="shadow" onClick={win.close}> </div>
                {!win.close ? <div className="shadow" onClick={win.close}> </div> : ''}
                <div className="scope">
                    <div className="win" style={{ height: (win.height || 200) + 'px', width: (win.width || 400) + 'px', marginTop: (win.top || 30) + 'vh' }}>
                        <div className={"title " + (win.status === 'loading' ? 'loading' : '')}>
                            <span>{win.title || say('main', 'reminder')}</span>
                            {win.close ? <span className="close" onClick={win.close}> </span> : ''}
                        </div>
                        <div className="main" style={win.mainStyle}>
                            {win.form}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}