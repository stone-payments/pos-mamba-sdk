const { IS_PROD } = require('./tools/consts.js')

module.exports = {
  extends: ['standard', 'prettier', 'prettier/standard'],
  plugins: ['standard', 'prettier'],
  env: {
    browser: true,
    node: true,
    mocha: true,
    es6: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
  },
  globals: {
    sleep: true,
  },
  rules: {
    indent: ['error', 2, { SwitchCase: 1 }],
    'no-console': IS_PROD ? ['error', { allow: ['warn', 'error'] }] : 0,
    'space-before-function-paren': 2,
  },
  overrides: [
    {
      files: ['**/__tests__/**/*.js', '**/*.test.js'],
      env: { jest: true },
    },
  ],
}
