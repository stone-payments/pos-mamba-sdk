module.exports = {
  extends: 'stylelint-config-standard',
  plugins: ['stylelint-scss'],
  processors: [
    [
      '@mapbox/stylelint-processor-arbitrary-tags',
      {
        fileFilterRegex: [/\.(svelte|html)$/],
      },
    ],
  ],
  rules: {
    'no-empty-source': null,
    'value-list-comma-newline-after': null,
    'declaration-colon-newline-after': null,
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global'],
      },
    ],
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['global'],
      },
    ],
  },
}
