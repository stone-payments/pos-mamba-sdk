const { resolve, dirname } = require('path');
const { getPkg, fromCwd } = require('quickenv');

const projectRoot = resolve(__dirname, '..', '..');

const PKG = getPkg();

/** Project's dist path */
const distPath = dirname(fromCwd(PKG.main ? PKG.main : 'dist/x'));

/** Project's src path */
const srcPath = dirname(fromCwd(PKG.source ? PKG.source : 'src/x'));

/** The @mamba project path */
exports.fromProject = (...args) => resolve(projectRoot, ...args);

/** Current project working directory */
exports.fromWorkspace = fromCwd;

/** Current project 'dist' directory */
exports.fromDist = (...args) => fromCwd(distPath, ...args);

/** Current project 'src' directory */
exports.fromSrc = (...args) => fromCwd(srcPath, ...args);
