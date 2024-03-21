import React from 'react';
import $ from 'jquery';
import channel from '@/channel';
import { getParam } from "@/utils/handy";

let Main = React.createClass({
    componentWillMount() {
        $(window).scrollTop(0);
        let href = window.location.href;
        let token = getParam(href, 'token');
        let project_id = getParam(href, 'online');
        if (project_id) {
            channel('import_media', { dir_id: 0, data: decodeURI(href.split('online=')[1]) }, (re) => {
                let location = {
                    pathname: '/online',
                    state: re
                };
                this.props.history.replace(location)
            }, () => {
                this.props.history.replace('/project')
            });
        } else if (token) {
            localStorage.signature = token;
            let project_id = getParam(href, 'project_id');
            if (project_id) {
                this.props.history.replace('/online#' + project_id)
            } else {
                this.props.history.replace('/project')
            }
        } else {
            this.props.history.replace('/')
        }
    },
    render() {
        return (
            <div>
                正在进入视频编辑……
            </div>
        )
    }
});


export default Main;
