const { resolve } = require('path')

const rootPath = resolve(__dirname, '..', '..')
const resolveFromRoot = (...args) => resolve(rootPath, ...args)

/** Current project working directory */
exports.fromProject = resolveFromRoot

/** Modules path */
exports.fromModulesRoot = (...args) => resolveFromRoot('node_modules', ...args)

/** Current project 'dist' directory */
exports.fromDist = (...args) => resolveFromRoot('dist', ...args)
