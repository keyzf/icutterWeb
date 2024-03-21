import { Modal } from 'antd';
import channel from "@/channel";

const _confirm = Modal.confirm;
export const info = Modal.info;
export const success = Modal.success;
export const error = Modal.error;
export const warning = Modal.warning;
/**
   tip:显示的文字
   url:发送请求的路径
   data:发送请求的参数
   callback:成功的回调
   info
   okText:确定按钮文字
   cancelText:取消按钮文字
   showLoading:控制确定按钮loading的回调
* */
export const confirm = (tip, url, data, callback, info, okText, cancelText, showLoading) => {
    _confirm({
        title: '提示',
        content: tip,
        style: {
            top: 200
        },
        maskClosable: true,
        okText: okText || '确认',
        cancelText: cancelText || '取消',
        onOk() {
            if (url) {
                return new Promise((resolve, reject) => {
                    channel(url, data, () => {
                        resolve();
                        if (callback) {
                            callback();
                        }
                    }, () => {
                        resolve();
                    }, 'info')
                }).catch(() => console.log('Oops errors!'));
            } else {
                if (showLoading) {
                    return new Promise((resolve, reject) => {
                        showLoading(resolve);
                    }).catch(() => console.log('Oops errors!'));
                } else {
                    if (callback) {
                        callback();
                    }
                }
            }
        }
    });
};
export const edit = (tip, url, data, callback, info, okText, cancelText) => {
    _confirm({
        title: tip,
        style: {
            top: 200
        },
        okText: okText || '确认',
        cancelText: cancelText || '取消',
        onOk() {
            if (url) {
                return new Promise((resolve, reject) => {
                    channel(url, data, () => {
                        resolve();
                        if (callback) {
                            callback();
                        }
                    }, () => {
                        resolve();
                    }, 'info')
                }).catch(() => console.log('Oops errors!'));
            } else {
                if (callback) {
                    callback();
                }
            }
        }
    });
};

