const { IS_TEST } = require('quickenv');
const generalConfig = require('./index.js');
const { extendPresetEnv } = require('./utils.js');

const config = extendPresetEnv(generalConfig, {
  useBuiltIns: 'usage',
  corejs: { version: 3, proposals: true },
});

if (IS_TEST()) {
  /** Transpile dynamic imports and async/await */
  config.plugins.push('dynamic-import-node', '@babel/plugin-transform-runtime');
} else {
  /** Accept dynamic import syntax and leave it to bundler */
  config.plugins.push('@babel/plugin-syntax-dynamic-import');
}

module.exports = config;
