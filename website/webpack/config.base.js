/**
 * Common webpack configuration
 */
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const MiniHtmlWebpackPlugin = require('mini-html-webpack-plugin')
const SimpleProgressPlugin = require('webpack-simple-progress-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { IS_PROD, IS_WATCHING } = require('quickenv')
const htmlTemplate = require('./helpers/htmlTemplate.js')
const loaders = require('./helpers/loaders.js')
const markdown = require('./helpers/markdown.js')
const { fromWorkspace, fromProject } = require('../../tools/utils/paths')

module.exports = {
  mode: IS_PROD() ? 'production' : 'development',
  cache: true,
  target: 'web',
  context: fromWorkspace('src'),
  entry: {
    app: ['./index.js'],
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
    extensions: ['.js', '.json', '.scss', '.css', '.html', '.svelte', '.md'],
    /** Make webpack also resolve modules from './src' */
    modules: [
      fromWorkspace('src'),
      fromWorkspace('node_modules'),
      fromProject('node_modules'),
    ],
  },
  optimization: {
    /** Create a separate chunk for webpack runtime */
    runtimeChunk: { name: 'runtime' },
    splitChunks: {
      cacheGroups: {
        /** Default chunk groups */
        default: {
          name: 'app',
          priority: -20,
          reuseExistingChunk: true,
        },
        /** Chunk that contains every external dependency that doesn't begin with '@mamba' */
        vendor: {
          test: /node_modules[\\/](?!@mamba)/i,
          name: 'lib',
          chunks: 'initial',
          minSize: 0,
          minChunks: 1,
          priority: -10,
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
      /** Run svelte component related loaders on  */
      {
        test: /\.(html|svelte)$/,
        include: [
          fromWorkspace('src'),
          /node_modules[\\/]svelte/,
          /node_modules[\\/]@mamba/,
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
        include: [fromWorkspace('src')],
        use: [loaders.babel, loaders.eslint],
      },
      {
        test: /\.(css|s[ac]ss)$/,
        /** When importing from a style file, let's use package.json's 'style' field before the actual 'main' one */
        resolve: { mainFields: ['style', 'main'] },
        use: [
          loaders.extractCss,
          loaders.css,
          loaders.postcss,
          loaders.resolveUrl,
          loaders.sass,
        ],
      },
      /** Handle html generated markdown files */
      { test: /\.md$/, use: [loaders.markdown] },
      /** Handle raw file imports (txt only for now) */
      { test: /\.(txt)$/, use: 'raw-loader' },
      /** Handle font imports */
      { test: /\.(eot|woff2?|otf|ttf)$/, use: [loaders.fonts] },
      /** Handle image imports */
      { test: /\.(gif|jpe?g|png|ico|svg)$/, use: [loaders.images] },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './assets/', to: fromWorkspace('dist', 'assets') },
      {
        from: './docs/',
        to: fromWorkspace('dist', 'docs'),
        force: true,
        transform(content, path) {
          return Promise.resolve(markdown(content))
        },
      },
    ]),
    new SimpleProgressPlugin(),
    !IS_WATCHING() &&
      new MiniCssExtractPlugin({
        filename: 'style.css',
        chunkFilename: '[name].css',
      }),
    new StyleLintPlugin(),
    new MiniHtmlWebpackPlugin({
      context: { title: 'Mamba Application' },
      template: htmlTemplate,
    }),
  ].filter(Boolean),
}
