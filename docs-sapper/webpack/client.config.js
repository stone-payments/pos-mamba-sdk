const webpack = require('webpack')
const merge = require('webpack-merge')
const config = require('sapper/webpack/config.js')
const baseConfig = require('./base.config.js')('client')
const { IS_DEV } = require('quickenv')

const client = {
  entry: config.client.entry(),
  output: Object.assign(config.client.output(), {
    globalObject: 'this',
  }),
  target: 'web',
  plugins: [
    IS_DEV && new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.browser': true,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ].filter(Boolean),
  devtool: IS_DEV && 'inline-source-map',
}

module.exports = merge([baseConfig, client])
