const { IS_PROD } = require('quickenv')

module.exports = {
  extends: [
    'standard',
    'prettier',
    'prettier/standard',
    'plugin:jest/recommended',
  ],
  parser: 'babel-eslint',
  plugins: ['standard', 'prettier', 'jest', 'html'],
  settings: {
    'html/html-extensions': ['.html', '.svelte'],
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    indent: ['error', 2, { SwitchCase: 1 }],
    camelcase: 'off',
    'no-console': IS_PROD() ? ['error', { allow: ['warn', 'error'] }] : 'off',
    'no-var': 'error',
    'comma-dangle': ['error', 'always-multiline'],
    'no-new': 'off',
  },
  overrides: [
    {
      files: ['**/__tests__/**/*.js', '**/*.test.js'],
      env: { jest: true },
    },
  ],
}
