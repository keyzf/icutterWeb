/*
* 媒体资源数据池 轨道操作 获取素材信息*/
import channel from "@/channel";

let unit_reader=()=>{

}
let load_reader=()=>{

}
export let video_list={};
export let hls_list={};
export let unit_unLoad={};
export let unit_initList={};
export let load_unLoad={};
export let load_unInit={};
//音频谱图json缓存
export let audio_preview_list={};
//媒资信息
export function set_audio_preview_list(data,id) {
    audio_preview_list[id]=data;
}
export function unit_callback(func) {
    unit_reader=func;
}
export function load_callback(func) {
    load_reader=func;
}
function refresh() {
    let list=[];
    for(let i in unit_unLoad){
        i&&(list.push(i));
    }
    for(let i in load_unLoad){
        i&&(list.push(i));
    }
    for(let i in load_unInit){
        i&&(list.push(i));
    }
    if(list.length){
      // aspect: null
      // audioPreviewImg: null
      // audioPreviewMp3: null
      // bak: null
      // baseName: "6233580e677f4194931e3a36ec847da0"
      // created: "2020-07-14 20:07:19"
      // dirId: -1
      // directory: ""
      // duration: 0
      // fileSize: 7601
      // fps: 0
      // height: 0
      // id: 791
      // materialFrom: 0
      // materialType: 0
      // mediaType: "audio"
      // mediaUrl: "https://quickstatic.pdnews.cn/user/1581213894965092020-07-14_20:07:17.mp3"
      // name: "2020-07-14_20:07:17.mp3"
      // status: 0
      // statusCn: "初始化中"
      // thumbnail: "https://kuaibian.s3.cn-north-1.jdcloud-oss.com/002d720e83944b91ab9d49b1f5680ebf/image/previewImg.jpg"
      // user: null
      // videoPreviewHls: null
      // videoPreviewImg: null
      // videoPreviewMp4: null
      // videoResolution: null
      // videoTimelineThumbnail: ""
      // width: 0
      //
        channel('get_media_status',{media_id:list.join('|')},(re)=>{
          for(let i =0;i<re.length;i++){
            let u=re[i]['media']||{};
            u['media_id'] = (u['media_id'] || u['id']).toString();
            for (let _i in u) {
              u[_i.replace(/([A-Z])/g, "_$1").toLowerCase()] = u[_i];
              u['preview_mp3']=u['audio_preview_mp3'];
              u['preview_hls']=u['video_preview_hls'];
              u['preview_mp4']=u['video_preview_mp4'];
            }
            re[i]=u;
          }
            unit_reader(re);
            load_reader(re);
        },()=>{

        })
    }
}
let autoRefresh=setInterval(refresh,10000);
export function initInterview() {
    clearInterval(autoRefresh);
    autoRefresh=setInterval(refresh,10000);
    let temp=setTimeout(refresh,5000);
}
export function clearOnlineList() {
    audio_preview_list={};
    clearInterval(autoRefresh);
    video_list = {};
    hls_list={};
    unit_unLoad={};
    unit_initList={};
    load_unLoad={};
    load_unInit={};
}
