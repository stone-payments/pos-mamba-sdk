import { getPkg } from 'quickenv';

const PKG = getPkg();

export default moduleId =>
  Object.keys(PKG.peerDependencies || [])
    .concat((PKG.build && PKG.build.external) || [])
    .some(depName => new RegExp(`${depName}[\\/]`).test(moduleId));
