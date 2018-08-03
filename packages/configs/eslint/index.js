const { lineLength } = require('../shared.js');

const IS_PROD = process.env.NODE_ENV === 'production';

module.exports = {
  root: true,
  extends: ['airbnb-base', 'prettier', 'plugin:import/recommended'],
  plugins: ['html', 'import', 'prettier'],
  settings: {
    'html/html-extensions': ['.html', '.svelte'],
  },
  env: {
    browser: true,
    es6: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    // ! Code
    /** Allow to use new for side effects */
    'no-new': 'off', // disallow dangling underscores in identifiers

    /** Disallow 'console.log' on production */
    'no-console': IS_PROD
      ? [
          'error',
          {
            allow: ['warn', 'error'],
          },
        ]
      : 'off',

    /** Allow implicit return */
    'consistent-return': 'off',

    /** Allow ++ -- operators */
    'no-plusplus': 'off',

    /** Allow nested ? ternary : expressions ? ... : ...  */
    'no-nested-ternary': 'off',

    /** Allow class methods to not use 'this' */
    'class-methods-use-this': 'off',

    // ! Style
    /** Allow __variables__ with underscores */
    'no-underscore-dangle': 'off',

    /** Max line length */
    'max-len': [
      'warn',
      lineLength,
      2,
      {
        ignoreUrls: true,
        ignoreComments: true,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],

    camelcase: [
      'error',
      {
        properties: 'never',
        ignoreDestructuring: true,
      },
    ],

    // ! Import rules
    /** Enforce file extensions on 'import' statements */
    'import/extensions': [
      'error',
      'always',
      {
        ignorePackages: true,
      },
    ],

    /** Don't complain about non-module svelte files */
    'import/no-unresolved': [
      'error',
      {
        ignore: ['.(?:svelte|html)$', '^(@mambasdk[\\/]|svelte-)'],
      },
    ],

    /** Allow to import peer dependencies */
    'import/no-extraneous-dependencies': [
      'warn',
      {
        peerDependencies: true,
      },
    ],
  },
};
