const { IS_TEST } = require('quickenv');
const generalConfig = require('./index.js');
const { extendPresetEnv } = require('./utils.js');

const config = extendPresetEnv(generalConfig, {
  useBuiltIns: 'entry',
  corejs: { version: 3, proposals: true },
  exclude: [
    'es.string.anchor', // Not used
    'es.regexp.*', // Not used regexp polyfills
    // Already exists on POS webkit
    'es.array.concat',
    'es.array.filter',
    'es.array.for-each',
    'es.array.index-of',
    'es.array.join',
    'es.array.map',
    'es.array.reduce',
    'es.array.splice',
    'es.array.some',
    'es.array.slice',
    'es.object.keys',
    'es.object.freeze',
    'es.date.to-string',
    'es.object.to-string',
    'es.string.split',
    'es.string.replace',
  ],
});

if (IS_TEST()) {
  config.plugins.push('istanbul');
}

if (IS_TEST()) {
  /** Transpile dynamic imports and async/await */
  config.plugins.push('dynamic-import-node', '@babel/plugin-transform-runtime');
} else {
  /** Accept dynamic import syntax and leave it to bundler */
  config.plugins.push('@babel/plugin-syntax-dynamic-import');
  config.plugins.push('lodash');
}

module.exports = config;
