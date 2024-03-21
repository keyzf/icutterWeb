/* 全局方法 上传 */
import $ from 'jquery';
import { message, Modal } from 'antd';
import EXIF from 'exif-js';
import * as qiniu from 'qiniu-js';
import channel, { get_data } from '@/channel';
import say from '@/database/local_language';
import waveform from '@/images/waveform.svg';


let config = {
  useCdnDomain: true,
  checkByMD5: true,
  bucket: 'quickedit'
}
let host = 'https://quickstatic.pdnews.cn/';
if (process.env.REACT_APP_ENV === "privateproduction") {
  config = {
    useCdnDomain: true,
    checkByMD5: true,
    disableStatisticsReport: true,
    bucket: 'imedia-xyy',
    uphost:'up-beijing2-oss.meitiyun.com',
    region:'beijing2',
  };
  host = 'https://imediaxyy.meitiyun.com/';
} 

// create canvas
let info = Modal.warning;
let canvas = document.createElement('canvas');
export function Init() {
  console.info('initUpload');
  const BYTES_PER_CHUNK = 1024 * 1024 * 5; // 每个文件切片大小定为1MB .
  let refresh = () => {

  };
  let objs = {};
  let index = 0;
  let stop = 0;
  let buffer = 0;
  let files = [];
  let media_type = '';
  let course = 0;
  let thread = 0;
  //校验格式；
  let white_list = get_data((localStorage.setpath || '') + '/dataBase/media_format.json');
  let verify = function (suffix) {
    console.info(suffix)
    media_type = white_list[suffix] || '';
    return media_type;
  };
  this.getFiles = () => {
    return files;
  };
  this.getCourse = () => {
    for (let i = 0; i < files.length; i++) {
      if (!(files[i].done || files[i].cancel_upload)) {
        return true;
      }
    }
    return false;
  };
  this.refresh = function (re) {
    // console.info(re)
    if (re) {
      refresh = re;
    } else {
      refresh = () => {

      }
    }
  };
  const upload_user_material = (name, url, type, project_id, buffer, func, func2) => {

    channel(project_id ? 'upload_project_material' : 'upload_user_material', JSON.stringify({
      name: name || '',
      projectId: project_id,
      mediaType: type,
      url: host + url,
      materialType: 0,
    }), (u) => {
      u['media_id'] = (u['media_id'] || u['id']).toString();
      for (let _i in u) {
        // 驼峰属性名改为下划线属性名
        u[_i.replace(/([A-Z])/g, "_$1").toLowerCase()] = u[_i];
      }
      func && func(u.media_id, files[buffer].duration, buffer);
      files[buffer].done = true;
      refresh();
    }, (re) => {
      refresh();
    })

  };
  /**
   * @method_main
   *
   * */
  const main = () => {
    if (course < 1) {
      let temp_obj = {};
      for (let i = files.length - 1; i >= 0; i--) {
        if (files[i].media_id) {
          if (temp_obj[files[i].media_id]) {
            files[i].cancel_upload = true;
          } else {
            temp_obj[files[i].media_id] = true;
          }
        }
      }
    }
  };
  this.pause = (buffer) => {
    files[buffer].suspend_upload = !files[buffer].suspend_upload;
    main();
    refresh(files);
  };
  this.cancel = (buffer) => {
    files[buffer].cancel_upload = true;
    files[buffer].subscription && files[buffer].subscription.unsubscribe();
    main();
    refresh(files);
  };
  //快捷入口，录音的上传等用了这个；
  this.uploadFile = (temp, dir_id, func, func2) => {
    this._uploadFile(temp, dir_id, func, func2, this.project_id);
    refresh(files);
  };
  /**
   * @method_this._uploadFile
   * 第一步操作
   * 根据后缀校验文件合法性（需改进）
   * 将文件预加载进来生成缩略图，md5码，然后将这些信息传给后端获取一个素材id
   * 上传的主进程是通过main函数来异步执行的
   * @param {Object} temp 文件对象
   * @param {String} dir_id 文件夹id
   * @param {Function} func 成功后的回调方法
   * @param {Function} func2 失败后的回调方法
   * @param {String} project_id 项目id
   * */
  this._uploadFile = (temp, dir_id, func, func2, project_id, group_id) => {
    console.info('_uploadFile******');
    let name = temp.name ? temp.name.replace(new RegExp(/( )/g), "_") : '';
    const num = parseInt((Math.random() + 1) * Math.pow(10, 14))
    const key = "user/" + num + name;
    let nameArray = name.split('.');
    let suffix = nameArray[nameArray.length - 1].toLowerCase();
    let ver = verify(suffix);
    let buffer = files.length;
    if (ver) {
      temp.dir_id = dir_id;
      let size = temp.size;
      temp.media_type = (suffix === 'gif' ? 'video' : ver);
      temp.uploading = true;
      temp.group_id = group_id;
      temp.buffer = buffer;
      let b = new Blob([temp]), // 文件转化成二进制文件
        url = URL.createObjectURL(b); //转化成url
      let ctx = canvas.getContext('2d');
      let dom = ver === 'image' ? 'img' : ver;
      let obj = document.createElement(dom);
      obj.currentTime = 5;
      if (ver !== 'image') {
        obj['onloadeddata'] = (e) => {
          URL.revokeObjectURL(this.src);  // 释放createObjectURL创建的对象
          let thumb = '', min_thumb = '';
          if (ver !== 'audio') {
            let height = 270, width = 480;
            if (ver === 'video') {
              width = obj.videoWidth || width;
              height = obj.videoHeight || height;
            }
            if (width / height > 16 / 9) {
              height = height / width * 480;
              width = 480;
            } else {
              width = width / height * 270;
              height = 270;
            }
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(obj, 0, 0, width, height);
            thumb = min_thumb = canvas.toDataURL('image/png');
          }
          files[buffer].thumbnail = (suffix === 'gif' ? '' : (thumb || waveform));
          files[buffer].obj = obj;
          files[buffer].url = url;
          if (obj.duration === Infinity) {
            obj.currentTime = 99999;
            obj.ondurationchange = () => {
              files[buffer].duration = obj.duration;
              refresh(files);
              const observer = {
                next(res) {
                  console.info(res, 'next')
                  files[buffer].percent = parseInt(res.total.percent);
                  refresh(files);
                },
                error(res) {
                  this.cancel(buffer)
                  message.info(name + say('main', 'uploadFailed'));
                },
                complete(res) {
                  // files[buffer].done = true;
                  refresh(files);
                  upload_user_material(name, res.key, temp.media_type, project_id, buffer, func, func2)
                }
              };
              const putExtra = {
                fname: name
              };
              channel('get_oss_token', {}, (token) => {

                const observable = qiniu.upload(b, key, token, putExtra, config)

                const subscription = observable.subscribe(observer) // 上传开始
                // or
                //                                   subscription.unsubscribe() // 上传取消
                files[buffer].subscription = subscription;
                // files[buffer].media_id = name;
                // func && func(name, obj.duration, buffer);

                refresh(files);
              });

            };
          } else {
            files[buffer].duration = obj.duration;
            let __data = { duration: obj.duration, dir_id: dir_id, media_type: (suffix === 'gif' ? 'video' : ver), file_name: name, file_size: size, base64: min_thumb.replace(/^data:image\/\w+;base64,/, "") };
            project_id && (__data['project_id'] = project_id);
            refresh(files);
            const observer = {
              next(res) {
                console.info(res, 'next')
                files[buffer].percent = parseInt(res.total.percent);
                refresh(files);
                // ...
              },
              error(res) {
                this.cancel(buffer)
                message.info(name + say('main', 'uploadFailed'));
                // ...
              },
              complete(res) {
                console.info(res, 'complete');
                // files[buffer].done = true;
                refresh(files);
                upload_user_material(name, res.key, temp.media_type, project_id, buffer, func, func2)
              }
            };
            const putExtra = {
              fname: name
            };
            channel('get_oss_token', {}, (token) => {

              const observable = qiniu.upload(b, key, token, putExtra, config)

              const subscription = observable.subscribe(observer) // 上传开始
              // or
              // subscription.unsubscribe() // 上传取消
              files[buffer].subscription = subscription;
              // files[buffer].media_id = name;
              // func && func(name, obj.duration, buffer);
              refresh(files);
            });
          }
        };
      } else {
        obj['onload'] = (e) => {
          URL.revokeObjectURL(this.src);  // 释放createObjectURL创建的对象
          let thumb = '', min_thumb = '';
          let height = 270, width = 480;
          width = obj.width || width;
          height = obj.height || height;
          if (width / height > 16 / 9) {
            height = height / width * 480;
            width = 480;
          } else {
            width = width / height * 270;
            height = 270;
          }
          canvas.width = width;
          canvas.height = height;
          EXIF.getData(obj, function () {
            EXIF.getAllTags(this);
            let orientation = EXIF.getTag(this, 'Orientation');
            switch (orientation) {
              case 3:
                ctx.rotate(Math.PI);
                ctx.drawImage(this, 0, -height, width, height);
                break;
              case 6:     // 旋转90度
                canvas.width = height;
                canvas.height = width;
                ctx.rotate(Math.PI / 2);
                ctx.drawImage(this, 0, -height, width, height);
                break;
              case 8:     // 旋转-90度
                canvas.width = height;
                canvas.height = width;
                ctx.rotate(3 * Math.PI / 2);
                ctx.drawImage(this, -width, 0, width, height);
                break;
              default:
                ctx.drawImage(this, 0, 0, width, height);
                break;
            }
            thumb = min_thumb = canvas.toDataURL('image/png');
            files[buffer].thumbnail = (suffix === 'gif' ? '' : (thumb || waveform));
            files[buffer].obj = obj;
            files[buffer].url = url;
            files[buffer].duration = obj.duration;
            refresh(files);
            const observer = {
              next(res) {
                files[buffer].percent = parseInt(res.total.percent);
                refresh(files);
              },
              error(res) {
                this.cancel(buffer)
                message.info(name + say('main', 'uploadFailed'));
              },
              complete(res) {
                console.info(res, 'complete');
                // files[buffer].done = true;
                console.info(project_id);
                refresh(files);
                upload_user_material(name, res.key, temp.media_type, project_id, buffer, func, func2)
              }
            };
            const putExtra = {
              fname: name
            };
            channel('get_oss_token', {}, (token) => {
              console.info(token);

              const observable = qiniu.upload(b, key, token, putExtra, config)

              const subscription = observable.subscribe(observer) // 上传开始
              // or
              // subscription.unsubscribe() // 上传取消
              files[buffer].subscription = subscription;
              // files[buffer].media_id = name;
              // func && func(name, obj.duration, buffer);

              refresh(files);
            });
            // let __data={duration:obj.duration,dir_id:dir_id,media_type:(suffix==='gif'?'video':ver),file_name:name,file_size:size,base64:min_thumb.replace(/^data:image\/\w+;base64,/,"")};
            // project_id&&(__data['project_id']=project_id);
            // group_id&&(__data['group_id']=group_id);
            // channel('preview_upload',JSON.stringify(__data),(re)=>{
            //     files[buffer].media_id=re.media_id;
            //     func&&func(re.media_id,obj.duration,buffer);
            //     main();
            // },(re)=>{
            //     func2&&func2();
            // },'info');
          });
        }
      }
      //超时未加载出来的音视频，web不支持
      if (ver !== 'image') {
        obj.onloadstart = (e) => {
          setTimeout(() => {
            if (!files[buffer].thumbnail) {
              files[buffer].obj = obj;
              refresh(files);
              refresh(files);
              const observer = {
                next(res) {
                  console.info(res, 'next')
                  files[buffer].percent = parseInt(res.total.percent);
                  refresh(files);
                },
                error(res) {
                  this.cancel(buffer)
                  message.info(name + say('main', 'uploadFailed'));
                },
                complete(res) {
                  console.info(res, 'complete');
                  // files[buffer].done = true;
                  console.info(project_id);
                  refresh(files);
                  upload_user_material(name, res.key, temp.media_type, project_id, buffer, func, func2)
                }
              };
              const putExtra = {
                fname: name
              };
              channel('get_oss_token', {}, (token) => {
                console.info(token);

                const observable = qiniu.upload(b, key, token, putExtra, config)

                const subscription = observable.subscribe(observer) // 上传开始
                // or
                // subscription.unsubscribe() // 上传取消
                files[buffer].subscription = subscription;
                // files[buffer].media_id = name;
                // func && func(name, obj.duration, buffer);
                refresh(files);
              });
            }
          }, 10000);
        };
      } else {
        setTimeout(() => {
          if (!files[buffer].thumbnail) {
            files[buffer].obj = obj;
            refresh(files);
            refresh(files);
            const observer = {
              next(res) {
                files[buffer].percent = parseInt(res.total.percent);
                refresh(files);
              },
              error(res) {
                this.cancel(buffer)
                message.info(name + say('main', 'uploadFailed'));
              },
              complete(res) {
                console.info(res, 'complete');
                // files[buffer].done = true;
                console.info(project_id);
                refresh(files);
                upload_user_material(name, res.key, temp.media_type, project_id, buffer, func, func2)
              }
            };
            const putExtra = {
              fname: name
            };
            channel('get_oss_token', {}, (token) => {

              const observable = qiniu.upload(b, key, token, putExtra, config)

              const subscription = observable.subscribe(observer) // 上传开始
              // or
              // subscription.unsubscribe() // 上传取消
              files[buffer].subscription = subscription;
              // files[buffer].media_id = name;
              // func && func(name, obj.duration, buffer);
              refresh(files);
            });
          }
        }, 10000);
      }
      obj.src = url;
      files.push(temp);
    } else {
      message.info('文件格式不正确！')
    }
  };
  //上传事件入口方法；dir_id：要上传到的文件夹的id，project_id:所属项目id（可为空）；
  this.upload = function (dir_id, project_id, group_id) {
    let file = $("#file");
    if ($.trim(file.val()) === '') {
      return false;
    }
    //获取dom元素中的内容
    let temp = document.getElementById('file').files;
    for (let i = 0; i < temp.length; i++) {
      temp[i].project_id = this.project_id;
      this._uploadFile(temp[i], dir_id, '', '', this.project_id, group_id);
    }
    file.val('');
    //刷新素材列表的回调方法；
    refresh(files);
  };
  // this.sendStop = function () {
  //     if (start == 0) {
  //         // alert("未检测到文件上传")
  //         return false
  //     }
  //     stop = 1
  // }
  // this.sendStart = function () {
  //     if (start == 0) {
  //         // alert("未检测到文件上传")
  //         return false``
  //     }
  //     stop = 0
  //     // sendRequest();
  // }
}
export default new Init()
