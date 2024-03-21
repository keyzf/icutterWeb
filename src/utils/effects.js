/* 画布操作 抠图和滤镜 */
import { notification } from 'antd';
// 高斯模糊
import stackBlurImage from '@/utils/StackBlur';

export function get() {
    // console.info('handy get')

}

export function set() {
    // console.info('handy set')

}

let _canvas = document.createElement('canvas');
let _ctx = _canvas.getContext('2d');
//c 抠像的16进制色值；
//s 抠像的边缘；
export function reversi(ctx, canvas, filter, x, y, lx, ly, lw, lh, c, s, t, img) {
    if (lw === 0 || lh === 0) return;
    if (lw < 1 || lh < 1) return;
    if (canvas.width <= 1 || canvas.height <= 1) return;
    let imageData;
    try {
        imageData = ctx.getImageData(lx || 0, ly || 0, lw || canvas.width, lh || canvas.height);
    } catch (e) {
        let info = '此功能';
        switch (filter) {
            case 'chroma': info = '抠像'; break;
            case 'blur': info = '自定义模糊'; break;
            case 'emboss': info = '浮雕'; break;
        }
        notification.warning({
            placement: 'topRight',
            key: filter,
            description: '该素材需导入完成才可预览' + info + '效果',
            bottom: 50,
            duration: 3,
        });
        return

    }
    // let imageData = ctx.getImageData(lx ||0, ly || 0, lw ||canvas.width, lh ||canvas.height);
    let data = imageData.data;
    // let image = new Image();
    let cr = 0, cg = 0, cb = 0;

    if (c) {
        cr = parseInt('0x' + c.substr(0, 2));
        cg = parseInt('0x' + c.substr(2, 2));
        cb = parseInt('0x' + c.substr(4, 2));
    }
    // if(c){
    let str1 = '659f52';
    let _cr = parseInt('0x' + str1.substr(0, 2));
    let _cg = parseInt('0x' + str1.substr(2, 2));
    let _cb = parseInt('0x' + str1.substr(4, 2));
    // }
    let str3 = [];
    // [
    //     '80bd6e','69a557','538842','417834','2a5320',
    //     '34662c','7ca264','1d3c19','6f8144','72ae62',
    //     '5b9347','4e813d','548e47','5e984c','467d3b',
    //     '436e36','386e33','7cb668','4b893f','609d52',
    //     '2d5f27','6b9f4e','71a95b','64934e','355328',
    //     '254620','6a9d58','212c1c','497439','589450',
    //     '396033','709350','608c40','50713d','3b4e32',
    //     '374528','719a61','344124','547245','2f3f24',
    //     '303e2b','2f3f24','45491e','527043','688d59',
    //     '4e6a3b','4d6a3a','63864b','3b4d2a','6b874b',
    //     '2c481f','1c2f14','3d5f2c','3b6229','4c6d44',
    //     '35502f','406532','719f5d','415838','7e8e50',
    //     '5a884b','77a46b','23421f','7c9e6a','708959',
    //     '849657','7ca45f','2c552b','213317','578f3f',
    //     '7bae68','6c854b','4e7a46','659747','65825c',
    //     '81a573','407844','89c47e','65a265',].map((v,k)=>{
    [].map((v, k) => {
        let str1 = v;
        let _cr = parseInt('0x' + str1.substr(0, 2));
        let _cg = parseInt('0x' + str1.substr(2, 2));
        let _cb = parseInt('0x' + str1.substr(4, 2));
        str3.push([_cr, _cg, _cb])
    });
    let sensitivity = s * 255 / 100;
    // image.src = canvas.toDataURL("image/png");
    switch (filter) {
        case 'isGif':
            _canvas.width = lw;
            _canvas.height = lh;
            _ctx.drawImage(img, 0, img.height / 2, img.width, img.height / 2, 0, 0, lw, lh);
            let _imageData = _ctx.getImageData(0, 0, lw, lh);
            let _data = _imageData.data;
            for (let i = 0; i <= data.length - 4; i += 4) {
                data[i + 3] = _data[i + 1];
            }
            break;
        case 'chroma':
            for (let i = 0; i <= data.length - 4; i += 4) {

                let r = data[i], g = data[i + 1], b = data[i + 2];
                // if(Math.abs(r-cr)<=sensitivity&&Math.abs(g-cg)<=sensitivity&&Math.abs(b-cb)<=sensitivity){
                //     data[i+3]=t*255/100;
                // }
                let dr = r - cr;
                let dg = g - cg;
                let db = b - cb;

                let diff = Math.sqrt((dr * dr + dg * dg + db * db) / (255.0 * 255.0));

                // if (blend > 0.0001) {
                //     return av_clipd((diff - s/100) / blend, 0.0, 1.0) * 255.0;
                // } else {
                data[i + 3] = (diff > s / 100) ? 255 : t * 255 / 100;
                str3.map((v, k) => {
                    let _diff = Math.sqrt(((r - v[0]) * (r - v[0]) + (g - v[1]) * (g - v[1]) + (b - v[2]) * (b - v[2])) / (255.0 * 255.0));
                    data[i + 3] = (_diff > s / 100) ? data[i + 3] : t * 255 / 100;
                });
                // }
                // data[i+3]=t*255/100;

            }
            break;
        //扣洞
        // case 'blur':
        //     if(lw&&lh){
        //         _canvas.width= lw ||canvas.width;
        //         _canvas.height=lh ||canvas.height;
        //         // _ctx.putImageData(imageData,0,0);
        //         // _ctx.filter='blur(8px)';
        //         _ctx.drawImage(canvas,0,0,_canvas.width,_canvas.height);
        //         imageData = _ctx.getImageData(lx ||0, ly || 0, lw ||canvas.width, lh ||canvas.height);
        //     }else{
        //         stackBlurImage(data,lw ||canvas.width,lh ||canvas.height,ctx,x ,y ,1);
        //     }
        //     break;
        case 'blur':
            if (lw && lh) {
                let num = 16;
                let _x = (lx || 0) - num > 0 ? lx - (lx || 0) - num : 0;
                let _y = (ly || 0) - num > 0 ? ly - (ly || 0) - num : 0;
                let __w = (lw || canvas.width) + (lx || 0) + num;
                let _w = __w > canvas.width ? canvas.width - _x : __w - _x;
                let __h = (lh || canvas.height) + (ly || 0) + num;
                let _h = __h > canvas.height ? canvas.height - _y : __h - _y;
                _canvas.width = _w;
                _canvas.height = _h;
                // _ctx.putImageData(imageData,0,0);
                _ctx.filter = 'blur(8px)';
                _ctx.drawImage(canvas, _x, _y, _w, _h, 0, 0, _w, _h);
                imageData = _ctx.getImageData((lx || 0) - _x, (ly || 0) - _y, lw || canvas.width, lh || canvas.height);
            } else {
                stackBlurImage(data, lw || canvas.width, lh || canvas.height, ctx, x, y, 1);
            }
            break;
        case 'monochrome':
            for (let i = 0; i <= data.length - 4; i += 4) {
                let average = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = average;
                data[i + 1] = average;
                data[i + 2] = average;
            }
            break;
        case 'negate':
            for (let i = 0; i <= data.length - 4; i += 4) {
                data[i] = 255 - data[i];
                data[i + 1] = 255 - data[i + 1];
                data[i + 2] = 255 - data[i + 2];
            }
            break;
        case 'emboss':
            for (let i = 0; i < data.length; i += 4) {
                //浮雕效果的算法：当前RGB减去相邻的GRB得到的值再加上128
                data[i] = data[i + 16 + canvas.width * 4] - data[i] + 128;
                data[i + 1] = data[i + 17 + canvas.width * 4] - data[i + 1] + 128;
                data[i + 2] = data[i + 18 + canvas.width * 4] - data[i + 2] + 128;
                //计算获取单位元素的RBG然后取平均值 再次灰度，优化浮雕的效果
                let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = avg;
                data[i + 1] = avg;
                data[i + 2] = avg;
            }
            break;
        case 'vintage':
            for (let i = 0; i < data.length; i += 4) {
                let dr = .393 * data[i] + .769 * data[i + 1] + .189 * data[i + 2];
                let dg = .349 * data[i] + .686 * data[i + 1] + .168 * data[i + 2];
                let db = .272 * data[i] + .534 * data[i + 1] + .131 * data[i + 2];

                let scale = Math.random() * 0.5 + 0.5;

                data[i] = scale * dr + (1 - scale) * data[i];
                scale = Math.random() * 0.5 + 0.5;
                data[i + 1] = scale * dg + (1 - scale) * data[i + 1];
                scale = Math.random() * 0.5 + 0.5;
                data[i + 2] = scale * db + (1 - scale) * data[i + 2];
            }
            break;
    }
    ctx.filter = ''

    ctx.putImageData(imageData, lx || 0, ly || 0);

}