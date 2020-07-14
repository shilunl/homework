## 1.Webpack 的构建流程主要有哪些环节？如果可以请尽可能详尽的描述 Webpack 打包的整个过程。
1、进行webpack.config.js对webpack进行配置    
2、依据配置，确定项目入口，找寻所有依赖资源模块  
3、依据loader配置，加载所有模块，对依赖模块进行转化     
4、依据pulgin配置，对资源进行各插件提供的功能，比如压缩文件，清除文件等。  
5、依据配置，确定出口，把转化好的资源文件，输入到指定位置。  
## 2、Loader 和 Plugin 有哪些不同？请描述一下开发 Loader 和 Plugin 的思路。
Loader负责源文件从输入到输出的转换，加载资源的。loader可以将文件从不同的语言（如TypeScript）转换为JavaScript，或者将内联图像转换为data URL。比如说：CSS-Loader，Style-Loader等。   
plugin 用于扩展webpack的功能，目的在于解决loader无法实现的其他事，从打包优化和压缩，到重新定义环境变量，功能强大到可以用来处理各种各样的任务。

每个Loader都导出一个函数，这个函数接受资源，然后对资源处理返回。  
plugin是通过钩子机制实现，webpack在每个环节都有定义好的钩子。插件是一个函数或者是一个包含apply方法的对象，接受一个compile对象，通过webpack的钩子处理资源。

## 3、使用 Webpack 实现 Vue 项目打包任务


1、webpack webpack-cli 基本安装  
2、less less-loader css-loader style-loader vue-style-loader    解析less  
3、vue-loader vue-template-compiler @vue/cli-plugin-babel 解析vue文件  
4、babel-loader @babel/core @babel/preset-env  js资源转义  
5、url-loader file-loader 图片资源复制或者转base64  
6、clean-webpack-plugin html-webpack-plugin  生成html  
7、webpack-dev-server  热重载  --hot参数  
8、webpack-merge 针对不同环境配置不同配置,把开发模式和生产模式分开。  
9、copy-webpack-plugin 打包时，复制不需要转换的资源  
10、webpack.DefinePlugin 配置全局常量  
11、webpackbar 打包时显示进度条  
12、mini-css-extract-plugin 处理css打包到指定文件  
13、eslint eslint-loader  eslint校验， 通过eslint --init 安装其他所需的插件  

配置文件如下：  
### npm scripts
```
"scripts": {
    "serve": "webpack-dev-server  --config webpack.dev.js",
    "build": "webpack --config webpack.prod.js",
    "lint": "eslint --ext .js --ext .vue src/ --fix"
},
```
### webpack.common.js
```
const path = require('path')

const VueLoaderPlugin = require('vue-loader/lib/plugin')
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/main.js',//文件入股口
    output: {
      path: path.resolve(__dirname, './dist'),//出口路径必须是绝对路径
      filename: 'js/[name]-[hash:8].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                use:{
                    loader:'babel-loader',
                    // options:{
                    //     presets:['@babel/preset-env']
                    // },
                },
                exclude: file => (
                    /node_modules/.test(file) &&
                    !/\.vue\.js/.test(file)
                )
            },
            
            {
                test: /\.less$/,
                use: [{
                    loader: 'vue-style-loader' 
                }, {
                    loader: 'css-loader' 
                }, {
                    loader: 'less-loader'
                }]
            },
            {
                test:/\.png$/,
                use:{
                    loader:'url-loader',
                    options:{
                        limit:5*1024,
                        esModule:false,
                        name: 'img/[name]_[hash:7].[ext]',
                    }
                }
            }
        ]
    },
    plugins: [
        
        new VueLoaderPlugin(),
        new htmlWebpackPlugin({
            title:'my app',
            template: './public/index.html',

        })
    ]
}
```
### webpack.dev.js
```
const path = require('path')
const webpack = require('webpack')
const common = require('./webpack.common.js')
const { merge } = require('webpack-merge')



module.exports = merge(common, {
    mode:'development',
    devtool:'cheap-module-source-map',
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress:true
    },
    module:{
        rules:[
            {
                test: /\.css$/,
                use:  [{
                    loader: 'vue-style-loader'
                }, {
                    loader: 'css-loader'
                }]
            },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            BASE_URL:'"./"'
        }),
    ]
})
```
### webpack.prod.js
```
const path = require('path')
const common = require('./webpack.common.js')
const { merge } = require('webpack-merge')
const webpack = require('webpack')
const WebpackBar = require('webpackbar');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const  CopyWebpackPlugin= require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = merge(common, {
    mode:'production',
    devtool:'nosources-source-map',
    module:{
        rules:[
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new WebpackBar(),
        new webpack.DefinePlugin({
            BASE_URL:'"./"'
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name]-[hash:8].css'
        }),
        new CopyWebpackPlugin({
            patterns: [
                {from: path.resolve(__dirname, './public')}
            ]
        })
    ]
})
```

