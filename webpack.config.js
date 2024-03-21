var path = require('path');
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'src/');
var webpack=require('webpack');
var CompressionWebpackPlugin = require('compression-webpack-plugin');

const vendors = [
    'react',
    'react-dom',
    'react-redux',
    'react-router',
    'react-router-redux',
    'redux',
];

//将jquery单独打包，将react的相关组件单独打包
module.exports = function (webpackConfig, env) {
    webpackConfig.entry={
        "index": "./src/index.js",
        serve: "./src/serve-config.js",
        vendor: vendors,
        jquery:["jquery"]
    }

    webpackConfig.plugins.push(new CompressionWebpackPlugin({ //gzip 压缩
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp(
            '\\.(js|css)$'    //压缩 js 与 css
        ),
        threshold: 10240,
        minRatio: 0.8
    }));
    webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin({
        names: ["jquery","vendor"],
        minChunks: Infinity
    }));
    webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin({
        name: "runtime",
        minChunks: Infinity
    }));
    webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin({
        name: 'common',
        minChunks: 2,
    }),);
    return webpackConfig;
}
