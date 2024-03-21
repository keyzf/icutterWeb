/* 高级操作 音频 */
import React from 'react';
import { Tooltip, Slider, InputNumber } from 'antd';
import say from '@/database/local_language';

export default class Top extends React.Component {

    render() {
        let volume = this.props.volume;
        let audio_fade = this.props.audio_fade;
        let lockVoiceFade = this.props.lockVoiceFade;
        let execute = this.props.execute;
        let fade_animate = this.props.fade_animate;

        let _start = 0, _end = 0;
        if (audio_fade.length > 2) {
            if (audio_fade[1].visibility !== audio_fade[0].visibility) {
                _start = (audio_fade[1].time_point - audio_fade[0].time_point).toFixed(2) * 1;
            }
            if (audio_fade[audio_fade.length - 1].visibility !== audio_fade[audio_fade.length - 2].visibility) {
                _end = (audio_fade[audio_fade.length - 1].time_point - audio_fade[audio_fade.length - 2].time_point).toFixed(2) * 1;
            }
        }
        return (<ul className='show'>
            <li>
                <div className="name">{say('main', 'volume')}</div>
                <div className="operation">
                    <div>
                        <Slider min={0} max={100} style={{ width: 150 }}
                            onChange={(value) => {
                                execute(value, 'volumeStart');
                            }}
                            value={volume.value} />
                        <InputNumber size={'small'} min={0} max={100}
                            value={volume.value}
                            onChange={(value) => {
                                execute(value, 'volumeStart');
                            }}
                        />
                    </div>
                </div>
                <div className="back">
                    <Tooltip title={say('main', 'reset')}>
                        {/* <span onClick={()=>{
                            execute(100, 'volumeStart');
                        }} className="ico-opera ico iconfont icon-chongzhi">
                        </span>*/}
                    </Tooltip>
                </div>
            </li>
            <li className="ani">
                <div className="name">{say('main', 'fade')}</div>
                <div className="operation">
                    <div>
                        <span
                            className="start">{say('main', lockVoiceFade ? 'fadeIn' : 'time')}</span>
                        <Slider min={0} max={5} step={0.5} style={{ width: 150 }}
                            onChange={(value) => {
                                execute(value, 'voiceFadeStart');
                            }}
                            value={_start} />
                        <InputNumber size={'small'} min={0} max={5} step={0.5}
                            value={_start}
                            onChange={(value) => {
                                execute(value, 'voiceFadeStart');
                            }}
                        />
                    </div>
                    <div style={{ display: lockVoiceFade ? 'flex' : 'none' }}>
                        <span className="start">{say('main', 'fadeOut')}</span>
                        <Slider min={0} max={5} step={0.5} style={{ width: 150 }}
                            onChange={(value) => {
                                execute(value, 'voiceFadeEnd');
                            }}
                            value={_end} />
                        <InputNumber size={'small'} min={0} max={5} step={0.5}
                            value={_end}
                            onChange={(value) => {
                                execute(value, 'voiceFadeEnd');
                            }}
                        />
                    </div>
                </div>
                {/* aaaaaa */}
                {/* <div className="back">
                        <span title={say('main', 'animation')}
                              className={"ico-opera ico-btn " + (lockVoiceFade ? 'current' : '')}
                              onClick={fade_animate}>{say('main', 'animation')}</span>
                        <Tooltip title={say('main', 'reset')}>
                        </Tooltip>
                    </div> */}
            </li>
        </ul>

        );
    }
}