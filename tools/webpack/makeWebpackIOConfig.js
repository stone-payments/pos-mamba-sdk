const { basename } = require('path')
const { fromDist, fromWorkspace } = require('../helpers/paths.js')
const { PKG } = require('../consts.js')

/** Set the entry and output webpack configurations for the current package */
module.exports = ({
  source = PKG.source || 'src/index.js',
  main = PKG.main,
  target = 'commonjs2',
  dist = fromDist(),
} = {}) => {
  /** Get the package entry point by its 'source' property. Default it to src/index.js */
  const entry = fromWorkspace(source)

  const output = {
    path: dist,
    filename: `${basename(main)}`,
    /** Use commonjs2 for smaller bundle sizes. */
    libraryTarget: target,
  }
  return { entry, output }
}
