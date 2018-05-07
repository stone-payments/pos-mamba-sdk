const { basename } = require('path')
const { fromDist, fromWorkspace } = require('../../utils/paths.js')
const { PKG } = require('../../consts.js')

/** Set the entry and output webpack configurations for the current package */
module.exports = ({
  source = PKG.source || 'src/index.js',
  main = PKG.main,
  target = 'commonjs2',
  dist = fromDist(),
} = {}) => {
  /** Get the package entry point by its 'source' property. Default it to src/index.js */
  const entry = [fromWorkspace(source)]

  const output = {
    path: dist,
    filename: main ? `${basename(main)}` : '[name].js',
    /** If no main was defined, fallback to umd format */
    libraryTarget: main ? target : 'umd',
  }
  return { entry, output }
}
