const { resolve, dirname, basename } = require('path')
const { PKG } = require('../consts.js')

const workspaceRoot = process.cwd()
const projectRoot = resolve(__dirname, '..', '..')

const resolveFromWorkspace = (...args) => resolve(workspaceRoot, ...args)

/** Project's dist path */
const distPath = dirname(resolveFromWorkspace(PKG.main ? PKG.main : 'dist/'))

/** The @mamba project path */
exports.fromProject = (...args) => resolve(projectRoot, ...args)

/** Current project working directory */
exports.fromWorkspace = resolveFromWorkspace

/** Modules path */
exports.fromModulesRoot = (...args) =>
  resolveFromWorkspace('node_modules', ...args)

/** Current project 'dist' directory */
exports.fromDist = (...args) => resolveFromWorkspace(distPath, ...args)

/** Set the entry and output webpack configurations for the current package */
exports.getBundleConfig = ({
  source = PKG.source || 'src/index.js',
  main = PKG.main,
  target = 'commonjs2',
  dist = distPath,
} = {}) => {
  /** Get the package entry point by its 'source' property. Default it to src/index.js */
  const entry = resolveFromWorkspace(source)

  const output = {
    path: dist,
    filename: `${basename(main)}`,
    /** Use commonjs2 for smaller bundle sizes. */
    libraryTarget: target,
  }
  return { entry, output }
}
