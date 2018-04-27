const merge = require('webpack-merge')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const baseConfig = require('../../../tools/webpack/config.base.js')

module.exports = merge(baseConfig, {
  stats: true,
  devtool: false,
  node: false,
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          output: {
            beautify: true,
          },
          mangle: {
            reserved: ['process'],
          },
        },
      }),
    ],
  },
})
