/**
 * Common webpack configuration
 */
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const MiniHtmlWebpackPlugin = require('mini-html-webpack-plugin')

const { fromWorkspace } = require('../../tools/utils/paths.js')
const { IS_PROD, PKG } = require('../../tools/consts.js')
const htmlTemplate = require('./helpers/htmlTemplate.js')
const loaders = require('./helpers/loaders.js')

module.exports = {
  mode: IS_PROD ? 'production' : 'development',
  cache: true,
  target: 'web',
  context: fromWorkspace('src'),
  entry: {
    app: [
      /** External scss/css */
      './external.scss',
      /** App entry point */
      './index.js',
    ],
  },
  output: {
    path: fromWorkspace('dist'),
    publicPath: './',
    filename: '[name].js',
  },
  /** Minimal useful output log */
  stats: {
    modules: false,
    chunks: false,
    colors: true,
    children: false,
  },
  resolve: {
    /** Do not resolve symlinks */
    symlinks: false,
    mainFields: ['svelte', 'browser', 'module', 'main'],
    extensions: ['.js', '.json', '.scss', '.css', '.html', '.svelte'],
    /** Make webpack also resolve modules from './src' */
    modules: ['src', 'node_modules'],
    alias: {
      /**
       * Ensure we're always importing the main packages from this project's root.
       * Fixes linked components using their own dependencies.
       */
      ...Object.keys(PKG.dependencies).reduce((acc, libName) => {
        acc[libName] = fromWorkspace('node_modules', libName)
        return acc
      }, {}),
    },
  },
  optimization: {
    /** Create a separate chunk for webpack runtime */
    runtimeChunk: { name: 'runtime' },
    splitChunks: {
      cacheGroups: {
        /** Disable default chunk groups */
        default: false,
        vendor: false,
        /** Chunk that contains every external dependency that doesn't begin with '@mamba' */
        libraries: {
          test: /node_modules(?!\/@mamba)/i,
          name: 'lib',
          chunks: 'initial',
          minSize: 0,
          minChunks: 1,
          priority: 0,
        },
        /** Chunk that contains used polyfills */
        polyfills: {
          test: /core-js/,
          name: 'polyfills',
          chunks: 'all',
          minSize: 0,
          minChunks: 1,
          priority: 1,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(html|svelte)$/,
        exclude: /node_modules\/(?!svelte|@mamba)/,
        use: [loaders.babel, loaders.svelte, loaders.eslint],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules\/(?!svelte\/)/,
        use: [loaders.babel, loaders.eslint],
      },
      {
        test: /\.(css|s[ac]ss)$/,
        /** When importing from a style file, let's use package.json's 'style' field before the actual 'main' one */
        resolve: { mainFields: ['style', 'main'] },
        use: [
          loaders.extractCss,
          loaders.css,
          loaders.resolveUrl,
          loaders.postcss,
          loaders.sass,
        ],
      },
      /** Handle raw file imports (txt only for now) */
      { test: /\.(txt)$/, use: 'raw-loader' },
      /** Handle font imports */
      { test: /\.(eot|woff2?|otf|ttf)$/, use: [loaders.fonts] },
      /** Handle image imports */
      { test: /\.(gif|jpe?g|png|ico|svg)$/, use: [loaders.images] },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.css',
      chunkFilename: '[name].css',
    }),
    new StyleLintPlugin(),
    new MiniHtmlWebpackPlugin({
      context: { title: 'Mamba Application' },
      template: htmlTemplate,
    }),
  ],
}
