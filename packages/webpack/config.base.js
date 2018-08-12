/**
 * Common webpack configuration
 */
const MiniHtmlWebpackPlugin = require('mini-html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const { getPkg, fromCwd } = require('quickenv');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const {
  BUNDLE_NAME,
  IS_POS,
  IS_BROWSER,
  IS_DEV,
  IS_PROD,
  NODE_ENV,
  APP_ENV,
} = require('./helpers/consts.js');
const htmlTemplate = require('./helpers/htmlTemplate.js');
const loaders = require('./helpers/loaders.js');
const MambaFixesPlugin = require('./helpers/MambaFixesPlugin.js');

const PKG = getPkg();

/** Get what direct dependencies will be exported with es6
 * to prevent babel from transforming it to commonjs
 * TODO: See if @babel-preset/env can output require(polyfills)
 * */
const es6Deps = Object.keys(PKG.dependencies).reduce((acc, depName) => {
  const path = fromCwd('node_modules', depName);
  const pkg = getPkg({ path });
  if (pkg.module || pkg['jsnext:main'] || pkg.esnext) {
    acc.push(path);
  }
  return acc;
}, []);

/** App entry point */
const entry = {
  app: [
    /** Mamba style resetter/normalizer */
    '@mambasdk/styles/dist/pos.css',
    /** Load the simulator bootstrap */
    IS_BROWSER && './simulator.js',
    /** App entry point */
    './index.js',
  ].filter(Boolean),
};

module.exports = {
  mode: IS_PROD ? 'production' : 'development',
  cache: true,
  target: 'web',
  context: fromCwd('src'),
  entry,
  output: {
    path: fromCwd(BUNDLE_NAME),
    publicPath: './',
    filename: '[name].[hash:5].js',
    chunkFilename: '[name].[hash:5].js',
  },
  resolve: {
    /** Do not resolve symlinks */
    symlinks: false,
    mainFields: ['svelte', 'jsnext:main', 'esnext', 'module', 'main'],
    extensions: ['.js', '.json', '.pcss', '.css', '.html', '.htmlx', '.svelte'],
    /** Make webpack also resolve modules from './src' */
    modules: [fromCwd('src'), 'node_modules'],
    alias: {
      '@mambasdk': fromCwd('node_modules', '@mambasdk'),
    },
  },
  module: {
    rules: [
      /** Run svelte component related loaders on  */
      {
        test: /\.(htmlx?|svelte)$/,
        exclude: [/node_modules[\\/].+[\\/]node_modules/],
        use: [loaders.babelEsNext, loaders.svelte, loaders.eslint],
      },
      /**
       * Run app COMMONJS dependencies through babel with module: 'commonjs'.
       * @babel/preset-env inserts es6 import if we don't pass "module: 'commonjs'",
       * resulting in mixed es6 and commonjs code.
       * */
      {
        test: /\.js$/,
        include: [/node_modules/],
        exclude: [
          /node_modules[\\/].+[\\/]node_modules/, // exclude sub dependencies of linked packaged
          /core-js/, // exclude babel polyfills
          /loader|webpack/, // exclude webpack files from being parsed
          ...es6Deps, // exclude es6 dependencies from being transpiled to cjs
        ],
        use: [loaders.babelCJS],
      },
      /** Run app ES6 dependencies through babel with { modules: false } */
      {
        test: /\.js$/,
        include: es6Deps,
        exclude: [/node_modules[\\/].+[\\/]node_modules/],
        use: [loaders.babelEsNext],
      },
      /** Run babel and eslint on projects src files with { modules: false } */
      {
        test: /\.js$/,
        include: [fromCwd('src')],
        use: [loaders.babelEsNext, loaders.eslint],
      },
      {
        test: /\.(css|s[ac]ss)$/,
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
          // loaders.sass,
        ],
      },
      /** Handle font imports */
      { test: /\.(eot|woff2?|otf|ttf)$/, use: [loaders.fonts] },
      /** Handle image imports */
      { test: /\.(gif|jpe?g|png|ico|svg)$/, use: [loaders.images] },
    ],
  },
  plugins: [
    /** Prepend the Function.prototype.bind() polyfill webpack's runtime code */
    new MambaFixesPlugin(),
    new ProgressBarPlugin(),
    new MiniCssExtractPlugin({
      filename: 'style.css',
      chunkFilename: '[name].[hash:5].css',
    }),
    new MiniHtmlWebpackPlugin({
      context: { title: 'Mamba Application' },
      template: htmlTemplate,
    }),
    new webpack.DefinePlugin({
      __NODE_ENV__: JSON.stringify(NODE_ENV),
      __APP_ENV__: JSON.stringify(APP_ENV),
      __PROD__: IS_PROD,
      __TEST__: NODE_ENV === 'test',
      __DEV__: IS_DEV,
      __POS__: IS_POS,
      __BROWSER__: IS_BROWSER,
    }),
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
