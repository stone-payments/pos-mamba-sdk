const merge = require('webpack-merge')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

/** Webpack configuration for bundle analyzing */
module.exports = merge(require('./config.build.js'), {
  /** Normal output log for bundle-analyzer */
  stats: 'verbose',
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      openAnalyzer: true,
      logLevel: 'info',
    }),
  ],
})
