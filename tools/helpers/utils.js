const { resolve, dirname } = require('path')
const { PKG } = require('../consts.js')

const rootPath = process.cwd()
const resolveFromRoot = (...args) => resolve(rootPath, ...args)

/** Project's dist path */
const distPath = dirname(resolveFromRoot(PKG.main ? PKG.main : 'dist/'))

/** Current project working directory */
exports.fromRoot = resolveFromRoot

/** Modules path */
exports.fromModulesRoot = (...args) => resolveFromRoot('node_modules', ...args)

/** Current project 'dist' directory */
exports.fromDist = (...args) => resolveFromRoot(distPath, ...args)

/** Set the entry and output webpack configurations for the current package */
exports.getPackageBuildConfig = () => {
  /** Get the package entry point by its 'source' property. Default it to src/index.js */
  const entry = resolveFromRoot(PKG.source ? PKG.source : 'src/index.js')

  const output = {
    path: distPath,
    filename: '[name].js',
    /** Use commonjs2 for smaller bundle sizes. */
    libraryTarget: 'commonjs2',
  }
  return { entry, output }
}
