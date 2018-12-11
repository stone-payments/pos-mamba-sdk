import { resolve, dirname } from 'path';
import { getPkg, fromCwd } from 'quickenv';

const projectRoot = resolve(__dirname, '..', '..');

const PKG = getPkg();

/** Project's dist path */
const distPath = dirname(fromCwd(PKG.main ? PKG.main : 'dist/x'));

/** Project's src path */
const srcPath = dirname(fromCwd((PKG.build && PKG.build.source) || 'src/x'));

/** The @mamba project path */
export const fromProject = (...args) => resolve(projectRoot, ...args);

/** Current project working directory */
export const fromWorkspace = fromCwd;

/** Current project 'dist' directory */
export const fromDist = (...args) => fromCwd(distPath, ...args);

/** Current project 'src' directory */
export const fromSrc = (...args) => fromCwd(srcPath, ...args);
