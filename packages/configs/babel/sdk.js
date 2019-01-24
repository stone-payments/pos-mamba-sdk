const { IS_TEST, IS_WATCHING } = require('quickenv');
const generalConfig = require('./index.js');
const { extendPresetEnv } = require('./utils.js');

const config = extendPresetEnv(generalConfig);

if (IS_TEST() || IS_WATCHING()) {
  /** Transpile dynamic imports and async/await */
  config.plugins.push('dynamic-import-node', '@babel/plugin-transform-runtime');
} else {
  /** Accept dynamic import syntax and leave it to bundler */
  config.plugins.push('@babel/plugin-syntax-dynamic-import');
}

module.exports = config;
