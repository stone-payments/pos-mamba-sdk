/**
 * Common webpack configuration
 */
const { existsSync } = require('fs');
const { join, resolve } = require('path');
const merge = require('webpack-merge');
const MiniHtmlWebpackPlugin = require('mini-html-webpack-plugin');
const WebpackBar = require('webpackbar');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const webpack = require('webpack');
const { fromCwd } = require('quickenv');
const clientEnvironment = require('@mamba/configs/helpers/clientEnvironment.js');

const getHTMLTemplate = require('./helpers/getHTMLTemplate.js');
const loaders = require('./helpers/loaders.js');
const { isOfModuleType, transpileIgnoreBaseCondition } = require('./helpers/depTranspiling.js');
const {
  DEBUG_LVL,
  IS_POS,
  IS_BROWSER,
  IS_DEV,
  IS_PROD,
  NODE_ENV,
  APP_ENV,
  ADD_MAMBA_SIMULATOR,
} = require('./helpers/consts.js');

const baseInclude = [fromCwd('src')];

const definePluginOptions = merge(clientEnvironment('webpack'), {
  __NODE_ENV__: JSON.stringify(NODE_ENV),
  __APP_ENV__: JSON.stringify(APP_ENV),
  __PROD__: IS_PROD,
  __TEST__: NODE_ENV === 'test',
  __DEV__: IS_DEV,
  __DEBUG_LVL__: DEBUG_LVL,
  __POS__: IS_POS,
  __SIMULATOR__: ADD_MAMBA_SIMULATOR,
  __BROWSER__: IS_BROWSER,
  __PLATFORM__: process.env.PLATFORM,
  __PLATFORM_S920__: process.env.PLATFORM === 'S920',
  __PLATFORM_Q92__: process.env.PLATFORM === 'Q92',
  __PLATFORM_Q92S__: process.env.PLATFORM === 'Q92S',
  __PLATFORM_D199__: process.env.PLATFORM === 'D199',
  __PLATFORM_D195__: process.env.PLATFORM === 'D195',
  __PLATFORM_Q60__: process.env.PLATFORM === 'Q60',
  __PLATFORM_MP35__: process.env.PLATFORM === 'MP35',
  __PLATFORM_MP35P__: process.env.PLATFORM === 'MP35P',
  __PLATFORM_D230__: process.env.PLATFORM === 'D230',
  __PLATFORM_V240M__: process.env.PLATFORM === 'V240M',
  __SUPPORT_SMALL_SCREEN__: process.env.__SUPPORT_SMALL_SCREEN__ === true,
});

const { PLATFORM } = process.env;

const hasEnvOf = (env) => typeof env === 'string' && env !== '';

const PLATFORM_TARGET = String(
  hasEnvOf(PLATFORM) && PLATFORM !== 'GENERIC' ? `.${PLATFORM}` : '',
).toUpperCase();

