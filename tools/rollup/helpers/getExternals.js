import { getPkg } from 'quickenv';

const PKG = getPkg();

export default moduleId => Object.keys(PKG.peerDependencies || [])
  .map(libName => libName)
  .some(depName => new RegExp(`${depName}[\\/]`).test(moduleId));
