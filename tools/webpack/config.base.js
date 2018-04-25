const SimpleProgressPlugin = require('webpack-simple-progress-plugin')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const { fromRoot, fromDist } = require('../helpers/utils.js')
const { IS_PROD, IS_DEV, PKG } = require('../consts.js')

/** Get the package entry point by its 'source' property. Default it to src/index.js */
const entry = fromRoot(PKG.source ? PKG.source : 'src/index.js')

const output = {
  path: fromDist(),
  filename: '[name].js',
  /** Use commonjs2 for smaller bundle sizes. */
  libraryTarget: 'commonjs2',
}

/**
 * Mamba Websdk common webpack configuration
 */
module.exports = {
  mode: IS_PROD ? 'production' : 'development',
  cache: true,
  target: 'web',
  entry,
  output,
  resolve: {
    /** Do not resolve symlinks */
    symlinks: false,
    extensions: [
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      '.json',
      '.scss',
      '.sass',
      '.css',
      '.html',
    ],
  },
  /** Minimal useful output log */
  stats: {
    modules: false,
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
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              compact: false,
              cacheDirectory: true,
            },
          },
          {
            loader: 'eslint-loader',
            options: {
              emitWarning: IS_DEV,
            },
          },
        ],
      },
      {
        test: /\.(css|less|s[ac]ss|styl)$/,
        resolve: {
          /** When importing from a style file, let's use package.json's 'style' field before the actual 'main' one */
          mainFields: ['style', 'main'],
        },
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: IS_DEV },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('postcss-import')(),
                require('autoprefixer')(),
                require('postcss-reporter')({ clearReportedMessages: true }),
              ],
              sourceMap: IS_DEV,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: IS_DEV,
            },
          },
        ],
      },
      {
        test: /\.(eot|woff2?|otf|ttf)$/,
        loader: 'url-loader',
        options: {
          // TODO: Test if an inline font works on the POS
          limit: 1, // Copy font files instead of inserting them on the css
          outputPath: 'assets/',
          name: './fonts/[name].[ext]',
        },
      },
      {
        test: /\.(gif|jpe?g|png|ico|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 1,
          outputPath: 'assets/',
          name: './images/[name].[ext]',
        },
      },
    ],
  },
  plugins: [
    new StyleLintPlugin(),
    new MiniCssExtractPlugin({
      filename: 'style.css',
      chunkFilename: '[id].css',
    }),
    new SimpleProgressPlugin({
      messageTemplate: [':bar', ':percent', ':elapseds', ':msg'].join(' '),
    }),
  ],
}
