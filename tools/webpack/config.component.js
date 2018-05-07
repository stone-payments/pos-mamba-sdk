const merge = require('webpack-merge')
const MiniHtmlWebpackPlugin = require('mini-html-webpack-plugin')

const { fromWorkspace } = require('../helpers/utils.js')
const { IS_WATCHING } = require('../consts.js')
const htmlTemplate = require('../helpers/htmlTemplate.js')

/** Webpack configuration used for svelte component build */
const buildConfig = require('./config.build.js')
/** Webpack configuration used for svelte component development */
const devConfig = require('./config.dev.js')

let config

/** If using webpack-dev-server, serve the appropriated dev config */
if (IS_WATCHING) {
  config = merge.strategy({ entry: 'replace' })(devConfig, {
    entry: fromWorkspace('example/index.js'),
    output: { libraryTarget: 'umd' },
    plugins: [
      new MiniHtmlWebpackPlugin({
        context: { title: 'Mamba Application' },
        template: htmlTemplate,
      }),
    ],
    devServer: {
      contentBase: fromWorkspace('example'),
    },
  })
  // If not watching, use the build config
} else {
  config = buildConfig
}

module.exports = config
