/**
 * Webpack configuration for analyzing a production bundle
 */

const merge = require('webpack-merge');
const VirtualModulesPlugin = require('webpack-virtual-modules');
const webpack = require('webpack');
const { getPkg, fromCwd } = require('quickenv');

const getEntrypoints = require('./helpers/getEntrypoints.js');
const getVirtualFiles = require('./helpers/getVirtualFiles.js');
const MambaFixesPlugin = require('./plugins/MambaFixesPlugin.js');
const { BUNDLE_NAME, IS_BROWSER } = require('./helpers/consts.js');
const loaders = require('./helpers/loaders.js');

const PKG = getPkg();

module.exports = merge(require('./config.base.js'), {
  entry: getEntrypoints(),
  output: {
    path: fromCwd('dist', BUNDLE_NAME),
  },
  resolve: {
    modules: [fromCwd('src'), 'node_modules'],
    alias: (() => {
      const aliases = {
        page: fromCwd('node_modules', 'page'),
        'core-js': fromCwd('node_modules', 'core-js'),
        '@mamba/pos': fromCwd('node_modules', '@mamba', 'pos'),
      };

      if (IS_BROWSER) {
        aliases.__APP_ICON__ = fromCwd('src', PKG.mamba.iconPath);
      }

      return aliases;
    })(),
  },
  module: {
    rules: [
      /** Handle font imports */
      { test: /\.(eot|woff2?|otf|ttf)$/, use: [loaders.fonts] },
      /** Handle image imports */
      { test: /\.(gif|jpe?g|png|ico|svg|bmp)$/, use: [loaders.images] },
    ],
  },
  plugins: [
    /** If no real 'src/index.js' present, use the default virtual one */
    new VirtualModulesPlugin(getVirtualFiles()),
    /** Prepend the Function.prototype.bind() polyfill webpack's runtime code */
    new MambaFixesPlugin(),
    new webpack.DefinePlugin({
      __APP_MANIFEST__: JSON.stringify({
        name: PKG.name,
        description: PKG.description,
        version: PKG.version,
        slug: `${PKG.mamba.id}-${PKG.name}`,
        ...PKG.mamba,
      }),
    }),
  ],
});
