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
    new webpack.NormalModuleReplacementPlugin(
      /(.*)\.PLATFORM(\.(gif|jpe?g|png|ico|svg|bmp))/,
      function (resource) {
        /* resource obj example
        {
          contextInfo: {
            issuer: '/Users/jaikme/Workspace/pos-mamba-app-launcher/src/constants/notifications/index.js',
            compiler: undefined
          },
          resolveOptions: {},
          context: '/Users/jaikme/Workspace/pos-mamba-app-launcher/src/constants/notifications',
          request: './models/BBBNotification.PLATFORM.js',
          dependencies: [
            HarmonyImportSideEffectDependency {
              module: null,
              weak: false,
              optional: false,
              loc: [SourceLocation],
              request: './models/BBBNotification.PLATFORM.js',
              userRequest: './models/BBBNotification.PLATFORM.js',
              redirectedModule: undefined,
              originModule: [NormalModule],
              sourceOrder: 1,
              parserScope: {}
            },
            HarmonyImportSpecifierDependency {
              module: null,
              weak: false,
              optional: false,
              loc: [SourceLocation],
              request: './models/BBBNotification.PLATFORM.js',
              userRequest: './models/BBBNotification.PLATFORM.js',
              redirectedModule: undefined,
              originModule: [NormalModule],
              sourceOrder: 1,
              parserScope: {},
              id: 'bbbCampaign',
              redirectedId: undefined,
              name: 'bbbCampaign',
              range: [Array],
              strictExportPresence: false,
              namespaceObjectAsContext: false,
              callArgs: undefined,
              call: undefined,
              directImport: true,
              shorthand: false
            }
          ]
        } */

        const replacement = resource.request.replace(/\.PLATFORM/, `${PLATFORM_TARGET}`);
        if (existsSync(path.join(resource.context, replacement))) {
          resource.request = replacement;
        } else {
          const defaultSameNameFile = resource.request.replace(/\.PLATFORM/, '');

          // Try use a file with the same name but(whitout platform slug)
          if (existsSync(path.join(resource.context, defaultSameNameFile))) {
            resource.request = defaultSameNameFile;
          }
          // Try use index.js instead
          else if (resource.context.includes('.js')) {
            const paths = resource.request.split('!');
            console.log(paths);
            const lastPathIndex = paths.length - 1;
            const lastPath = paths[lastPathIndex];
            const requestPath = path.join(
              resource.context,
              lastPath.split('/').slice(0, -1).join('/'),
              'index.js',
            );

            if (existsSync(requestPath)) {
              resource.request = requestPath;
            }
          }
        }

        // if (resource.request.indexOf('Default') === -1) return;

        /* const paths = resource.request.split('!');
      console.log(paths);
      const lastPathIndex = paths.length - 1;
      const lastPath = paths[lastPathIndex];
      const pathNames = lastPath.split('/');
      const fileName = pathNames[pathNames.length - 1];
      const replacementTry = fileName.replace(/\.PLATFORM/, `.${PLATFORM}`);

      console.log(resource.request, replacementTry);

      if (existsSync(replacementTry)) {
        // .replace(/-APP_TARGET/, `-${appTarget}`);
        const finalReplace = resource.request.replace(replacementTry, resource.request);
        console.log('finalReplace -> ', replacementTry, finalReplace);
        resource.request = finalReplace;
      } */

        /*
      /Users/jaikme/Workspace/calculator-new/node_modules/babel-loader/lib/index.js??ref--4-0!/Users/jaikme/Workspace/calculator-new/node_modules/svelte-loader/index.js??ref--4-1!/Users/jaikme/Workspace/calculator-new/node_modules/eslint-loader/index.js??ref--4-2!/Users/jaikme/Workspace/calculator-new/src/components/Calculator/Keypad/Default.html
      */

        /* const replacementPath = resource.request
        .replace(/\.ORG/, ORG_TARGET !== '' ? `.${ORG_TARGET}` : ORG_TARGET)
        .replace(
          /\.MODEL/,
          MODEL_TARGET !== '' ? `.${MODEL_TARGET}` : MODEL_TARGET,
        )
        .replace(
          /\.TARGET/,
          ENV_TARGET !== '' ? `.${ENV_TARGET}` : ENV_TARGET,
        );
      console.log('------> replacementPath: ', replacementPath);
      if (existsSync(replacementPath)) {
        resource.request = replacementPath;
        return;
      }
      const fallback = resource.request
        .replace(/\.ORG/, '')
        .replace(/\.MODEL/, '');
        .replace(/\.TARGET/, '');
      resource.request = fallback; */
      },
    ),
  ],
});
