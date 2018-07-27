/**
 * Common webpack configuration
 */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MiniHtmlWebpackPlugin = require('mini-html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const { IS_PROD, getPkg, fromCwd } = require('quickenv');
const htmlTemplate = require('./helpers/htmlTemplate.js');
const loaders = require('./helpers/loaders.js');
const MambaFixesPlugin = require('./helpers/MambaFixesPlugin.js');

const PKG = getPkg();

module.exports = {
  mode: IS_PROD() ? 'production' : 'development',
  cache: true,
  target: 'web',
  context: fromCwd('src'),
  entry: {
    app: [
      /** Mamba style resetter/normalizer */
      '@mambasdk/styles/dist/pos.css',
      /** App entry point */
      './index.js',
    ],
  },
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
    extensions: ['.js', '.json', '.pcss', '.css', '.html', '.svelte'],
    /** Make webpack also resolve modules from './src' */
    modules: [fromCwd('src'), 'node_modules'],
    alias: {
      /**
       * Ensure we're always importing the main packages from this project's root.
       * Fixes linked components using their own dependencies.
       */
      '@mambasdk': fromCwd('node_modules', '@mambasdk'),
      ...Object.keys(PKG.dependencies).reduce((acc, libName) => {
        acc[libName] = fromCwd('node_modules', libName);
        return acc;
      }, {}),
    },
  },
  module: {
    rules: [
      /** Run svelte component related loaders on  */
      {
        test: /\.(html|svelte)$/,
        include: [
          fromCwd('src'),
          /node_modules[\\/]svelte/,
          /node_modules[\\/]@mambasdk/,
        ],
        use: [loaders.babel, loaders.svelte, loaders.eslint],
      },
      /** Make 'svelte' related javascript code run through babel without linting */
      {
        test: /\.js?$/,
        include: [/node_modules[\\/]svelte/],
        use: [loaders.babel],
      },
      /** Run babel and eslint on projects src files only */
      {
        test: /\.js?$/,
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
