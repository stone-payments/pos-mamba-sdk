const merge = require('webpack-merge');
const { lineLength } = require('../shared.js');
const additionalGlobals = require('../helpers/clientEnvironment.js');

const IS_PROD = process.env.NODE_ENV === 'production';

module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'prettier',
    'plugin:import/recommended',
    'plugin:@tivac/svelte/svelte',
  ],
  plugins: ['prettier', 'html', '@tivac/svelte', 'import'],
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
  globals: merge(additionalGlobals, {
    __APP_ENV__: true,
    __NODE_ENV__: true,
    __BROWSER__: true,
    __POS__: true,
    __PROD__: true,
    __TEST__: true,
    __DEV__: true,
    __DEBUG_LVL__: true,
    __SIMULATOR__: true,
    __APP_MANIFEST__: true,
    LOG_INFO: true,
    LOG_ERROR: true,
    LOG_WARN: true,
    LOG: true,
  }),
  rules: {
    'import/no-cycle': 'off',
    // ! Code
    /** Allow to use new for side effects */
    'no-new': 'off', // disallow dangling underscores in identifiers

    /** Disallow 'console.log' on production */
    'no-console': IS_PROD
      ? ['warn', { allow: ['info', 'warn', 'error'] }]
      : 'off',

    /** Allow implicit return */
    'consistent-return': 'off',

    /** Allow ++ -- operators */
    'no-plusplus': 'off',

    /** Allow to reassign method parameters */
    'no-param-reassign': 'off',

    /** Allow nested ? ternary : expressions ? ... : ...  */
    'no-nested-ternary': 'off',

    /** Allow class methods to not use 'this' */
    'class-methods-use-this': 'off',

    // ! Style

    /** Allow __variables__ with underscores */
    'no-underscore-dangle': 'off',

    /** Allow both LF and CRLF line endings */
    'linebreak-style': 'off',

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
        ignore: ['.(?:svelte|html)$', '^(@mamba[\\/]|svelte-)'],
      },
    ],

    /** Allow to import peer dependencies */
    'import/no-extraneous-dependencies': [
      'warn',
      {
        peerDependencies: true,
      },
    ],

    'import/prefer-default-export': 'off',

    // ! eslint-config-prettier override

    /** Require semicolons without enforcing */
    semi: ['warn', 'always'],

    quotes: [
      'error',
      'single',
      { avoidEscape: true, allowTemplateLiterals: true },
    ],

    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'always-multiline',
      },
    ],

    // this option sets a specific tab width for your code
    // https://eslint.org/docs/rules/indent
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
        VariableDeclarator: 1,
        outerIIFEBody: 1,
        FunctionDeclaration: {
          parameters: 1,
          body: 1,
        },
        FunctionExpression: {
          parameters: 1,
          body: 1,
        },
        CallExpression: {
          arguments: 1,
        },
        ArrayExpression: 1,
        ObjectExpression: 1,
        ImportDeclaration: 1,
        flatTernaryExpressions: false,
        ignoreComments: false,
        ignoredNodes: ['TemplateLiteral'],
      },
    ],
    'template-curly-spacing': ['off'],

    // ! Svelte eslint

    /** We want to use onupdate */
    '@tivac/svelte/onupdate': 'off',
    '@tivac/svelte/onstate-this-refs': 'warn',
    '@tivac/svelte/property-ordering': [
      'warn',
      {
        order: [
          'namespace',
          'tag',
          'immutable',
          'components',
          'store',
          'setup',
          'preload',
          'helpers',
          'data',
          'computed',
          'props',
          'oncreate',
          'ondestroy',
          'onstate',
          'onupdate',
          'methods',
          'actions',
          'events',
          'transitions',
        ],
      },
    ],
  },
};
