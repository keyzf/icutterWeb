const path = require('path')

module.exports = {
    webpack: (config, env) => {
        // 路径别名
        config.resolve.alias = {
            '@': path.join(__dirname, '.', 'src')
        }
        // 样式丢失
        let oneOf = config.module.rules[1].oneOf
        config.module.rules[1].oneOf.splice(oneOf.length - 1, 1, {
            exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/, /\.scss$/],
            loader: require.resolve('file-loader'),
            options: {
                name: 'static/media/[name].[hash:8].[ext]',
            },
        }, {
            test: /\.scss$/,
            loaders: ['style-loader', 'css-loader', 'sass-loader']
        })

        return config;
    },
    paths: (paths, env) => {
        return paths;
    },
}