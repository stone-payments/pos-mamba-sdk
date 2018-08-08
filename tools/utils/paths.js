const { resolve, dirname } = require('path');
const { getPkg, fromCwd } = require('quickenv');

const projectRoot = resolve(__dirname, '..', '..');

const PKG = getPkg();

/** Project's dist path */
const distPath = dirname(fromCwd(PKG.main ? PKG.main : 'dist/x'));

/** Project's src path */
const srcPath = dirname(fromCwd((PKG.build && PKG.build.source) || 'src/x'));

/** The @mamba project path */
module.exports.fromProject = (...args) => resolve(projectRoot, ...args);

/** Current project working directory */
module.exports.fromWorkspace = fromCwd;

/** Current project 'dist' directory */
module.exports.fromDist = (...args) => fromCwd(distPath, ...args);

/** Current project 'src' directory */
module.exports.fromSrc = (...args) => fromCwd(srcPath, ...args);
