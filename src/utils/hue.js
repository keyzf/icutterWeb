/* 颜色 目前没有引用*/

export function get() {
    // console.info('handy get')

}

export function set() {
    // console.info('handy set')

}

export function hue(ctx, canvas, filter, sum) {
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;
    let p = canvas;
    let value=sum/100+1;
    switch (filter) {
        case 'hue':
            sum = sum / 180 * Math.PI;
            let sin = Math.sin(sum);
            let cos = Math.cos(sum);
            let matrix=[
                0.213 + cos * 0.787 - sin * 0.213, 0.715 - cos * 0.715 - sin * 0.715, 0.072 - cos * 0.072 + sin * 0.928,
                0.213 - cos * 0.213 + sin * 0.143, 0.715 + cos * 0.285 + sin * 0.140, 0.072 - cos * 0.072 - sin * 0.283,
                0.213 - cos * 0.213 - sin * 0.787, 0.715 - cos * 0.715 + sin * 0.715, 0.072 + cos * 0.928 + sin * 0.072
            ];
            for(let i=0;i<=data.length-4;i+=4){
                let r=data[i],g=data[i+1],b=data[i+2];
                data[i]=r * matrix[0] + g * matrix[1] + b * matrix[2];
                data[i+1]=r * matrix[3] + g * matrix[4] + b * matrix[5];
                data[i+2]=r * matrix[6] + g * matrix[7] + b * matrix[8]
            }
            break;
        case 'brightness':
            for(let i=0;i<=data.length-4;i+=4){
                let r=data[i],g=data[i+1],b=data[i+2];
                data[i]=r * value;
                data[i+1]=g *value;
                data[i+2]=b * value;
            }
            break;
        case 'contrast':
            let x= -(0.5 * value) + 0.5;
            for(let i=0;i<=data.length-4;i+=4){
                let r=data[i],g=data[i+1],b=data[i+2];
                data[i]=r * value+x*255;
                data[i+1]=g *value+x*255;
                data[i+2]=b * value+x*255;
            }
            break;
        case 'saturate':
            let mt=[
                0.213 + 0.787 * value, 0.715 - 0.715 * value, 0.072 - 0.072 * value,
                0.213 - 0.213 * value, 0.715 + 0.285 * value, 0.072 - 0.072 * value,
                0.213 - 0.213 * value, 0.715 - 0.715 * value, 0.072 + 0.928 * value
            ];
            for(let i=0;i<=data.length-4;i+=4){
                let r=data[i],g=data[i+1],b=data[i+2];
                data[i]=r * mt[0] + g * mt[1] + b * mt[2];
                data[i+1]=r * mt[3] + g * mt[4] + b * mt[5];
                data[i+2]=r * mt[6] + g * mt[7] + b * mt[8]
            }
            break;
    }
    ctx.putImageData(imageData, 0, 0);
}