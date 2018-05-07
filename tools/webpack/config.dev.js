/**
 * Webpack configuration for active development
 */
const webpack = require('webpack')
const merge = require('webpack-merge')

const { fromDist } = require('../helpers/utils.js')
const baseConfig = require('./config.base.js')

module.exports = merge(baseConfig, {
  devtool: 'source-map',

  plugins: [new webpack.HotModuleReplacementPlugin()],

  optimization: {
    namedModules: true,
    noEmitOnErrors: true,
  },

  devServer: {
    contentBase: fromDist(),
    compress: true,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
    },
    open: true,
    overlay: {
      warnings: true,
      errors: true,
    },
    port: 8080,
    publicPath: 'http://localhost:8080/',
    hot: true,
  },
})
