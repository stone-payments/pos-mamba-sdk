/**
 * Common webpack configuration
 */
const { readFileSync } = require('fs');
const MiniHtmlWebpackPlugin = require('mini-html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VirtualModulesPlugin = require('webpack-virtual-modules');
const webpack = require('webpack');
const { getPkg, fromCwd } = require('quickenv');

const getVirtualFiles = require('./helpers/getVirtualFiles.js');
const getEntrypoints = require('./helpers/getEntrypoints.js');
const getHTMLTemplate = require('./helpers/getHTMLTemplate.js');
const loaders = require('./helpers/loaders.js');
const MambaFixesPlugin = require('./plugins/MambaFixesPlugin.js');
const {
  isOfModuleType,
  transpileIgnoreBaseCondition,
} = require('./helpers/depTranspiling.js');
const {
  BUNDLE_NAME,
  DEBUG_LVL,
  IS_POS,
  IS_BROWSER,
  IS_DEV,
  IS_PROD,
  NODE_ENV,
  APP_ENV,
  ADD_MAMBA_SIMULATOR,
} = require('./helpers/consts.js');

const PKG = getPkg();

module.exports = {
  mode: IS_PROD ? 'production' : 'development',
  cache: true,
  target: 'web',
  node: false,
  context: fromCwd('src'),
  entry: getEntrypoints(),
  output: {
    path: fromCwd('dist', BUNDLE_NAME),
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
    /** Make webpack also resolve modules from './src' */
    modules: [fromCwd('src'), 'node_modules'],
    alias: {
      page: fromCwd('node_modules', 'page'),
      'core-js': fromCwd('node_modules', 'core-js'),
      '@mamba/pos': fromCwd('node_modules', '@mamba', 'pos'),
    },
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
    new ProgressBarPlugin(),
    new MiniCssExtractPlugin({
      filename: 'style.css',
      chunkFilename: '[name].[hash:5].css',
    }),
    new MiniHtmlWebpackPlugin({
      context: { title: 'Mamba Application' },
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
      __MANIFEST__: JSON.stringify({
        name: PKG.name,
        description: PKG.description,
        version: PKG.version,
        slug: `${PKG.mamba.id}-${PKG.name}`,
        iconBase64: readFileSync(fromCwd('src', PKG.mamba.iconPath), {
          encoding: 'base64',
        }),
        ...PKG.mamba,
      }),
    }),
  ].filter(Boolean),
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
