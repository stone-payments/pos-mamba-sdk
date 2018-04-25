const merge = require('webpack-merge')

/** Webpack configuration used for development */
module.exports = merge(require('./config.base.js'), {
  devtool: 'eval-source-map',

  optimization: {
    namedModules: true,
    noEmitOnErrors: true,
  },
})
