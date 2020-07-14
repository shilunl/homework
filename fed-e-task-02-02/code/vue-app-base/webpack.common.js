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