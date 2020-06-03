const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    entry: path.resolve(__dirname, '../src/main.js'),
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: "js/[name].js"
    },

    devtool: '#source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /(node_modules)/,
                include: path.resolve(__dirname, '../src')
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                exclude: /(node_modules)/
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader', // 把样式挂载到head里
                    'css-loader' // 分析 css 中的关系
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader', // 把样式挂载到head里
                    'css-loader', // 分析 css 中的关系
                    'less-loader'
                ]
            },
            {
                test: /\.(eot|woff2?|ttf|svg)$/,
                use: [
                    {
                        loader: "url-loader"
                    }
                ]
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: '房贷试算器 - TypeScript 版',
            template: path.resolve(__dirname, '../src/index.html')
        }),

        new VueLoaderPlugin()
    ],
}