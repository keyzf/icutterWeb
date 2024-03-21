/* 轨道操作 初始化轨道上元素并绑定拖拽*/
import React from 'react';
import $ from "jquery";
import channel from "@/channel";
import { dragStop, test as testConfig } from "./online-configs";
import { getDuration } from "@/utils/handy";
import renderUnit from "./render-unit";


export function initUnit(u) {
    return (<div key={(u.media_id || '') + Math.ceil(Math.random() * 100000)}
        data-duration={u.duration ? parseInt(u.duration * 25) / 25 : ''}
        data-mediaId={u.media_id || ''}
        data-mediaType={u.media_type || ''}
        data-mediaUrl={u.media_url || ''}
        data-thumbnail={u.thumbnail || ''}
        data-uploading={u.thumbnail && u.media_id ? 'can' : 'cannot'}
        data-buffer={u.buffer}
        title={u.name ? u.name : ''}
        data-name={u.name ? u.name : ''}
        data-previewHls={u.preview_hls ? u.preview_hls : ''}
        data-previewMp4={u.preview_mp4 ? u.preview_mp4 : ''}
        data-previewMp3={u.preview_mp3 ? u.preview_mp3 : ''}
        data-videoPreviewImg={u.video_preview_img || ''}
        data-audioPreviewImg={u.audio_preview_img || ''}
        data-transType={u.trans_type ? u.trans_type : ''}
        data-subType={u.sub_type ? u.sub_type : ''}
        data-transName={u.name ? u.name : ''}
        data-startTime={0}
        data-endTime={u.duration ? parseInt(u.duration * 25) / 25 : 5}
        data-startRange={0}
        data-endRange={u.duration ? parseInt(u.duration * 25) / 25 : 5}
        className={'can-del ' + (u.media_type === 'transition' ? 'mater tran' : 'mater') + (u.thumbnail && u.media_id ? '' : ' uploading')}>
        <div className="pic">
            {
                u.media_type === 'audio'
                    ? <span className='icoImg ico iconfont icon-audio' />
                    : <img src={u.thumbnail ? u.thumbnail : ''} alt="" />
            }
            <span className="out_type status status-3" style={{ width: (u.percent || 0) + '%' }}>  </span>
            {u.duration && u.media_type === 'video' ? <p className="duration"><span className='ico iconfont  icon-yingpiangui'> </span>{getDuration(u.duration)} </p> : ''}
            {u.media_type === 'image' ? <p className="duration"><span className='ico iconfont icon-tupianicon'> </span> </p> : ''}
            {u.duration && u.media_type === 'audio' ? <p className="duration">{getDuration(u.duration)} </p> : ''}
            {u.used ? <p className="used"> </p> : ''}
        </div>
        <p className="name">{u.name}</p>
    </div>)
}
export function setDrag(auto_indent, unit_length, unit_time, set_time_line_now, time_line_start, project_id) {
    setTimeout(() => {
        let $control = $('.control .pathway-box');
        $(".material-main-list > div.mater ").each((k, v) => {
            if ($(v).attr('data-uploading') !== 'cannot') {
                // if(true){
                $(v).draggable({
                    cancel: "a.ui-icon", // 点击一个图标不会启动拖拽
                    cursorAt: { top: 20, left: 20 },
                    helper: (e, u) => {
                        let parent = $(document.createElement('div'));
                        parent.css({ margin: '13px' });
                        let par = $(document.createElement('div'));
                        $('.focused').removeClass('focused');
                        par.addClass('drag-layer');
                        par.append($(e.currentTarget).clone().removeClass('mater').addClass('focused')
                            .addClass('mater-helper').html('<div class="clip-item-thumbs"> </div><div class="trim trimL"></div><div class="trim trimR"></div>'));
                        parent.append(par);
                        return parent
                    },
                    snap: '.mater-helper,.pathway',
                    scope: 'maters',
                    scroll: false,
                    addClasses: false,
                    appendTo: ".flex-column",
                    // snapMode: "outer",
                    delay: 100,
                    snapTolerance: auto_indent ? 10 : 0,
                    start: function (event, ui) {
                        let unit = ui.helper.find('.mater-helper');
                        renderUnit(unit, unit_length, unit_time);
                        dragStop();
                        setTimeout(() => {
                            let media_id = unit.attr('data-mediaid');
                            let data = unit.attr('data-mediaurl') || '';
                            if (media_id.indexOf('VCG') >= 0 && data.indexOf('[') === 0) {
                                channel('import_plat_media', {
                                    plat: 'VCG',
                                    project_id: project_id || '',
                                    data: data
                                },
                                    () => {

                                    })
                            }
                        })
                    },
                    drag: function (t, ui) {
                        if (ui.helper.hasClass('license')) {
                            let obj = ui.helper.find('.mater-helper');
                            let offset = obj.offset();
                            let ct = $control.offset().top;
                            let pt = $control.find('.pathway').eq(0).offset().top;
                            let ut = offset.top;
                            let cl = $control.offset().left;
                            let pl = $control.find('.pathway').eq(0).offset().left;
                            let ul = offset.left;
                            let duration = obj.attr('data-duration');
                            let top = offset.top - $control.offset().top;
                            let $left = ul - cl;
                            // if ($left < 0) {
                            //     $(this).draggable("option", "cursorAt", {left: 10, top: 10});
                            // }
                            setTimeout(() => {
                                if ($left >= 0) {
                                    set_time_line_now($left);
                                }
                                let left = $left - time_line_start;
                                let now = left / unit_length * unit_time;
                                testConfig(obj, now, now + duration * 1, Math.round(top / 60), auto_indent ? unit_time / unit_length : 0, 'replace');
                            });
                            // if(ct-pt)
                            //     ui.helper.css({
                            //         left: 0, top: 0,
                            //         position: 'absolute'
                            //     })
                            if (ut - ct >= 5 && ul - cl >= 0) {
                                if ((ut - pt) % 61 === 0) {
                                    // $(this).draggable( "option", "grid", [ 1, 61 ] );
                                }
                                $control.find('.pathway').each(function (k, v) {
                                    // // console.info($(v).offset().top)
                                })
                            }
                        }
                    },
                    cursor: "move"
                });
            }
        })
    })
}