import React from 'react';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/slider';
import 'jquery-ui/ui/effect';
import 'jquery-ui';
import 'jquery-ui/ui/widgets/resizable';
import 'jquery-ui/ui/widgets/selectable';
import 'jquery-ui/ui/widgets/draggable';
import 'jquery-ui/ui/widgets/sortable';
import 'jquery-ui/ui/widgets/droppable';
import 'jquery-ui/ui/widgets/slider';
import { message, Select, Input, Button } from 'antd';
import channel, { scope } from '@/channel';
import say from '@/database/local_language';
import plat_case from '@/database/plat_case';
import { encrypt, getDuration } from '@/utils/handy';
import short from '@/images/defult.png';
import imgBg from '@/images/img-bg.jpg';
import { confirm } from "@/components/Modal";
import Dialog from '@/components/Dialog';

const Option = Select.Option;
const OptGroup = Select.OptGroup;
const TextArea = Input.TextArea;
let uploadBlob = '';
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
    stager: 10,

};
let short_cut = -1;
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

let plat_class = plat_case;
let verify_list = localStorage.stager ? {
    title: /[^\w\u4E00-\u9FA5\u0800-\u4e00〈〉《》。 ，、：；？！‘’“”′.,﹑:;?!'"+\-*=<_#$&%^·-—…\/@￥¥-…√ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ×÷±／≈≡≠＜＞≤≥∏º％‰℅°℃℉″㎡㎥āáǎàŌÓǑÒūúǔùīíǐìēéěèêǖǘǚǜü]/g,
    title_start: /^[^\w\u4E00-\u9FA5\u0800-\u4e00《“]/,
    label: /[^\w\u4E00-\u9FA5\u0800-\u4e00〈〉《》。，、：；？！‘’“”′.,﹑:;?!'"+\-*=<_#$&%^·-—…\/@￥¥-…√ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ×÷±／≈≡≠＜＞≤≥∏º％‰℅°℃℉″㎡㎥āáǎàŌÓǑÒūúǔùīíǐìēéěèêǖǘǚǜü]/g,
} : {
        title: /[^\w\u4E00-\u9FA5〈〉《》。 ，、：；？！‘’“”′.,﹑:;?!'"+\-*=<_#$&%^·-—…\/@￥¥-…√ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ×÷±／≈≡≠＜＞≤≥∏º％‰℅°℃℉″㎡㎥āáǎàŌÓǑÒūúǔùīíǐìēéěèêǖǘǚǜü]/g,
        title_start: /^[^\w\u4E00-\u9FA5《“]/,
        label: /[^\w\u4E00-\u9FA5〈〉《》。，、：；？！‘’“”′.,﹑:;?!'"+\-*=<_#$&%^·-—…\/@￥¥-…√ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ×÷±／≈≡≠＜＞≤≥∏º％‰℅°℃℉″㎡㎥āáǎàŌÓǑÒūúǔùīíǐìēéěèêǖǘǚǜü]/g,

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
            pa: [],
            form: { label: [] },
            alertInfo: '',
            obj: {},
            original: {
                name: '',
                label: [],
                movie_id: [],
                project_id: '',
                description: '',
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
            alertInfo: '',
            obj: {},
            original: {
                name: '',
                label: [],
                project_id: '',
                movie_id: '',
                description: '',
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
        /*  channel('get_auth_user_list', {}, (response) => {
             let list = [];
             let re = response;
             re.map((v, k) => {
                 let _obj = {
                     k: v.plat,
                     index: platforms[v.plat],
                     username: v.username,
                     pu_id: v.pu_id,
                     title: '',
                     category: '',   //分类
                     label: [],
                     description: '',
                     thumbnail: '',
                     original: 1, //1 原创
                     publish_status: 1,// 0存草稿，1直接发布
                     permission: 0,
                     view_pwd: '',
                     is_vr: false,//是否全景视频
                 };
                 list.push(_obj);
                 //加载平台分类列表
                 if (!categoryDom[v.plat]) {
                     let dom = [];
                     let list = plat_class[v.plat];
                     for (let i in list) {
                         if (list[i] instanceof Object) {
                             let _dom = [];
                             for (let j in list[i]) {
                                 dom.push(<Option key={'bean' + j} title={list[i][j]} value={j}>{list[i][j]}</Option>)
                             }
                             dom.push(<OptGroup label={i} key={'bean' + i} className="stack">{_dom}</OptGroup>)
                         } else {
                             dom.push(<Option key={'bean' + i} title={list[i]} value={i}>{list[i]}</Option>)
                         }
                     }
                     categoryDom[v.plat] = dom;
                 }
             });
             this.setState({ plat_list: list });
         }) */
    }

    componentDidMount() {
        $(".crosswise .short-list").sortable();
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
            // plat_class['stager']={};
            this.renderPlatList()
        }
    }

    getSnapshot() {
        channel('get_recommend_snapshot', { media_id: this.state.pa[0].media_id }, (re) => {
            short_cut = -1;
            this.setState({ snapShort: re })
        })
    }

    shouldComponentUpdate(nP, nS) {
        let os = this.props.issue.show, ns = nP.issue.show;
        if (ns && !os) {
            short_cut = -1;
            let nP_data = nP.issue.projectArray[0];
            this.state.original = {
                name: nP_data.name || '',
                label: nP_data.label ? nP_data.label.split('|') : [],
                movie_id: [],
                project_id: '',
                description: nP_data.description || '',
                thumbnail: '',
                directory_id: 0,
                plat_user_list: []
            };

            this.state.plat_list.map((v, k) => {
                v.selected = false;
                v.category = '';
            })
            $('#issue-title').val(nP_data.name);
            $('#issue-label').val('');
            $('#issue-desc').val('');
            this.state.pa = nP.issue.projectArray;
            this.state.original.thumbnail = this.state.pa[0].thumbnail;
            this.getSnapshot()
        }
        if (!ns && os) {
            this.state.original = {
                name: '',
                label: [],
                movie_id: [],
                project_id: '',
                description: '',
                thumbnail: '',
                directory_id: 0,
                plat_user_list: []
            };
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
        this.state.snapShort[0] = URL.createObjectURL(uploadBlob); //转化成url
        this.setState({ change: true });
    }

    generateMovie() {
        this.state.original.project_id = this.props.issue.project_id;
        this.state.original.movie_id = this.state.pa.length === 1 ? this.state.pa[0].media_id : $(".crosswise .short-list").sortable('toArray');
        if (!this.state.original.name) {
            message.info(say('verify', 'say5') + say('main', 'title'));
            $('#issue-title').focus();
            return;
        }
        if (this.state.original.name.length < 15) {
            message.info('标题至少需15个字');
            $('#issue-title').focus();
            return;
        }
        if (!this.state.original.label.length) {
            message.info(say('verify', 'say5') + say('main', 'label') + '（回车键确认）');
            $('#issue-label').focus();
            return;
        }
        if (this.state.original.label.length < 2) {
            message.info('至少需两个标签（回车键确认）');
            $('#issue-label').focus();
            return;
        }
        if (!this.state.original.description) {
            message.info(say('verify', 'say5') + say('main', 'intro'));
            $('#issue-desc').focus();
            return;
        }
        this.state.original.plat_user_list = [];
        for (let j = 0; j < this.state.plat_list.length; j++) {
            let _o = this.state.plat_list[j];
            if (_o.selected) {
                if (_o.category) {
                    _o.title = this.state.original.name;
                    _o.label = this.state.original.label;
                    _o.description = this.state.original.description;
                    this.state.original.plat_user_list.push(_o);
                } else {
                    message.info(say('main', 'chooseClassPlease'));
                    this.state.form = _o;
                    this.refreshParam();
                    return;
                }
            }
        }
        if (this.state.pa.length === 1 && this.state.original.plat_user_list.length < 1) {
            message.info('请选择发布平台');
            return;
        }
        if (issueLock) {
            issueLock = false;
            this.state.original.thumbnail = short_cut === -1 ? (this.state.original.thumbnail || this.state.pa[0].thumbnail) : this.state.snapShort[short_cut];
            channel(this.state.pa.length === 1 ? 'live_publish_video' : 'live_merge_video', JSON.stringify(this.state.original), (re) => {
                issueLock = true;
                this.props.refreshVideoList && this.props.refreshVideoList();
                this.props.close();
            }, (re) => {
                issueLock = true;
            }, 'info')
        }
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
                () => {
                }
            );
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
                                            () => {
                                            }
                                        );
                                    }, (re) => {
                                        confirm(
                                            re.result || '绑定失败！',
                                            '',
                                            '',
                                            () => {
                                            }
                                        );
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
            snapShort.push(<div key={'snapShort' + i} className={short_cut === i ? 'current' : ''} style={{ flexBasis: $('.reveal').hasClass('vertical') ? '15%' : '31%' }} onClick={() => {
                short_cut = i;
                this.refreshParam();
            }
            }><img src={this.state.snapShort[i] || (localStorage.pure ? imgBg : short)} alt="" />
                {short_cut === i ? <span className='current-tip'><span className='ico iconfont icon-duigou'></span></span> : ''}
            </div>)
        }
        let platform = [];
        let plat_list = [];
        //根据后端返回的平台列表来渲染选择按钮
        for (let i = 0; i < this.state.plat_list.length; i++) {
            let o = this.state.plat_list[i];
            platform.push(<div key={'plat-ico' + i} title={o.username} onClick={() => {
                this.selectPlat(i);
            }}>

                {o.selected
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
                }}><span>
                        <svg className="icon svg-icon" aria-hidden="true">
                            <use xlinkHref={"#icon-" + o.k}> </use>
                        </svg>
                        <span className="t-a-c"> {'名称'}：<span className="c-r">{o.username.length > 10 ? o.username.substr(0, 10) : o.username} </span></span>
                    </span>
                    <div className="classify"> 分类：
                        <Select size={'small'} width={100}
                            onChange={(v) => {
                                this.state.plat_list[i].category = v;
                            }}
                        >{categoryDom[this.state.form.k]}
                        </Select></div>
                </div>);
            }
        }
        let labelsDom = [];
        this.state.original.label.map((v, k) => {
            let dom = (<span key={k}>{v} <span className="ico iconfont icon-guanbi" onClick={() => {
                this.state.original.label.splice(k, 1);
                this.refreshParam();
            }}> </span></span>);
            labelsDom.push(dom);
        });
        let paDom = [];
        this.state.pa.map((v, k) => {
            paDom.push(
                <div key={'unit' + k} id={v.media_id} className="unit">
                    <img src={v.thumbnail} alt="" />
                    <div>
                        <div>
                            {v.name}
                        </div>
                        <div>
                            <span>
                                {getDuration(v.duration)}
                            </span>
                            <span title="删除" className="ico iconfont icon-shanchu fr" onClick={() => {
                                this.state.pa.splice(k, 1);
                                this.refreshParam();
                            }}> </span>
                            <span title="取该影片缩略图作为合并后缩略图" className={this.state.original.thumbnail === v.thumbnail ? "ico iconfont icon-suolvetu current fr" : "ico iconfont icon-suolvetu fr"} onClick={() => {
                                this.state.original.thumbnail = v.thumbnail;
                                this.refreshParam();
                            }}> </span>
                        </div>
                    </div>
                </div>)
        });
        return (
            <div name={this.props.refresh} className={"dialog issue-project-live " + (this.props.issue.show ? 'show' : 'hidden')} style={{ zIndex: 999 }}>
                <div className="shadow" onClick={() => {
                    this.props.close();
                }}> </div>
                <div style={{ position: 'absolute', 'zIndex': '-1', marginLeft: '-88px', paddingLeft: '30px', width: '300px', opacity: 0 }} >
                    <input id="snapFile" accept="image/png, image/jpeg" onChange={() => {
                        this.upload();
                    }} type="file" /></div>
                <div className="scope">
                    <div className="win issue-project live">
                        <span className="ico iconfont icon-guanbi" onClick={() => {
                            this.props.close();
                        }}> </span>
                        <div className="main column">
                            <div className="crosswise">
                                {/*<span className='modal-tip'>
                                    <span className='ico iconfont icon-xingxing'></span>
                                </span>*/}
                                <div className="column column-list" style={{ display: this.state.pa.length > 1 ? 'flex' : 'none' }}>
                                    <p className="title">
                                        <span> </span>
                                        <span>剪辑列表</span> <span className="desc">上下移动可调整顺序</span>
                                    </p>
                                    <div className="short-list">
                                        {paDom}
                                    </div>
                                </div>
                                <div className="column column-left">
                                    <div className="base-info">
                                        <p className="title">
                                            <span> </span>
                                            <span>{say('main', 'basicInfo')}</span>
                                        </p>
                                        <div className="column">
                                            <div><span>{say('main', 'title')} <span className="color-r">*</span></span><Input id="issue-title" onChange={(e) => {
                                                e.target.value = e.target.value.replace
                                                    (verify_list.title, '');
                                                e.target.value = e.target.value.replace
                                                    (verify_list.title_start, '');
                                                this.state.original.name = e.target.value;
                                            }} type="text" placeholder={say('verify', 'say1')} maxLength={20} /></div>
                                            <div><span >{say('main', 'label')} <span className="color-r">*</span></span>
                                                <Select
                                                    mode="tags"
                                                    placeholder={say('verify', 'say2')}
                                                    notFoundContent=""
                                                    value={this.state.original.label}
                                                    style={{ width: '86%', maxWidth: '100%' }}
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
                                            <div><span>{say('main', 'intro')} <span className="color-r">*</span></span>
                                                <TextArea value={this.state.original.description} id="issue-desc" rows={4} onChange={(e) => {
                                                    this.state.original.description = e.target.value;
                                                    this.setState({ original: this.state.original })
                                                }} placeholder={say('verify', 'say3')} maxLength={200} /></div>
                                        </div>
                                    </div>
                                    <div className="platform">
                                        <p className="title">
                                            <span> </span>
                                            <span>{say('main', 'platform')}</span>
                                        </p>
                                        <div>
                                            {platform.length ? platform : '在账户界面绑定平台账号，可一键全平台发布，并统计到它们的表现数据。也可以不选择平台直接发行，在影片中可以导出到本地。'}
                                        </div>
                                    </div>
                                    <div className="sel-platform">
                                        <div className="o-h">
                                            <div className="selection live">
                                                {plat_list.length ? plat_list : ''}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="column column-right live" style={{ display: this.state.pa.length <= 1 ? 'flex' : 'none' }}>
                                    <div className="vision">
                                        {this.props.issue.show ? <video controls={true} src={this.state.pa[0] ? this.state.pa[0].media_url : ''} /> : ''}
                                    </div>
                                    <div className="screen-shot">
                                        <p className="title">
                                            <span>{say('main', 'thumbnail')}</span>
                                            <span className="ico iconfont icon-shuaxin c-p"
                                                onClick={() => {
                                                    this.getSnapshot();
                                                }}
                                            > </span>
                                        </p>
                                        <div className="crosswise snapShort" style={{ height: '125px' }}>
                                            {snapShort}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Dialog setting={this.state.alertInfo} />
                        </div>
                        <div className="issue-btn-area btn-area t-a-c">
                            <Button type="primary" onClick={() => {
                                this.generateMovie();
                            }}>
                                发布
                            </Button>
                            <Button type="primary" onClick={() => {
                                this.props.close();
                            }}>
                                取消
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}