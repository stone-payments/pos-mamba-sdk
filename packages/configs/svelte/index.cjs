/* eslint-disable @typescript-eslint/ban-ts-comment */
const sveltePreprocess = require('svelte-preprocess');
const defaultConfig = require('./defaults.cjs');

module.exports = {
  // @ts-ignore
  preprocess: sveltePreprocess(defaultConfig),
};
