import { basename, dirname } from 'path';
import glob from 'globby';
import Case from 'case';
import resolve from 'rollup-plugin-node-resolve';
import cjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';
import { getPkg } from 'quickenv';
import makeRollupConfig from './helpers/makeRollupConfig.js';
import getExternals from './helpers/getExternals.js';

const PKG = getPkg();
const babelConfig = require('../../.babelrc.js');

/** Common rollup plugins */
const plugins = [
  resolve(),
  cjs(),
  // eslint(),
  babel({
    /** Enforce usage of '.babelrc.js' at the project's root directory */
    babelrc: false,
    ...babelConfig,
    exclude: /node_modules[/\\](?!(svelte)|(@mamba))/,
  }),
  filesize(),
];

/** List of bundles to be generated */
const configs = [];

/** Bundles for package submodules */
glob.sync(PKG.subModules || []).forEach((subModEntryRelPath) => {
  const subModuleName = basename(dirname(subModEntryRelPath));
  let entryName = basename(subModEntryRelPath, '.js');

  entryName = entryName !== 'index' ? Case.camel(`${subModuleName} ${entryName}`) : subModuleName;

  configs.push({
    input: subModEntryRelPath,
    output: `${entryName}.js`,
    plugins,
  });
});

/** The default bundle for the package */
if (PKG.main) {
  configs.push({
    plugins,
  });
}

export default configs.map(config => makeRollupConfig({
  ...config,
  external: getExternals,
  experimentalDynamicImport: true,
}));
