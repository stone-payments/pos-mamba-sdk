const { dirname, basename } = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const glob = require('globby')
const { fromWorkspace, getBundleConfig } = require('../../helpers/utils.js')
const { PKG } = require('../../consts.js')
const buildConfig = require('./config.js')

/** Current workspace path */
const workspacePath = fromWorkspace()

const compile = opts =>
  webpack(opts, (err, stats) => {
    if (!err) {
      console.log(
        stats.toString({
          modules: false,
          chunks: false,
          colors: true,
          children: false,
          builtAt: false,
          assets: true,
          cached: false,
          chunkModules: false,
          hash: false,
          reasons: false,
          source: false,
          timings: false,
          version: false,
        }),
      )
    } else console.err(err)
  })

/** Get all sub-modules entry points based on the globs defined on package.json's 'subModules' properties */
const subModulesBundleConfigs = glob
  .sync(PKG.subModules || [])
  .map(subModEntryRelPath => {
    const subModuleName = basename(dirname(subModEntryRelPath))
    return {
      subModuleName,
      ...getBundleConfig({
        source: fromWorkspace(subModEntryRelPath),
        main: `${subModuleName}.js`,
        dist: workspacePath,
      }),
    }
  })

/** Compile each native module to it's own file */
subModulesBundleConfigs.forEach(subModulesBundleConfig => {
  const { entry, output, subModuleName } = subModulesBundleConfig

  console.log(`Building sub-module '${subModuleName}'`)
  compile(merge(buildConfig, { entry, output }))
})

console.log(`Building module '${PKG.name}'`)
compile(buildConfig)
