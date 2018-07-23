module.exports = {
  extends: 'stylelint-config-standard',
  ignoreFiles: './docs-sapper/**/*',
  rules: {
    'no-descending-specificity': null,
    'color-hex-case': null,
    'no-empty-source': null,
    'value-list-comma-newline-after': null,
    'declaration-colon-newline-after': null,
    'at-rule-no-unknown': null,
    /** Allow 'ref:*' selectors */
    'selector-type-no-unknown': null,
    'selector-pseudo-class-no-unknown': null,
    /**
     * Since stylelint reads all 'ref:*' as the same selector,
     * this prevents it from complaining when multiple 'ref:*'
     * are present on the same css
     */
    'no-descending-specificity': null,
  },
}
