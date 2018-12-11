/**
 * Webpack configuration for analyzing a production bundle
 */

const { readFileSync, existsSync } = require('fs');
const merge = require('webpack-merge');
const VirtualModulesPlugin = require('webpack-virtual-modules');
const webpack = require('webpack');
const { getPkg, fromCwd } = require('quickenv');

const getEntrypoints = require('./helpers/getEntrypoints.js');
const getVirtualFiles = require('./helpers/getVirtualFiles.js');
const MambaFixesPlugin = require('./plugins/MambaFixesPlugin.js');
const { BUNDLE_NAME } = require('./helpers/consts.js');
const loaders = require('./helpers/loaders.js');

const PKG = getPkg();

module.exports = merge(require('./config.base.js'), {
  entry: getEntrypoints(),
  output: {
    path: fromCwd('dist', BUNDLE_NAME),
  },
  resolve: {
    modules: [fromCwd('src'), 'node_modules'],
    alias: {
      page: fromCwd('node_modules', 'page'),
      'core-js': fromCwd('node_modules', 'core-js'),
      '@mamba/pos': fromCwd('node_modules', '@mamba', 'pos'),
    },
  },
  module: {
    rules: [
      /** Handle font imports */
      { test: /\.(eot|woff2?|otf|ttf)$/, use: [loaders.fonts] },
      /** Handle image imports */
      { test: /\.(gif|jpe?g|png|ico|svg)$/, use: [loaders.images] },
    ],
  },
  plugins: [
    /** If no real 'src/index.js' present, use the default virtual one */
    new VirtualModulesPlugin(getVirtualFiles()),
    /** Prepend the Function.prototype.bind() polyfill webpack's runtime code */
    new MambaFixesPlugin(),
    new webpack.DefinePlugin(
      (() => {
        const __MANIFEST__ = {
          name: PKG.name,
          description: PKG.description,
          version: PKG.version,
          slug: `${PKG.mamba.id}-${PKG.name}`,
          ...PKG.mamba,
        };

        if (PKG.mamba) {
          const iconPath = fromCwd('src', PKG.mamba.iconPath);
          if (existsSync(iconPath)) {
            __MANIFEST__.iconBase64 = readFileSync(iconPath, {
              encoding: 'base64',
            });
          }
        }

        return { __MANIFEST__: JSON.stringify(__MANIFEST__) };
      })(),
    ),
  ],
});
