import React from 'react';
import $ from 'jquery';
import { Input, Modal, Icon, Select } from 'antd';
import channel from '@/channel';
import { getUserInfo, refresh as refreshInfo } from "@/channel/userInfo";
import project_config from '@/database/project_config';
import { confirm } from "@/components/Modal";
import List from './List';
import GoTop from "@/components/GoTop";

const Search = Input.Search;
const Option = Select.Option;
let searchThing = '';
let sort_by = 'update_time';//排序对象
let desc = 1;//排序方式
let _checkMore = () => {

};
let list = [];
let max = ''; //当前共多少页
export default class CreateProject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: getUserInfo(),
            items: [],
            loading: false, // 加载中
            modalVisible: false,
            modalText: '',
            page: 1,
            limit: 20,
            total: 0,
        };
    }

    componentWillMount() {
        $(window).scrollTop(0);
        if (!localStorage.signature) {
            this.props.history.push('/login');
        } else {
            refreshInfo((re) => {
                this.setState({ userInfo: re })
            });
            this.refreshData();
        }
    }

    componentDidMount() {
        _checkMore = this.checkMore.bind(this);
        if (document.addEventListener) {
            document.addEventListener("mousewheel", _checkMore, false);
        }
        else {
            document.attachEvent("onmousewheel", _checkMore);
        }
    }

    componentWillUnmount() {
        list = [];
        if (document.addEventListener) {
            document.removeEventListener("mousewheel", _checkMore, false);
        }
        else {
            document.detachEvent("onmousewheel", _checkMore);
        }
    }

    // 滚动加载
    checkMore() {
        let items = [].concat({
            temp: true,
            name: "创建项目", callBack: () => {
                this.setState({ modalVisible: true })
            }
        }, this.state.items);
        if (items.length) {
            let last = $($('.main-list').find('ul').find('li')[items.length - 1]);
            if (last.length && ($('.main-list').height() - last.offset().top) > 100 && !this.state.loading) {
                this.state.page++;
                this.refreshData(true);
            }
        }
    }

    // 刷新数据 后台获取list数据
    refreshData(isEmpty) {
        if (max && this.state.page > max) {
            this.state.page = max;
            return;
        }
        if (!isEmpty) {
            this.state.items = [];
            this.state.page = 1;
        }
        this.setState({ loading: true });
        channel('get_project_list', {
            desc: desc,
            sort_by: sort_by,
            name: searchThing,
            size: this.state.limit,
            page: this.state.page,
        }, (re) => {
            if (!isEmpty) {
                list = [];
            }
            let list1 = re.list || [];
            this.state.total = re.totalPages || 0;
            this.state.page = re.page || 1;
            max = re.totalPages;
            list1.map((v) => {
                list.push(v);
            });
            this.state.loading = false;
            this.setState({ items: list });
        });
    }

    // 创建项目
    createProject(name) {
        localStorage.projectName = name || this.state.modalText || '我的项目';
        project_config.name = name || this.state.modalText || '我的项目';
        project_config['is_template'] = 0;//缺省值为0-普通项目，1-用户模板，2-系统模板；
        channel('save_project_config', JSON.stringify(project_config), (re) => {
            this.props.history.push('/online#' + re.project_id)
        }, '', 'info')
    }

    setItems(items) {
        this.setState({ items: items || [] });
        list = this.state.items;
    }

    delItems(list) {
        confirm(
            '确定要删除这些项目么？',
            'trash_project',
            { project_id: list.join(('|')), action: 2 },
            this.refreshData.bind(this)
        )
    }

    // 排序
    getSortBy(val) {
        switch (val) {
            case 'time_asc':
                sort_by = 'update_time';
                desc = 0;
                break;
            case 'time_desc':
                sort_by = 'update_time';
                desc = 1;
                break;
            case 'name_asc':
                sort_by = 'name';
                desc = 0;
                break;
            case 'name_desc':
                sort_by = 'name';
                desc = 1;
                break;
        }
        this.refreshData();
    }

    render() {
        let items = [].concat({
            temp: true,
            name: "创建项目", callBack: () => {
                this.setState({ modalVisible: true })
            }
        }, this.state.items);
        return (
            <div>
                <div className="main-area haveTop">
                    <div className="main-list">
                        <div>
                            <div className="select">
                                <div className="f-r">
                                    <span className='sort-box'>
                                        <Select defaultValue={'time_desc'}
                                            showArrow={false}
                                            style={{ width: 94 }}
                                            onChange={(val) => {
                                                this.getSortBy(val)
                                            }}>
                                            <Option value="time_asc">按时间升序</Option>
                                            <Option value="time_desc">按时间降序</Option>
                                            <Option value="name_asc">按名称升序</Option>
                                            <Option value="name_desc">按名称降序</Option>
                                        </Select>
                                        <span className='sortIco ico iconfont icon-zhengxu'> </span>
                                    </span>
                                    <Search
                                        placeholder="请输入关键词搜索"
                                        onSearch={(value) => {
                                            searchThing = value;
                                            this.refreshData();
                                        }}
                                        style={{ width: 200 }}
                                    />
                                </div>
                            </div>
                            <List
                                items={items}
                                history={this.props.history}
                                setItems={this.setItems.bind(this)} />
                            {this.state.loading ?
                                <div className='list-loading'>
                                    <Icon className='m-0-5' type="loading" />
                                    <span>加载中...</span>
                                </div>
                                : null}
                            {!items.length && !this.state.loading ?
                                <div className="hasnone">
                                    <svg className="logo icon" aria-hidden="true">
                                        <use xlinkHref="#icon-wuxiangmu"> </use>
                                    </svg>
                                    <p>
                                        <span>您还没有项目哦~</span>
                                    </p>
                                </div>
                                : null}
                            {this.state.page >= 2
                                ? <GoTop callBack={() => { $('.main-area').scrollTop(0); }} />
                                : null}
                        </div>
                    </div>
                </div>
                <Modal title='创建项目'
                    visible={this.state.modalVisible}
                    style={{ top: 200 }}
                    maskClosable={false}
                    onOk={() => {
                        this.createProject();
                    }}
                    onCancel={() => {
                        this.setState({ modalVisible: false })
                    }}
                >
                    <p><Input
                        placeholder="请输入项目名称"
                        onBlur={(e) => {
                            this.state.modalText = e.target.value;
                        }}
                        onPressEnter={(e) => {
                            this.createProject(e.target.value);
                        }} /></p>
                </Modal>
            </div>
        )
    }
}


