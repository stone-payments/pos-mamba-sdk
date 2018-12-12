/**
 * Webpack configuration for analyzing a production bundle
 */
const merge = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = merge(require('./config.app.build.js'), {
  stats: 'errors-only',
  devtool: false,
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      openAnalyzer: true,
      logLevel: 'info',
    }),
  ],
});
