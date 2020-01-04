/**
 * webpack开发环境配置，主要内容：
 * 热更新
 * 不要压缩代码
 */
const Webpack = require('webpack')
const webpackConfig = require('./webpack.config.js')
// webpack配置合并工具
const webpackMerge = require('webpack-merge')

module.exports = webpackMerge(webpackConfig, {
    mode:'development',
    devtool: 'cheap-module-eval-source-map',
    // 本地服务配置
    devServer: {
        // 端口号
        port: 9000,
        // 是否热更新
        hot: true,
        // 打包输出
        contentBase: '../dist'
    },
    plugins: [
        // 开发环境支持热更新
        new Webpack.HotModuleReplacementPlugin()
    ]
})