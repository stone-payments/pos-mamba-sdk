/**
 * Webpack configuration for active development
 */
const merge = require('webpack-merge')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const { fromWorkspace } = require('../../tools/utils/paths')

module.exports = merge(require('./config.base.js'), {
  devtool: 'source-map',

  plugins: [new CaseSensitivePathsPlugin()],

  optimization: {
    namedModules: true,
    noEmitOnErrors: true,
  },

  devServer: {
    contentBase: fromWorkspace('dist'),
    watchContentBase: true,
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
    inline: true,
    watchOptions: {
      poll: true,
    },
  },
})
