const sveltePreprocess = require('svelte-preprocess');
const defaultConfig = require('./defaults.json');

module.exports = {
  preprocess: sveltePreprocess(defaultConfig),
};
