const { IS_PROD } = require('./tools/consts.js')

module.exports = {
  extends: [
    'standard',
    'prettier',
    'prettier/standard',
    'plugin:jest/recommended',
  ],
  plugins: ['standard', 'prettier', 'jest', 'html'],
  env: {
    browser: true,
    node: true,
    mocha: true,
    es6: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: false,
      modules: true,
    },
  },
  settings: {
    'html/html-extensions': ['.html', '.svelte'],
    'html/indent': '+2',
    'html/report-bad-indent': 'warn',
  },
  rules: {
    indent: ['warn', 2, { SwitchCase: 1 }],
    'no-console': IS_PROD ? ['error', { allow: ['warn', 'error'] }] : 'off',
    'no-var': 'error',
    'comma-dangle': ['error', 'always-multiline'],
  },
  overrides: [
    {
      files: ['**/__tests__/**/*.js', '**/*.test.js'],
      env: { jest: true },
    },
  ],
}
