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