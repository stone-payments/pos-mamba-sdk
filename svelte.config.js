const getPreprocessor = require('svelte-preprocess')

module.exports = {
  preprocess: getPreprocessor({
    transformers: {
      postcss: {
        plugins: [require('autoprefixer')],
      },
    },
  }),
}
