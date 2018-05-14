const { resolve, dirname } = require('path')
const { PKG } = require('../consts.js')
const posixify = require('./posixify.js')

const workspaceRoot = process.cwd()
const projectRoot = resolve(__dirname, '..', '..')

const resolveFromWorkspace = (...args) =>
  posixify(resolve(workspaceRoot, ...args))

/** Project's dist path */
const distPath = dirname(resolveFromWorkspace(PKG.main ? PKG.main : 'dist/x'))

/** Project's src path */
const srcPath = dirname(resolveFromWorkspace(PKG.source ? PKG.source : 'src/x'))

/** The @mamba project path */
exports.fromProject = (...args) => posixify(resolve(projectRoot, ...args))

/** Current project working directory */
exports.fromWorkspace = resolveFromWorkspace

/** Current project 'dist' directory */
exports.fromDist = (...args) => resolveFromWorkspace(distPath, ...args)

/** Current project 'src' directory */
exports.fromSrc = (...args) => resolveFromWorkspace(srcPath, ...args)
