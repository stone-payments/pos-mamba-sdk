const { IS_DEV } = require('quickenv')
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
  styleLoader: 'style-loader',
  css: {
    loader: 'css-loader',
    options: {
      sourceMap: IS_DEV(),
      minimize: !IS_DEV(),
      /** Apply the two last loaders */
      importLoaders: 1,
    },
  },
  postcss: {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: () => [
        require('postcss-easy-import')(),
        require('postcss-advanced-variables')(),
        // require('postcss-url')(),
        require('postcss-nested')(),
        require('postcss-preset-env')(/* {
          stage: 3,
          features: {
            'nesting-rules': true,
          },
        } */),

        // require('postcss-browser-reporter')(),
        // require('postcss-reporter')(),
      ],
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
  html: {
    loader: 'html-loader',
  },
  markdownUrl: {
    loader: 'url-loader',
    options: {
      outputPath: 'assets/',
      name: './guides/[name].[ext]',
    },
  },
  svelte: type => {
    const [server, client] = ['server', 'client']

    if (type !== client && type !== server) {
      throw new Error(`Unknown svelte type: ${type}`)
    }

    let loader = { loader: 'svelte-loader' }

    switch (type) {
      case 'server':
        loader.options = {
          css: false,
          generate: 'ssr',
          ...require(fromProject('svelte.config.js')),
        }
        break
      default:
        loader.options = {
          emitCss: true,
          hydratable: true,
          hotReload: IS_DEV(),
          ...require(fromProject('svelte.config.js')),
        }
    }

    return loader
  },
}
