/**
 * Webpack configuration for building bundles
 */
const webpack = require('webpack')
const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const { fromProject, fromDist } = require('../utils/paths.js')
const { IS_PROD } = require('../consts.js')

const baseConfig = require('./config.base.js')

/** Webpack plugins to be used while building */
const plugins = [
  new CleanWebpackPlugin([fromDist()], {
    root: fromProject(),
    verbose: false,
  }),

  new CopyWebpackPlugin([
    { from: './assets/', to: fromDist('assets') },
    { from: fromProject('manifest.xml'), to: fromDist() },
  ]),
]

/** If building for production... */
if (IS_PROD) {
  plugins.push(
    /** Generate hashes based on module's relative path */
    new webpack.HashedModuleIdsPlugin(),
  )
}

/** Build optimizations */
const optimization = {
  /** If analyzing bundle, don't concatenate modules */
  minimize: IS_PROD,
  minimizer: [
    /** Minify the bundle's css */
    new OptimizeCSSAssetsPlugin({
      /** Default css processor is 'cssnano' */
      cssProcessor: require('cssnano'),
      cssProcessorOptions: {
        core: IS_PROD,
        discardComments: IS_PROD,
      },
    }),
    /** Minify the bundle's js */
    new UglifyJsPlugin({
      cache: true, // Enables file caching
      parallel: true, // Use multiple CPUs if available,
      sourceMap: true, // Enables sourcemap,
      uglifyOptions: {
        compress: {
          reduce_funcs: false,
          keep_fnames: false,
          /** Functions that doesn't have side-effects */
          pure_funcs: [
            'classCallCheck',
            '_classCallCheck',
            '_possibleConstructorReturn',
            'Object.freeze',
            'invariant',
            'warning',
          ],
        },
        mangle: {
          keep_fnames: false,
          /** Prevent renaming of `process.env...` */
          reserved: ['process'],
        },
        output: {
          comments: false,
        },
      },
    }),
  ],
}

module.exports = merge(baseConfig, {
  devtool: false,
  node: false,
  plugins,
  optimization,
})
