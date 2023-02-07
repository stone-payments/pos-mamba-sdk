/**
 * Webpack configuration for analyzing a production bundle
 */
const { existsSync } = require('fs');
const path = require('path');
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
const { PLATFORM } = process.env;

const hasEnvOf = (env) => typeof env === 'string' && env !== '';

const PLATFORM_TARGET = String(
  hasEnvOf(PLATFORM) && PLATFORM !== 'GENERIC' ? `.${PLATFORM}` : '',
).toUpperCase();

module.exports = merge(require('./config.base.js'), {
  entry: getEntrypoints(),
  output: {
    path: fromCwd('dist', BUNDLE_NAME),
  },
  resolve: {
    modules: [fromCwd('src'), 'node_modules', fromCwd('vendors/packages')],
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
    new webpack.NormalModuleReplacementPlugin(
      /(.*)\.PLATFORM(\.(gif|jpe?g|png|ico|svg|bmp|js|html))/,
      function (resource) {
        console.log(resource.request);
        /* relevant resource obj sample
        {
          context: '<absolute folder>',
          request: './<file path>/<file name>.PLATFORM.js',
        } */

        const replacement = resource.request.replace(/\.PLATFORM/, `${PLATFORM_TARGET}`);
        if (existsSync(path.join(resource.context, replacement))) {
          resource.request = replacement;
        } else {
          const getPathFileName = (request) => {
            const paths = request.split('!');
            const lastPath = paths[paths.length - 1];
            return lastPath.split('/').slice(0, -1).join('/');
          };

          const defaultSameNameFile = resource.request.replace(/\.PLATFORM/, '');

          // Try use a file with the same name but(whitout platform slug)
          if (existsSync(path.join(resource.context, defaultSameNameFile))) {
            resource.request = defaultSameNameFile;
          }
          // Try use index.js instead
          else if (resource.context.includes('.js')) {
            const nextPath = path.join(
              resource.context,
              getPathFileName(resource.request),
              'index.js',
            );
            if (existsSync(nextPath)) resource.request = nextPath;
          }
          // Try use index.html instead
          else if (resource.context.includes('.html')) {
            const nextPath = path.join(
              resource.context,
              getPathFileName(resource.request),
              'index.html',
            );
            if (existsSync(nextPath)) resource.request = nextPath;
          }
        }
      },
    ),
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
