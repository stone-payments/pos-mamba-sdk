const { IS_TEST, IS_DEV } = require('quickenv');

const presets = [
  [
    '@babel/preset-env',
    {
      useBuiltIns: false,
      loose: true,
      /** Only parse modules if testing. If not, let webpack handle it */
      modules: IS_TEST() ? 'commonjs' : false,
      debug: IS_DEV(),
      forceAllTransforms: true,
    },
  ],
  ['@babel/preset-stage-3', { loose: true }],
];

const plugins = [['@babel/plugin-proposal-class-properties', { loose: true }]];

module.exports = {
  extends: resolve(__dirname, 'packages/configs/babel/sdk.js'),
};
