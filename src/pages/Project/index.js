import React from 'react';
import $ from 'jquery';
import { Input, Select, Icon } from 'antd';
import channel from '@/channel';
import { getUserInfo, refresh as refreshInfo } from "@/channel/userInfo";
import GoTop from "@/components/GoTop";
import List from './List';
import './index.scss';

const Search = Input.Search;
const Option = Select.Option;
let searchThing = '';
let sort_by = 'update_time';//排序对象
let desc = 1;//排序方式
let _checkMore = () => {

};
let list = [];
let max = ''; //当前共多少页
export default class Project extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: getUserInfo(),
            items: [],
            loading: false, // 加载中
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
        }else {
            document.attachEvent("onmousewheel", _checkMore);
        }
    }

    componentWillUnmount() {
        searchThing = '';
        sort_by = 'update_time';//排序对象
        desc = 1;//排序方式
        list = [];
        if (document.addEventListener) {
            document.removeEventListener("mousewheel", _checkMore, false);
        }else {
            document.detachEvent("onmousewheel", _checkMore);
        }
    }

    // 滚动加载
    checkMore() {
        if (this.state.items.length) {
            let last = $($('.main-list').find('ul').find('li')[this.state.items.length - 1]);
            if (last.length && last.offset().top < 730 && !this.state.loading) {
                this.state.page++;
                this.refreshData(true);
            }
        }
    }

    // 刷新数据 后台获取list数据
    refreshData(noEmpty) {
        if (max && this.state.page > max) {
            this.setState({ page: max }); return;
        }
        if (!noEmpty) {
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
            if (!noEmpty) {
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


    setItems(items) {
        this.setState({ items: items || [] },()=>{
            list = items || [];
        });
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
        const { items, loading, page } = this.state;
        return (
            <div>
                <div className="main-area haveTop">
                    <div className="main-list">
                        <div>
                            <div className="select">
                                <div className="f-r">
                                    <span className='sort-box'>
                                        <Select defaultValue={'time_desc'}
                                            showArrow={ false }
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
                            {loading ?
                                <div className='list-loading'>
                                    <Icon className='m-0-5' type="loading" />
                                    <span>加载中...</span>
                                </div>
                                : null}
                            {!items.length && !loading ?
                                <div className="hasnone">
                                    <svg className="logo icon" aria-hidden="true">
                                        <use xlinkHref="#icon-wuxiangmu"> </use>
                                    </svg>
                                    <p>
                                        <span>您还没有项目哦~</span>
                                    </p>
                                </div>
                                : null}
                            {page >= 2
                                ? <GoTop callBack={() => { $('.main-area').scrollTop(0); }} />
                                : null}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


