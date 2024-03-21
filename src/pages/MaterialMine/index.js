import React from 'react';
import $ from 'jquery';
import { Input, Select, Icon } from 'antd';
import channel from '@/channel';
import say from '@/database/local_language';
import { getUserInfo, refresh as refreshInfo } from "@/channel/userInfo";
import uploading from '@/channel/clipFileUpload';
import List from './List';
import GoTop from "@/components/GoTop";

const Search = Input.Search;
const Option = Select.Option;

let searchThing = '';
let sort_by = 'add_time';//排序对象
let desc = 1;//排序方式
let media_type = 'all';//文件类型
let auto_refresh = '';
let _checkMore = () => {

};
let list = [];
let max = ''; //当前共多少页
export default class MaterialMine extends React.Component {
    state = {
        userInfo: getUserInfo(),
        items: [],
        files: [],
        page: 1,
        limit: 20,
        loading: false, // 加载中
        total: 0,
        uploadBuffer: [], // 将要上传但是还没有上传成功的素材
    };

    componentWillMount() {
        $(window).scrollTop(0);
        !localStorage.signature && this.props.history.push('/login');
        refreshInfo((re) => {
            this.setState({ userInfo: re });
        });
        this.refreshData();
    }

    componentDidMount() {
        uploading.refresh(this.refreshData.bind(this));
        _checkMore = this.checkMore.bind(this);
        if (document.addEventListener) {
            document.addEventListener("mousewheel", _checkMore, false);
        }else {
            document.attachEvent("onmousewheel", _checkMore);
        }
    }

    componentWillUnmount() {
        clearTimeout(auto_refresh);
        searchThing = '';
        sort_by = 'add_time';//排序对象
        desc = 1;//排序方式
        media_type = 'all';//文件类型
        list = [];
        uploading.refresh();
        if (document.addEventListener) {
            document.removeEventListener("mousewheel", _checkMore, false);
        }else {
            document.detachEvent("onmousewheel", _checkMore);
        }
    }

    // 滚动加载
    checkMore() {
        let items = [].concat(this.state.uploadBuffer, this.state.items);
        if (items.length) {
            let last = $($('.main-list').find('ul').find('li')[items.length - 1]);
            if (last.length && last.offset().top < 730 && !this.state.loading) {
                this.state.page++;
                this.refreshData('', true);
            }
        }
    }

    // 刷新数据 后台获取list数据
    refreshData(files, noEmpty) {
        if (files) {
            let temp = [];
            for (let i = 0; i < files.length; i++) {
                if (files[i].dir_id === 0 && !files[i].done && !files[i].cancel_upload) {
                    temp.push(files[i]);
                }
            }
            this.setState({ 'uploadBuffer': temp })
        } else {
            if (max && this.state.page > max) {
                this.state.page = max;
                return;
            }
            if (!noEmpty) {
                this.state.items = [];
                this.state.page = 1;
            }
            this.setState({ loading: true });
            channel('get_media_list', {
                media_type: media_type,
                desc: desc,
                sort: sort_by,
                name: searchThing,
                size: this.state.limit,
                page: this.state.page,
            }, (re) => {
                if (!noEmpty) {
                    list = [];
                }
                let list1 = re.list || [];
                let _obj = {};
                this.state.total = re.totalPages || 0;
                this.state.page = parseInt(re.page) || 1;
                max = re.totalPages;
                this.state.items.map((v, k) => {
                    if (v['checked']) {
                        _obj[v.media_id] = true;
                    }
                });
                list1.map((v, k) => {
                    v['plat'] = 'onvideo';
                    if (_obj[v.media_id]) {
                        v['checked'] = true;
                    }
                    v['selected'] = false;
                    if (v.status !== 3) {
                        list.push(v);
                    }
                });
                for (let i = 0; i < list.length; i++) {
                    if (list[i].status === 0 || list[i].status === 4) {
                        if (list[i].add_time && new Date() - new Date(list[i].add_time) < 1000 * 60 * 60 * 5) {
                            this.changeStatus();
                        }
                    }
                }
                this.state.loading = false;
                this.setState({ items: list });
                this.state.uploadBuffer = [];
                if (uploading) {
                    let files = uploading.getFiles();
                    for (let i = 0; i < files.length; i++) {
                        if (files[i].dir_id === 0 && !files[i].done && !files[i].cancel_upload) {
                            this.state.uploadBuffer.push(files[i]);
                        }
                    }
                }
            });
        }
    }

    changeStatus() {
        channel('get_media_list', {
            media_type: media_type,
            desc: desc,
            sort_by: sort_by,
            name: searchThing,
            size: 1000,
            page: 1,
            trash: 0
        }, (re) => {
            let list = re.list || [];
            this.state.items.map((item) => {
                for (let i = 0; i < list.length; i++) {
                    if (item.media_id === list[i].media_id) {
                        item = { ...item, ...list[i] }
                    }
                }
            });
            this.setItems(this.state.items);
            clearTimeout(auto_refresh);
            for (let i = 0; i < list.length; i++) {
                if (list[i].status === 0 || list[i].status === 4) {
                    if (list[i].add_time && new Date() - new Date(list[i].add_time) < 1000 * 60 * 60 * 5) {
                        auto_refresh = setTimeout(() => {
                            this.changeStatus();
                        }, 5000);
                        break;
                    }
                }
            }
        });

    }

    // 选中的items
    setItems(items) {
        this.setState({ items: items || [] });
        list = this.state.items;
    }

    getMediaType(val) {
        media_type = val;
        this.refreshData();
    }

    upload() {
        uploading.upload(0, '', localStorage.team || '');
    }

    render() {
        let items = [].concat({
            temp: true, name: "上传素材", callBack: () => {
                $('#file').click();
            }
        }, this.state.uploadBuffer, this.state.items);
        return (
            <div>
                <div style={{ position: 'absolute', 'zIndex': '-1', marginLeft: '-88px', paddingLeft: '30px', width: '300px', opacity: 0 }} ><input onChange={this.upload} type="file" id="file" multiple /></div>
                <div className="main-area haveTop">
                    <div className="main-list" >
                        <div>
                            <div className="select" >
                                <div>
                                    <Search
                                        placeholder={say('main', 'search')}
                                        onSearch={(value) => {
                                            searchThing = value;
                                            this.refreshData();
                                        }}
                                        style={{ width: 200 }}
                                    />
                                    <Select className='all-box'
                                        defaultValue={'all'} onChange={(val) => {
                                            this.getMediaType(val)
                                        }}>
                                        <Option value="all">{say('main', 'all')}</Option>
                                        <Option value="video">{say('main', 'video')}</Option>
                                        <Option value="audio">{say('main', 'audio')}</Option>
                                        <Option value="image">{say('main', 'image')}</Option>
                                    </Select>
                                </div>
                            </div>
                            <List
                                items={items}
                                userInfo={this.state.userInfo}
                                history={this.props.history}
                                setItems={this.setItems.bind(this)}
                            />
                            {this.state.loading ?
                                <div className='list-loading'>
                                    <Icon className='m-0-5' type="loading" />
                                    <span>加载中...</span>
                                </div>
                                : null}
                            {!items.length && !this.state.loading ?
                                <div className="hasnone">
                                    <svg className="logo icon" aria-hidden="true">
                                        <use xlinkHref="#icon-wusucai"> </use>
                                    </svg>
                                    <p>
                                        <span>您还没有素材哦~</span>
                                    </p>
                                </div> : null
                            }
                            {this.state.page >= 2
                                ? <GoTop callBack={() => { $('.main-area').scrollTop(0); }} />
                                : null}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


