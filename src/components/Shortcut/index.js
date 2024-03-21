import React from 'react';
import say from '@/database/local_language';

export default class Dialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = { step: 0 };
    }

    render() {
        let win = this.props.setting;
        let ctrl = this.state.step ? 'ctrl' : 'cmd';
        let home = this.state.step ? 'Home' : 'fn + ←';
        let end = this.state.step ? 'End' : 'fn + →';
        return (
            <div className={"dialog guide " + win.setting}>
                <div className="shadow" onClick={win.close}> </div>
                <div className={"step shortcut-bg"} >
                    <div className="tab"><span onClick={() => {
                        this.setState({ step: 0 })
                    }} className={this.state.step === 0 ? 'current' : ''}><span className="ico ico-mac"> </span>MAC</span>
                        <span onClick={() => {
                            this.setState({ step: 1 })
                        }} className={this.state.step === 1 ? 'current' : ''}><span className="ico ico-windows"> </span>Windows</span></div>
                    <div className="detail">
                        <div>
                            <div className="unit" title={say('main', 'clip')}>
                                <div>
                                    {say('main', 'clip')}
                                </div>
                                <div>
                                    s
                                </div>
                            </div>
                            {/*<div className="unit" title={say('main','exitFullScreen')}>*/}
                            {/*<div>*/}
                            {/*{say('main','exitFullScreen')}*/}
                            {/*</div>*/}
                            {/*<div>*/}
                            {/*esc*/}
                            {/*</div>*/}
                            {/*</div>*/}
                            <div className="unit" title={say('main', 'pause/play')}>
                                <div>
                                    {say('main', 'pause/play')}
                                </div>
                                <div>
                                    space
                                </div>
                            </div>
                            {/* <div className="unit" title={'波纹剪'}>
                                <div>
                                    {'波纹剪'}
                                </div>
                                <div>
                                    {ctrl} + d
                                </div>
                            </div> */}
                            <div className="unit" title={say('main', 'copy')}>
                                <div>
                                    {say('main', 'copy')}
                                </div>
                                <div>
                                    Alt + {say('main', 'drag')}
                                </div>
                            </div>
                            <div className="unit" title={say('main', 'undo')}>
                                <div>
                                    {say('main', 'undo')}
                                </div>
                                <div>
                                    {ctrl} + z
                                </div>
                            </div>
                            <div className="unit" title={say('main', 'redo')}>
                                <div >
                                    {say('main', 'redo')}
                                </div>
                                <div>
                                    {ctrl} + shift + z
                                </div>
                            </div>
                            <div className="unit" title={say('main', 'delete')}>
                                <div>
                                    {say('main', 'delete')}
                                </div>
                                <div>
                                    delete/backspace
                                </div>
                            </div>
                            <div className="unit" title={'添加字幕'}>
                                <div>
                                    {'添加字幕'}
                                </div>
                                <div>
                                    {ctrl} + q
                                </div>
                            </div>
                            <div className="unit" title={say('main', 'toEnd')}>
                                <div>
                                    {say('main', 'autoZoom')}
                                </div>
                                <div>
                                    {ctrl} + A
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="unit" title={say('main', 'forwardByFrame')}>
                                <div>
                                    {say('main', 'forwardByFrame')}
                                </div>
                                <div>
                                    ↓
                                </div>
                            </div>
                            <div className="unit" title={say('main', 'rewindByFrame')}>
                                <div>
                                    {say('main', 'rewindByFrame')}
                                </div>
                                <div>
                                    ↑
                                </div>
                            </div>
                            <div className="unit" title={say('main', 'forwardBySeconds')}>
                                <div>
                                    {say('main', 'forwardBySeconds')}
                                </div>
                                <div>
                                    →
                                </div>
                            </div>
                            <div className="unit" title={say('main', 'rewindBySeconds')}>
                                <div>
                                    {say('main', 'rewindBySeconds')}
                                </div>
                                <div>
                                    ←
                                </div>
                            </div>
                            <div className="unit" title={say('main', 'zoomOut')}>
                                <div>
                                    {say('main', 'zoomOut')}
                                </div>
                                <div>
                                    -（—）
                                </div>
                            </div>
                            <div className="unit" title={say('main', 'zoomIn')}>
                                <div>
                                    {say('main', 'zoomIn')}
                                </div>
                                <div>
                                    =（+）
                                </div>
                            </div>
                            <div className="unit" title={say('main', 'toStart')}>
                                <div>
                                    {say('main', 'toStart')}
                                </div>
                                <div>
                                    {home}
                                </div>
                            </div>
                            <div className="unit" title={say('main', 'toEnd')}>
                                <div>
                                    {say('main', 'toEnd')}
                                </div>
                                <div>
                                    {end}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}