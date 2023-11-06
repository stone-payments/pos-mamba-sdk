/**
 * Webpack configuration for building bundles
 */
const fs = require('fs');
const { join } = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const { fromCwd } = require('quickenv');
const TerserPlugin = require('terser-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { getPkg } = require('quickenv');
const {
  BUNDLE_NAME,
  IS_PROD,
  IS_POS,
  ORG_ASSETS_FOLDER,
  STATIC_ASSETS_FOLDER,
} = require('./helpers/consts.js');
const MambaManifestPlugin = require('./plugins/MambaManifestPlugin.js');

const PKG = getPkg();

const { PLATFORM, BUILD_ALL } = process.env;

const hasOrgFolder = fs.existsSync(join(fromCwd('src'), ORG_ASSETS_FOLDER));

const hasStaticFolder = fs.existsSync(join(fromCwd('src'), STATIC_ASSETS_FOLDER));

module.exports = merge(require('./config.app.js'), {
  devtool: false,
  plugins: [
    /** Minify the bundle's css */
    new OptimizeCSSAssetsPlugin({
      /** Default css processor is 'cssnano' */
      cssProcessorOptions: {
        core: IS_PROD,
        discardComments: IS_PROD,
        autoprefixer: false,
      },
    }),
    IS_POS && new MambaManifestPlugin(),
    new FileManagerPlugin({
      events: {
        onStart: {
          delete: [
            `./dist/${BUNDLE_NAME}`,
            `./dist/${BUNDLE_NAME}${BUILD_ALL ? `.${PLATFORM}` : ''}.tar.gz`,
            `./dist/${BUNDLE_NAME}${BUILD_ALL ? `.${PLATFORM}` : ''}.ppk`,
          ],
        },
        onEnd: {
          copy: [
            {
              source: `./src/${PKG.mamba.iconPath}`,
              destination: `./dist/${BUNDLE_NAME}/${PKG.mamba.iconPath}`,
            },
            hasOrgFolder && {
              source: `./src/${ORG_ASSETS_FOLDER}`,
              destination: `./dist/${BUNDLE_NAME}/${ORG_ASSETS_FOLDER}`,
            },
            hasStaticFolder && {
              source: `./src/${STATIC_ASSETS_FOLDER}`,
              destination: `./dist/${BUNDLE_NAME}/${STATIC_ASSETS_FOLDER}`,
            },
          ].filter(Boolean),
          archive: [
            {
              source: `./dist/${BUNDLE_NAME}/`,
              destination: `./dist/${BUNDLE_NAME}${BUILD_ALL ? `.${PLATFORM}` : ''}.tar.gz`,
              format: 'tar',
              options: {
                gzip: true,
                gzipOptions: { level: 1 },
              },
            },
            {
              source: `./dist/${BUNDLE_NAME}/`,
              destination: `./dist/${PKG.name}_v${PKG.version}${
                BUILD_ALL ? `.${PLATFORM}` : ''
              }.ppk`,
              format: 'zip',
              options: {
                gzip: true,
                gzipOptions: { level: 1 },
              },
            },
          ],
        },
      },
      context: process.cwd(),
    }),
    /** Generate hashes based on module's relative path */
    IS_PROD && new webpack.HashedModuleIdsPlugin(),
  ].filter(Boolean),
  optimization: {
    minimize: IS_PROD,
    minimizer: [
      /** Minify the bundle's js */
      new TerserPlugin({
        extractComments: false,
        parallel: true,
        terserOptions: {
          safari10: true,
          compress: {
            /** Disabling this option sometimes improves performance of the output code */
            reduce_funcs: false,
            keep_infinity: true,
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
        },
      }),
    ],
  },
});
