/* 全局方法 国际化处理方法 */
import { get_data } from "@/channel";

// let local_language={};
let language_list=[
    'cn','jp','en'
];

//初始化中文
let local_language=get_data((localStorage.setpath||'')+'/dataBase/local_language/local_language.json');
// console.info(local_language)
//语言的索引
export let language=localStorage.language || 'cn';

let index = 0;
let refresh=()=>{

};
export const set_refresh=(fun)=>{
    refresh=fun;
};
export const set_language=(lan)=>{
    language=lan;
    localStorage.language=lan;
    index=Math.max(language_list.indexOf(lan),0);
    // local_language=get_data('/dataBase/local_language/'+(language||'cn')+'.json',local_language);
    refresh();
};
set_language(language);
export const get_home = (param) => {
    return say('home',param);
};
export const get_control = (param) => {
    return say('control',param);
};
export const get_guide = (param) => {
    return say('guide',param);
};
const say = (path,param) => {
    return local_language[path] && local_language[path][param] ? local_language[path][param][index] : '';
};
export default say
