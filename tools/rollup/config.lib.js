import { basename, dirname } from 'path'
import glob from 'globby'
import resolve from 'rollup-plugin-node-resolve'
import cjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import filesize from 'rollup-plugin-filesize'
// import eslint from 'rollup-plugin-eslint'
import { getPkg } from 'quickenv'
import makeRollupConfig from './helpers/makeRollupConfig'
import getExternals from './helpers/getExternals'

const PKG = getPkg()

/** Common rollup plugins */
const plugins = [
  resolve(),
  cjs(),
  // eslint(),
  babel({
    /** Enforce usage of '.babelrc.js' at the project's root directory */
    babelrc: false,
    ...require('../../.babelrc.js'),
    exclude: /node_modules[/\\](?!(svelte)|(@mamba))/,
  }),
  filesize(),
]

/** List of bundles to be generated */
const configs = []

/** Bundles for package submodules */
glob.sync(PKG.subModules || []).forEach(subModEntryRelPath => {
  const subModuleName = basename(dirname(subModEntryRelPath))
  configs.push({
    input: subModEntryRelPath,
    output: `${subModuleName}.js`,
    plugins,
  })
})

/** The default bundle for the package */
if (PKG.main) {
  configs.push({
    plugins,
  })
}

export default configs.map(config =>
  makeRollupConfig({
    ...config,
    external: getExternals,
    experimentalDynamicImport: true,
  }),
)
