const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const { fromWorkspace, fromDist } = require('../helpers/utils.js')
const { IS_PROD, PKG } = require('../consts.js')

/**
 * Define the external packages that should not be included in the bundle.
 * It's defined by the current project's `package.json`.
 * */
const externals = ['peerDependencies'].reduce((acc, depType) => {
  if (PKG[depType]) {
    Object.keys(PKG[depType]).forEach(dep => {
      acc[dep] = dep
    })
    return acc
  }
}, {})

/** Webpack plugins to be used while building */
const plugins = [
  new CleanWebpackPlugin([fromDist()], {
    root: fromWorkspace(),
    verbose: false,
  }),
]

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

/** Webpack configuration for building */
module.exports = merge(require('./config.base.js'), {
  devtool: 'source-map',
  node: false,
  externals,
  plugins,
  optimization,
})
