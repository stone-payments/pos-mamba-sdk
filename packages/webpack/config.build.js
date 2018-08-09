/**
 * Webpack configuration for building bundles
 */
const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssProcessor = require('cssnano');
const { BUNDLE_NAME, IS_PROD } = require('./helpers/consts.js');

module.exports = merge(require('./config.base.js'), {
  devtool: false,
  node: false,
  plugins: [
    new FileManagerPlugin({
      onStart: {
        delete: [`${BUNDLE_NAME}`, `./${BUNDLE_NAME}.tar.gz`],
      },
      onEnd: {
        copy: [
          { source: './src/assets', destination: `./${BUNDLE_NAME}/assets` },
          {
            source: './.mamba/{manifest.xml,*.so}',
            destination: `./${BUNDLE_NAME}/`,
          },
        ],
        archive: [
          {
            source: `./${BUNDLE_NAME}/`,
            destination: `./${BUNDLE_NAME}.tar.gz`,
            format: 'tar',
            options: {
              gzip: true,
              gzipOptions: { level: 1 },
              globOptions: { nomount: true },
            },
          },
        ],
      },
    }),
    /** Generate hashes based on module's relative path */
    IS_PROD && new webpack.HashedModuleIdsPlugin(),
  ].filter(Boolean),
  optimization: {
    /** If analyzing bundle, don't concatenate modules */
    minimize: IS_PROD,
    minimizer: [
      /** Minify the bundle's css */
      new OptimizeCSSAssetsPlugin({
        /** Default css processor is 'cssnano' */
        cssProcessor,
        cssProcessorOptions: {
          core: IS_PROD,
          discardComments: IS_PROD,
          autoprefixer: false,
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
  },
});
