const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { IS_DEV, IS_WATCHING } = require('quickenv')

const { fromProject } = require('../../../tools/utils/paths')

/** Read the project's .babelrc.js to enforce it in 'babel-loader' */
const babelrc = require(fromProject('.babelrc.js'))
/** 'babel-loader' already appends 'sourceMap: true'. Cannot have both. */
delete babelrc.sourceMaps

module.exports = {
  babel: {
    loader: 'babel-loader',
    options: {
      compact: false,
      cacheDirectory: IS_DEV(),
      babelrc: false,
      ...babelrc,
    },
  },
  eslint: {
    loader: 'eslint-loader',
    options: { emitWarning: IS_DEV() },
  },
  /**
   * MiniCssExtractPlugin doesn't support HMR.
   * For developing, use 'style-loader' instead.
   * */
  extractCss: IS_WATCHING() ? 'style-loader' : MiniCssExtractPlugin.loader,
  css: {
    loader: 'css-loader',
    options: {
      sourceMap: IS_DEV(),
      /** Apply the two last loaders (resolve-url, postcss) to @imported url() css files */
      importLoaders: 3,
    },
  },
  postcss: {
    loader: 'postcss-loader',
    options: {
      plugins: [require('autoprefixer')()],
      sourceMap: true, // 'resolve-url-loader' requires this to be always true
    },
  },
  sass: {
    loader: 'sass-loader',
    options: {
      sourceMap: true, // 'resolve-url-loader' requires this to be always true
    },
  },
  resolveUrl: {
    loader: 'resolve-url-loader',
    options: {
      sourceMap: IS_DEV(),
      keepQuery: true,
      fail: true,
      debug: IS_DEV(),
    },
  },
  fonts: {
    loader: 'url-loader',
    options: {
      // TODO: Test if an inline font works on the POS
      limit: 1, // Copy font files instead of inserting them on the css
      outputPath: 'assets/',
      name: './fonts/[name].[ext]',
    },
  },
  images: {
    loader: 'url-loader',
    options: {
      limit: 1,
      outputPath: 'assets/',
      name: './images/[name].[ext]',
    },
  },
  svelte: {
    loader: 'svelte-loader',
    options: {
      emitCss: true,
      hotReload: IS_DEV(),
      ...require(fromProject('svelte.config.js')),
    },
  },
}