module.exports = {
  mode: IS_PROD ? 'production' : 'development',
  cache: true,
  target: 'web',
  node: false,
  context: fromCwd('src'),
  output: {
    path: fromCwd('dist'),
    publicPath: './',
    filename: '[name].[hash:5].js',
    chunkFilename: '[name].[hash:5].js',
  },
  resolve: {
    /** Do not resolve symlinks */
    symlinks: false,
    enforceExtension: false,
    mainFields: ['svelte', 'esnext', 'jsnext:main', 'module', 'main'],
    extensions: ['.js', '.ts', '.json', '.pcss', '.css', '.html', '.htmlx', '.svelte'],
  },
  module: {
    rules: [
      /**
       * ! App modules
       * */
      {
        test: /\.(htmlx?|svelte)$/,
        include: baseInclude,
        exclude: [/node_modules/],
        use: [loaders.babelEsNext, loaders.svelte, loaders.eslint],
      },
      {
        test: /\.ts$/,
        use: [loaders.babelEsNext, loaders.eslint],
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: [loaders.sourcemaps],
      },
      {
        test: /\.js$/,
        include: baseInclude,
        exclude: [/node_modules/],
        enforce: 'pre',
        use: [loaders.babelEsNext, loaders.eslint],
      },
      /**
       * ! Dependency modules
       * */
      /** On dependencies svelte files, run svelte compiler and babel */
      {
        test: /\.(htmlx?|svelte)$/,
        include: [/node_modules/],
        /** When developing, parse linked packages svelte dependencies */
        use: [loaders.babelEsNext, loaders.svelte],
      },
      /** Transpile .mjs dependencies as well */
      {
        test: /\.mjs$/,
        include: [/node_modules/],
        exclude: [/core-js/],
        use: [loaders.babelEsNext],
      },
      /**
       * * Run app COMMONJS dependencies through babel with module: 'commonjs'.
       * @babel/preset-env inserts es6 import if we don't pass "module: 'commonjs'",
       * resulting in mixed es6 and commonjs code.
       * */
      {
        test: {
          ...transpileIgnoreBaseCondition,
          and: [isOfModuleType('cjs')],
        },
        use: [loaders.babelCJS],
      },
      /** Run app ES6 dependencies through babel with { modules: false } */
      {
        test: {
          ...transpileIgnoreBaseCondition,
          and: [isOfModuleType('es')],
        },
        use: [loaders.babelEsNext],
      },
      /**
       * ! Generic files
       */
      {
        test: /\.(css|pcss)$/,
        /** When importing from a style file, let's
         * use package.json's 'style' field before
         * the actual 'main' one
         * */
        resolve: { mainFields: ['style', 'main'] },
        use: [loaders.extractCss, loaders.css, loaders.postcss, loaders.resolveUrl],
      },
    ],
  },
  plugins: [
    new WebpackBar(),
    new LodashModuleReplacementPlugin(),
    new webpack.NormalModuleReplacementPlugin(
      /(.*)\.PLATFORM(\.(gif|jpe?g|png|ico|svg|bmp|js|html))/,
      function (resource) {
        /* relevant resource obj sample
        {
          context: '<absolute folder>',
          request: './<file path>/<file name>.PLATFORM.js',
        } */

        const replacement = resource.request.replace(/\.PLATFORM/, `${PLATFORM_TARGET}`);
        if (existsSync(join(resource.context, replacement))) {
          resource.request = replacement;
        } else {
          const getPathFileName = (request) => {
            const paths = request.split('!');
            const lastPath = paths[paths.length - 1];
            return lastPath.split('/').slice(0, -1).join('/');
          };

          const defaultSameNameFile = resource.request.replace(/\.PLATFORM/, '');

          // Try use a file with the same name but(whitout platform slug)
          if (existsSync(join(resource.context, defaultSameNameFile))) {
            resource.request = defaultSameNameFile;
          }
          // Try use index.js instead
          else if (resource.context.includes('.js')) {
            const nextPath = join(resource.context, getPathFileName(resource.request), 'index.js');
            if (existsSync(nextPath)) resource.request = nextPath;
          }
          // Try use index.html instead
          else if (resource.context.includes('.html')) {
            const nextPath = join(
              resource.context,
              getPathFileName(resource.request),
              'index.html',
            );
            if (existsSync(nextPath)) resource.request = nextPath;
          } else if (/(.*)\.(gif|jpe?g|png|ico|svg|bmp)/.test(resource.request)) {
            resource.request = resolve(__dirname, './virtual-files/dummy.gif');
          }
        }
      },
    ),
    new MiniCssExtractPlugin({
      filename: 'style.css',
      chunkFilename: '[name].[hash:5].css',
    }),
    new MiniHtmlWebpackPlugin({
      context: { title: 'Application' },
      template: getHTMLTemplate,
    }),
    new webpack.DefinePlugin(definePluginOptions),
  ],
  /** Minimal useful output log */
  stats: {
    modules: false,
    chunks: false,
    colors: true,
    children: false,
    env: true,
    warningsFilter: [/source-map-loader/, /Failed to parse source map/],
  },
  optimization: {
    namedChunks: true,
    namedModules: true,
    /** Create a separate chunk for webpack runtime */
    runtimeChunk: { name: 'runtime' },
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      minChunks: 1,
      automaticNameDelimiter: '_',
      cacheGroups: {
        vendors: false,
        libs: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        /** Chunk that contains used polyfills */
        polyfills: {
          test: /core-js/,
          name: 'polyfills',
          priority: 10,
        },
      },
    },
  },
};
