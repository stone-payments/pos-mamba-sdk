import { basename, dirname } from 'path'
import makeRollupConfig from './helpers/makeRollupConfig.js'
import glob from 'globby'

const { PKG } = require('../consts.js')

/** List of bundles to be generated */
const bundles = []

/** Bundles for package submodules */
glob.sync(PKG.subModules || []).map(subModEntryRelPath => {
  const subModuleName = basename(dirname(subModEntryRelPath))
  bundles.push(
    makeRollupConfig({
      input: subModEntryRelPath,
      output: `${subModuleName}.js`,
    }),
  )
})

/** The default bundle for the package */
bundles.push(makeRollupConfig())

/** The ESM bundle if  */
if (PKG.module) {
  bundles.push(
    makeRollupConfig({
      output: PKG.module,
      format: 'es',
    }),
  )
}

export default bundles
