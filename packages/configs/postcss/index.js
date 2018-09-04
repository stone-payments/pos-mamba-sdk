module.exports = {
  plugins: {
    'postcss-easy-import': {
      extensions: ['.css', '.pcss'],
    },
    'postcss-extend-rule': {},
    'postcss-advanced-variables': {},
    'postcss-calc': {
      warnWhenCannotResolve: true,
    },
    'postcss-preset-env': {
      stage: 2 /** Defaults postcss-preset-env to stage 2 */,
    },
    'postcss-atroot': {},
    'postcss-property-lookup': {},
    'postcss-nested': {},
    'css-mqpacker': {},
    'postcss-reporter': { clearReportedMessages: true },
  },
};
