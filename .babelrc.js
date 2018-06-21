const { IS_TEST } = require('quickenv')

const presets = [
  [
    '@babel/preset-env',
    {
      useBuiltIns: 'usage',
      loose: true,
      /** Only parse modules if testing. If not, let webpack handle it */
      modules: IS_TEST() ? 'commonjs' : false,
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
