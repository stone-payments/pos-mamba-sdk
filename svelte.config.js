const getPreprocessor = require('svelte-preprocess');
const { IS_DEV } = require('quickenv');

module.exports = {
  dev: IS_DEV(),
  legacy: true,
  preprocess: getPreprocessor({
    transformers: {
      postcss: true,
    },
  }),
  //   onwarn(warning, handler) {
  //     /** Prevent warning on autofocus attributes */
  //     if (warning.code === 'a11y-autofocus') {
  //       return
  //     }
  //     handler(warning)
  //   },
};
