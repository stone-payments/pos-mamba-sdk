const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { IS_WATCHING } = require('quickenv');
/** Read the template's .babelrc.js to enforce it in 'babel-loader' */
const babelrc = require('@mamba/configs/babel/template.js');
const { extendPresetEnv } = require('@mamba/configs/babel/utils.js');
/** Read the svelte config file from the project */
const svelteConfig = require('@mamba/configs/svelte/index.js');

const { IS_DEV } = require('./consts.js');

const babelLoaderConfig = {
  loader: 'babel-loader',
  options: {
    sourceMaps: IS_DEV,
    cacheDirectory: IS_DEV,
    babelrc: false,
    ...babelrc,
  },
};

module.exports = {
  babelEsNext: babelLoaderConfig,
  babelCJS: {
    ...babelLoaderConfig,
    options: extendPresetEnv(babelLoaderConfig.options, {
      modules: 'commonjs',
    }),
  },
  eslint: {
    loader: 'eslint-loader',
    options: { emitWarning: IS_DEV },
  },
  /**
   * MiniCssExtractPlugin doesn't support HMR.
   * For developing, use 'style-loader' instead.
   * */
  extractCss: IS_WATCHING() ? 'style-loader' : MiniCssExtractPlugin.loader,
  css: {
    loader: 'css-loader',
    options: {
      sourceMap: IS_DEV,
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
  resolveUrl: {
    loader: 'resolve-url-loader',
    options: {
      sourceMap: IS_DEV,
      keepQuery: true,
      debug: false, // IS_DEV,
    },
  },
  fonts: {
    loader: 'url-loader',
    options: {
      fallback: 'file-loader',
      limit: 1, // Copy font files instead of inserting them on the css
      outputPath: 'assets/',
      name: './fonts/[name].[ext]',
    },
  },
  images: {
    loader: 'url-loader',
    options: {
      fallback: 'file-loader',
      limit: 1,
      outputPath: 'assets/',
      name: './images/[name].[hash:5].[ext]',
    },
  },
  svelte: {
    loader: 'svelte-loader',
    options: {
      emitCss: true,
      hotReload: IS_DEV,
      /** fix for svelte-loader not setting css: false when emitCss: true */
      css: false,
      ...svelteConfig,
    },
  },
};
