import { basename, dirname } from 'path';
import glob from 'globby';
import resolve from 'rollup-plugin-node-resolve';
import cjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';
import Case from 'case';
import { getPkg } from 'quickenv';
import makeRollupConfig from './helpers/makeRollupConfig.js';
import getExternals from './helpers/getExternals.js';

const babelConfig = require('../../.babelrc.js');

const PKG = getPkg();

/** Common rollup plugins */
const plugins = [
  resolve(),
  cjs(),
  babel({
    /** Enforce usage of a single '.babelrc.js' located at the project's root directory */
    babelrc: false,
    ...babelConfig,
    exclude: /node_modules[/\\](?!(svelte)|(@mamba))/,
  }),
  filesize(),
];

/** List of bundles to be generated */
const configs = [];

/** Bundles for package with multiple entrypoints and outputs */
if (PKG.build && PKG.build.source && Array.isArray(PKG.build.source)) {
  glob.sync(PKG.build.source).forEach(subModEntryRelPath => {
    const submoduleDirname = basename(dirname(subModEntryRelPath));
    let entryName = basename(subModEntryRelPath, '.js');

    /**
     * If a submodule file is a direct child of a 'src' directory,
     * use the actual file name as the entry name.
     *
     * If the parent directory is not 'src' and the submodule
     * entrypoint is named 'index.js', use the parent directory name as the entry name.
     *
     * If the parent directort is not 'src' and the submodule
     * entrypoint is NOT named 'index.js', combine
     * the parent directory name with entrypoint name.
     */
    entryName =
      submoduleDirname === 'src'
        ? entryName
        : entryName !== 'index'
          ? Case.camel(`${submoduleDirname} ${entryName}`)
          : submoduleDirname;

    configs.push({
      input: subModEntryRelPath,
      output: `${entryName}.js`,
      plugins,
    });
  });
} else if (PKG.main) {
  /** If there's no multiple outputs and the main output is set, build it */
  configs.push({
    plugins,
  });
}

export default configs.map(config =>
  makeRollupConfig({
    ...config,
    external: getExternals,
    experimentalDynamicImport: true,
  }),
);
