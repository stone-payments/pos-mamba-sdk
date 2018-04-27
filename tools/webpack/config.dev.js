const merge = require('webpack-merge')
const SimpleProgressPlugin = require('webpack-simple-progress-plugin')

/** Webpack configuration used for development */
module.exports = merge(require('./config.base.js'), {
  devtool: 'eval-source-map',

  plugins: [
    new SimpleProgressPlugin({
      messageTemplate: [':bar', ':percent', ':elapseds', ':msg'].join(' '),
    }),
  ],

  optimization: {
    namedModules: true,
    noEmitOnErrors: true,
  },
})
