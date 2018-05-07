/**
 * Webpack configuration for the main mamba website
 */
const merge = require('webpack-merge')
const MiniHtmlWebpackPlugin = require('mini-html-webpack-plugin')

const { IS_WATCHING, PKG } = require('../tools/consts.js')
const htmlTemplate = require('../tools/utils/htmlTemplate.js')

const buildConfig = require('../tools/webpack/config.build.js')
const devConfig = require('../tools/webpack/config.dev.js')

let config

const commonWebsiteConfig = {
  entry: ['./src/external.scss'],
  optimization: { nodeEnv: process.env.NODE_ENV },
}

/** If using webpack-dev-server, serve the appropriated dev config */
if (IS_WATCHING) {
  config = merge(devConfig, commonWebsiteConfig)
} else {
  /** If not watching, use the build config */
  config = merge(buildConfig, commonWebsiteConfig, {
    plugins: [
      new MiniHtmlWebpackPlugin({
        context: { title: PKG.title || 'Mamba Application' },
        template: htmlTemplate,
      }),
    ],
  })
}

module.exports = config
