/* 轨道操作  轨道上字幕对象的处理 */
import $ from 'jquery';
import { message } from 'antd';
import channel from '@/channel';
import { refreshDuration } from "./online-configs";

export let config = {
    current: 0,
    list: []
};
let project_id = 0;
let sub_language = 'zh';
let second_language = '';
let second_list = [];
export let language_list = [
    {
        'language': 'zh',
        'desc': '中文',
    },
    {
        'language': 'en',
        'desc': '英语',
    },
];
export function clear() {

}
export function init_subtitles(id) {
    project_id = id;
    /*  channel('get_text_language', {}, (re) => {
         if(re.length){
             channel('get_text_language', {project_id: project_id}, (r) => {
                 if(r.length){
                     re.map((language)=>{
                         if(JSON.stringify(r).indexOf(JSON.stringify(language)) !== -1){
                             language['selected'] = true;
                         }else {
                             language['selected'] = false;
                         }
                     })
                 }
                     language_list = re;
             });
         }
     }); */
    get_text_list(language_list[0]['language']);
}
export function get_text_list(lan, second_lan) {
    sub_language = lan || sub_language;
    second_language = second_lan || '';
    if (project_id && project_id != 0) {
        console.info(project_id);
        channel('get_text_list', { project_id: project_id, language: sub_language }, (re) => {
            second_list = [];
            if (second_language) {
                channel('get_text_list', { project_id: project_id, language: second_language }, (_re) => {
                    second_list = _re;
                    init_list(re);
                }, () => {
                    init_list(re);
                });
            } else {
                init_list(re);
            }
        }, () => {
            second_list = [];
            init_list([]);
        });
    } else {
        second_list = [];
        init_list([]);
    }
}
let refresh = (config) => {

};
export function set_refresh(func) {
    refresh = func
}
export function init_list(list) {
    config = {
        current: config.current || 0,
        list: list
    };
    _refresh_duration(config)
}
export function set_current(n) {
    config.current = n < config.list.length ? n : 0;
    // refresh(config)
}
export function set_list_text(text, id) {
    config.list.map((v, k) => {
        if (v.text_id === id) {
            //let lineWidth=0;
            //let last=0;
            //let array=[];
            //for(let i=0;i<v.text.length;i++){
            //      lineWidth+=context.measureText(v.text[i]).width;
            //      if(lineWidth>canvas.width/10*9)
            console.info(v.text !== text)
            if (v.text !== text) {
                // let lineWidth=0;
                // let last=0;
                // let array=[];
                // for(let i=0;i<v.text.length;i++){
                //     lineWidth+=context.measureText(v.text[i]).width;
                //     if(lineWidth>canvas.width/10*9){
                //         array.push(v.text.substring(last,i));
                //         lineWidth=0;
                //         last=i;
                //     }
                //     if(i===v.text.length-1){
                //         array.push(v.text.substring(last,i+1));
                //     }
                // }
                v.text = text;
                refresh(config)
            }
        } else if (v.chinese_id === id) {
            v.chinese = text;
            refresh(config)
        }
    });
}
export function set_list_site(time, id) {
    config.list.map((v, k) => {
        if (v.text_id === id) {
            let start = Math.round(time[0] * 25) / 25;
            let end;
            let reset = false;
            if (start < 0) {
                start = 0;
                reset = true;
            }
            if (time.length > 1) {
                end = Math.round(time[1] * 25) / 25;
            } else {
                let duration = v.end_time - v.start_time;
                end = Math.round((start + duration) * 25) / 25;
            }
            if (end > start && start >= 0) {
                v.start_time = start;
                v.end_time = end;
            }
            if (reset) {
                let _config = config;
                refresh({
                    current: 0,
                    list: []
                });
                refresh(_config)
            }
            refresh(config)
        }
    });
}
export function sub_del(ids) {
    let id = ids.join('|');
    if (id) {
        channel('trash_text_list', { text_id: id }, (re) => {

            for (let i = config.list.length - 1; i >= 0; i--) {
                console.info(config.list[i].text_id);
                for (let j = ids.length - 1; j >= 0; j--) {
                    if (config.list[i].text_id === ids[j]) {
                        config.list.splice(i, 1);
                        break;
                    }
                }
            }
            _refresh_duration();
        })
    }
}
export function render_list(obj) {
    // pre_config=JSON.stringify(getConfig());
}
export function get_list() {
    return config;
}
function _refresh_duration() {
    let end = 0;
    if (config.list) {
        for (let i = 1; i < 5; i++) {
            if (config.list.length >= i) {
                let _end = config.list[config.list.length - i].end_time;
                end = _end > end ? _end : end;
            }
        }
        if (second_language !== sub_language && second_list.length) {
            config.list.map((v, k) => {
                if (second_list[k]) {
                    v['chinese'] = second_list[k].text;
                    v['chinese_id'] = second_list[k].text_id;
                    v['chinese_start_time'] = second_list[k].start_time;
                    v['chinese_end_time'] = second_list[k].end_time;
                } else {
                    v['chinese'] = '';
                    v['chinese_id'] = '';
                    v['chinese_start_time'] = '';
                    v['chinese_end_time'] = '';
                }
            })
        }
    }
    refreshDuration('subtitle', end);
    refresh(config);
}
export function setTranslateSubtitle(obj, start_time, end_time, project_id) {
    console.info(obj);
    let start = start_time || 0,
        end = end_time || 0;
    let list = config.list;
    let index = list.length, length = list.length;
    for (let i = 0; i < list.length; i++) {
        if (list[i].end_time > start) {
            index = i;
            break;
        }
    }
    for (let i = 0; i < list.length; i++) {
        if (list[i].start_time >= end) {
            length = i;
            break;
        }
    }
    let del_list = list.splice(index, length - index);
    // let first=list.slice(0,index);
    // let third=list.slice(end);
    for (let i = obj.length - 1; i >= 0; i--) {
        list.splice(index, 0, {
            end_time: obj[i].end_time * 1 + start * 1,
            language: "zh",
            project_id: project_id,
            start_time: obj[i].begin_time * 1 + start * 1,
            text: obj[i].text,
            text_id: "",
        });
    }
    let ids = [];
    del_list.map((v, k) => {
        ids.push(v.text_id);
    });

    // let new_list=first.concat(obj,third);

    let _new = {
        "project_id": project_id || '0',
        "projectId": project_id || '0',
        "text_list": list
    };
    channel('save_text_info', JSON.stringify(_new), (re) => {
        if (ids.length) {
            channel('trash_text_list', { text_id: ids.join('|') }, (re) => {
                get_text_list();
                message.success("智能字幕制作完成，制作完成的字幕将会覆盖轨道上已存在的字幕。")
               /*  Modal.info({
                    title: '智能字幕制作完成',
                    content: '制作完成的字幕将会覆盖轨道上已存在的字幕',
                    style: {
                        top: 200
                    },
                    cancelText: ''
                }); */
            }, () => {

            }, 'info')
        } else {
            get_text_list();
            message.success("智能字幕制作完成，制作完成的字幕将会覆盖轨道上已存在的字幕。")
           /*  Modal.info({
                title: '智能字幕制作完成',
                content: '制作完成的字幕将会覆盖轨道上已存在的字幕',
                style: {
                    top: 200
                },
                cancelText: ''
            }); */
        }
    }, () => {

    }, 'info');
    _refresh_duration();
}
export function sub_add(obj) {
    channel('save_text_info', JSON.stringify(obj), (re) => {
    }, () => {

    }, 'info');
    _refresh_duration();
}
export function sub_move(obj) {
    let list = config.list;
    let flag = list.length - 1, _flag = 0;
    for (let i = 0; i < list.length; i++) {
        if (list[i].text_id === obj.text_id) {
            list.splice(i, 1);
            break;
        }
    }
    for (let i = 0; i < list.length; i++) {
        if (list[i].start_time > obj.start_time) {
            flag = i;
            break;
        }
    }
    config.list.splice(_flag || flag, 0, obj);
    let _new = {
        "project_id": obj.project_id,
        "projectId": obj.project_id,
        "text_list": [obj,
        ]
    };
    channel('save_text_info', JSON.stringify(_new), (re) => {
    }, () => {

    }, 'info')
    _refresh_duration();
}
export function sub_change(obj, reset, chinese) {
    let c = config.current;
    obj['language'] = sub_language;
    if (chinese) {
        let _new = {
            "project_id": obj.project_id,
            "projectId": obj.project_id,
            "text_list": [
                {
                    language: second_language || 'zh',
                    text_id: obj.chinese_id || '',
                    start_time: obj.chinese_start_time,
                    end_time: obj.chinese_end_time,
                    text: obj.chinese || ''
                },
            ]
        }
        channel('save_text_info', JSON.stringify(_new), (re) => {
            let _new = {
                project_id: obj.project_id,
                text_id: obj.chinese_id || re[0],
                start_time: obj.chinese_start_time,
                end_time: obj.chinese_end_time,
                text: obj.chinese || ''
            };
            second_list.map((v, k) => {
                if (v.text_id === _new.text_id) {
                    second_list[k] = _new;
                }
            });
            _refresh_duration()
        }, () => {

        }, 'info')
    } else {
        let _new = {
            "project_id": obj.project_id,
            "projectId": obj.project_id,
            "text_list": [{
                language: obj.language || 'zh',
                text_id: obj.text_id || '',
                start_time: obj.start_time,
                end_time: obj.end_time,
                text: obj.text || ''
            },
            ]
        }
        channel('save_text_info', JSON.stringify(_new), (re) => {
            let flag = 0, _flag = 0;
            let array = [];
            let _new = {
                project_id: obj.project_id,
                text_id: obj.text_id || re[0],
                start_time: obj.start_time,
                end_time: obj.end_time,
                text: obj.text || '',
                chinese: obj.chinese || '',
                chinese_id: obj.chinese_id || '',
                chinese_start_time: obj.chinese_start_time,
                chinese_end_time: obj.chinese_end_time
            };
            config.list.map((v, k) => {
                if (v.text_id === _new.text_id) {
                    array = config.list.splice(k, 1);
                    if (v.start_time === obj.start_time && !reset) {
                        _flag = k
                    }
                }
            });
            config.list.map((v, k) => {
                if (v.start_time < obj.start_time) {
                    flag = k + 1;
                }
            });
            if (!array.length) {
                setTimeout(() => {
                    $('.subtitles-content >div').eq(flag).find('textarea').focus();
                });
            }
            if (reset) {
                config.current = flag;
            }
            config.list.splice(_flag || flag, 0, _new);
            _refresh_duration()
        }, () => {

        }, 'info')
    }
}
export function clear_list() {
    config = {
        current: 0,
        list: []
    };
}
