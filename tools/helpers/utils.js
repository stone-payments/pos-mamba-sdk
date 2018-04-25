const { resolve } = require('path')

const rootPath = process.cwd()
const resolveFromRoot = (...args) => resolve(rootPath, ...args)

module.exports = {
  /** Current project working directory */
  fromRoot: resolveFromRoot,

  /** Modules path */
  fromModulesRoot: (...args) => resolveFromRoot('node_modules', ...args),

  /** Current project 'dist' directory */
  fromDist: (...args) => resolveFromRoot('dist', ...args),
}
