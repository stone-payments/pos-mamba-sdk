module.exports = {
  syntax: 'postcss-scss',
  plugins: [
    require('postcss-easy-import'),
    require('postcss-extend-rule'),
    require('postcss-advanced-variables'),
    require('postcss-preset-env')({
      stage: 2 /** Defaults postcss-preset-env to stage 2 */,
    }),
    require('postcss-atroot'),
    require('postcss-property-lookup'),
    require('postcss-nested'),
  ],
}
