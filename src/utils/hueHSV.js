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
    let increment = (sum || 50 ) / 100;
    // console.info(increment)
    test(data,increment,filter);
    // switch (filter) {
    //     case 1:
    //         for (let i = 0; i <= data.length - 4; i += 4) {
    //             let r = data[i], g = data[i + 1], b = data[i + 2],
    //                 nr, ng, nb;
    //             let max = Math.max(r, g, b),
    //                 min = Math.min(r, g, b);
    //             let delta = (max - min) / 255;
    //             if (delta === 0) {
    //                 continue;
    //             }
    //             let val = (max + min) / 255;
    //             let l = val / 2;
    //             let s, alpha;
    //             if (l < 0.5) {
    //                 s = delta / val;
    //             } else {
    //                 s = delta / (2 - val)
    //             }
    //             if (increment >= 0) {
    //                 if (increment + s >= 1) {
    //                     alpha = s;
    //                 } else {
    //                     alpha = 1 - increment;
    //                 }
    //                 alpha = 1 / alpha - 1;
    //                 nr = r + (r - l * 255) * alpha;
    //                 ng = g + (g - l * 255) * alpha;
    //                 nb = b + (b - l * 255) * alpha;
    //             } else {
    //                 alpha = increment;
    //                 nr = l * 255 + (r - l * 255) * (1 + alpha);
    //                 ng = l * 255 + (g - l * 255) * (1 + alpha);
    //                 nb = l * 255 + (b - l * 255) * (1 + alpha);
    //             }
    //             data[i] = nr;
    //             data[i + 1] = ng;
    //             data[i + 2] = nb;
    //         }
    //         break;
    //     case 2:
    //         test(data,increment,filter);
    //         break;
    //         // case 3:
    //         //     o(data, 0, increment, 0);
    //         //     break;
    //         // case 4:
    //         //     o(data, 0, 0, increment);
    //         break;
    // }

    function test(data,e,filter) {
        let fun=addSaturationToRGB;
        switch (filter){
            case 0:fun=addBrightnessToRGB;break;
            case 1:fun=addSaturationToRGB;break;
            case 2:fun=addSaturationToRGB;break;
            case 3:fun=addHueToRGB;break;
        }

        for (let j = 0; j <= data.length - 4; j += 4) {
            let k= fun([data[j],data[j+1],data[j+2]],e);
            data[j] = k[0];
            data[j + 1] = k[1];
            data[j + 2] = k[2];
        }
    }

    function addSaturationToRGB(t, e) {
        var i = RGBtoHSV(255 * t[0], 255 * t[1], 255 * t[2]);
        return i[1] += e, i[1] > 1 ? i[1] = 1 : i[1] <= 0 && (i[1] = 0), HSVtoRGB(i[0], i[1], i[2])
    }

    function addBrightnessToRGB(t, e) {
        var i = RGBtoHSV(255 * t[0], 255 * t[1], 255 * t[2]);
        return i[2] += e, i[2] > 1 ? i[2] = 1 : i[2] < 0 && (i[2] = 0), HSVtoRGB(i[0], i[1], i[2])
    }

    function addHueToRGB(t, e) {
        var i = RGBtoHSV(255 * t[0], 255 * t[1], 255 * t[2]);
        return i[0] += e / 360, i[0] > 1 ? i[0] -= 1 : i[0] < 0 && (i[0] += 1), HSVtoRGB(i[0], i[1], i[2])
    }


    function HSVtoRGB(t, e, i) {
        var r, n, a, s, o, l, h, c;
        switch (1 === arguments.length && (e = t.s, i = t.v, t = t.h), s = Math.floor(6 * t), o = 6 * t - s, l = i * (1 - e), h = i * (1 - o * e), c = i * (1 - (1 - o) * e), s % 6) {
            case 0:
                r = i, n = c, a = l;
                break;
            case 1:
                r = h, n = i, a = l;
                break;
            case 2:
                r = l, n = i, a = c;
                break;
            case 3:
                r = l, n = h, a = i;
                break;
            case 4:
                r = c, n = l, a = i;
                break;
            case 5:
                r = i, n = l, a = h
        }
        return [r, n, a]
    }

    function RGBtoHSV(t, e, i) {
        1 === arguments.length && (e = t.g, i = t.b, t = t.r);
        var r, n = Math.max(t, e, i), a = Math.min(t, e, i), s = n - a, o = 0 === n ? 0 : s / n, l = n / 255;
        switch (n) {
            case a:
                r = 0;
                break;
            case t:
                r = e - i + s * (i > e ? 6 : 0), r /= 6 * s;
                break;
            case e:
                r = i - t + 2 * s, r /= 6 * s;
                break;
            case i:
                r = t - e + 4 * s, r /= 6 * s
        }
        return [r, o, l]
    }

    /*   function process_C(data,c,b) {
           // let s=Math.round(Math.sin(hue)* (1<<16) * sat);
           // let c=Math.round(Math.cos(hue)* (1<<16) * sat);
           let contrast = (c * 256 * 16);
           let brightness = ( (100.0 * b + 100.0) * 511) / 200 - 128 - contrast / 32;
           for(let i=0;i<data.length-4;i+=4){
               let r=data[i],g=data[i+1],b=data[i+2];
               // let Y = 0.299*r + 0.587*g + 0.114*b;
               // let U = -0.147*r - 0.289*g + 0.436*b;
               // let V = 0.615*r - 0.515*g - 0.100*b;

               y=(((30*r) + (59*g) + (11*b))/100);
               u=(((-17*r) - (33*g) + (50*b)+12800)/100);
               v=(((50*r) - (42*g) - (8*b)+12800)/100);

               // let u=U-128;
               // let v=V-128;
               // let new_u= (c*u - s*v + (1<<15) + (128<<16))>>16;
               // let new_v= (s*u + c*v + (1<<15) + (128<<16))>>16;
               let new_u = ((U * contrast) >> 12) + brightness;
               let new_v = ((V * contrast) >> 12) + brightness;
               if(new_u & 255) new_u= (-new_u)>>31;
               if(new_v & 255) new_v= (-new_v)>>31;

               y=(((30*r) + (59*g) + (11*b))/100);
               u=(((-17*r) - (33*g) + (50*b)+12800)/100);
               v=(((50*r) - (42*g) - (8*b)+12800)/100);

               let R = Y + 1.14*new_v;
               let G = Y - 0.39*new_u - 0.58*new_v;
               let B = Y + 2.03*new_u;
               data[i]=R;
               data[i+1]=G;
               data[i+2]=B;
           }
       }*/


    function o(t, e, n, i) {
        let o = document.createElement("canvas");
        o.width = p.width;
        o.height = p.height;
        let r = o.getContext("2d"),
            a = [],
            s = e === -1,
            l = e && e > 0 && e <= t.length ? e : t.length,
            c = {
                r: 0,
                g: 0,
                b: 0
            },
            d = Math.sqrt(Math.pow(255, 2) + Math.pow(255, 2) + Math.pow(255, 2)),
            h = n && n >= 0 && n <= 1 ? n : 0,
            u = i && i >= 0 && i <= 1 ? i : 0,
            m = !1;
        for (let g = 0; g < l; g++) {
            let f, _, C;
            if (!m) {
                let y = new Image;
                y.src = t[g].image;
                r.drawImage(y, 0, 0, p.width, p.height);
                let v = r.getImageData(0, 0, p.width, p.height);
                f = 0;
                _ = t.length;
                C = t.length / 4;
                for (let T = 0; T < _; T += 4) {
                    let x = {r: t[T], g: t[T + 1], b: t[T + 2]},
                        b = Math.sqrt(Math.pow(x.r - c.r, 2) + Math.pow(x.g - c.g, 2) + Math.pow(x.b - c.b, 2));
                    // b <= d * h && f++
                }
            }
            if (!m && C - f <= C * u) {

            } else {
                s && (m = !0);
                a.push(t[g])
            }
        }
        a = a.concat(t.slice(l));
        a.length <= 0 && a.push(t[t.length - 1]);
        return a;
    }

    // function i(t, e, n) {
    //     var i = document.createElement("canvas");
    //     i.width = p.width, i.height = p.height;
    //     var o, r, a, s = i.getContext("2d"), l = {r: 0, g: 0, b: 0},
    //         c = Math.sqrt(Math.pow(255, 2) + Math.pow(255, 2) + Math.pow(255, 2)),
    //         d = e && e >= 0 && e <= 1 ? e : 0, h = n && n >= 0 && n <= 1 ? n : 0, u = new Image;
    //     u.src = t.image, s.drawImage(u, 0, 0, p.width, p.height);
    //     var m = s.getImageData(0, 0, p.width, p.height);
    //     o = 0, r = m.data.length, a = m.data.length / 4;
    //     for (var g = 0; g < r; g += 4) {
    //         var f = {r: m.data[g], g: m.data[g + 1], b: m.data[g + 2]},
    //             _ = Math.sqrt(Math.pow(f.r - l.r, 2) + Math.pow(f.g - l.g, 2) + Math.pow(f.b - l.b, 2));
    //         _ <= c * d && o++
    //     }
    //     return !(a - o <= a * h)
    // }
    //
    // function o(t, e, n, i) {
    //     var o = document.createElement("canvas");
    //     o.width = p.width, o.height = p.height;
    //     for (var r = o.getContext("2d"), a = [], s = e === -1, l = e && e > 0 && e <= t.length ? e : t.length, c = {
    //         r: 0,
    //         g: 0,
    //         b: 0
    //     }, d = Math.sqrt(Math.pow(255, 2) + Math.pow(255, 2) + Math.pow(255, 2)), h = n && n >= 0 && n <= 1 ? n : 0, u = i && i >= 0 && i <= 1 ? i : 0, m = !1, g = 0; g < l; g++) {
    //         var f, _, C;
    //         if (!m) {
    //             var y = new Image;
    //             y.src = t[g].image, r.drawImage(y, 0, 0, p.width, p.height);
    //             var v = r.getImageData(0, 0, p.width, p.height);
    //             f = 0, _ = v.data.length, C = v.data.length / 4;
    //             for (var T = 0; T < _; T += 4) {
    //                 var x = {r: v.data[T], g: v.data[T + 1], b: v.data[T + 2]},
    //                     b = Math.sqrt(Math.pow(x.r - c.r, 2) + Math.pow(x.g - c.g, 2) + Math.pow(x.b - c.b, 2));
    //                 b <= d * h && f++
    //             }
    //         }
    //         !m && C - f <= C * u || (s && (m = !0), a.push(t[g]))
    //     }
    //     return a = a.concat(t.slice(l)), a.length <= 0 && a.push(t[t.length - 1]), a
    // }


    ctx.putImageData(imageData, 0, 0);
}