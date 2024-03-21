/* 素材列表 (素材 文字 过渡  音乐 贴图 字幕) */
import React from 'react';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/slider';
import 'jquery-ui/ui/effect';
import { Select, Input, Tooltip, Popover } from 'antd';
import channel from '@/channel';
import say from '@/database/local_language';
import { getDuration, getSize } from '@/utils/handy';
import { LoadMore } from "@/utils/pages";
import VideoPlayer from '@/components/VideoPlayerHls';
import uploading from '@/channel/clipFileUpload';
import { dragStop, getConfig, test as testConfig } from "../trackDetail/online-configs";
import renderUnit from "../trackDetail/render-unit";
import { initUnit } from "../trackDetail/init-unit";
import Subtitles from './Subtitles';
import SubtitlesStyle from './SubtitlesStyle';

const Search = Input.Search;
const Option = Select.Option;
let dir_id = 0;
let type = 'get_media_list';
let media_type = 'all';
let media_type_name = say('main', 'all');
let stream = '';
let searchThing = '';
let auto_refresh = '';
let duration = 0;
let _mater_top_list = [
    /*{type:0,name:'媒体'},*/
    {
        code: 1, name: say('main', 'material'), ico: 'icon-sucai-weixuanzhong', icoSel: 'icon-sucai-xuanzhong',
        children: [{ code: 11, name: '项目素材' }, { code: 12, name: '我的素材' }, { code: 13, name: '媒资素材' }]
    },
    { code: 2, name: say('main', 'text'), ico: 'icon-wenzi-weidianji', icoSel: 'icon-wenzi-dianji' },
    { code: 3, name: say('main', 'trans'), ico: 'icon-guoduweidianji', icoSel: 'icon-guodu-dianji' },
    { code: 4, name: say('main', 'music'), ico: 'icon-yinxiao-weidianji', icoSel: 'icon-yinxiao-dianji' },
    { code: 5, name: say('main', 'graphics'), ico: 'icon-tietu-weidianji', icoSel: 'icon-tietu-dianji' },
    { code: 6, name: say('main', 'subtitles'), ico: 'icon-zimu-weidianji', icoSel: 'icon-zimu-dianji' },
    // {code:7,name:'主题',ico:'icon-zhuti',icoSel:'icon-zhuti-h'},
];
export default class MainList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show_cloud: false, // 显示网络素材弹框
            show_cloudSvg: false, // 显示视觉中国素材弹框
            data_list: [],
            mater_top_current: 1,
            refresh: true,
            importList: {},
            delete: {},
            uploadBuffer: [],
            value: 0,
            showSearch: false, // 是否显示搜素
            showSubtitlesStyle: false, // 是否显示字幕样式
            text_info: {}, // 默认无时的样式
            accountnName: '' // 当前用户名
        };
    }
    openRecord() {
        this.props.record(dir_id)
    }

    componentWillMount() {
        channel('get_userInfo', '', (re) => {
            this.setState({ accountnName: re.name || '' })
        }, '', 'info')
    }
    componentDidMount() {
        this.refresh_mater_top(_mater_top_list[0]);
        setTimeout(() => {
            if (type === 'get_project_material') {
                this.refresh_mater_top(_mater_top_list[0]);
            }
        }, 3000);
        // uploading.refresh(this.refreshUpload);
        this.state.sub_language = 'zh';
        uploading.refresh((files) => {
            this.refreshUpload(files);
        });
    }
    componentWillUnmount() {
        clearTimeout(auto_refresh);
        stream.stop && stream.stop();
        uploading.refresh();
    }
    getVideoList(stager) {
        if (stager) {
            this.setState({ show_cloudSvg: true });
        } else {
            this.setState({ show_cloud: true });
        }
    }
    refreshUpload(files) {
        console.info(files);
        if (this.props.location.pathname !== '/online') {
            return;
        }
        if (files) {
            let temp = [];
            for (let i = 0; i < files.length; i++) {
                if (!files[i].done && !files[i].cancel_upload && ((type === 'get_media_list' && !files[i]['project_id']) || (type === 'get_project_material' && files[i]['project_id']))) {
                    temp.push(files[i]);
                }
            }
            let array = [];
            temp.forEach((u, i) => {
                // u['used']=this.props.used_list[u.media_id]&&type==='get_project_material';
                array.push(initUnit(u));
            });
            this.setState({ 'uploadBuffer': array });
            this.setDrag();
        } else {
            this.refreshing();
        }
    }

    refreshing() {
        if (this.props.location.pathname !== '/online') {
            return;
        }

        let url = 'get_medias', subtitles = '';
        let data = {
            m_type: type,
            dir_id: dir_id || 0,
            size: 50,
        };
        switch (type) {
            case 'get_project_material':
                url = type;
                data = {
                    project_id: this.props.project_id,
                    media_type: media_type,
                    name: searchThing,
                    m_type: 0,
                    dir_id: dir_id || 0
                };
                break;
            case 'get_media_list':
                url = type;
                data = {
                    media_type: media_type,
                    name: searchThing,
                    m_type: 0,
                    dir_id: dir_id || 0
                };
                break;
            case 'get_system_material':
                url = "get_media_source_list";
                data = {
                    size: 50
                }; break;
            case 'subtitles':
                url = '';
                break;
            case 'graphics':
                data = {
                    media_type: 'all',
                    m_type: 1,
                    dir_id: dir_id || 0
                };
                break;
        }
        if (url === subtitles) {

        } else {
            if (data.dir_id === '_solo') {
                url = url + '_solo';
                data.dir_id = 0;
            }
            new LoadMore(url, data, (re) => {
                clearTimeout(auto_refresh);
                for (let i = 0; i < re.length; i++) {
                    if (re[i].status === 0 || re[i].status === 4 || re[i].status === 6) {
                        if (re[i].add_time && new Date() - new Date(re[i].add_time) < 1000 * 60 * 60 * 5) {
                            auto_refresh = setTimeout(() => {
                                this.refreshing();
                            }, 5000);
                            break;
                        }
                    }
                }
                this.state.data_list = re;
                this.renderData(re)
            })
        }
    }
    renderData(list) {
        let re = list || this.state.data_list;
        if (type !== 'get_project_material' && !list) return;
        let array = [];
        let _type = '', _duration = '';
        switch (type) {
            case 'text':
                _type = 'text';
                _duration = 8;
                break;
            case 'transition':
                _type = 'transition';
                _duration = 1;
                break;
        }
        if ((type === 'get_media_list' || type === 'get_project_material')) { // 素材
            let files = uploading.getFiles();
            let array = [];
            for (let i = 0; i < files.length; i++) {
                if (((type === 'get_media_list' && !files[i]['project_id']) || (type === 'get_project_material' && files[i]['project_id'])) && (!files[i].done) && (!files[i].cancel_upload)) {
                    let u = files[i];
                    // u['used']=this.props.used_list[u.media_id]&&type==='get_project_material';
                    array.push(initUnit(u));
                    console.info('refreshdata');
                    console.info(files[i])
                }
            }
            this.state.uploadBuffer = array;
        } else {
            this.state.uploadBuffer = [];
        }
        // 文字，过滤， 音乐，贴图，字幕，素材
        re.forEach((u, i) => {
            u['media_id'] = (u['media_id'] || u['id']).toString();
            for (let _i in u) {
                u[_i.replace(/([A-Z])/g, "_$1").toLowerCase()] = u[_i];
            }
            if (u.status !== 3) { // status===3 上传中刷新页面， 此状态页面不显示
                let videoJsOptions = {};
                u.media_type = u.media_type || _type;
                u.duration = u.duration || _duration;
                let uploading = 'can';
                switch (u.media_type) {
                    case 'video': uploading = ((u.media_url && u.media_url.toLocaleLowerCase().indexOf('.hls') > 0) || u.preview_mp4 || u.preview_hls) ? 'can' : 'cannot'; break;
                    case 'image': uploading = ((u.media_url && (u.media_url.toLocaleLowerCase().indexOf('jpg') > 0 || u.media_url.toLocaleLowerCase().indexOf('.png') > 0 || u.media_url.toLocaleLowerCase().indexOf('.bmp') > 0 || u.media_url.toLocaleLowerCase().indexOf('.jpeg') > 0)) || u.status === 1) ? 'can' : 'cannot'; break;
                    case 'audio': uploading = u.preview_mp3 || u.audioPreviewMp3 ? 'can' : 'cannot'; break;
                    case 'text': if (u.sub_type === 'animation') { u['preview_mp4'] = u.mp4_url || ''; u.media_url = u.json_url }; break;
                }
                if (u.sub_type === 'animation') {
                    videoJsOptions = {
                        preload: 'auto',  // 预加载
                        bigPlayButton: false,  // 大按钮
                        autoplay: true,   // 自动播放
                        controls: false,  // 是否开启控制栏
                        aspectRatio: "16:9",
                        width: '100%',
                        muted: true, // 是否静音
                        playbackRates: [2], // 播放倍速
                        loop: true, // 是否循环播放
                        sources: [{
                            src: u.mp4_url,
                            type: 'video/mp4'
                        }]
                    };
                }
                if (type !== 'graphics' || u.media_type !== 'audio') {
                    let dom = (<div key={(u.media_id || '')}
                        data-duration={u.duration ? parseInt(u.duration * 25) / 25 : ''}
                        data-mediaId={u.media_id}
                        data-mediaType={u.media_type}
                        data-mediaUrl={u.media_url}
                        data-thumbnail={u.thumbnail}
                        title={u.name ? u.name : ''}
                        data-name={u.name ? u.name : ''}
                        data-previewHls={u.preview_hls ? u.preview_hls : ''}
                        data-previewMp4={u.preview_mp4 ? u.preview_mp4 : ''}
                        data-previewMp3={u.preview_mp3 ? u.preview_mp3 : ''}
                        data-videoPreviewImg={u.video_preview_img}
                        data-audioPreviewImg={u.audio_preview_img}
                        data-uploading={uploading}
                        data-transType={u.trans_type ? u.trans_type : ''}
                        data-subType={u.sub_type ? u.sub_type : ''}
                        data-transName={u.name ? u.name : ''}
                        data-startTime={0}
                        data-endTime={u.duration ? parseInt(u.duration * 25) / 25 : 5}
                        data-startRange={0}
                        data-endRange={u.duration ? parseInt(u.duration * 25) / 25 : 5}
                        className={(type === 'get_media_list' ? 'can-del ' : ' ') + (type === 'get_project_material' && !this.props.used_list[u.media_id] ? 'can-del project-mater ' : ' ') + (u.media_type === 'transition' ? 'mater tran' : 'mater')}>
                        <div className="pic">
                            {
                                u.media_type === 'audio'
                                    ? <span className='icoImg ico iconfont icon-audio' />
                                    : <img src={u.thumbnail ? u.thumbnail : ''} alt="" />
                            }
                            {/*{
                                    u.sub_type === 'animation'&&u.gif_url?<img className="gif-preview" src={u.gif_url} alt=""/>:''
                                }*/}
                            {
                                u.sub_type === 'animation' ? <div className="gif-preview"><VideoPlayer id={"video" + i} {...videoJsOptions} /></div> : ''
                            }
                            <span className={"out_type status status-" + u.status}>{u.status_cn}</span>
                            {u.duration && u.media_type === 'video' ? <p className="duration"><span className='ico iconfont  icon-yingpiangui'> </span>{getDuration(u.duration)} </p> : ''}
                            {u.media_type === 'image' ? <p className="duration"><span className='ico iconfont icon-tupianicon'> </span> </p> : ''}
                            {u.duration && u.media_type === 'audio' ? <p className="duration">{getDuration(u.duration)} </p> : ''}
                            {u.media_id && u.media_id.indexOf('VCG') !== -1 ? <p className="copyright_ico"><span className='ico iconfont icon-banquan'> </span> </p> : ''}
                            {this.props.used_list[u.media_id] && type === 'get_project_material' ? <p className="used"> </p> : ''}
                            {!this.props.used_list[u.media_id] && type === 'get_project_material' || type === 'get_media_list' ? (<p className="c-p online-material-del"
                                onClick={() => {
                                    this.props.deleteMedia(u.media_id, type);
                                }}><span className='ico iconfont icon-shanchu'> </span> </p>) : ''}
                        </div>
                        <p className="name">{u.name}</p>
                    </div>);

                    if (type === 'get_system_material') {
                        dom = (
                            <Popover key={(u.media_id || '')} overlayClassName={'title-tips'} color={'gray'} placement="right"
                                content={(<div className="">
                                    <p>分辨率:{`${u.width} * ${u.height}`}</p>
                                    <p>
                                        大小:{getSize(u.content_length)}
                                    </p>
                                    <p>
                                        上传人:{this.state.accountnName}
                                    </p>
                                    <p>
                                        上传时间:{u['add_time']}
                                    </p></div>)} trigger="hover">
                                {dom}
                            </Popover>)
                    }
                    array.push(dom)
                }
            }
        });
        this.setState({ items: array });
        this.setDrag();
    }
    setDrag() {
        let that = this;
        setTimeout(() => {
            let $control = $('.control .pathway-box');
            $(".material-main-list > div.mater ").each((k, v) => {
                if ($(v).attr('data-uploading') !== 'cannot') {
                    // if(true){
                    $(v).draggable({
                        cancel: "a.ui-icon", // 点击一个图标不会启动拖拽
                        cursorAt: { top: 20, left: 20 },
                        helper: (e, u) => {
                            let parent = $(document.createElement('div'));
                            parent.css({ margin: '6px 13px' });
                            let par = $(document.createElement('div'));
                            $('.focused').removeClass('focused');
                            par.addClass('drag-layer');
                            par.append($(e.currentTarget).clone().removeClass('mater').addClass('focused')
                                .addClass('mater-helper').html('<div class="clip-item-thumbs"> </div><div class="trim trimL"></div><div class="trim trimR"></div>'));
                            parent.append(par);
                            return parent
                        },
                        snapMode: 'inner',
                        snap: '.mater-helper,.pathway',
                        scope: 'maters',
                        scroll: false,
                        addClasses: false,
                        appendTo: ".flex-column",
                        // snapMode: "outer",
                        delay: 100,
                        snapTolerance: that.props.auto_indent ? 10 : 0,
                        start: function (event, ui) {
                            let unit = ui.helper.find('.mater-helper');
                            renderUnit(unit, that.props.unit_length, that.props.unit_time);
                            dragStop();
                            setTimeout(() => {
                                let media_id = unit.attr('data-mediaid');
                                let data = unit.attr('data-mediaurl') || '';
                                if (media_id.indexOf('VCG') >= 0 && data.indexOf('[') === 0) {
                                    channel('import_plat_media', {
                                        plat: 'VCG',
                                        project_id: that.props.project_id || '',
                                        data: data
                                    },
                                        () => {

                                        })
                                }
                            })
                        },
                        drag: function (t, ui) {
                            if (ui.helper.hasClass('license')) {
                                let obj = ui.helper.find('.mater-helper');
                                let offset = obj.offset();
                                let ct = $control.offset().top;
                                let pt = $control.find('.pathway').eq(0).offset().top;
                                let ut = offset.top;
                                let cl = $control.offset().left;
                                let pl = $control.find('.pathway').eq(0).offset().left;
                                let ul = offset.left;
                                let duration = obj.attr('data-duration');
                                let top = offset.top - $control.offset().top;
                                let $left = ul - cl;
                                // if ($left < 0) {
                                //     $(this).draggable("option", "cursorAt", {left: 10, top: 10});
                                // }
                                setTimeout(() => {
                                    if ($left >= 0) {
                                        that.props.set_time_line_now($left);
                                    }
                                    let left = $left - that.props.time_line_start;
                                    let now = left / that.props.unit_length * that.props.unit_time;
                                    testConfig(obj, now, now + duration * 1, Math.round(top / 36.5), that.props.auto_indent ? that.props.unit_time / that.props.unit_length : 0, 'replace');
                                });
                                // if(ct-pt)
                                //     ui.helper.css({
                                //         left: 0, top: 0,
                                //         position: 'absolute'
                                //     })
                                if (ut - ct >= 5 && ul - cl >= 0) {
                                    if ((ut - pt) % 38 === 0) {
                                        // $(this).draggable( "option", "grid", [ 1, 61 ] );
                                    }
                                    $control.find('.pathway').each(function (k, v) {
                                    })
                                }
                            }
                        },
                        cursor: "move"
                    });
                }
            })
        })
    }
    getMediaType(param) {
        media_type = param;
        switch (media_type) {
            case 'all':
                media_type_name = say('main', 'all');
                break;
            case 'video':
                media_type_name = say('main', 'video');
                break;
            case 'audio':
                media_type_name = say('main', 'audio');
                break;
            case 'image':
                media_type_name = say('main', 'image');
                break;
        }
        this.refreshing()

    }
    getMaterial(e, id, code) {
        $('.material-main-left').find('p').removeClass('current');
        e && ($(e.target).children('p').length ? $(e.target).children('p').addClass('current') : $(e.target).addClass('current'));
        searchThing = '';
        media_type = 'all';
        this.state.showSearch = false;
        media_type_name = say('main', 'all');
        switch (code) {
            case 11:
                type = 'get_project_material';
                break;
            case 12:
                type = 'get_media_list';
                break;
            case 13:
                type = 'get_system_material';
                break;
            case 2:
                type = 'text';
                break;
            case 3:
                type = 'transition';
                break;
            case 4:
                type = 'audio';
                break;
            case 5:
                type = 'graphics';
                break;
            case 6: type = 'subtitles';
                break;
            case 7: type = 'get_theme_list';
                break;
        }
        dir_id = id;
        this.refreshing();
    }
    refresh_mater_top(v) {
        switch (v.code) {
            case 1:
                type = 'get_project_material';
                this.render_mater_second_top([
                    { id: 11, name: "项目素材" },
                    { id: 12, name: "我的素材" },
                    { id: 13, name: "媒资素材" }
                ], v.code);
                return;
            case 6: type = 'subtitles'; this.setState({ files: [] }); return;
            default: type = 'get_medias'; break;
        }
        channel('get_directory_list', {
            dir_type: v.code
        }, (response) => {
            this.render_mater_second_top(response, v.code);
        }, () => {
            this.render_mater_second_top([]);
        })
    }
    render_mater_second_top(param, code) {
        let array = [];
        let re = param || [];
        re.forEach((u, i) => {
            array.push(<li key={u.id} id={u.id} onClick={(e) => {
                this.getMaterial(e, u.id, code === 1 ? u.id : code)
            }
                // }><p className={i===0?'current':''}>
            }><p>
                    {u.name}</p></li>)
        });
        this.setState({ files: array });
        setTimeout(() => {
            $('.material-main-left li').eq(0).click();
        }, 200)

    }
    render() {
        let _record = <Tooltip className='hover-box'
            onClick={() => {
                this.openRecord();
            }}>
            <span className="dis-hover ico iconfont icon-luyin c-p"> </span>
            <span className="on-hover">录音</span>
        </Tooltip>;
        let _import = <Tooltip className='hover-box'
            onClick={() => {
                this.getVideoList('stager');
            }}>
            <span className="dis-hover ico iconfont icon-sucaiku c-p"> </span>
            <span className="on-hover"> 版权素材 </span>
        </Tooltip>;
        let _converge = <Tooltip className='hover-box'
            onClick={() => {
                this.getVideoList();
            }}>
            <span className="dis-hover ico iconfont icon-wangluosucai c-p"> </span>
            <span className="on-hover">网络素材</span>
        </Tooltip>;
        let _upload = <Tooltip className='hover-box'
            onClick={() => {
                uploading.project_id = type === 'get_project_material' ? this.props.project_id : '';
                $('#file').click();
            }}>
            <span className="dis-hover ico iconfont icon-shangchuan c-p" > </span>
            <span className="on-hover">上传</span>
        </Tooltip>;
        let _search = (this.state.showSearch
            ? <Search size={'small'} style={{ width: 180 }}
                placeholder={say('main', 'search')}
                onSearch={(value) => {
                    if (!value) {
                        this.state.showSearch = false;
                    }
                    searchThing = value;
                    this.refreshing();
                }}
            />
            : <span className='searchBtn c-p'
                onClick={() => {
                    this.setState({ showSearch: true });
                }}
            >
                <span className='ico iconfont icon-sousuo'> </span>
                <span>搜索</span>
            </span>);
        let _tabs = <Select value={media_type} style={{ width: 62 }} size={'small'} onChange={(val) => {
            this.getMediaType(val)
        }}>
            <Option value="all">{say('main', 'all')}</Option>
            <Option value="video">{say('main', 'video')}</Option>
            <Option value="audio">{say('main', 'audio')}</Option>
            <Option value="image">{say('main', 'image')}</Option>
        </Select>;
        let _mater_top_dom = [];
        _mater_top_list.map((v, k) => {
            let current = this.state.mater_top_current;
            _mater_top_dom.push(<li key={k} type={v.code} className={current === v.code ? 'current' : ''} onClick={() => {
                this.state.mater_top_current = v.code;
                if (v.code === 6) {
                    type = 'subtitles';
                    this.setState({ files: [] });
                } else {
                    this.refresh_mater_top(v);
                }
            }}>{current === v.code ? <span className={'ico iconfont ' + v.icoSel}> </span> : <span className={'ico iconfont ' + v.ico}> </span>}{v.name}</li>)
        });
        let left_width = 100;
        let select_dom = false;
        let items = this.state.uploadBuffer.concat(this.state.items);
        switch (this.state.mater_top_current) {
            case 0: select_dom = true; break;
            case 1: select_dom = type !== 'get_system_material'; break;
            case 7: left_width = 0; break;
        }
        return (
            <div className="material source-list">
                <div className="material-top">
                    <ul className='material-top-first'>
                        {_mater_top_dom}
                    </ul>
                </div>
                <Subtitles
                    playVideo={this.props.playVideo}
                    setTransToAudio={this.props.setTransToAudio}
                    transToAudio={this.props.transToAudio}
                    visible={this.state.mater_top_current === 6}
                    project_id={this.props.project_id}
                    subtitles_config={this.props.subtitles_config}
                    subtitles_change={this.props.subtitles_change}
                    refreshData={this.refreshing.bind(this)}
                    setShowStyle={() => {
                        let _config = getConfig();
                        this.state.text_info = _config['text_info'];
                        this.props.setShowSubtitlesStyle(true)
                        this.setState({ 'showSubtitlesStyle': true })
                    }
                    }
                />
                {this.state.mater_top_current === 6 ? '' :
                    // this.state.mater_top_current ===4?
                    //     <Music
                    //         files={this.state.files}
                    //         items={this.state.items}
                    //
                    //     />:
                    <div className="material-main">
                        <div className={left_width ? "material-main-left show-l" : "material-main-left"} >
                            <ul style={{ marginLeft: 0 }}>
                                {this.state.files}
                            </ul>
                        </div>
                        <div className="material-main-right">
                            {select_dom ?
                                <div className="material-main-select select">
                                    <div>
                                        <div style={{ position: 'absolute', 'zIndex': '-1', marginLeft: '-88px', paddingLeft: '30px', width: '300px', opacity: 0 }} ><input onChange={() => {
                                            uploading.upload()
                                        }} type="file" id="file" multiple /></div>
                                        {_record}
                                        {_upload}
                                        {/*{_import}*/}
                                        {/*{_converge}*/}
                                    </div>
                                    <div>
                                        {_search}
                                        <span className='sort-box'>
                                            {_tabs}
                                        </span>
                                    </div>
                                </div> : ''}
                            <div className="material-main-box">
                                <div className="material-main-list">
                                    {select_dom ? items : this.state.items}
                                </div>
                            </div>
                        </div>
                    </div>}
                <SubtitlesStyle show={this.state.showSubtitlesStyle}
                    playVideo={this.props.playVideo}
                    text_info={this.state.text_info}
                    close={() => {
                        this.props.setShowSubtitlesStyle(false)
                        this.setState({ showSubtitlesStyle: false })
                    }}
                />
            </div>
        );
    }
}
