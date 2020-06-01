const path = require('path')
const merge = require('webpack-merge')
const commonConfig = require('./webpack.common.js')

module.exports = () => {
    // @ts-ignore
    return merge(commonConfig, {
        mode: 'development',
        devServer: {
            contentBase: path.resolve(__dirname, '../src'),
        }
    })
}