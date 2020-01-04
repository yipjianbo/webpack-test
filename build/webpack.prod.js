/**
 * webpack生产环境配置，主要内容：
 * css压缩
 * js压缩
 * 分包优化
 */
const path = require('path')
const webpackConfig = require('./webpack.config.js')
// webpack配置合并插件
const WebpackMerge = require('webpack-merge')
// 静态资源复制插件
const CopyWebpackPlugin = require('copy-webpack-plugin')
// css压缩工具
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// js压缩工具
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// webpack-parallel-uglify-plugin
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
module.exports = WebpackMerge(webpackConfig, {
    mode:'production',
    devtool: 'cheap-module-source-map',
    plugins: [
        // 复制静态资源
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname,'../public'),
            to: path.resolve(__dirname,'../dist')
        }])
    ],
    // 压缩配置
    optimization: {
        minimizer: [
            // js压缩
            // new UglifyJsPlugin({
            //     cache: true,
            //     parallel: true,
            //     sourceMap: true
            // }),
            // 强化js压缩
            new ParallelUglifyPlugin({
                cacheDir: '.cache/',
                uglifyJS: {
                    output: {
                        comments: false,
                        beautify: false
                    },
                    compress: {
                        drop_console: true,
                        collapse_vars: true,
                        reduce_vars: true
                    }
                }
            }),
            // css压缩
            new OptimizeCssAssetsPlugin({})
        ],
        // 分包
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                libs: {
                    name: 'chunk-libs',
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    chunks: 'initial' // 只打包初始时依赖的第三方
                }
            }
        }
    }
})