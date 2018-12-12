/**
 * Common webpack configuration
 */
const { existsSync } = require('fs');
const { fromCwd } = require('quickenv');
const { IS_BROWSER, ADD_MAMBA_SIMULATOR } = require('./consts.js');

module.exports = () => ({
  app: [
    /** Mamba style resetter/normalizer */
    `@mamba/styles/dist/${IS_BROWSER ? 'desktop' : 'pos'}.css`,
    /** Optional generic external styles file */
    existsSync(fromCwd('src', 'styles.pcss')) && './styles.pcss',
    /** Mamba simulator entry point */
    ADD_MAMBA_SIMULATOR && './simulator.js',
    /** Virtual app entry point */
    `./index.${IS_BROWSER ? 'browser' : 'pos'}.js`,
  ].filter(Boolean),
});
