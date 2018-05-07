/**
 * Webpack configuration for developing and building svelte components
 */
const merge = require('webpack-merge')
const MiniHtmlWebpackPlugin = require('mini-html-webpack-plugin')

const { IS_WATCHING, PKG } = require('../tools/consts.js')
const htmlTemplate = require('../tools/utils/htmlTemplate.js')

const buildConfig = require('../tools/webpack/config.build.js')
const devConfig = require('../tools/webpack/config.dev.js')

let config

/** If using webpack-dev-server, serve the appropriated dev config */
if (IS_WATCHING) {
  config = devConfig
  /** If not watching, use the build config */
} else {
  config = merge(buildConfig, {
    entry: ['./src/external.scss'],
    optimization: {
      nodeEnv: process.env.NODE_ENV,
    },
    plugins: [
      new MiniHtmlWebpackPlugin({
        context: { title: PKG.title || 'Mamba Application' },
        template: htmlTemplate,
      }),
    ],
  })
}

module.exports = config
