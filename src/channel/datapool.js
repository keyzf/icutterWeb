/* 目前没有引用 */
import channel from "@/channel";
let unready_movie={};
let list_movie=[];
let callback_movie=()=>{};
export function thread_movie(list,callback) {
    list_movie=list;
    unready_movie={};
    callback_movie=callback;
    if(list&&list.length){
        for(let i=0;i<list.length;i++){
            if(list[i].media_id && ![2,3].includes(list[i].status)){
                if(unready_movie[list[i].media_id]&&unready_movie[list[i].media_id].length){
                    unready_movie[list[i].media_id].push(i);
                }else{
                    unready_movie[list[i].media_id]=[i];
                }
            }
        }
        // refresh();
    }
}

function refresh() {
    let list=[];
    let refresh=false;
    for(let i in unready_movie){
        i&&(list.push(i));
    }
    if(list.length){
        channel('get_media_progress',{media_id:list.join('|')},(re)=>{
            list.map((v,k)=>{
                {/*
                            0  等待合成
                            1  正在合成
                            2  合成完成
                            3  合成失败
                            4  取消合成*/}
                unready_movie[v]&&unready_movie[v].map((v,k)=>{
                    let pro=re[list_movie[v].media_id];
                    if(pro){
                        list_movie[v]['progress']=re;
                    }
                    if(pro<0){
                        //兼容后端可能会在成功的时候假装失败一次；
                        if(list_movie[v]['tempSum']){
                            list_movie[v]['status']=3;
                            list_movie[v]['status_cn']='合成失败';
                            delete unready_movie[list_movie[v].media_id];
                        }else{
                            list_movie[v]['tempSum']=true;
                        }
                    }else if(pro===100||pro==='100'){
                        list_movie[v]['status']=2;
                        list_movie[v]['status_cn']='合成完成';
                        refresh=true;
                        delete unready_movie[list_movie[v].media_id];
                    }else{
                        list_movie[v]['progress']=pro;
                    }
                })
            });
            callback_movie(list_movie,refresh);
        },()=>{

        })
    }
}
let autoRefresh=setInterval(refresh,6000);
