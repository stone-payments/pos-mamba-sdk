const webpack = require('webpack')
const merge = require('webpack-merge')
const buildConfig = require('./config.js')

const {
  fromWorkspace,
  getBundleConfig,
} = require('../../../tools/helpers/utils.js')

/** @mamba/native modules list */
const nativeModules = [
  'app',
  'cookie',
  'gif',
  'keyboard',
  'merchant',
  'payment',
  'printer',
  'statusbar',
  'system',
  'transaction',
]

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

/** Compile each native module to it's own file */
const workspacePath = fromWorkspace()
nativeModules.forEach(nativeModule => {
  const { entry, output } = getBundleConfig({
    source: fromWorkspace('src', nativeModule, 'index.js'),
    main: `${nativeModule}.js`,
    dist: workspacePath,
  })

  console.log(`Building @mamba/native/${nativeModule}`)
  compile(merge(buildConfig, { entry, output }))
})

/** Compile the main native.js */
console.log(`Building @mamba/native`)
compile(buildConfig)
