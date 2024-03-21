import React from 'react';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/slider';
import 'jquery-ui/ui/effect';
import { message, Checkbox, Select, Input, Button, Switch } from 'antd';
import channel, { scope } from '@/channel';
import say from '@/database/local_language';
import plat_case from '@/database/plat_case';
import { cloneConfig, encrypt } from '@/utils/handy';
import { uploadSnapshot, dataURLtoBlob } from '@/utils/handy';
import short from '@/images/defult.png';
import imgBg from '@/images/img-bg.jpg';
import Dialog from '@/components/Dialog';
import { confirm } from "@/components/Modal";

const TextArea = Input.TextArea;
let blob, uploadBlob = '', logoBlob = '';
let out_type_obj = localStorage.pure ? {
    'AUDIO': { k: 'AUDIO', v: say('main', 'audioSolo'), paid: true },
    '360P': { k: '360P', v: say('main', 'LC'), paid: true },
    '480P': { k: '480P', v: say('main', 'SD'), paid: true, selected: true },
    '720P': { k: '720P', v: say('main', 'HD'), paid: true },
    '1080P': { k: '1080P', v: say('main', 'hi-vision'), paid: true },
    // '4K': { k: '4K', v: say('main', '4K'), paid: true },
} : {
        'AUDIO': { k: 'AUDIO', v: say('main', 'audioSolo'), paid: true },
        '360P': { k: '360P', v: say('main', 'LC'), paid: true },
        '480P': { k: '480P', v: say('main', 'SD'), paid: true, selected: true },
        '720P': { k: '720P', v: say('main', 'HD'), paid: true, pay: !localStorage.qiniu },
        '1080P': { k: '1080P', v: say('main', 'hi-vision'), paid: true, pay: true },
        // '4K': { k: '4K', v: say('main', '4K'), paid: true, pay: true },
    };
let issueLock = true;
let platforms = {
    OnVideo: 0,
    bilibili: 1,
    dayuhao: 2,
    miaopai: 3,
    iqiyi: 4,
    baijiahao: 5,
    qq: 6,
    toutiao: 7,
    youku: 8,
    youtube: 9,
    stager: 10
};
let short_cut = 0;
let categoryDom = {
    OnVideo: '',
    bilibili: '',
    dayuhao: '',
    miaopai: '',
    iqiyi: '',
    baijiahao: '',
    qq: '',
    toutiao: '',
    youku: '',
    youbube: '',
    stager: ''
};
let subtitle_language_list = [];

