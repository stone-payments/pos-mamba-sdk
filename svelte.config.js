const getPreprocessor = require('svelte-preprocess')
const { IS_DEV } = require('quickenv')

module.exports = {
  dev: IS_DEV(),
  legacy: true,
  preprocess: getPreprocessor({
    transformers: {
      postcss: true,
    },
  }),
}
