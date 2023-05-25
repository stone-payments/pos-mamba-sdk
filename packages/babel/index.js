const { IS_TEST: IS_TEST_FN } = require('@mamba/configs/envModes.cjs');
const moduleResolverConfig = require('./lib/module-resolver-config.js');

const IS_TEST = IS_TEST_FN();

const presetEnvOptions = {
  useBuiltIns: false,
  loose: true,

  /** Only parse modules if testing. If not, let bundler handle it */
  modules: process.env.NODE_ENV === 'test' ? 'commonjs' : process.env.BABEL_MODULES || false,
  debug: false,
  forceAllTransforms: true,
};

if (IS_TEST) {
  presetEnvOptions.targets = {
    node: 'current',
  };
}

const config = {
  presets: [['@babel/preset-env', presetEnvOptions], '@babel/preset-typescript'],
  plugins: [
    moduleResolverConfig,

    /** Transpile dynamic imports and async/await */
    IS_TEST && 'istanbul',
    IS_TEST && 'dynamic-import-node',
    IS_TEST && '@babel/plugin-transform-runtime',

    /** Accept dynamic import syntax and leave it to bundler */
    !IS_TEST && '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    ['@babel/plugin-proposal-class-properties', { loose: true }],
  ].filter(Boolean),
  env: {
    production: {
      plugins: [['react-remove-properties', { properties: ['data-test'] }]],
    },
  },
};

module.exports = config;
