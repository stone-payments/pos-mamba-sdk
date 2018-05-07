const { resolve, dirname } = require('path')
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