let plat_class = plat_case;
let verify_list = localStorage.stager ? {
    title: /[^\w\u4E00-\u9FA5\u0800-\u4e00〈〉《》。 ，、：；？！‘’“”′.,﹑:;?!'"+\-*=<_#$&%^·-—…\/@￥¥-…√ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ×÷±／≈≡≠＜＞≤≥∏º％‰℅°℃℉″㎡㎥āáǎàŌÓǑÒūúǔùīíǐìēéěèêǖǘǚǜü]/g,
    title_start: /^[^\w\u4E00-\u9FA5\u0800-\u4e00《“]/,
    label: /[^\w\u4E00-\u9FA5\u0800-\u4e00〈〉《》。，、：；？！‘’“”′ .,﹑:;?!'"+\-*=<_#$&%^·-—…\/@￥¥-…√ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ×÷±／≈≡≠＜＞≤≥∏º％‰℅°℃℉″㎡㎥āáǎàŌÓǑÒūúǔùīíǐìēéěèêǖǘǚǜü]/g,
} : {
        title: /[^\w\u4E00-\u9FA5〈〉《》。 ，、：；？！‘’“”′.,﹑:;?!'"+\-*=<_#$&%^·-—…\/@￥¥-…√ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ×÷±／≈≡≠＜＞≤≥∏º％‰℅°℃℉″㎡㎥āáǎàŌÓǑÒūúǔùīíǐìēéěèêǖǘǚǜü]/g,
        title_start: /^[^\w\u4E00-\u9FA5《“]/,
        label: /[^\w\u4E00-\u9FA5〈〉《》。，、：；？！‘’“”′ .,﹑:;?!'"+\-*=<_#$&%^·-—…\/@￥¥-…√ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ×÷±／≈≡≠＜＞≤≥∏º％‰℅°℃℉″㎡㎥āáǎàŌÓǑÒūúǔùīíǐìēéěèêǖǘǚǜü]/g,

    };

export default class Detail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: say('main', 'basicTransfom'),
            change: true,
            snapShort: [],
            thumbnail: '',
            update: '',
            film: false,
            loading: false,
            form: { label: [] },
            alertInfo: '',
            theLogo: false,
            theLogoUrl: '',
            obj: {},
            original: {
                name: '',
                label: [],
                project_id: '',
                description: '',
                language: {
                    empty: true
                },
                out_type: ['480P'],
                thumbnail: '',
                directory_id: 0,
                plat_user_list: []
            },
            index: 0,
            plat_list: []
        };
    }
    componentWillUnmount() {
        let state = {
            name: say('main', 'basicTransfom'),
            change: true,
            snapShort: [],
            thumbnail: '',
            update: '',
            theLogo: false,
            theLogoUrl: '',
            alertInfo: '',
            obj: {},
            original: {
                name: '',
                label: [],
                project_id: '',
                description: '',
                out_type: ['480P'],
                thumbnail: '',
                directory_id: 0,
                plat_user_list: []
            },
            index: 0,
            plat_list: []
        };
        for (let i in state) {
            this.state[i] = state[i]
        }
        categoryDom = {
            OnVideo: '',
            bilibili: '',
            dayuhao: '',
            miaopai: '',
            iqiyi: '',
            baijiahao: '',
            qq: '',
            toutiao: ''
        };
    }
    renderPlatList() {
        /*  channel('get_auth_user_list', {}, (re) => {
             let list = [];
             re.map((v, k) => {
                 list.push({
                     k: v.plat,
                     index: platforms[v.plat],
                     username: v.username,
                     pu_id: v.pu_id,
                     title: '',
                     category: '1',   //分类
                     label: [],
                     description: '',
                     thumbnail: '',
                     original: 1, //1 原创
                     publish_status: 1,// 0存草稿，1直接发布
                     permission: 0,
                     view_pwd: '',
                     is_vr: false,//是否全景视频
                     out_type: '480P'
                 });
                 if (v.plat === 'stager') {
                     list[k].out_type = '720P';
                     list[k].selected = true;
                 }
                 //加载平台分类列表
                 if (!categoryDom[v.plat]) {
                     let dom = [];
                     let list = plat_class[v.plat];
                     for (let i in list) {
                         if (list[i] instanceof Object) {
                             let _dom = [];
                             for (let j in list[i]) {
                                 _dom.push(<div key={'bean' + j} className="bean" onClick={() => {
                                     this.state.form.categoryOB = { k: j, v: list[i][j] }
                                     this.refreshParam();
                                 }}>{list[i][j]}</div>)
                             }
                             dom.push(<div key={'bean' + i} className="stack"><div>{i}</div><div>{_dom}</div></div>)
                         } else {
                             dom.push(<div key={'bean' + i} className="bean" onClick={() => {
                                 this.state.form.categoryOB = { k: i, v: list[i] }
                                 this.refreshParam();
                             }}>{list[i]}</div>)
                         }
                     }
                     categoryDom[v.plat] = dom;
                 }
             });
             this.setState({ plat_list: list });
         }) */
    }
    componentWillMount() {
        if (localStorage.stager) {
            channel('stager_user_info', { m: 'Onvideo', a: 'showtags' }, (re) => {
                let stager = {};
                for (let i in re) {
                    stager[i] = {};
                    re[i].map((v, k) => {
                        stager[i][v.tag_id] = v.content
                    })
                }
                plat_class['stager'] = stager;
                this.renderPlatList()
            }, () => {
                plat_class['stager'] = {};
                this.renderPlatList()
            });
        } else {
            this.renderPlatList()
        }
    }
    getSnapshot() {
        this.props.getSnapshot((re) => {
            this.setState({ snapShort: re })

        }, 6);
    }

    shouldComponentUpdate(nP, nS) {
        let os = this.props.issue.show, ns = nP.issue.show;
        if (ns && !os) {
            this.state.original.project_id = nP.issue.project_id;
            this.state.original.name = nP.issue.name || '';
            this.state.original.label = nP.issue.label && nP.issue.label.join('') ? nP.issue.label : [];
            console.info(nP.issue.label);
            this.state.original.description = nP.issue.description || '';
            /* channel('get_text_language', { project_id: nP.issue.project_id }, (re) => {
                if (re.length) {
                    subtitle_language_list = re;
                    if (re.length) {
                        this.state.original.language.empty = false;
                        this.state.original.language[re[0].language] = true;
                    }
                }
            }); */
            this.getSnapshot()
        }
        if (os && !ns) {
            this.state.original.name = '';
            this.state.original.label = [];
            this.state.original.description = '';
        }
        return true;
    }
    refreshParam() {
        $('.category-list').removeClass('show');
        this.setState({ change: true });
    }
    upload(e) {
        let file = $("#snapFile");
        if ($.trim(file.val()) === '') {
            return false;
        }
        let temp = document.getElementById('snapFile').files;
        uploadBlob = new Blob([temp[0]]); // 文件转化成二进制文件
        uploadBlob['name'] = temp[0]['name'];
        this.state.snapShort[0] = URL.createObjectURL(uploadBlob); //转化成url
        this.setState({ change: true });
    }
    uploadLogo(e) {
        let file = $("#logoFile");
        if ($.trim(file.val()) === '') {
            return false;
        }
        let temp = document.getElementById('logoFile').files;
        logoBlob = new Blob([temp[0]]); // 文件转化成二进制文件
        logoBlob['name'] = temp[0]['name'];
        this.state.theLogoUrl = URL.createObjectURL(logoBlob); //转化成url
        this.setState({ change: true });
    }
    generateMovie() {
        this.state.original.out_type = [];
        for (let i in out_type_obj) {
            if (out_type_obj[i].selected) {
                this.state.original.out_type.unshift(i)
            }
        }
        if (!this.state.original.name) {
            message.warning(say('verify', 'say5') + say('main', 'title'));
            $('#issue-title').focus();
            return;
        }
        // if(!this.state.original.label.length){
        //     message.warning(say('verify','say5')+say('main','label'));
        //     $('#issue-label').focus();
        //     return;
        // }
        if (!this.state.original.description) {
            message.warning(say('verify', 'say5') + say('main', 'intro'));
            $('#issue-desc').focus();
            return;
        }
        if (!this.state.original.out_type.length) {
            message.warning('请选择规格');
            return;
        }
        this.state.original.plat_user_list = [];
        for (let j = 0; j < this.state.plat_list.length; j++) {
            let _o = this.state.plat_list[j];
            if (_o.selected) {
                if (!_o.out_type) {
                    message.warning('请选择规格');
                    $('#plat-' + _o.pu_id).click();
                    return;
                }
                if (!_o.title) {
                    message.warning(say('verify', 'say5') + say('main', 'title'));
                    $('#plat-' + _o.pu_id).click();
                    $('#form-title').focus();
                    return;
                }
                if (_o.k === 'baijiahao' || _o.k === 'toutiao' || _o.k === 'qq') {
                    let len = _o.title.replace(/[\u0391-\uFFE5]/g, "aa").length;
                    let whether = true;
                    switch (_o.k) {
                        case 'baijiahao': if (len < 15) { whether = false }; break;
                        case 'toutiao': if (len < 9) { whether = false }; break;
                        case 'qq': if (len < 11) { whether = false }; break;
                    }
                    if (!whether) {
                        message.warning('标题长度过短');
                        $('#plat-' + _o.pu_id).click();
                        $('#form-title').focus();
                        return;
                    }
                }
                if (_o.categoryOB) {
                    _o.category = _o.categoryOB.k;
                } else {
                    $('#plat-' + _o.pu_id).click();
                    message.warning(say('main', 'chooseClassPlease'));
                    return;
                }
                if (_o.k !== 'stager' && _o.k !== 'toutiao' && _o.k !== 'youku' && !_o.label.length) {
                    message.warning('请输入标签');
                    $('#plat-' + _o.pu_id).click();
                    $('#form-label').focus();
                    return;
                }
                if (_o.k === 'qq' && _o.label.length < 2) {
                    message.warning('企鹅号最少需要两个标签');
                    $('#plat-' + _o.pu_id).click();
                    $('#form-label').focus();
                    return;
                }
                if (_o.k === 'bilibili' && !_o.description) {
                    message.warning('请输入简介');
                    $('#plat-' + _o.pu_id).click();
                    $('#form-desc').focus();
                    return;
                }
                this.state.original.plat_user_list.push(_o);
            }
        }
        if (issueLock) {
            issueLock = false;
            this.setState({ loading: true });
            blob = dataURLtoBlob(this.state.snapShort[short_cut]) || uploadBlob || '';
            uploadSnapshot(blob, { k: 'project_id', v: this.state.original.project_id }, (re) => {
                this.state.original.thumbnail = re || '';
                this.state.original.enable_headtail = this.state.film;
                let data = cloneConfig(this.state.original);
                data.language = [];
                for (let i in this.state.original.language) {
                    if (this.state.original.language[i] === true) {
                        data.language.push(i === 'empty' ? '' : i);
                    }
                }
                if (this.state.theLogo && this.state.theLogoUrl) {
                    uploadSnapshot(logoBlob, { k: 'project_id', v: this.state.original.project_id }, (re) => {
                        data['watermarkUrl'] = re;
                        this._publish_video(data)
                    }, () => {
                        issueLock = true;
                    }, 'info');
                } else {
                    data['watermarkUrl'] = '';
                    this._publish_video(data)
                }
            }, () => {
                issueLock = true;
                this.setState({ loading: false });
            }, 'info');
        }
    }
    _publish_video(data) {
        data['title'] = data['name'];
        data['label'] = data['label'].join(',');
        data['outType'] = data['out_type'].join(',');
        data['projectId'] = data['project_id'];
        data['aspect'] = this.props.screen_scale;
        // data['watermarkUrl'] = this.state.theLogo && this.state.theLogoUrl ? this.state.theLogoUrl : '';
        data['watermarkLocation'] = 'right_top';
        channel('publish_video', JSON.stringify(data), (re) => {
            issueLock = true;
            this.setState({ loading: false });
            this.props.history.push(this.props.is_template ? '/template/mine' : '/hub/movie');
        }, (re) => {
            issueLock = true;
            this.setState({ loading: false });
            this.props.history.push(this.props.is_template ? '/template/mine' : '/hub/movie');
        }, 'info')

    }
    copyForm(i) {
        (!this.state.plat_list[i].title) && (this.state.plat_list[i].title = this.state.original.name);
        (this.state.original.label.length && !this.state.plat_list[i].label.length) && (this.state.plat_list[i].label = this.state.original.label.join('|').split('|'));
        (!this.state.plat_list[i].description) && (this.state.plat_list[i].description = this.state.original.description);
        if (this.state.plat_list[i].k === 'baijiahao' || this.state.plat_list[i] === 'qq') {
            this.state.plat_list[i].description = this.state.plat_list[i].description.substr(0, 100);
        }
    }
    selectPlat(i) {
        let o = this.state.plat_list[i];
        if (o.k !== 'stager') {
            if (!o.selected) {
                /* channel('get_auth_user_list', {}, (re) => {
                    re.map((v, k) => {
                        if (v.pu_id === o.pu_id) {
                            if (v.expire_status) {
                                this.onceBing(v)
                            } else {
                                o.selected = true;
                                this.copyForm(i);
                                this.refreshParam();
                            }
                        }
                    });
                }, '', 'info'); */
            } else {
                o.selected = false;
                if (!this.state.form.selected) {
                    for (let i = 0; i < this.state.plat_list.length; i++) {
                        if (this.state.plat_list[i].selected) {
                            this.state.form = this.state.plat_list[i];
                            break;
                        }
                    }
                }
                this.refreshParam();
            }
        } else {
            this.copyForm(i);
            this.refreshParam();
        }
    }
    onceBing(o) {
        if (o.auth_type === 'oauth2') {
            confirm(
                '请在新页签中重新绑定账号',
                '',
                '',
                () => { }
            );
            /*this.setState({'alertInfo':{
                setting: 'show',
                close: ()=>{
                    this.setState({alertInfo:''})
                },
                msg:'请在新页签中重新绑定账号'
            }});*/
            window.open(scope + 'publish/auth/' + o.plat + '/?token=' + localStorage.signature, '_blank')
        } else if (o.auth_type === 'password') {
            this.setState({
                'alertInfo': {
                    setting: 'show',
                    title: '绑定账号',
                    width: 400,
                    height: 250,
                    top: 30,
                    close: () => {
                        this.setState({ alertInfo: '' })
                    },
                    form: (
                        <ul>
                            <li><span>用户名：</span><input id="platAcc" type="text" /></li>
                            <li><span>密码：</span><input id="platPass" type="password" /></li>
                            <li className="msg"> </li>
                            <li>
                                <span className="btn" onClick={() => {
                                    channel('bind_account', {
                                        username: $('#platAcc').val(),
                                        password: encrypt($('#platPass').val()),
                                        plat: o.plat
                                    }, (re) => {
                                        confirm(
                                            '绑定成功！',
                                            '',
                                            '',
                                            () => { }
                                        );
                                        /*this.setState({'alertInfo':{
                                            setting: 'show',
                                            close: ()=>{
                                                this.setState({alertInfo:''})
                                            },
                                            msg:'绑定成功！'
                                        }});*/
                                    }, (re) => {
                                        confirm(
                                            re.result || '绑定失败！',
                                            '',
                                            '',
                                            () => { }
                                        );
                                        /*this.setState({'alertInfo':{
                                            setting: 'show',
                                            close: ()=>{
                                                this.setState({alertInfo:''})
                                            },
                                            msg:re.result||'绑定失败！'
                                        }})*/
                                    })
                                }}>确认</span>
                                <span className="btn" onClick={() => {
                                    this.setState({ alertInfo: '' })
                                }}>取消</span>
                            </li>
                        </ul>
                    )
                }
            })

        }
    }
    render() {
        let snapShort = [];
        for (let i = 0; i < 6; i++) {
            snapShort.push(<div key={'snapShort' + i} className={short_cut === i ? 'current' : ''} style={{ flexBasis: $('.reveal').hasClass('vertical') ? '15%' : '27%' }} onClick={() => {
                short_cut = i;
                this.refreshParam();
            }
            }><img src={this.state.snapShort[i] || (localStorage.pure ? imgBg : short)} alt="" />{short_cut === i ? <span className='current-tip'><span className='ico iconfont icon-duigou'></span></span> : ''}</div>)
        }
        let platform = [];
        let plat_list = [];
        //根据后端返回的平台列表来渲染选择按钮
        for (let i = 0; i < this.state.plat_list.length; i++) {
            let o = this.state.plat_list[i];
            platform.push(<div key={'plat-ico' + i} title={o.username} onClick={() => {
                this.selectPlat(i);
            }}> {o.selected
                ? <svg className="icon svg-icon" aria-hidden="true">
                    <use xlinkHref={"#icon-" + o.k + "-nh"}> </use>
                </svg>
                : <svg className="icon svg-icon" aria-hidden="true">
                    <use xlinkHref={"#icon-" + o.k + "-n"}> </use>
                </svg>
                }{(o.index !== 0 && !o.index) ? o.plat_cn : ''}</div>);
            if (o.selected) {
                if (!this.state.form.selected) {
                    this.state.form = this.state.plat_list[i];
                }
                plat_list.push(<div key={'plat-form' + i} id={'plat-' + o.pu_id} className={this.state.plat_list[i].pu_id === this.state.form.pu_id ? 'current' : ''} onClick={() => {
                    this.state.form = this.state.plat_list[i];
                    this.refreshParam();
                }}><svg className="icon svg-icon" aria-hidden="true">
                        <use xlinkHref={"#icon-" + o.k}> </use>
                    </svg><span className="t-a-c"> {say('main', 'account')}：<span>{o.username} </span></span> </div>)
            }
        }
        let out_type = [];
        let form_type = [];
        for (let i in out_type_obj) {
            let o = out_type_obj[i];
            out_type.push(<div key={'out_type' + i} className={o.selected ? 'current' : ''} onClick={() => {
                // if(this.props.meal.resolution.indexOf(o.k)>=0){
                // if(this.props.is_template){
                //     for(let _i in out_type_obj){
                //         out_type_obj[_i].selected=false;
                //     }
                // }
                o.selected = !o.selected;
                this.refreshParam();
                // }
            }}><p>{o.k}</p><p>{o.v}</p>{o.pay ? <span><span>{say('main', 'pay')}</span></span> : ''}</div>);
            if (o.selected) {
                if (!this.state.form.out_type || !out_type_obj[this.state.form.out_type].selected) {
                    this.state.form.out_type = i;
                }
                form_type.push(<span key={'form_type' + i} className={this.state.form.out_type === o.k ? 'current' : ''} onClick={(e) => {
                    this.state.form.out_type = o.k;
                    this.refreshParam();
                }}><span className="radio"> </span>{o.k}</span>)
            }
        }
        let _labelsDom = [];
        this.state.form.label && (this.state.form.label.map((v, k) => {
            let dom = (<span key={k}>{v} <span className="ico iconfont icon-guanbi" onClick={() => {
                this.state.form.label.splice(k, 1);
                this.refreshParam();
            }}> </span></span>);
            _labelsDom.push(dom);
        }));
        let descLength = 200;
        let labelLength = 3;
        let titleLength = 30;
        switch (this.state.form.k) {
            case 'stager': titleLength = 20; break;
            case 'baijiahao': descLength = 100; break;
            case 'toutiao': descLength = 400; labelLength = 5; break;
            case 'qq': descLength = 100; labelLength = 5; break;
            case 'youku': descLength = 2000; titleLength = 80; break;
            case 'bilibili': descLength = 250; labelLength = 5; titleLength = 80; break;
        }
        let formDom = (
            <div className="form">
                {localStorage.stager ? '' : <div><span>{say('main', 'theType')}</span>
                    <div> {form_type}</div>
                </div>}
                <div><span>{say('statement', 'say7')}</span>
                    <Input value={this.state.form.title} onChange={(e) => {
                        e.target.value = e.target.value.replace
                            (verify_list.title, '');
                        e.target.value = e.target.value.replace
                            (verify_list.title_start, '');
                        this.state.form.title = e.target.value;
                        this.refreshParam();
                    }
                    } id="form-title" type="text" placeholder={say('verify', 'say4') + titleLength + "字"} maxLength={titleLength} />
                </div>
                <div><span>{say('main', 'class')}</span><span className="category-selected" onClick={() => {
                    $('.category-list').addClass('show')
                }}>{this.state.form.categoryOB && this.state.form.categoryOB.v}</span>
                    <div className="category-list">
                        {categoryDom[this.state.form.k]}
                    </div>
                </div>
                {localStorage.stager ? <div> </div> : <div><span>{say('main', 'label')}</span>
                    <Select
                        mode="tags"
                        placeholder={say('verify', 'say2')}
                        notFoundContent=""
                        value={this.state.form.label}
                        style={{ width: '500px', maxWidth: '100%' }}
                        onChange={(val) => {
                            let clone = [];
                            val.map((v) => {
                                let _v = v.replace(/\s+/g, '').replace(verify_list.label, '').substr(0, 8);
                                if (_v && clone.length < labelLength && clone.indexOf(_v) === -1)
                                    clone.push(_v);
                            });
                            this.state.form.label = clone;
                            this.refreshParam();
                        }}
                        tokenSeparators={[',']}>
                    </Select>
                </div>}
                {localStorage.stager ? <div> </div> : <div>
                    <span style={{ marginLeft:'-10px' }} ><span style={{ display:"inline-block", width: 10, color: "red" }}>*</span>{say('main', 'intro')}</span>
                    <TextArea rows={4} id="form-desc" placeholder={"不超过" + descLength + "字"} value={this.state.form.description} onChange={(e) => {
                        this.state.form.description = e.target.value;
                        this.refreshParam();
                    }
                    } maxLength={descLength} /></div>}
            </div>
        );
        let subtitle_type_dom = [<span key={'empty'} style={{
            display: 'inline-block', margin: '0 3px'
        }} key={99}>
            <Checkbox
                checked={this.state.original.language.empty}
                onChange={(e) => {
                    this.state.original.language.empty = !this.state.original.language.empty;
                    this.setState({ film: this.state.film })
                }}>无字幕</Checkbox>
        </span>];

        subtitle_language_list.map((v, k) => {
            subtitle_type_dom.push(
                <span key={k} style={{
                    display: 'inline-block', margin: '0 3px'
                }}>
                    <Checkbox
                        checked={this.state.original.language[v.language]}
                        onChange={(e) => {
                            this.state.original.language[v.language] = !this.state.original.language[v.language];
                            this.setState({ film: this.state.film })
                        }}>{v.desc}</Checkbox>
                </span>
            )

        });
        return (
            <div className={'issue-project ' + (this.props.issue.show ? '' : 'hidden')}>
                <div style={{ position: 'absolute', 'zIndex': '-1', marginLeft: '-88px', paddingLeft: '30px', width: '300px', opacity: 0 }} ><input id="snapFile" accept="image/png, image/jpeg" onChange={() => {
                    this.upload();
                }} type="file" /><input id="logoFile" accept="image/png, image/jpeg" onChange={() => {
                    this.uploadLogo();
                }} type="file" /></div>
                <div className="main">
                    <div className="crosswise">
                        <div className="column column-left">
                            <div className="base-info">
                                <p className="title">
                                    <span> </span>
                                    <span>{say('main', 'basicInfo')}</span>
                                </p>
                                <div className="base-info-content">
                                    <div><span className='m-0-5'>{say('main', 'title')}</span>
                                        <Input id="issue-title" value={this.state.original.name} onChange={(e) => {
                                            e.target.value = e.target.value.replace
                                                (verify_list.title, '');
                                            e.target.value = e.target.value.replace
                                                (verify_list.title_start, '');
                                            this.state.original.name = e.target.value;
                                            this.refreshParam();
                                        }} type="text" placeholder='请输入标题1-20字' maxLength={20} /></div>
                                    <div><span className='m-0-5'>{say('main', 'label')}</span>
                                        <Select
                                            mode="tags"
                                            placeholder={say('verify', 'say2')}
                                            notFoundContent=""
                                            value={this.state.original.label}
                                            style={{ width: '500px', maxWidth: '100%' }}
                                            maxLength={8}
                                            onChange={(val) => {
                                                let clone = [];
                                                val.map((v) => {
                                                    let _v = v.replace(/\s+/g, '').replace(verify_list.label, '').substr(0, 8);
                                                    if (_v && clone.length < 3 && clone.indexOf(_v) === -1)
                                                        clone.push(_v);
                                                });
                                                this.state.original.label = clone;
                                                this.refreshParam();
                                            }}
                                        >
                                        </Select>
                                    </div>
                                    <div><span className='m-0-5' style={{ marginLeft:'-10px' }}><span style={{ display:"inline-block", width: 10, color: "red" }}>*</span>{say('main', 'intro')}</span>
                                        <TextArea id="issue-desc" value={this.state.original.description} rows={4} onChange={(e) => {
                                            this.state.original.description = e.target.value;
                                            this.setState({ original: this.state.original });
                                        }} placeholder={say('verify', 'say3')} maxLength={200} /></div>
                                </div>
                            </div>
                            {/*{this.props.is_template?'':<div className="output" style={{flex:0}}>*/}
                            {/*<p className="title">*/}
                            {/*<span> </span>*/}
                            {/*<span>字幕</span>*/}
                            {/*</p>*/}
                            {/*<p className="sub" style={{margin:'15px'}}>*/}
                            {/*{subtitle_type_dom}*/}
                            {/*</p>*/}
                            {/*</div>}*/}
                            <div className="output">
                                <p className="title">
                                    <span> </span>
                                    <span>输出设置</span>
                                </p>
                                <p className="sub">{say('statement', 'say1')}</p>
                                <div>
                                    {out_type}
                                </div>
                            </div>
                            <div className="output">
                                <p className="title">
                                    <span> </span>
                                    <span >添加水印</span>
                                    <span> </span>
                                    <Switch size={"small"} checked={this.state.theLogo || false} onChange={(value) => {
                                        this.setState({ theLogo: value });
                                    }} />
                                </p>
                                <p className="sub"> </p>
                                <div>
                                    <div className="only" onClick={() => {
                                        if (!this.state.theLogo) {
                                            message.error('请开启添加水印按钮');
                                            return;
                                        }
                                        $('#logoFile').click();
                                    }}>
                                        <p className=""><span className="ico iconfont icon-tianjiaguidao"> </span></p>
                                    </div>
                                    {this.state.theLogoUrl ?
                                        <div className="only">
                                            <img style={{ opacity: 0 }} src={imgBg} alt="" className="stance" />
                                            <div>
                                                <img onLoad={() => {
                                                    this.props.playVideo();
                                                }} id="theLogoUrl" src={this.state.theLogoUrl} alt="" />
                                            </div>
                                        </div> : ''}
                                </div>

                            </div>
                            {/*    {this.props.is_template?'':
                                <div className="platform">
                                    <p className="title">
                                        <span> </span>
                                        <span>{say('main','platform')}</span>
                                    </p>
                                    <p className="tt">{say('statement','say3')}</p>
                                    <div>
                                        {platform}
                                    </div>
                                </div>}
                            {this.props.is_template?'':
                                <div className="sel-platform">
                                    <div className="o-h">
                                        <div className="selection">
                                            {plat_list}
                                        </div>
                                    </div>
                                    {plat_list.length?formDom:''}
                                </div>}*/}
                        </div>
                        <div className="column column-right">
                            <div className="vision"> </div>
                            <div className="screen-shot">
                                <span className="title">
                                    <span>{say('main', 'thumbnail')}</span>
                                    <span className='ico iconfont icon-shangchuan c-p'
                                        onClick={() => {
                                            $('#snapFile').click();
                                        }}
                                    > </span>
                                    <span className='ico iconfont icon-shuaxin c-p'
                                        onClick={() => {
                                            this.getSnapshot();
                                        }}
                                    > </span>
                                </span>
                                <div className="crosswise column-right-crosswise">
                                    {snapShort}
                                </div>
                            </div>
                        </div>
                    </div>
                    <Dialog setting={this.state.alertInfo} />
                </div>
                <div className="issue-btn-area">
                    <Button loading={this.state.loading} style={{ opacity: this.props.issue.issue ? 1 : 0.6 }} onClick={() => {
                        if (this.props.issue.issue) {
                            this.generateMovie();
                        }
                    }} type="primary">
                        {this.props.is_template ? '合成' : '确认合成'}
                    </Button>
                    <Button onClick={() => {
                        this.props.close();
                        this.props.playVideo();
                    }} type="primary">
                        取消
                    </Button>
                </div>
            </div>
        )
    }
}
