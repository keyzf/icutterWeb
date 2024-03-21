/*
* 媒体资源数据池 轨道操作 文字转语音语音转文字素材信息*/
import channel from "@/channel";
import { message } from 'antd';
import { setTranslateAudio } from "./online-configs";
import { setTranslateSubtitle } from "./subtitles-config";

export let unit_unLoad = {};
let _refreshData = () => {

}
export function refreshData(refresh) {
    _refreshData = refresh;
};
function refresh() {
    let list = [];
    for (let i in unit_unLoad) {
        let v = unit_unLoad[i];
        channel('query_trans_result', { taskId: v.taskId }, (re) => {
            if (re.status === 1) {
                console.info(v);
                delete unit_unLoad[v.taskId];
                console.info(re)
                console.info('delete');
                if (v.type === 'audio') {
                    channel('get_media_status', { media_id: re.mediaId }, (re) => {
                        re[0]['media_type'] = 'audio';
                        let u = re[0]['media'];
                        u['media_id'] = (u['media_id'] || u['id']).toString();
                        for (let _i in u) {
                            u[_i.replace(/([A-Z])/g, "_$1").toLowerCase()] = u[_i];
                        }
                        message.info('转换成功，已替换在音频轨道');
                        setTranslateAudio(u, v.start);
                        setTimeout(() => {
                            _refreshData();
                        }, 2000)
                    }, () => {

                    })
                } else if (v.type === 'text') {
                    setTranslateSubtitle(JSON.parse(re['data']), v.start_time, v.end_time, v.project_id);

                } else {

                }
            } else if (re.status === 2) {
                message.info('转换失败，请稍后尝试');
                delete unit_unLoad[v.taskId];
            }
        }, () => {
            // message.info('转换失败，请稍后尝试');
            delete unit_unLoad[v.taskId];
        }, 'info')
    }
    // if(list.length){
    //     list.map((v,k)=>{
    //     })
    // }
}
let autoRefresh = setInterval(refresh, 3000);
export function initInterview() {
    clearInterval(autoRefresh);
    autoRefresh = setInterval(refresh, 3000);
}
export function clearTranslate() {
    clearInterval(autoRefresh);
    unit_unLoad = {};
}
