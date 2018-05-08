const { IS_PROD } = require('./tools/consts.js')

const rules = {
  indent: ['error', 2, { SwitchCase: 1 }],
  'no-console': IS_PROD ? ['error', { allow: ['warn', 'error'] }] : 'off',
  'no-var': 'error',
  'comma-dangle': ['error', 'always-multiline'],
}

module.exports = {
  extends: [
    'standard',
    'prettier',
    'prettier/standard',
    'plugin:jest/recommended',
  ],
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
