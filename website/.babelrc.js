const { IS_PROD, IS_DEV, IS_TEST } = require('./tools/consts.js')

const presets = [
  [
    '@babel/preset-env',
    {
      /** Polyfill only used built-ins */
      useBuiltIns: 'usage',
      loose: true,
      /** Only parse modules if testing. If not, let webpack handle it */
      modules: IS_TEST ? 'commonjs' : false,
      debug: false,
      forceAllTransforms: true,
    },
  ],
  ['@babel/preset-stage-3', { loose: true }],
]

const plugins = [['@babel/plugin-proposal-class-properties', { loose: true }]]

module.exports = {
  sourceMaps: true,
  presets,
  plugins,
}
