/* 高级操作 变换*/
import React from 'react';
import { Button, Tooltip, Slider, InputNumber, Input, Switch } from 'antd';
import say from '@/database/local_language';

const ButtonGroup = Button.Group;

export default class Top extends React.Component {
    state = {
        start_scale: 1,
        end_scale: 1,
    }
    componentWillMount() {
        this.state.start_scale = this.props.transform.start_scale;
        this.state.end_scale = this.props.transform.end_scale;
    }
    shouldComponentUpdate(nP, nS) {
        (nP.start_scale !== this.props.start_scale) && (this.state.start_scale = nP.start_scale);
        (nP.end_scale !== this.props.end_scale) && (this.state.end_scale = nP.end_scale);
        return true;
    }

    render() {
        let transform = this.props.transform;
        let video_fade = this.props.video_fade;
        let execute = this.props.execute;
        let lockZoom = this.props.lockZoom;
        let lockPosition = this.props.lockPosition;
        let lockFade = this.props.lockFade;
        let selected_start = this.props.selected_start;
        let selected_end = this.props.selected_end;
        let to_start = this.props.to_start;
        let to_end = this.props.to_end;
        let zoom_animate = this.props.zoom_animate;
        let position_animate = this.props.position_animate;
        let fade_animate = this.props.fade_animate;
        let set_blurred = this.props.set_blurred;
        let type = this.props.type;
        return (<ul className='show'>
            <li>
                <div className="name">{say('main', 'rotation')}</div>
                <div className="operation">
                    <div>
                        <ButtonGroup>
                            <Tooltip title={say('main', 'counterclockwise')} onClick={() => {
                                execute(transform.rotation - 45, 'rotation');
                            }}>
                                <Button><span
                                    className="ico iconfont icon-zuoxuanzhuan"> </span></Button>
                            </Tooltip>
                            <Tooltip title={say('main', 'clockwise')} onClick={() => {
                                execute(transform.rotation + 45, 'rotation');
                            }}>
                                <Button><span
                                    className="ico iconfont icon-youxuanzhuan"> </span></Button>
                            </Tooltip>
                        </ButtonGroup>
                        <InputNumber min={-360} max={360} step={1} size={'small'}
                            value={transform.rotation}
                            onChange={(value) => {
                                execute(value, 'rotation');
                            }} />
                    </div>
                </div>
                <div className="back">
                    <Tooltip title={say('main', 'reset')}>
                        {/*<span onClick={() => {
                            execute(0, 'rotation');
                        }} className="ico-opera ico iconfont icon-chongzhi">
                        </span>*/}
                    </Tooltip>
                </div>
            </li>
            <li>
                <div className="name">{say('main', 'rollovers')}</div>
                <div className="operation">
                    <div>
                        <ButtonGroup>
                            <Tooltip title={say('main', 'horizontal')} onClick={() => {
                                let flip = 0;
                                switch (transform.flip) {
                                    case 0: flip = 2; break;
                                    case 1: flip = 3; break;
                                    case 2: flip = 0; break;
                                    case 3: flip = 1; break;
                                }
                                execute(flip, 'flip');
                            }}>
                                <Button
                                    style={{ color: transform.flip === 0 || transform.flip === 1 ? '#BFBFBF' : '#666666' }}><span
                                        className="ico iconfont icon-zuoyoujingxiang"> </span></Button>
                            </Tooltip>
                            <Tooltip title={say('main', 'vertical')} onClick={() => {
                                let flip = 0;
                                switch (transform.flip) {
                                    case 0: flip = 1; break;
                                    case 1: flip = 0; break;
                                    case 2: flip = 3; break;
                                    case 3: flip = 2; break;
                                }
                                execute(flip, 'flip');
                            }}>
                                <Button
                                    style={{ color: transform.flip === 0 || transform.flip === 2 ? '#BFBFBF' : '#666666' }}><span
                                        className="ico iconfont icon-shangxiajingxiang"> </span></Button>
                            </Tooltip>
                        </ButtonGroup>
                    </div>
                </div>
                <div className="back">
                    <Tooltip title={say('main', 'reset')}>
                        {/*<span onClick={() => {
                            execute(0, 'flip');
                        }} className="ico-opera ico iconfont icon-chongzhi">
                        </span>*/}
                    </Tooltip>
                </div>
            </li>
            <li className="ani">
                <div className="name">{say('main', 'zoom')}</div>
                <div className="operation">
                    <div>
                        <span className="start"
                            style={{ display: lockZoom ? 'inline-block' : 'none' }}>{say('main', 'start')}</span>
                        <Slider min={0.01} max={5} style={{ width: 150 }} step={0.01}
                            onChange={(value) => {
                                execute(value, 'zoomStart');
                                this.setState({ start_scale: transform.start_scale })
                            }} value={transform.start_scale} />
                        <InputNumber min={0.01} max={5} step={0.01} size={'small'}
                            value={this.state.start_scale}
                            onChange={(value) => {
                                let re = execute(value, 'zoomStart');
                                this.setState({ start_scale: re === '' ? value : transform.start_scale })
                            }}
                        />
                        {/*<input min={0.01} max={5} step={0.01} size={'small'}*/}
                        {/*defaultValue={transform.start_scale}*/}
                        {/*onPressEnter={(value) => {*/}
                        {/*execute(value, 'zoomStart');*/}
                        {/*}}*/}
                        {/*onBlur={(value) => {*/}
                        {/*execute(value, 'zoomStart');*/}
                        {/*}}*/}
                        {/*/>*/}
                        {lockZoom ?
                            <Tooltip title={say('main', 'toStart')}>
                                <span className="ico-opera ico iconfont icon-shubiaobianji"
                                    style={{ opacity: selected_start ? 0.6 : 1 }}
                                    onClick={to_start}> </span>
                            </Tooltip> : ''}
                    </div>
                    <div style={{ display: lockZoom ? 'flex' : 'none' }}>
                        <span className="start">{say('main', 'end')}</span>
                        <Slider min={0.01} max={5} style={{ width: 150 }} step={0.01}
                            onChange={(value) => {
                                execute(value, 'zoomEnd');
                                this.setState({ end_scale: transform.end_scale })
                            }} value={transform.end_scale} />
                        <InputNumber min={0.01} max={5} step={0.01} size={'small'}
                            value={this.state.end_scale}
                            onChange={(value) => {
                                let re = execute(value, 'zoomEnd');
                                this.setState({ end_scale: re === '' ? value : transform.end_scale })
                            }}
                        />
                        {lockZoom ?
                            <Tooltip title={say('main', 'toEnd')}>
                                <span className="ico-opera ico iconfont icon-shubiaobianji"
                                    style={{ opacity: selected_end ? 0.6 : 1 }} onClick={to_end}> </span>
                            </Tooltip> : ''}
                    </div>
                </div>
                {/* aaaaaa */}
                {/* <div className="back">
                    <span title={say('main', 'animation')}
                        className={"ico-opera ico-btn " + (lockZoom ? 'current' : '')}
                        onClick={zoom_animate}>{say('main', 'animation')}</span>
                    <Tooltip title={say('main', 'reset')}>
                    </Tooltip>
                </div> */}
            </li>
            <li className="ani">
                <div className="name">{say('main', 'position')}</div>
                <div className="operation">
                    <div>
                        <span className="start"
                            style={{ display: lockPosition ? 'inline-block' : 'none' }}>{say('main', 'start')}</span>
                        <span>X</span>
                        <InputNumber size={'small'}
                            value={transform.start_position_x}
                            onChange={(value) => {
                                execute(value, 'operationStartX');
                            }}
                        />
                        <span>Y</span>

                        <InputNumber size={'small'}
                            value={transform.start_position_y}
                            onChange={(value) => {
                                execute(value, 'operationStartY');
                            }}
                        />
                        {lockPosition ?
                            <Tooltip title={say('main', 'toStart')}>
                                <span className="ico-opera ico iconfont icon-shubiaobianji"
                                    style={{ opacity: selected_start ? 0.6 : 1 }}
                                    onClick={to_start}> </span>
                            </Tooltip> : ''}

                    </div>
                    <div style={{ display: lockPosition ? 'flex' : 'none' }}>
                        <span className="start">{say('main', 'end')}</span>
                        <span>X</span>
                        <InputNumber size={'small'}
                            value={transform.end_position_x}
                            onChange={(value) => {
                                execute(value, 'operationEndX');
                            }}
                        />
                        <span>Y</span>
                        <InputNumber size={'small'}
                            value={transform.end_position_y}
                            onChange={(value) => {
                                execute(value, 'operationEndY');
                            }}
                        />
                        {lockPosition ?
                            <Tooltip title={say('main', 'toEnd')}>
                                <span className="ico-opera ico iconfont icon-shubiaobianji"
                                    style={{ opacity: selected_end ? 0.6 : 1 }}
                                    onClick={to_end}> </span>
                            </Tooltip> : ''}
                    </div>
                </div>
                {/* aaaaaa */}
                {/*  <div className="back">
                    <span title={say('main', 'animation')}
                        className={"ico-opera ico-btn " + (lockPosition ? 'current' : '')}
                        onClick={position_animate}>{say('main', 'animation')}</span>
                    <Tooltip title={say('main', 'reset')}>
                    </Tooltip>
                </div> */}
            </li>
            <li className="ani">
                <div className="name">{say('main', 'opacity')}</div>
                <div className="operation">
                    <div>
                        <span className="start"
                            style={{ display: lockFade ? 'inline-block' : 'none' }}>{say('main', 'start')}</span>
                        <Slider min={0} max={100} style={{ width: 150 }}
                            onChange={(value) => {
                                execute(value, 'fadeStart');
                            }}
                            value={video_fade[0].visibility} />

                        <InputNumber size={'small'} min={0} max={100}
                            value={video_fade[0].visibility}
                            onChange={(value) => {
                                execute(value, 'fadeStart');
                            }}
                        />
                    </div>
                    <div style={{ display: lockFade ? 'flex' : 'none' }}>
                        <span className="start">{say('main', 'end')}</span>
                        <Slider min={0} max={100} style={{ width: 150 }}
                            onChange={(value) => {
                                execute(value, 'fadeEnd');
                            }}
                            value={video_fade[video_fade.length - 1].visibility} />
                        <InputNumber size={'small'} min={0} max={100}
                            value={video_fade[video_fade.length - 1].visibility}
                            onChange={(value) => {
                                execute(value, 'fadeEnd');
                            }}
                        />
                    </div>
                </div>
                {/* aaaaaa */}
                {/* <div className="back">
                    <span title={say('main', 'animation')}
                        className={"ico-opera ico-btn " + (lockFade ? 'current' : '')}
                        onClick={fade_animate}>{say('main', 'animation')}</span>
                    <Tooltip title={say('main', 'reset')}>
                    </Tooltip>
                </div> */}
            </li>
            {/* aaaaaa */}
            {/* {type === 'video' || type === 'image' ?
                <li>
                    <div className="name">背景模糊</div>
                    <div className="operation">
                        <div>

                        </div>
                    </div>
                    <div className="back ico-opera">
                        <Switch checked={transform.blurred || false} onChange={(value) => {
                            set_blurred(value, 'blurred');

                        }} />
                    </div>
                </li> : ''} */}
        </ul>
        );
    }
}