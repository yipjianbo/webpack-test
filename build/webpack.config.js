const path = require('path');
// 为特定html文件插入有哈希值的js脚本
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 每次打包前，清空dist文件夹
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
// 将js动态生成的<style>标签改成外链形式引入，更加优雅,样式将合并到一个css文件。
const MiniCssExtractPlugin =  require('mini-css-extract-plugin');
const devMode = process.argv.indexOf('--mode=production') === -1;

// 将css文件一一打包，不合并，以外链的形式引入
// const  ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
// 生成ExtractTextWebpackPlugin配置实例
// let indexLess = new ExtractTextWebpackPlugin('index.[hash:8].less');
// let indexCss = new ExtractTextWebpackPlugin('index.[hash:8].css');
// 静态资源复制插件
const CopyWebpackPlugin = require('copy-webpack-plugin')
// vue-loader解析.vue文件
const VueLoaderPlugin = require('vue-loader/lib/plugin')
// happypack多进程压缩js，优化压缩时间
const HappyPack = require('happypack')
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({size: os.cpus().length})
const Webpack = require('webpack')
// 展示打包后文件大小的插件
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = {
    // 开发模式
    mode: 'development',
    // 加载额外模块
    module: {
        rules: [
          // vue文件编译
          {
            test:/\.vue$/,
            use:['cache-loader','thread-loader',{
              loader:'vue-loader',
              options:{
                compilerOptions:{
                  preserveWhitespace:false
                }
              }
            }]
          },
          // babel配置
          {
              test: /\.js$/,
              use: [
                {
                  loader: 'happypack/loader?id=happyBabel'
                }
              ],
              // include exclude 同样配置include exclude也可以减少webpack loader的搜索转换时间
              exclude: /node_modules/
          },
          // MiniCssExtractPlugin配置方式,css合并成一个外链引入
          {
              test: /\.css$/,
              // use: ['style-loader', MiniCssExtractPlugin.loader,  'css-loader', 'postcss-loader'] // 从右向左解析原则
              use: [
                {
                  loader: devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
                  options: {
                    publicPath:"../dist/css/",
                    hmr:devMode
                  }
                },
                'css-loader',
                // 这里postcss-loader不用写option配置，因为在postcss.config.js已经写过了
                'postcss-loader'
              ]
          },
          // less
          {
              test: /\.less$/,
              // use: ['style-loader', MiniCssExtractPlugin.loader,  'css-loader', 'postcss-loader', 'less-loader'] // 从右向左解析原则
              use: [
                {
                  loader: devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
                  options: {
                    publicPath:"../dist/css/",
                    hmr:devMode
                  }
                },
                'css-loader',
                'less-loader',
                // 这里postcss-loader不用写option配置，因为在postcss.config.js已经写过了
                'postcss-loader'
              ]
          },
          // 图片处理
          {
              test: /\.(jpe?g|png|gif)$/i, //图片文件
              // url-loader,file-loader配合处理，小于limit转成base64，否则将文件直接移入使用
              use: [
                  {
                    loader: 'url-loader',
                    options: {
                      limit: 10240,
                      fallback: {
                        loader: 'file-loader',
                        options: {
                            name: 'img/[name].[hash:8].[ext]'
                        }
                      }
                    }
                  }
              ]
          },
          // 多媒体处理
          {
              test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, //媒体文件
              use: [
                  {
                    loader: 'url-loader',
                    options: {
                      limit: 10240,
                      fallback: {
                        loader: 'file-loader',
                        options: {
                          name: 'media/[name].[hash:8].[ext]'
                        }
                      }
                    }
                  }
              ]
          },
          // 字体处理
          {
              test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i, // 字体
              use: [
                  {
                    loader: 'url-loader',
                    options: {
                      limit: 10240,
                      fallback: {
                        loader: 'file-loader',
                        options: {
                          name: 'fonts/[name].[hash:8].[ext]'
                        }
                      }
                    }
                  }
              ]
          }
        ]
    },
    resolve: {
      /**
       * 当我们代码中出现 import 'vue'时， webpack会采用向上递归搜索的方式去node_modules 目录下找。
       * 为了减少搜索范围我们可以直接告诉webpack去哪个路径下查找。也就是别名(alias)的配置
       */
      alias: {
        'vue$':'vue/dist/vue.runtime.esm.js',
        '@':path.resolve(__dirname,'../src')
      },
      // webpack会根据extensions定义的后缀查找文件(频率较高的文件类型优先写在前面)
      extensions:['*','.js','.json','.vue']
    },
    // 单个js入口的写法
    // entry: path.resolve(__dirname, '../src/main.js'),
    entry: ["@babel/polyfill", path.resolve(__dirname,'../src/main.js')],
    // 输出
    output: {
        filename: '[name].[hash:8].js',
        path: path.resolve(__dirname, '../dist')
    },
    // 插件
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html'), // 要引入脚本的html页面
            filename: 'index.html', // 打包后的html文件名称
            // chunks: ['main'] // 引用entry入口的main模块
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
          filename: devMode ? '[name].css' : '[name].[hash].css',
          chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
        }),
        // vue模版解析插件
        new VueLoaderPlugin(),
        // 强化js压缩,多线程压缩
        new HappyPack({
          id: 'happyBabel',
          loaders: [
            {
              loader: 'babel-loader',
              option: {
                presets: [
                  ['@babel/present-env']
                ],
                // 是否缓存loader结果，下次对比无变化直接使用
                cacheDirectory: true
              }
            }
          ],
          threadPool: happyThreadPool // 共享进城池
        }),
        new Webpack.DllReferencePlugin({
          context: __dirname,
          manifest: require('./vendor-manifest.json')
        }),
        new CopyWebpackPlugin([ // 拷贝生成的文件到dist目录 这样每次不必手动去cv
          {from: 'static', to:'static'}
        ]),
        new BundleAnalyzerPlugin({
          analyzerHost: '127.0.0.1',
          analyzerPort: '8899'
        })
    ]
}