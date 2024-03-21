/* 全局方法 发送请求的封装 处理接口路径 */
import $ from 'jquery';
import infoChannel from './request-shunt';
import { v4 as uuidv4 } from 'uuid';

//服务
let _scope = '';
// 域名
let host = "https://devimedia.pdnews.cn/";
// development 开发环境  production 生产环境
if (process.env.NODE_ENV === 'production') {
    _scope = '/apiservice/';
} else {
    _scope = 'https://quickedit.pdnews.cn/apiservice/';
    // _scope = 'https://mt-optest-http.jdcloud.com/apiservice/';
    // _scope = '//116.196.118.109:8081/';
}
export function get_data(url, pre_data) {
    let re_data = {};
    $.ajax({
        type: 'get',
        async: false,
        url: url,
        success: function (data, status) {
            re_data = data;
        },
        error: function (data) {
            return pre_data;
        }
    });
    return re_data
}

export let scope = _scope;
export let serve_ip = scope;
export const set_serve_ip = (url) => {
    if (url !== serve_ip) {
        serve_ip = url || serve_ip;
    }
}
const chanel = (url, data, success, fail, auto) => {
    // console.info(url);
    let _url = '', _data = data, _success = success, _method = 'get', _fail = fail, async = true, _json = '', trans = false;
    switch (url) {
        // 记录错误信息给后端
        case 'report_error': _url = '//testapi.onvideo.cn/feedback/ajax/report_error/'; _method = 'POST'; break;

        /*【历史版本 API】*/
        // 保存历史版本
        case 'save_project_version': _url = scope + 'video/ajax/save_project_version/'; _method = 'POST'; break;
        // 查询历史版本列表
        case 'get_project_version_list': _url = scope + 'video/ajax/get_project_version_list/'; _method = 'get'; break;
        // 查询历史版本配置
        case 'get_project_version_config': _url = scope + 'video/ajax/get_project_version_config/'; _method = 'get'; break;
        // 使用历史版本
        case 'use_project_version': _url = scope + 'video/ajax/use_project_version/'; _method = 'POST'; break;

        /*模板*/
        // 按模板创建项目
        case 'create_project_by_template': _url = scope + 'video/ajax/create_project_by_template/'; _method = 'POST'; break;
        // 设置项目类型
        case 'change_project_type': _url = scope + 'video/ajax/change_project_type/'; _method = 'POST'; break;
        // 设置主题类型
        case 'change_theme_type': _url = scope + 'video/ajax/change_theme_type/'; _method = 'POST'; break;
        // 删除主题
        case 'delete_theme': _url = scope + 'video/ajax/delete_theme/'; _method = 'POST'; break;
        // 查询模板预览影片
        case 'get_template_movie': _url = scope + 'video/ajax/get_template_movie/'; _method = 'get'; break;
        // 查询主题列表
        case 'get_theme_list': _url = scope + 'video/ajax/get_theme_list/'; _method = 'get'; break;
        // 查询主题配置
        case 'get_theme_config': _url = scope + 'video/ajax/get_theme_config/'; _method = 'get'; break;
        // 保存主题配置
        case 'save_theme_config': _url = scope + 'video/ajax/save_theme_config/'; _method = 'POST'; break;
        // 查询所有可用的片头片尾Logo角标列表(m_type:2-片头，3-片尾，4-Logo，5-角标，6-背景音乐。缺省返回全部)
        case 'get_themematerial_list': _url = scope + 'video/ajax/get_themematerial_list/'; _method = 'get'; break;

        // 获取已有的字幕语种
        case 'get_text_language': _url = scope + 'video/ajax/get_text_language/'; _method = 'self'; async = false; break;
        // 新华社平台发布（单独新华社环境）
        case 'publish_to_plat': _url = scope + 'publish/ajax/publish_to_plat/'; _method = 'POST'; break;
        // 获取字幕
        // case 'get_text_list': _url= scope + 'video/ajax/get_text_list/';_method='get';break;
        // 保存字幕
        // case 'save_text_info': _url= scope + 'video/ajax/save_text_info/';_method='get';break;
        // 查询团队信息
        case 'get_group_list': _url = scope + 'accounts/ajax/get_group_list/'; _method = 'get'; async = false; break;
        // 查询团队成员列表
        case 'get_group_user': _url = scope + 'accounts/ajax/get_group_user/'; _method = 'get'; break;
        // 查询团队信息
        case 'get_group_info': _url = scope + 'accounts/ajax/get_group_info/'; _method = 'get'; break;
        // 管理员查询申请信息
        case 'get_apply_list': _url = scope + 'accounts/ajax/get_apply_list/'; _method = 'get'; break;
        // 复制素材
        case 'copy_material': _url = scope + 'video/ajax/copy_material/'; _method = 'POST'; break;
        // 翻译字幕
        case 'translate': _url = scope + 'video/ajax/translate/'; _method = 'POST'; break;
        // 语音转文字
        case 'trans_audio_to_text': _url = scope + 'video/ajax/trans_audio_to_text'; _method = 'get'; break;
        // 字幕转语音
        case 'trans_text_to_audio': _url = scope + 'video/ajax/trans_text_to_audio/'; _method = 'POST'; break;
        // 文字转语音
        case 'trans_str_to_audio': _url = scope + 'video/ajax/trans_str_to_audio/'; _method = 'POST'; break;
        // 获取文字转语音和语音转文字状态
        case 'query_trans_result': _url = scope + 'video/ajax/query_trans_result'; _method = 'get'; break;
        // 用户查询受邀信息
        case 'get_invitation_list': _url = scope + 'accounts/ajax/get_invitation_list/'; _method = 'get'; break;
        // 将用户从团队移出
        case 'remove_from_group': _url = scope + 'accounts/ajax/remove_from_group/'; _method = 'POST'; break;
        // 设置用户在团队中的权限
        case 'set_group_authority': _url = scope + 'accounts/ajax/set_group_authority/'; _method = 'POST'; break;
        // 通过邀请码加入团队
        case 'join_group': _url = scope + 'accounts/ajax/join_group/'; _method = 'POST'; break;
        // 生成入团邀请码
        case 'generate_invite_code': _url = scope + 'accounts/ajax/generate_invite_code/'; _method = 'POST'; break;
        // 管理员处理申请信息
        case 'deal_apply': _url = scope + 'accounts/ajax/deal_apply/'; _method = 'POST'; break;
        // 用户处理邀请信息
        case 'deal_invitation': _url = scope + 'accounts/ajax/deal_invitation/'; _method = 'POST'; break;
        // 用户申请加入某个团队
        case 'apply_group': _url = scope + 'accounts/ajax/apply_group/'; _method = 'POST'; break;
        // 管理员邀请账号入团
        case 'invitation_user': _url = scope + 'accounts/ajax/invitation_user/'; _method = 'POST'; break;
        // 设置团队信息
        case 'set_group_info': _url = scope + 'accounts/ajax/set_group_info/'; _method = 'POST'; break;
        // 创建账户
        case 'create_account': _url = scope + 'accounts/ajax/create_account/'; _method = 'POST'; break;
        // 修改账户
        case 'config_account': _url = scope + 'accounts/ajax/config_account/'; _method = 'POST'; break;
        // 修改媒体所属文件夹
        case 'change_directory': _url = scope + 'video/ajax/change_directory/'; _method = 'POST'; break;
        // 删除字幕
        case 'trash_text_list': _url = scope + 'subtitle/ajax/trash_text_list'; _method = 'get'; break;
        // 获取字体列表
        case 'get_fonts_list': _url = scope + 'video/ajax/get_fonts_list/'; _method = 'get'; async = false; break;
        // 查询字幕列表
        case 'get_text_list': _url = scope + 'subtitle/ajax/get_text_list'; _method = 'get'; trans = true; break;
        // 保存字幕
        case 'save_text_info': _url = scope + 'subtitle/ajax/save_text_info'; _method = 'POST';
            _data = JSON.parse(_data);
            _data['projectId'] = _data['project_id'];
            _data['list'] = _data['text_list'];
            _data['list'].forEach((v, k) => {
                v['text_id'] = v['text_id'] || uuidv4();
                for (let i in v) {
                    v[i.replace(/\_(\w)/g, function (all, letter) {
                        return letter.toUpperCase();
                    })] = v[i];

                }
            });
            _data = JSON.stringify(_data);
            break;
        // 获取上传token
        case 'get_oss_token': _url = scope + 'video/ajax/get_oss_token'; _method = 'get'; _json = 'text'; break;
        // 上传用户素材
        case 'upload_user_material': _url = scope + 'video/ajax/upload_user_material'; _method = 'post'; break;
        // 上传项目素材
        case 'upload_project_material': _url = scope + 'video/ajax/upload_project_material'; _method = 'post'; break;




        // 读取Logo属性
        case 'get_logo_info': _url = scope + 'video/ajax/get_logo_info/'; _method = 'get'; break;
        // 设置Logo属性
        case 'set_logo_info': _url = scope + 'video/ajax/set_logo_info/'; _method = 'POST'; break;
        // 上传片头片尾logo
        case 'upload_headtail': _url = serve_ip + 'video/ajax/upload_headtail/'; _method = 'POST'; break;
        // 删除片头片尾logo
        case 'delete_headtail': _url = serve_ip + 'video/ajax/delete_headtail/'; _method = 'POST'; break;
        // 获取片头片尾logo
        case 'get_headtail_list': _url = scope + 'video/ajax/get_headtail_list/'; _method = 'get'; break;
        // 批量下载
        case 'muti_download': _url = serve_ip + 'video/ajax/muti_download/'; _method = 'get'; break;
        // 套餐下单
        case 'generate_order': _url = scope + 'billing/ajax/generate_order/'; _method = 'POST'; break;
        // 查询用户选择某个套餐时，可以返现金额 以及  开始有效期
        case 'get_balance': _url = scope + 'billing/ajax/get_balance/'; _method = 'get'; break;
        // 创建直播项目
        case 'live_create_project': _url = scope + 'live/ajax/create_project/'; _method = 'POST'; break;
        // 修改直播打点
        case 'config_time_point': _url = scope + 'live/ajax/config_time_point/'; _method = 'POST'; break;
        // 删除直播打点
        case 'delete_time_point': _url = scope + 'live/ajax/delete_time_point/'; _method = 'POST'; break;
        // 直播打点
        case 'get_time_point': _url = scope + 'live/ajax/get_time_point/'; _method = 'get'; break;
        // 查询直播剪辑项目列表
        case 'live_get_project_list': _url = scope + 'live/ajax/get_project_list/'; _method = 'get'; break;
        // 查询直播剪辑项目明细
        case 'live_get_project_detail': _url = scope + 'live/ajax/get_project_detail/'; _method = 'get'; break;
        // 删除直播剪辑项目
        case 'live_trash_project': _url = scope + 'live/ajax/trash_project/'; _method = 'POST'; break;
        // 编辑名称
        case 'live_change_name': _url = scope + 'live/ajax/change_name/'; _method = 'POST'; break;
        // 截取视频
        case 'live_cut_video': _url = serve_ip + 'live/ajax/cut_video/'; _method = 'POST'; break;
        // 发布视频块
        case 'publish_video': _url = serve_ip + 'publish/ajax/publish_video/'; _method = 'POST'; break;
        // 发布视频块
        case 'live_publish_video': _url = serve_ip + 'publish/ajax/publish_video/'; _method = 'POST'; break;
        // 合并发布
        case 'live_merge_video': _url = serve_ip + 'live/ajax/merge_video/'; _method = 'POST'; break;
        // 查询截取视频列表
        case 'live_get_video_list': _url = scope + 'live/ajax/get_video_list/'; _method = 'get'; break;
        // 根据关键词检索视频列表
        case 'search_video': _url = scope + 'collect/ajax/search_video/'; _method = 'get'; break;
        // 根据关键词检索图片列表：
        case 'search_image': _url = scope + 'collect/ajax/search_image/'; _method = 'get'; break;
        // 根据播放页面地址获取视频文件URL
        case 'get_video_url': _url = scope + 'collect/ajax/get_video_url/'; _method = 'get'; break;
        // 设置语言
        case 'set_language': _url = scope + 'accounts/ajax/set_language/'; _method = 'POST'; break;
        // stagerLive接口
        // case 'stager_user_info': _url=stager;_method='get';break;
        // 获取stagerlive素材列表
        case 'get_import_media': _url = scope + 'video/ajax/get_import_media/'; _method = 'get'; break;
        // 导入stagerlive素材列表
        case 'import_media': _url = serve_ip + 'video/ajax/import_media/'; _method = 'POST'; break;
        // 创建文件夹
        case 'verify_token': _url = scope + 'accounts/ajax/verify_token/'; _method = 'POST'; break;
        // 是否引导
        case 'set_guide': _url = scope + 'accounts/ajax/set_guide/'; _method = 'POST'; break;
        // 创建文件夹
        case 'create_directory': _url = scope + 'video/ajax/create_directory/'; _method = 'POST'; break;
        // 查询文件夹列表
        case 'get_directory_list': _url = scope + 'video/ajax/get_directory_list'; _method = 'get'; break;
        // 查询系统素材
        case 'get_medias': _url = scope + 'video/ajax/get_medias'; _method = 'get'; break;
        // 查询合成进度
        case 'get_media_progress': _url = scope + 'video/ajax/get_media_progress/'; _method = 'get'; break;
        // 查询素材状态
        case 'get_media_status': _url = scope + 'video/ajax/get_media_status'; _method = 'get'; break;
        // 查询素材列表
        case 'get_media_list': _url = scope + 'video/ajax/get_media_list'; _method = 'get'; break;
        // 查询项目素材列表
        case 'get_project_material': _url = scope + 'video/ajax/get_project_media_list'; _method = 'get'; break;
        // 查询媒资素材列表
        case 'get_media_source_list': _url = scope + 'video/ajax/get_media_source_list'; _method = 'get'; break;
        // 查询系统素材列表
        case 'get_system_material': _url = scope + 'video/ajax/get_system_material'; _method = 'get'; break;
        // 删除恢复媒体
        case 'trash_media': _url = serve_ip + 'video/ajax/trash_media/'; _method = 'get'; break;
        // 删除项目媒体素材
        case 'delete_project_material': _url = serve_ip + 'video/ajax/delete_project_material/'; _method = 'get'; break;
        // 文件夹删除与恢复
        case 'trash_directory': _url = serve_ip + 'video/ajax/trash_directory/'; _method = 'POST'; break;
        // 修改项目名称
        case 'change_projectName': _url = scope + 'video/ajax/project_rename/'; _method = 'GET'; break;
        // 修改名称
        case 'change_name': _url = scope + 'video/ajax/change_name/'; _method = 'POST'; break;
        // 检查文件分片是否已经上传
        case 'verify_upload': _url = serve_ip + 'video/ajax/verify_upload/'; _method = 'get'; break;
        // 上传视频音频
        case 'upload_media': _url = serve_ip + 'video/ajax/upload_media/'; _method = 'POST'; break;
        // 查询工程列表
        case 'get_project_list': _url = scope + 'video/ajax/get_project_list/'; _method = 'get'; break;
        // 创建工程副本(dst_type    复制生成对象的类型：0-项目，1-模板
        case 'copy_project': _url = serve_ip + 'video/ajax/copy_project/'; _method = 'POST'; break;
        // // 查询影片列表
        // case 'get_movie_list': _url=scope + 'video/ajax/get_movie_list/';_method= 'get';break;
        // 查询工程配置
        case 'get_project_config': _url = scope + 'video/ajax/get_project_config'; _method = 'get'; break;
        // 初始化工程配置
        case 'get_project_init': _url = scope + 'video/ajax/get_project_config/'; _method = 'self'; break;
        // 查询文字素材列表
        case 'get_text_material': _url = scope + 'video/ajax/get_text_material/'; _method = 'POST'; break;
        // 查询转场效果列表
        case 'get_transition_material': _url = scope + 'video/ajax/get_transition_material/'; _method = 'POST'; break;
        // 查询音效素材列表
        case 'get_audio_material': _url = scope + 'video/ajax/get_audio_material/'; _method = 'POST'; break;
        // 查询图片素材列表
        case 'get_image_material': _url = scope + 'video/ajax/get_image_material/'; _method = 'POST'; break;
        // 删除工程
        case 'trash_project': _url = scope + 'video/ajax/trash_project/'; _method = 'get'; break;
        // 删除影片
        case 'trash_publish': _url = scope + 'publish/ajax/trash_publish/'; _method = 'get'; break;
        // 获取系统推荐的缩略图
        case 'get_recommend_snapshot': _url = serve_ip + 'video/ajax/get_recommend_snapshot/'; _method = 'get'; break;
        // 上传素材预传信息(m_type：0-用户素材，1-系统素材，2-片头，3-片尾，4-Logo，5-角标，6-背景音乐)
        case 'preview_upload': _url = serve_ip + 'video/ajax/preview_upload/'; _method = 'POST'; break;
        // 上传缩略图
        case 'upload_snapshot': _url = serve_ip + 'video/ajax/upload_snapshot/'; _method = 'POST'; break;
        // 设置缩略图
        case 'set_thumbnail': _url = serve_ip + 'video/ajax/set_thumbnail/'; _method = 'POST'; break;
        // 完成视频制作
        case 'generate_movie': _url = serve_ip + 'video/ajax/generate_movie/'; _method = 'POST'; break;
        // 查询影片播放统计
        case 'get_stat_detail': _url = scope + 'publish/ajax/get_stat_detail/'; _method = 'get'; break;
        // 查询影片发布统计
        case 'get_movie_list': _url = scope + 'publish/ajax/get_publish_list/'; _method = 'get'; break;
        // 获取统计数据接口
        case 'get_portal_stat': _url = scope + 'accounts/ajax/get_portal_stat/'; _method = 'get'; break;
        // 头像上传
        case 'upload_photo': _url = serve_ip + 'accounts/ajax/upload_photo/'; _method = 'POST'; break;
        //保存项目配置(is_template 参数：0-普通项目，1-用户模板，2-系统模板)
        case 'save_project_config': _url = serve_ip + 'video/ajax/save_project_config'; _method = 'POST'; break;
        //登录
        case 'login': _url = scope + 'user/ajax/login'; _method = 'POST'; break;
        //登录验证码
        case 'loginCode': _url = `${ host }/cms/sys/captchaImage`; _method = 'get'; break;
        //获取套餐信息
        case 'meal': _url = scope + 'billing/ajax/get_account_plan/'; _method = 'get'; break;
        //数据统计
        case 'get_billing_statistic': _url = scope + 'statistical/ajax/get_billing_statistic/'; _method = 'get'; break;
        //退出
        case 'logout': _url = scope + 'user/ajax/logout/'; _method = 'get'; break;
        //获取用户信息
        case 'get_userInfo': _url = scope + 'user/ajax/user_info/'; _method = 'get'; break;
        // 获取用户信息
        case 'get_account': _url = scope + 'accounts/ajax/get_account_info/'; _success = (re) => {
            // set_serve_ip(re.server_host+'/');
            success(re);
        }; _method = 'self'; break;
        //获取邮箱验证码
        //mail_type  修改邮箱： 1,修改密码：2,注册申请：3,忘记密码：4
        case 'getECode': _url = scope + 'accounts/ajax/send_email_code/'; _method = 'POST'; break;
        //修改邮箱
        case 'editEmail': _url = scope + 'accounts/ajax/change_email/'; _method = 'POST'; break;
        //获取短信验证码
        //sms_type  修改手机号： 1,修改密码：2,注册申请：3,忘记密码：4
        case 'getPCode': _url = scope + 'accounts/ajax/send_sms_code/'; _method = 'POST'; break;
        //申请试用
        case 'register': _url = scope + 'accounts/ajax/register/'; _method = 'POST'; break;
        //重置密码（通过手机号）
        case 'resetPwd': _url = scope + 'accounts/ajax/reset_pwd_by_phone/'; _method = 'POST'; break;
        //重置密码
        case 'reset_pwd': _url = scope + 'accounts/ajax/reset_pwd/'; _method = 'POST'; break;
        //密码方式对接平台绑定账户
        case 'bind_account': _url = scope + 'publish/ajax/bind_account/'; _method = 'POST'; break;
        //密码方式对接平台绑定账户
        case 'debind_account': _url = scope + 'publish/ajax/debind_account/'; _method = 'POST'; break;
        //修改手机号
        case 'editPhone': _url = scope + 'accounts/ajax/change_cellphone/'; _method = 'POST'; break;
        //修改密码
        case 'editPass': _url = scope + 'accounts/ajax/change_password/'; _method = 'POST'; break;
        //获取发布平台列表
        case 'get_plat_list': _url = scope + 'publish/ajax/get_plat_list/'; _method = 'get'; break;
        //获取已授权平台账户列表
        case 'get_auth_user_list': _url = scope + 'publish/ajax/get_auth_user_list/'; _method = 'self'; break;
        // 视频素材检索
        case 'search_plat_video': _url = scope + 'collect/ajax/search_plat_video/'; _method = 'get'; break;
        // 视频明细
        case 'search_plat_video_detail': _url = scope + 'collect/ajax/search_plat_video_detail/'; _method = 'get'; break;
        // 视频组
        case 'search_plat_video_group': _url = scope + 'collect/ajax/search_plat_video_group/'; _method = 'get'; break;
        // 视频组明细
        case 'search_plat_video_group_detail': _url = scope + 'collect/ajax/search_plat_video_group_detail/'; _method = 'get'; break;
        // 图片素材检索
        case 'search_plat_image': _url = scope + 'collect/ajax/search_plat_image/'; _method = 'get'; break;
        // 图片明细
        case 'search_plat_image_detail': _url = scope + 'collect/ajax/search_plat_image_detail/'; _method = 'get'; break;
        // 组图
        case 'search_plat_image_group': _url = scope + 'collect/ajax/search_plat_image_group/'; _method = 'get'; break;
        // 组图明细
        case 'search_plat_image_group_detail': _url = scope + 'collect/ajax/search_plat_image_group_detail/'; _method = 'get'; break;
        // 专题
        case 'search_plat_topic': _url = scope + 'collect/ajax/search_plat_topic/'; _method = 'get'; break;
        // 专题明细
        case 'search_plat_topic_detail': _url = scope + 'collect/ajax/search_plat_topic_detail/'; _method = 'get'; break;
        // 音频素材检索
        case 'search_plat_audio': _url = scope + 'collect/ajax/search_plat_audio/'; _method = 'get'; break;
        // 获取视频下载URL
        case 'get_video_download_url': _url = scope + 'collect/ajax/get_video_download_url/'; _method = 'get'; break;
        // 获取音频下载URL
        case 'vcg_audio_download_url': _url = scope + 'collect/ajax/vcg_audio_download_url/'; _method = 'get'; break;
        // 视觉中国素材导入
        case 'import_plat_media': _url = scope + 'video/ajax/import_plat_media/'; _method = 'POST'; break;
        // 素材购物车导入
        case 'project_box': _url = scope + 'video/ajax/project_box/'; _method = 'POST'; break;
        // 版权素材查询分类，二级三级菜单
        case 'get_vcg_category': _url = scope + 'video/ajax/get_vcg_category/'; _method = 'get'; break;
        // 新华网 目录检索
        case 'search_sobey_directory': _url = scope + 'video_ajax/search_sobey_directory/'; _method = 'get'; break;
        // 新华网 检索某个目录下素材
        case 'search_sobey_material': _url = scope + 'video_ajax/search_sobey_material/'; _method = 'get'; break;
        default: _url = url; break;
    }
    _url && (infoChannel(_url, _data, _success, _method, async, _fail, auto, url, _json, trans))
};
//预登录

// chanel('login', JSON.stringify({"name":"yangxin","password":"yangxin"}),
//   (re)=>{
//     sessionStorage.signature=re||'';
//     });
// chanel('get_media_list',{mediaType:'all'},
//   (re)=>{
//     // sessionStorage.signature=re||'';
//     });
export let upload_media = () => {
    return serve_ip + 'video/ajax/upload_media/';
};
export let upload_film = () => {
    return serve_ip + 'video/ajax/upload_headtail/';
};
export let upload_snapshot = () => {
    return serve_ip + 'video/ajax/upload_snapshot/';
};
export default chanel
