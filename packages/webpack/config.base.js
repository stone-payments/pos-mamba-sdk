/**
 * Common webpack configuration
 */
const MiniHtmlWebpackPlugin = require('mini-html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const { IS_PROD, getPkg, fromCwd } = require('quickenv');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const htmlTemplate = require('./helpers/htmlTemplate.js');
const loaders = require('./helpers/loaders.js');
const MambaFixesPlugin = require('./helpers/MambaFixesPlugin.js');

const PKG = getPkg();
/** Get a map of all the project's dependencies */
const dependencyMap = Object.keys(PKG.dependencies).reduce((acc, libName) => {
  acc[libName] = fromCwd('node_modules', libName);
  return acc;
}, {});

/** Default ENV variables */
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

if (!process.env.APP_ENV) {
  process.env.APP_ENV = 'browser';
}

if (!process.env.DEBUG) {
  process.env.DEBUG = process.env.NODE_ENV === 'development';
}

/** App entry point */
const entry = {
  app: [
    /** Mamba style resetter/normalizer */
    '@mambasdk/styles/dist/pos.css',
    /** Load the simulator bootstrap */
    process.env.APP_ENV !== 'pos' && './simulator.js',
    /** App entry point */
    './index.js',
  ].filter(Boolean),
};

module.exports = {
  mode: IS_PROD() ? 'production' : 'development',
  cache: true,
  target: 'web',
  context: fromCwd('src'),
  entry,
  output: {
    path: fromCwd('bundle'),
    publicPath: './',
    filename: '[name].[hash:5].js',
    chunkFilename: '[name].[hash:5].js',
  },
  resolve: {
    /** Do not resolve symlinks */
    symlinks: false,
    mainFields: ['svelte', 'module', 'main'],
    extensions: ['.js', '.json', '.pcss', '.css', '.html', '.htmlx', '.svelte'],
    /** Make webpack also resolve modules from './src' */
    modules: [fromCwd('src'), 'node_modules'],
  },
  module: {
    rules: [
      /** Run svelte component related loaders on  */
      {
        test: /\.(htmlx?|svelte)$/,
        exclude: [/node_modules[\\/].+[\\/]node_modules/],
        use: [loaders.babel, loaders.svelte, loaders.eslint],
      },
      /** Make 'svelte' related js code run through babel */
      {
        test: /\.js$/,
        include: Object.values(dependencyMap),
        exclude: [/node_modules[\\/].+[\\/]node_modules/],
        use: [loaders.babel],
      },
      /** Run babel and eslint on projects src files only */
      {
        test: /\.js$/,
        include: [fromCwd('src')],
        use: [loaders.babel, loaders.eslint],
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
      __NODE_ENV__: JSON.stringify(process.env.NODE_ENV),
      __APP_ENV__: JSON.stringify(process.env.APP_ENV),
      __PROD__: process.env.NODE_ENV === 'production',
      __TEST__: process.env.NODE_ENV === 'test',
      __DEV__: process.env.NODE_ENV === 'development',
      __DEBUG__: process.env.DEBUG,
      __POS__: process.env.APP_ENV === 'pos',
      __BROWSER__: process.env.APP_ENV === 'browser',
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
