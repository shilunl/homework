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