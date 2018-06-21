module.exports = {
  plugins: [
    require('postcss-easy-import'),
    require('postcss-advanced-variables'),
    require('postcss-atroot'),
    require('postcss-extend-rule'),
    require('postcss-nested'),
    require('postcss-preset-env')({
      stage: 2 /** Defaults postcss-preset-env to stage 2 */,
    }),
    require('postcss-property-lookup'),
  ],
}
