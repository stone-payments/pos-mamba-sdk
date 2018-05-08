import { basename, dirname } from 'path'
import makeRollupConfig from './helpers/makeRollupConfig.js'
import glob from 'globby'
import resolve from 'rollup-plugin-node-resolve'
import cjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import filesize from 'rollup-plugin-filesize'
import eslint from 'rollup-plugin-eslint'

const { PKG } = require('../consts.js')

/** Common rollup plugins */
const plugins = [
  resolve(),
  cjs(),
  eslint(),
  babel({
    exclude: 'node_modules/**',
    /** Enforce usage of '.babelrc.js' at the project's root directory */
    babelrc: false,
    ...require('../../.babelrc.js'),
  }),
  filesize(),
]

/** List of bundles to be generated */
const configs = []

/** Bundles for package submodules */
glob.sync(PKG.subModules || []).forEach(subModEntryRelPath => {
  const subModuleName = basename(dirname(subModEntryRelPath))
  configs.push(
    makeRollupConfig({
      input: subModEntryRelPath,
      output: `${subModuleName}.js`,
      plugins,
    }),
  )
})

/** The default bundle for the package */
configs.push(
  makeRollupConfig({
    plugins,
  }),
)

/** The ESM bundle if  */
if (PKG.module) {
  configs.push(
    makeRollupConfig({
      output: PKG.module,
      format: 'es',
      plugins,
    }),
  )
}

export default configs
