const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { IS_DEV, IS_WATCHING } = require('quickenv');

/** Read the template's .babelrc.js to enforce it in 'babel-loader' */
const babelrc = require('@mambasdk/configs/babel/template.js');

/** Read the svelte config file from the project */
const svelteConfig = require('@mambasdk/configs/svelte/index.js');

module.exports = {
  babel: {
    loader: 'babel-loader',
    options: {
      compact: false,
      cacheDirectory: !process.env.DEBUG && IS_DEV(),
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
      importLoaders: 2,
    },
  },
  /** Use postcss loader in case of extraneous css files */
  postcss: {
    loader: 'postcss-loader',
    options: {
      sourceMap: true, // 'resolve-url-loader' requires this to be always true
    },
  },
  // sass: {
  //   loader: 'sass-loader',
  //   options: {
  //     sourceMap: true, // 'resolve-url-loader' requires this to be always true
  //   },
  // },
  resolveUrl: {
    loader: 'resolve-url-loader',
    options: {
      sourceMap: IS_DEV(),
      keepQuery: true,
      fail: true,
      debug: false, // IS_DEV(),
    },
  },
  fonts: {
    loader: 'url-loader',
    options: {
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
      ...svelteConfig,
    },
  },
};
