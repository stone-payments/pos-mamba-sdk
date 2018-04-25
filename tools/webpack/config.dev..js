const merge = require('webpack-merge')

/** Webpack configuration used for development */
module.exports = merge(require('./config.base.js'), {
  devtool: 'source-map',

  output: {
    filename: '[name].js',
    publicPath: './',
  },

  optimization: {
    namedModules: true,
    noEmitOnErrors: true,
  },
})
