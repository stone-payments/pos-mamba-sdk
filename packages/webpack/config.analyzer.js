/**
 * Webpack configuration for analyzing a production bundle
 */
const merge = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = merge(require('./config.build.js'), {
  stats: 'verbose',
  devtool: false,
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      openAnalyzer: true,
      logLevel: 'info',
    }),
  ],
});
