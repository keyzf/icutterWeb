/* 画布操作 使用gl生成转场图片 */

import transitions from "gl-transitions";
import createTransition from "gl-transition";
import createTexture from "gl-texture2d";

// const imageFrom = await loadImage("url1");
// const imageTo = await loadImage("url2");
// ^ NB: we just assumed you have these 2 imageFrom and imageTo Image objects that have the image loaded and ready
const canvas = document.createElement('canvas');

const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([-1, -1, -1, 4, 4, -1]), // see a-big-triangle
  gl.STATIC_DRAW
);
export function getTransition(imageFrom, imageTo, width, height, pro, type) {

  canvas.width = width;
  canvas.height = height;

  gl.viewport(0, 0, width, height);
  const from = createTexture(gl, imageFrom);
  from.minFilter = gl.LINEAR;
  from.magFilter = gl.LINEAR;

  const to = createTexture(gl, imageTo);
  to.minFilter = gl.LINEAR;
  to.magFilter = gl.LINEAR;
  const transition = createTransition(gl, transitions.find(t => t.name === (transitions.map(t => t.name).includes(type) ? type : 'GridFlip'))); // https://github.com/gl-transitions/gl-transitions/blob/master/transitions/cube.glsl

  // animates forever!
  //   const loop = (t) => {
  //     // requestAnimationFrame(loop);
  //     transition.draw((t/1000)%1, from, to, canvas.width, canvas.height, { persp: 1.5, unzoom: 0.6 });
  //   }
  transition.draw(pro || 0, from, to, canvas.width, canvas.height, { persp: 1.5, unzoom: 0.6 });
  // requestAnimationFrame(loop);
  return canvas;

}
