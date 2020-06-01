/**
* @description: 房贷库生成配置
* @author:      yulei@addcn.com
* @dateTime:    2020-06-01 11:27:34
*/
const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: './lib/index.ts',
    output: {
        path: path.resolve(__dirname, '../es'),
        filename: 'index.js',
        libraryTarget: 'umd',
        library: 'mortgageCalculator'
    },
    devtool: '#source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new UglifyJsPlugin()
    ]
}