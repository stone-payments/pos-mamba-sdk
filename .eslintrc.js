const { IS_PROD } = require('quickenv')

const rules = {
  indent: ['error', 2, { SwitchCase: 1 }],
  'no-console': IS_PROD() ? ['error', { allow: ['warn', 'error'] }] : 'off',
  'no-var': 'error',
  'no-sequences': 0,
  'no-new': 0,
}

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
    ecmaFeatures: {
      jsx: false,
      modules: true,
    },
  },
  globals: {
    cy: true,
  },
  rules: rules,
  overrides: [
    {
      files: ['**/__tests__/**/*.js', '**/*.test.js'],
      env: { jest: true },
    },
    /** Allow native to use console methods */
    {
      files: ['packages/native/**/*.js'],
      rules: Object.assign({}, rules, { 'no-console': 0 }),
    },
  ],
}
