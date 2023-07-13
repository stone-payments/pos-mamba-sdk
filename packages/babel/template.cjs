const commonConfig = require('./index.cjs');
const extendPresetEnv = require('./lib/extendPresetEnv.cjs');

const config = extendPresetEnv(commonConfig, {
  useBuiltIns: 'usage',
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
    'es.parse-float',
  ],
});

module.exports = config;
