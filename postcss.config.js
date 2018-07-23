module.exports = {
  plugins: [
    require('postcss-easy-import')({
      extensions: ['.css', '.pcss'],
    }),
    require('postcss-extend-rule'),
    require('postcss-advanced-variables'),
    require('postcss-preset-env')({
      stage: 2 /** Defaults postcss-preset-env to stage 2 */,
    }),
    require('postcss-atroot'),
    require('postcss-property-lookup'),
    require('postcss-nested'),
    require('postcss-reporter')({ clearReportedMessages: true }),
  ],
}
