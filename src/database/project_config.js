const project_config = {
    "project_id": '0', // 0-新建，非0-修改。缺省值0
    "name": "项目",
    "duration": 123,
    "portrait":false,
    "text_info":{
        "font_size": 50,
        "status":false,
        "font_color": 'ffffff',
        "font_name": 'FZShuSong-Z01S',
        "background_color": '000000',
        "alpha": 0,
        "position_x": 'middle',  // 水平位置，left, middle, right
        "position_y": 50,  // 底部间距，px
    },
    "auto_indent": true,  // 是否自动对齐（磁铁工具）
    "themes": 'zhuti',  // 主题
    "theme_id": '',  // 主题
    "video_list": [  // 视频轨道列表
        {
            "name": "图像轨",  // 名称
            "order": 1,  // 排序
            "volume": 0,
            "duration": 123,
            "update_time": "2017-08-02 12:21:12",  // 最近更新时间
            "lock_track": false,  // 是否锁定
            "obj_list": [  // 轨道上的对象列表
                // {
                //     "obj_type": "video",  // 用户自己上传的视频素材
                //     "obj_id": "123456",  // 视频ID
                //     "duration": 10.32,  // 时长
                //     "start_time": 0,  // 在轨道上开始位置（时间）
                //     "end_time": 10.32,  // 在轨道上结束位置
                //     "effects": 0,  // 滤镜
                //     "special": {  // 该对象特有属性
                //         "video_url": "/media/video/1/name.flv",  // 视频URL
                //         "preview_url": "/media/video/1/preview.mp4",  // 预览URL（低码率）
                //         "video_preview_img": "/media/video/1/video_preview.png",  // 视频缩略图
                //         "audio_preview_img": "/media/video/1/audio_preview.png",  // 音频缩略图
                //         "thumbnail": "/media/video/1/thumbnail.png",  // 视频封面图
                //         "start_range": 0.0,  // 截取视频开始时间
                //         "end_range": 10.0,  // 截取视频结束时间
                //     },
                //     "transform": {  // 基本变换
                //         "rotation": 0,  // 向左/向右旋转角度（-180——180）
                //         "flip": 0,  // 左右/上下翻转（0-无，1-上下、2-左右、3-上下+左右）
                //         "start_scale": 1.0,  // 开始缩放比例
                //         "end_scale": 1.0,  // 结束缩放比例
                //         "start_position_x": 50,  // 开始 距左
                //         "start_position_y": 50,  // 开始 距上
                //         "end_position_x": '',  // 结束 距左
                //         "end_position_y": 50,  // 结束 距上
                //            "blurred":false,//背景模糊
                //     },
                //     "volume": {  // 声音
                //         "start_value": 100,  // 开始 音量大小
                //         "end_value": 100,  // 结束 音量大小
                //         "echoes": false,  // 是否加回声
                //     },
                //     "specialeffect": {  // 特效
                //         "back_play": false,  // 倒放
                //         "shake": false,  // 加晃动
                //         "deshake": false,  // 去抖动
                //         "vague_x": 0,  // 向X轴模糊
                //         "vague_y": 0,  // 向Y轴模糊
                //         "remove_logo": true,  // 是否去Logo，如果false，忽略下面的值
                //         "logo_x": 100,  // Logo 距左位置
                //         "logo_y": 100,  // Logo 距上位置
                //         "logo_width": 50,   // Logo 宽度
                //         "logo_height": 50,  // Logo 高度
                //     },
                //     "fade": [
                //         {
                //             "time_point": 0.0,  // 相对该视频时间点
                //             "visibility": 0,  // 透明度
                //             "fade_type": 0,  // 0-视频/图片/文本/背景，1-音频
                //         },
                //         {
                //             "time_point": 0.0,
                //             "visibility": 0,  // 音量大小
                //             "fade_type": 1,
                //         },
                //         {
                //             "time_point": 3.0,
                //             "visibility": 100,
                //             "fade_type": 0,
                //         },
                //         {
                //             "time_point": 3.0,
                //             "visibility": 100,
                //             "fade_type": 1,
                //         },
                //     ],
                //     "color": {  // 色彩
                //         "brightness": 0,  // 亮度
                //         "contrast": 0,  // 对比度
                //         "saturation": 0,  // 饱和度
                //         "hue": 0,  // 色调
                //     },
                //     "colorkeying": {  // 抠图
                //         "select_color": "dc00a4",  // 颜色
                //         "transparency": 100,  // 透明度 %
                //         "sensitivity": 100,  // 相似度 %
                //     },
                //     "speed": {  // 播放速度
                //         "value": 2,  // 倍率
                //     }
                // },
                // {
                //     "obj_type": "transitions",  // 转场
                //     "obj_id": 3,  // 转场特效类型ID
                //     "duration": 3,
                //     "start_time": 10.32,
                //     "end_time": 13.32,
                //     "effects": 0,
                // },
                // {
                //     "obj_type": "image",  // 用户自己上传图片素材
                //     "obj_id": "123456",
                //     "duration": 5,
                //     "start_time": 13.32,
                //     "end_time": 18.32,
                //     "effects": 0,
                //     "special": {
                //         "img_url": "http://www.domain.com/media/image/name.jpg",
                //     },
                //     "transform": {},
                //     "color": {},
                // },
                // {
                //     "obj_type": "text",  // 文本
                //     "obj_id": 4,
                //     "duration": 5,
                //     "start_time": 18.32,
                //     "end_time": 23.32,
                //     "effects": 0,
                //     "special": {
                //         "text": "Hello World",  // 文本内容
                //         "font_family": 0,  // 字体样式
                //         "bold": false,  // 是否加粗
                //         "italic": false,  // 是否倾斜
                //         "underline": false,  // 是否加下划线
                //         "text_color": "rgb(0,0,0)",  // 文字颜色
                //         "background_color": "rgb(0,0,0)",  // 文字背景颜色
                //         "container_color": "rgb(0,0,0)",  // 文本框颜色
                //         "text_align": 1,  // 对齐方式（0-水平靠左，1-水平居中，2-水平靠右，3-垂直靠上，4-垂直居中，5-垂直靠下）
                //         "line_height": 100,  // 行间距
                //         "spacing": 0,  // 字间距
                //         "start_font_size": 100,  // 开始 字体大小
                //         "end_font_size": 100,  // 结束 字体大小
                //         "start_position_x": 240,  // 开始 距左位置
                //         "start_position_y": 240,  // 开始 距上位置
                //         "end_position_x": 240,  // 结束 距左位置
                //         "end_position_y": 240,  // 结束 距上位置
                //         "move": 0,  // 滚动方式 0-不滚，1-上下滚动，2-左右游动
                //     },
                // },
                // {
                //     "obj_type": "graphics",  // 系统自带图片市场 素材
                //     "obj_id": 1,
                //     "duration": 5,
                //     "start_time": 23.32,
                //     "end_time": 28.32,
                //     "effects": 0,
                //     "transform": {},
                //     "animation": {},
                //     "fade": [],
                //     "color": {},
                //     "colorkeying": {},
                //     "speed": {},
                // },
            ]
        },
        {
            "name": "图像轨",  // 名称
            "order": 1,  // 排序
            "volume": 100,
            "duration": 123,
            "update_time": "2017-08-02 12:21:12",  // 最近更新时间
            "lock_track": false,  // 是否锁定
            "obj_list": [  // 轨道上的对象列表
                // {
                //     "obj_type": "video",  // 用户自己上传的视频素材
                //     "obj_id": "123456",  // 视频ID
                //     "duration": 10.32,  // 时长
                //     "start_time": 0,  // 在轨道上开始位置（时间）
                //     "end_time": 10.32,  // 在轨道上结束位置
                //     "effects": 0,  // 滤镜
                //     "special": {  // 该对象特有属性
                //         "video_url": "/media/video/1/name.flv",  // 视频URL
                //         "preview_url": "/media/video/1/preview.mp4",  // 预览URL（低码率）
                //         "video_preview_img": "/media/video/1/video_preview.png",  // 视频缩略图
                //         "audio_preview_img": "/media/video/1/audio_preview.png",  // 音频缩略图
                //         "thumbnail": "/media/video/1/thumbnail.png",  // 视频封面图
                //         "start_range": 0.0,  // 截取视频开始时间
                //         "end_range": 10.0,  // 截取视频结束时间
                //     },
                //     "transform": {  // 基本变换
                //         "rotation": 0,  // 向左/向右旋转角度（-180——180）
                //         "flip": 0,  // 左右/上下翻转（0-无，1-上下、2-左右、3-上下+左右）
                //         "start_scale": 1.0,  // 开始缩放比例
                //         "end_scale": 1.0,  // 结束缩放比例
                //         "start_position_x": 50,  // 开始 距左
                //         "start_position_y": 50,  // 开始 距上
                //         "end_position_x": 50,  // 结束 距左
                //         "end_position_y": 50,  // 结束 距上
                //     },
                //     "volume": {  // 声音
                //         "start_value": 100,  // 开始 音量大小
                //         "end_value": 100,  // 结束 音量大小
                //         "echoes": false,  // 是否加回声
                //     },
                //     "specialeffect": {  // 特效
                //         "back_play": false,  // 倒放
                //         "shake": false,  // 加晃动
                //         "deshake": false,  // 去抖动
                //         "vague_x": 0,  // 向X轴模糊
                //         "vague_y": 0,  // 向Y轴模糊
                //         "remove_logo": true,  // 是否去Logo，如果false，忽略下面的值
                //         "logo_x": 100,  // Logo 距左位置
                //         "logo_y": 100,  // Logo 距上位置
                //         "logo_width": 50,   // Logo 宽度
                //         "logo_height": 50,  // Logo 高度
                //     },
                //     "fade": [
                //         {
                //             "time_point": 0.0,  // 相对该视频时间点
                //             "visibility": 0,  // 透明度
                //             "fade_type": 0,  // 0-视频/图片/文本/背景，1-音频
                //         },
                //         {
                //             "time_point": 0.0,
                //             "visibility": 0,  // 音量大小
                //             "fade_type": 1,
                //         },
                //         {
                //             "time_point": 3.0,
                //             "visibility": 100,
                //             "fade_type": 0,
                //         },
                //         {
                //             "time_point": 3.0,
                //             "visibility": 100,
                //             "fade_type": 1,
                //         },
                //     ],
                //     "color": {  // 色彩
                //         "brightness": 0,  // 亮度
                //         "contrast": 0,  // 对比度
                //         "saturation": 0,  // 饱和度
                //         "hue": 0,  // 色调
                //     },
                //     "colorkeying": {  // 抠图
                    //         "select_color": "dc00a4",  // 颜色
                //         "transparency": 100,  // 透明度 %
                //         "sensitivity": 100,  // 相似度 %
                //     },
                //     "speed": {  // 播放速度
                //         "value": 2,  // 倍率
                //     }
                // },
                // {
                //     "obj_type": "transitions",  // 转场
                //     "obj_id": 3,  // 转场特效类型ID
                //     "duration": 3,
                //     "start_time": 10.32,
                //     "end_time": 13.32,
                //     "effects": 0,
                // },
                // {
                //     "obj_type": "image",  // 用户自己上传图片素材
                //     "obj_id": "123456",
                //     "duration": 5,
                //     "start_time": 13.32,
                //     "end_time": 18.32,
                //     "effects": 0,
                //     "special": {
                //         "img_url": "http://www.domain.com/media/image/name.jpg",
                //     },
                //     "transform": {},
                //     "color": {},
                // },
                // {
                //     "obj_type": "text",  // 文本
                //     "obj_id": 4,
                //     "duration": 5,
                //     "start_time": 18.32,
                //     "end_time": 23.32,
                //     "effects": 0,
                //     "special": {
                //         "text": "Hello World",  // 文本内容
                //         "font_family": 0,  // 字体样式
                //         "bold": false,  // 是否加粗
                //         "italic": false,  // 是否倾斜
                //         "underline": false,  // 是否加下划线
                //         "text_color": "rgb(0,0,0)",  // 文字颜色
                //         "background_color": "rgb(0,0,0)",  // 文字背景颜色
                //         "container_color": "rgb(0,0,0)",  // 文本框颜色
                //         "text_align": 1,  // 对齐方式（0-水平靠左，1-水平居中，2-水平靠右，3-垂直靠上，4-垂直居中，5-垂直靠下）
                //         "line_height": 100,  // 行间距
                //         "spacing": 0,  // 字间距
                //         "start_font_size": 100,  // 开始 字体大小
                //         "end_font_size": 100,  // 结束 字体大小
                //         "start_position_x": 240,  // 开始 距左位置
                //         "start_position_y": 240,  // 开始 距上位置
                //         "end_position_x": 240,  // 结束 距左位置
                //         "end_position_y": 240,  // 结束 距上位置
                //         "move": 0,  // 滚动方式 0-不滚，1-上下滚动，2-左右游动
                //     },
                // },
                // {
                //     "obj_type": "graphics",  // 系统自带图片市场 素材
                //     "obj_id": 1,
                //     "duration": 5,
                //     "start_time": 23.32,
                //     "end_time": 28.32,
                //     "effects": 0,
                //     "transform": {},
                //     "animation": {},
                //     "fade": [],
                //     "color": {},
                //     "colorkeying": {},
                //     "speed": {},
                // },
            ]
        },
        /*{
            "name": "视频3",  // 名称
            "order": 1,  // 排序
            "volume": 100,
            "duration": 123,
            "update_time": "2017-08-02 12:21:12",  // 最近更新时间
            "lock_track": false,  // 是否锁定
            "obj_list": [  // 轨道上的对象列表
                // {
                //     "obj_type": "video",  // 用户自己上传的视频素材
                //     "obj_id": "123456",  // 视频ID
                //     "duration": 10.32,  // 时长
                //     "start_time": 0,  // 在轨道上开始位置（时间）
                //     "end_time": 10.32,  // 在轨道上结束位置
                //     "effects": 0,  // 滤镜
                //     "special": {  // 该对象特有属性
                //         "video_url": "/media/video/1/name.flv",  // 视频URL
                //         "preview_url": "/media/video/1/preview.mp4",  // 预览URL（低码率）
                //         "video_preview_img": "/media/video/1/video_preview.png",  // 视频缩略图
                //         "audio_preview_img": "/media/video/1/audio_preview.png",  // 音频缩略图
                //         "thumbnail": "/media/video/1/thumbnail.png",  // 视频封面图
                //         "start_range": 0.0,  // 截取视频开始时间
                //         "end_range": 10.0,  // 截取视频结束时间
                //     },
                //     "transform": {  // 基本变换
                //         "rotation": 0,  // 向左/向右旋转角度（-180——180）
                //         "flip": 0,  // 左右/上下翻转（0-无，1-上下、2-左右、3-上下+左右）
                //         "start_scale": 1.0,  // 开始缩放比例
                //         "end_scale": 1.0,  // 结束缩放比例
                //         "start_position_x": 50,  // 开始 距左
                //         "start_position_y": 50,  // 开始 距上
                //         "end_position_x": 50,  // 结束 距左
                //         "end_position_y": 50,  // 结束 距上
                //     },
                //     "volume": {  // 声音
                //         "start_value": 100,  // 开始 音量大小
                //         "end_value": 100,  // 结束 音量大小
                //         "echoes": false,  // 是否加回声
                //     },
                //     "specialeffect": {  // 特效
                //         "back_play": false,  // 倒放
                //         "shake": false,  // 加晃动
                //         "deshake": false,  // 去抖动
                //         "vague_x": 0,  // 向X轴模糊
                //         "vague_y": 0,  // 向Y轴模糊
                //         "remove_logo": true,  // 是否去Logo，如果false，忽略下面的值
                //         "logo_x": 100,  // Logo 距左位置
                //         "logo_y": 100,  // Logo 距上位置
                //         "logo_width": 50,   // Logo 宽度
                //         "logo_height": 50,  // Logo 高度
                //     },
                //     "fade": [
                //         {
                //             "time_point": 0.0,  // 相对该视频时间点
                //             "visibility": 0,  // 透明度
                //             "fade_type": 0,  // 0-视频/图片/文本/背景，1-音频
                //         },
                //         {
                //             "time_point": 0.0,
                //             "visibility": 0,  // 音量大小
                //             "fade_type": 1,
                //         },
                //         {
                //             "time_point": 3.0,
                //             "visibility": 100,
                //             "fade_type": 0,
                //         },
                //         {
                //             "time_point": 3.0,
                //             "visibility": 100,
                //             "fade_type": 1,
                //         },
                //     ],
                //     "color": {  // 色彩
                //         "brightness": 0,  // 亮度
                //         "contrast": 0,  // 对比度
                //         "saturation": 0,  // 饱和度
                //         "hue": 0,  // 色调
                //     },
                //     "colorkeying": {  // 抠图
                //         "select_color": "dc00a4",  // 颜色
                //         "transparency": 100,  // 透明度 %
                //         "sensitivity": 100,  // 相似度 %
                //     },
                //     "speed": {  // 播放速度
                //         "value": 2,  // 倍率
                //     }
                // },
                // {
                //     "obj_type": "transitions",  // 转场
                //     "obj_id": 3,  // 转场特效类型ID
                //     "duration": 3,
                //     "start_time": 10.32,
                //     "end_time": 13.32,
                //     "effects": 0,
                // },
                // {
                //     "obj_type": "image",  // 用户自己上传图片素材
                //     "obj_id": "123456",
                //     "duration": 5,
                //     "start_time": 13.32,
                //     "end_time": 18.32,
                //     "effects": 0,
                //     "special": {
                //         "img_url": "http://www.domain.com/media/image/name.jpg",
                //     },
                //     "transform": {},
                //     "color": {},
                // },
                // {
                //     "obj_type": "text",  // 文本
                //     "obj_id": 4,
                //     "duration": 5,
                //     "start_time": 18.32,
                //     "end_time": 23.32,
                //     "effects": 0,
                //     "special": {
                //         "text": "Hello World",  // 文本内容
                //         "font_family": 0,  // 字体样式
                //         "bold": false,  // 是否加粗
                //         "italic": false,  // 是否倾斜
                //         "underline": false,  // 是否加下划线
                //         "text_color": "rgb(0,0,0)",  // 文字颜色
                //         "background_color": "rgb(0,0,0)",  // 文字背景颜色
                //         "container_color": "rgb(0,0,0)",  // 文本框颜色
                //         "text_align": 1,  // 对齐方式（0-水平靠左，1-水平居中，2-水平靠右，3-垂直靠上，4-垂直居中，5-垂直靠下）
                //         "line_height": 100,  // 行间距
                //         "spacing": 0,  // 字间距
                //         "start_font_size": 100,  // 开始 字体大小
                //         "end_font_size": 100,  // 结束 字体大小
                //         "start_position_x": 240,  // 开始 距左位置
                //         "start_position_y": 240,  // 开始 距上位置
                //         "end_position_x": 240,  // 结束 距左位置
                //         "end_position_y": 240,  // 结束 距上位置
                //         "move": 0,  // 滚动方式 0-不滚，1-上下滚动，2-左右游动
                //     },
                // },
                // {
                //     "obj_type": "graphics",  // 系统自带图片市场 素材
                //     "obj_id": 1,
                //     "duration": 5,
                //     "start_time": 23.32,
                //     "end_time": 28.32,
                //     "effects": 0,
                //     "transform": {},
                //     "animation": {},
                //     "fade": [],
                //     "color": {},
                //     "colorkeying": {},
                //     "speed": {},
                // },
            ]
        },*/
    ],
    "audio_list": [  // 音频轨道
        {
            "name": "音频轨",
            "order": 1,
            "update_time": "2017-08-02 12:21:12",
            "volume": 100,
            "lock_track": false,
            "obj_list": [
                // {
                //     "obj_type": "audio",  // 用户自己上传的音频素材
                //     "obj_id": "123456",
                //     "duration": 10.32,
                //     "start_time": 0,
                //     "end_time": 10.32,
                //     "effects": 0,
                //     "special": {
                //         "audio_url": "/media/audio/1/name.pcm",
                //         "audio_preview_img": "/media/audio/1/audio_preview.png",  // 音频缩略图
                //         "start_range": 0.0,  // 截取音频开始时间
                //         "end_range": 10.0,  // 截取音频结束时间
                //     },
                //     "fade": [
                //         {
                //             "time_point": 0.0,
                //             "visibility": 0,
                //             "fade_type": 1,
                //         },
                //         {
                //             "time_point": 3.0,
                //             "visibility": 100,
                //             "fade_type": 1,
                //         },
                //     ],
                // },
                // {
                //     "obj_type": "music",  // 系统自带的音频市场 素材
                //     "obj_id": 1,
                //     "duration": 10.32,
                //     "start_time": 0,
                //     "end_time": 10.32,
                //     "effects": 0,
                //     "special": {
                //         "audio_url": "/media/audio/1/name.pcm",
                //         "audio_preview_img": "/media/audio/1/audio_preview.png",  // 音频缩略图
                //         "start_range": 0.0,  // 截取音频开始时间
                //         "end_range": 10.0,  // 截取音频结束时间
                //     },
                //     "fade": [
                //         {
                //             "time_point": 0.0,
                //             "visibility": 0,
                //             "fade_type": 1,
                //         },
                //         {
                //             "time_point": 3.0,
                //             "visibility": 100,
                //             "fade_type": 1,
                //         },
                //     ],
                // },
            ]
        },
    ]
}
export default project_config
