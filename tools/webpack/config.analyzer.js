/**
 * Webpack configuration for analyzing a production bundle
 */
const merge = require('webpack-merge')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

const buildConfig = require('./config.build.js')

/** Webpack configuration for bundle analyzing */
module.exports = merge(buildConfig, {
  /** Normal output log for bundle-analyzer */
  stats: 'verbose',
  devtool: false,
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      openAnalyzer: true,
      logLevel: 'info',
    }),
  ],
})
