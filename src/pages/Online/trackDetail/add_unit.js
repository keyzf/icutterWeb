/* 轨道操作 添加素材到轨道 */
import text_config from '@/database/text_config';
import {cloneConfig} from "@/utils/handy";

export function add_unit(original) {
    let obj={};
    if(original.special){
        (original.obj_type==='text'&&original.copy)&&(original['obj_id']= +new Date()+'text_'+original.obj_id.split('_')[1]);
        return original;
    }
    original.duration=original.duration||5;
    original.thumbnail=original.thumbnail||'';
    original.video_preview_img=original.video_preview_img||'';
    original.audio_preview_img=original.audio_preview_img||'';
    original.uploading=original.uploading||'';
    original.preview_mp4=original.preview_mp4||'';
    original.preview_mp3=original.preview_mp3||'';
    original.preview_hls=original.preview_hls||'';
    original.status=original.status||'';
    original.media_url=original.media_url||'';
    original.sub_type=original.sub_type||'';
    let _videoType={
        "obj_type": original.media_type,  // 用户自己上传的视频素材
        "obj_id": original.media_id,  // 视频ID
        "duration": original.duration,  // 时长
        "name": original.name||'',  // 时长
        "start_time": original.start_time,  // 在轨道上开始位置（时间）
        "end_time": original.end_time,  // 在轨道上结束位置
        "effects": original.effects||'original',  // 滤镜
        "trans_start":original.trans_start||{},  // 转场
        "trans_end":original.trans_end||{},  // 转场
        "special": {  // 该对象特有属性
            "media_url": original.media_url,  // 视频URL
            "status": original.status,  // 视频URL
            "preview_hls": original.preview_hls,  // 预览URL（低码率）
            "preview_mp3": original.preview_mp3,  // 预览URL（低码率）
            "preview_mp4": original.preview_mp4,  // 预览URL（低码率）
            "sub_type": original.sub_type,  // 预览URL（低码率）
            "uploading": original.uploading,  // 预览URL（低码率）--------------------------------------
            "buffer": (original.buffer!==0&&!original.buffer)? undefined:original.buffer,  // 预览URL（低码率）-------------------------------
            "video_preview_img": original.video_preview_img,  // 视频缩略图
            "audio_preview_img": original.audio_preview_img,  // 音频缩略图
            "thumbnail": original.thumbnail,  // 视频封面图
            "start_range": original.start_range||0,  // 截取视频开始时间
            "end_range": original.end_range||original.duration,  // 截取视频结束时间
        },
        "transform": original.transform||{  // 基本变换
            "rotation": 0,  // 向左/向右旋转角度（-180——180）
            "flip": 0,  // 左右/上下翻转（0-无，1-上下、2-左右、3-上下+左右）
            "start_scale": 1.0,  // 开始缩放比例
            "end_scale": 1.0,  // 结束缩放比例
            "start_position_x": 0,  // 开始 距左
            "start_position_y": 0,  // 开始 距上
            "end_position_x": 0,  // 结束 距左
            "end_position_y": 0,  // 结束 距上
        },

    //     _obj['effects']=__obj['effects']||_obj['effects'];
    // _obj['trans_start']=__obj['trans_start']||_obj['trans_start'];
    // _obj['trans_end']=__obj['trans_end']||_obj['trans_end'];
    // _obj['transform']=__obj['transform']||_obj['transform'];
    // _obj['volume']=__obj['volume']||_obj['volume'];
    // _obj['specialeffect']=__obj['specialeffect']||_obj['specialeffect'];
    // _obj['color']=__obj['color']||_obj['color'];
        "volume": original.volume||{  // 声音
            "value": 100,  // 开始 音量大小
            "end_value": 1,  // 结束 音量大小
            "echoes": false,  // 是否加回声
        },
        "specialeffect":original.specialeffect||{  // 特效
            "back_play": false,  // 倒放
            "shake": false,  // 加晃动
            "deshake": false,  // 去抖动
            "vague_x": 0,  // 向X轴模糊
            "vague_y": 0,  // 向Y轴模糊
            "remove_logo": true,  // 是否去Logo，如果false，忽略下面的值
            "logo_x": 0,  // Logo 距左位置
            "logo_y": 0,  // Logo 距上位置
            "logo_width": 0,   // Logo 宽度
            "logo_height": 0,  // Logo 高度
        },
        "video_fade":[
            {
                "time_point": 0,  // 相对该视频时间点
                "visibility": 100,  // 透明度
                "fade_type": 0,  // 0-视频/图片/文本/背景，1-音频
            }
        ],
        "delogo":[],
        "color":original.color||{  // 色彩
            "brightness": 0,  // 亮度
            "contrast": 0,  // 对比度
            "saturation": 0,  // 饱和度
            "hue": 0,  // 色调
        },
        "colorkeying":{  // 抠图
            "select_color": "",  // 颜色
            "transparency": 0,  // 透明度 %
            "sensitivity": 1,  // 相似度 %
        },
        "speed": {  // 播放速度
            "value": 1,  // 倍率
        },
        "audio_fade":[
            {
                "time_point": 0,  // 相对该视频时间点
                "visibility": 100,  // 透明度
                "fade_type": 0,  // 0-视频/图片/文本/背景，1-音频
            },
            {
                "time_point": original.end_time||original.duration,  // 相对该视频时间点
                "visibility": 100,  // 透明度
                "fade_type": 0,  // 0-视频/图片/文本/背景，1-音频
            }
        ]
    };
    switch (original.media_type){
        case 'video':obj=_videoType;break;
        case 'audio':obj={
            "name": original.name||'',  // 时长
            "obj_type": original.media_type,  // 用户自己上传的视频素材
            "obj_id": original.media_id,  // 视频ID
            "duration": original.duration,  // 时长
            "start_time": original.start_time,  // 在轨道上开始位置（时间）
            "end_time": original.end_time,  // 在轨道上结束位置
            "effects": 'original',  // 滤镜
            "special": _videoType.special,
            "volume": _videoType.volume,
            "audio_fade":_videoType.audio_fade,
        };break;
        case 'image':obj={
            "name": original.name||'',  // 时长
            "obj_type": original.media_type,  // 用户自己上传的视频素材
            "obj_id": original.media_id,  // 视频ID
            "duration": original.duration,  // 时长
            "start_time": original.start_time,  // 在轨道上开始位置（时间）
            "end_time": original.end_time,  // 在轨道上结束位置
            "effects": 'original',  // 滤镜
            "trans_start":original.trans_start||{},  // 转场
            "trans_end":original.trans_end||{},  // 转场
            "special": _videoType.special,
            "delogo": _videoType.delogo,
            "transform":_videoType.transform,
            "specialeffect":_videoType.specialeffect,
            "color":_videoType.color,
            "video_fade":_videoType.video_fade,
            "colorkeying":_videoType.colorkeying,
        };break;
        case 'text':if(text_config[original.media_id]){
                obj=cloneConfig(text_config[original.media_id]);
                obj.obj_id=+new Date()+original.media_id;
                obj.duration=original.duration;
                obj['special']['thumbnail']=original.thumbnail;
                obj.start_time=original.start_time;
                obj.end_time=original.end_time;
                obj.effects='original';
                obj.trans_start=original.trans_start||{};
                obj.trans_end=original.trans_end||{};
            }else{
            switch (original.sub_type){
                case 'animation':
                    obj={
                        "name": original.name||'',  // 时长
                        "obj_type": original.media_type,  // 用户自己上传的视频素材
                        "obj_id": +new Date()+original.media_id,  // 视频ID
                        "duration": original.duration,  // 时长
                        "start_time": original.start_time,  // 在轨道上开始位置（时间）
                        "end_time": original.end_time,  // 在轨道上结束位置
                        "effects": 'original',  // 滤镜
                        "trans_start":original.trans_start||{},  // 转场
                        "trans_end":original.trans_end||{},  // 转场
                        "special": {
                            "media_url": original.media_url,  // 视频URL
                            "status": original.status,  // 视频URL
                            "preview_hls": original.preview_hls,  // 预览URL（低码率）
                            "preview_mp3": original.preview_mp3,  // 预览URL（低码率）
                            "preview_mp4": original.preview_mp4,  // 预览URL（低码率）
                            "sub_type": original.sub_type,  // 预览URL（低码率）
                            "uploading": original.uploading,  // 预览URL（低码率）--------------------------------------
                            "buffer": (original.buffer!==0&&!original.buffer)? undefined:original.buffer,  // 预览URL（低码率）-------------------------------
                            "video_preview_img": original.video_preview_img,  // 视频缩略图
                            "audio_preview_img": original.audio_preview_img,  // 音频缩略图
                            "thumbnail": original.thumbnail,  // 视频封面图
                            "start_range": 0,  // 截取视频开始时间
                            "end_range": original.end_range||original.duration,  // 截取视频结束时间
                            "text": "<p></p>",
                            "svg1": "",
                            "svg": "",
                            "position_x": 0,
                            "position_y": 0,
                            "position_w": 1000,
                            "position_h": 1000,
                            "move": 0,
                        },
                        "transform":_videoType.transform,
                        "layers":[],
                        "video_fade":_videoType.video_fade,
                    };break;
                default:
                    obj={
                        "name": original.name||'',  // 时长
                        "obj_type": original.media_type,  // 用户自己上传的视频素材
                        "obj_id": +new Date()+original.media_id,  // 视频ID
                        "duration": original.duration,  // 时长
                        "start_time": original.start_time,  // 在轨道上开始位置（时间）
                        "end_time": original.end_time,  // 在轨道上结束位置
                        "effects": 'original',  // 滤镜
                        "trans_start":original.trans_start||{},  // 转场
                        "trans_end":original.trans_end||{},  // 转场
                        "special": {
                            "media_url": original.media_url,  // 视频URL
                            "status": original.status,  // 视频URL
                            "preview_hls": original.preview_hls,  // 预览URL（低码率）
                            "preview_mp3": original.preview_mp3,  // 预览URL（低码率）
                            "preview_mp4": original.preview_mp4,  // 预览URL（低码率）
                            "sub_type": original.sub_type,  // 预览URL（低码率）
                            "uploading": original.uploading,  // 预览URL（低码率）--------------------------------------
                            "buffer": (original.buffer!==0&&!original.buffer)? undefined:original.buffer,  // 预览URL（低码率）-------------------------------
                            "video_preview_img": original.video_preview_img,  // 视频缩略图
                            "audio_preview_img": original.audio_preview_img,  // 音频缩略图
                            "thumbnail": original.thumbnail,  // 视频封面图
                            "start_range": 0,  // 截取视频开始时间
                            "end_range": original.end_range||original.duration,  // 截取视频结束时间
                            "text": "<p class=\"ql-align-center\"><span style=\"color: rgb(102, 185, 102);\">这是大标题</span></p><p class=\"ql-align-center\"><span style=\"color: rgb(102, 185, 102);\">这是副标题</span></p>",
                            "svg1": "data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"800\" height=\"400\"><foreignObject width=\"100%\" height=\"100%\"><div  xmlns=\"http://www.w3.org/1999/xhtml\"  style=\"font-size:100px;line-height:200px;letter-spacing:0px;padding-left: 0.2em;white-space:pre-wrap;word-break: break-all;\" ><p class=\"ql-align-center\" style=\"text-align: center; margin: 0px; padding: 0px; line-height: 200px; min-height: 200px;\"><span style=\"color: rgb(102, 185, 102); margin: 0px -1px;\">这是大标题</span></p><p class=\"ql-align-center\" style=\"text-align: center; margin: 0px; padding: 0px; line-height: 200px; min-height: 200px;\"><span style=\"color: rgb(102, 185, 102); margin: 0px -1px;\">这是副标题</span></p></div></foreignObject></svg>",
                            "svg": "",
                            "font_family": 0,
                            "bold": false,
                            "italic": false,
                            "underline": false,
                            "text_color": "rgb(0,0,0)",
                            "background_color": "rgb(0,0,0)",
                            "container_color": "rgb(0,0,0)",
                            "text_align": 1,
                            "line_height": 200,
                            "spacing": 0,
                            "font_size": 100,
                            "position_x": 0,
                            "position_y": 0,
                            "position_w": 1000,
                            "position_h": 1000,
                            "move": 0,
                        },
                        "transform":_videoType.transform,
                        "layers":[],
                        "video_fade":_videoType.video_fade,
                    };break;
            }
            }break;
    }
    return obj;
}