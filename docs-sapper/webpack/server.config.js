const merge = require('webpack-merge')
const config = require('sapper/webpack/config.js')
const baseConfig = require('./base.config.js')('server')
const pkg = require('../package.json')

const server = {
  entry: config.server.entry(),
  output: config.server.output(),
  target: 'node',
  externals: Object.keys(pkg.dependencies).filter(d => d !== 'svelte'),
  performance: {
    hints: false, // it doesn't matter if server.js is large
  },
}

module.exports = merge([baseConfig, server])
