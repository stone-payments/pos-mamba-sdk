/**
 * Common webpack configuration
 */
const StyleLintPlugin = require('stylelint-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const makeWebpackIOConfig = require('./helpers/makeWebpackIOConfig.js')
const { IS_PROD } = require('../consts.js')
const loaders = require('./helpers/loaders.js')

const { entry, output } = makeWebpackIOConfig()

module.exports = {
  entry,
  output,
  mode: IS_PROD ? 'production' : 'development',
  cache: true,
  target: 'web',
  resolve: {
    /** Do not resolve symlinks */
    symlinks: false,
    mainFields: ['svelte', 'browser', 'module', 'main'],
    extensions: ['.js', '.json', '.scss', '.css', '.html', '.svelte'],
  },
  /** Minimal useful output log */
  stats: {
    modules: true,
    chunks: false,
    colors: true,
    children: false,
  },
  optimization: {
    /** Don't process 'process.env.NODE_ENV' */
    nodeEnv: false,
  },
  module: {
    rules: [
      {
        test: /\.(html|svelte)$/,
        /** We want to parse components from packages that start with 'svelte' or '@mamba' */
        exclude: /node_modules\/(?!svelte|@mamba)/,
        use: [loaders.babel, loaders.svelte, loaders.eslint],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [loaders.babel, loaders.eslint],
      },
      {
        test: /\.(css|less|s[ac]ss|styl)$/,
        resolve: {
          /** When importing from a style file, let's use package.json's 'style' field before the actual 'main' one */
          mainFields: ['style', 'main'],
        },
        use: [
          loaders.extractCss,
          loaders.css,
          loaders.resolveUrl,
          loaders.postcss,
          loaders.sass,
        ],
      },
      {
        test: /\.(eot|woff2?|otf|ttf)$/,
        use: [loaders.fonts],
      },
      {
        test: /\.(gif|jpe?g|png|ico|svg)$/,
        use: [loaders.images],
      },
    ],
  },
  plugins: [
    new StyleLintPlugin(),
    new MiniCssExtractPlugin({
      filename: 'style.css',
      chunkFilename: '[id].css',
    }),
  ],
}
