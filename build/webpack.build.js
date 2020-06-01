const merge = require('webpack-merge')
const commonConfig = require('./webpack.common.js')

module.exports = () => {
    // @ts-ignore
    return merge(commonConfig, {
        mode: 'production',
    })
}
