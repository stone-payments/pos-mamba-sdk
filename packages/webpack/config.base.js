/**
 * Common webpack configuration
 */
const MiniHtmlWebpackPlugin = require('mini-html-webpack-plugin');
const WebpackBar = require('webpackbar');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OfflinePlugin = require('offline-plugin');
const webpack = require('webpack');
const { fromCwd } = require('quickenv');

const getHTMLTemplate = require('./helpers/getHTMLTemplate.js');
const loaders = require('./helpers/loaders.js');
const {
  isOfModuleType,
  transpileIgnoreBaseCondition,
} = require('./helpers/depTranspiling.js');
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
    extensions: ['.js', '.json', '.pcss', '.css', '.html', '.htmlx', '.svelte'],
  },
  module: {
    rules: [
      /**
       * ! App modules
       * */
      {
        test: /\.(htmlx?|svelte)$/,
        include: [fromCwd('src')],
        exclude: [/node_modules/],
        use: [loaders.babelEsNext, loaders.svelte, loaders.eslint],
      },
      {
        test: /\.js$/,
        include: [fromCwd('src')],
        exclude: [/node_modules/],
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
        use: [
          loaders.extractCss,
          loaders.css,
          loaders.postcss,
          loaders.resolveUrl,
        ],
      },
    ],
  },
  plugins: [
    new WebpackBar(),
    new MiniCssExtractPlugin({
      filename: 'style.css',
      chunkFilename: '[name].[hash:5].css',
    }),
    new MiniHtmlWebpackPlugin({
      context: { title: 'Application' },
      template: getHTMLTemplate,
    }),
    new webpack.DefinePlugin({
      __NODE_ENV__: JSON.stringify(NODE_ENV),
      __APP_ENV__: JSON.stringify(APP_ENV),
      __PROD__: IS_PROD,
      __TEST__: NODE_ENV === 'test',
      __DEV__: IS_DEV,
      __DEBUG_LVL__: DEBUG_LVL,
      __POS__: IS_POS,
      __SIMULATOR__: ADD_MAMBA_SIMULATOR,
      __BROWSER__: IS_BROWSER,
    }),
    new OfflinePlugin(),
  ],
  /** Minimal useful output log */
  stats: {
    modules: false,
    chunks: false,
    colors: true,
    children: false,
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
