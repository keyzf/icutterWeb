/* 全局方法 加载字体 */
import channel from "@/channel";
import $ from 'jquery';
import * as Quill from 'quill';  //引入编辑器
import { isSupportFontFamily } from "@/utils/handy";
import { confirm } from "@/components/Modal";

let font_list=[];
let fonts=[];
let include=(code, name, url)=>{
    return' @font-face {' +
            'font-family: '+code+'; src: url("'+url+'")format(\'truetype\');' +
            '}';
};
let write=(code,name,url)=>{
    return ' .ql-snow .ql-picker.ql-font .ql-picker-label[data-value='+code.replace(/ /g,'')+']::before,' +
            '.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='+code.replace(/ /g,'')+']::before {' +
            'content: "'+name+'";' +
            'font-family: '+code+';' +
            '}' +
            '.ql-font-'+code.replace(/ /g,'')+'{' +
            'font-family: '+code+';' +
            '}';
};
export function install_fonts(font) {
    font_list.map((v,k)=>{
        if(v.code===font&&!v.support){
            confirm( '你未安装此字体或者安装后未重启浏览器，是否要下载安装？',
                '',
                '',
                ()=>{
                    window.open(v.url,'_blank')
                }
            );
        }
    })
}
export function load_fonts(type) {
    if(localStorage.signature&&!font_list.length){
        channel('get_fonts_list','',(res)=>{
          let re=res;
            let font_str='<style>';
            re.map((v,k)=>{
              v.code=v.code.split('.')[0];
                let support=isSupportFontFamily(v.code);
                if(!support){
                    font_str+=include(v.code,v.name,v.url);
                }else{
                    v['support']=true;
                }
                font_str+=write(v.code,v.name,v.url);
            });
            font_str+='</style>';
            font_list=re;
            $('head').append($(font_str));
        },'','info');
        let Font = Quill.import('formats/font');
        font_list.map((v, k) => {

            if(v.code.indexOf(' ')===-1){
                fonts.push(v.code.replace(/ /g,''));
            }
        });
        Font.whitelist = fonts; //将字体加入到白名单
        Quill.register(Font, true);

    }
    if(type==='text'){
        return fonts;
    }else{
        return font_list;
    }
}
