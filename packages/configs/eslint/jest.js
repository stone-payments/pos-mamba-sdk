/**
 * Manually import the jest config while we
 * can't 'extend' from inside the 'overrides'
 * */
const {
  configs: { recommended },
} = require('eslint-plugin-jest');

module.exports = {
  root: false,
  overrides: {
    files: ['**/*.test.js', '**/*.spec.js'],
    env: { jest: true },
    globals: {
      expectPage: true,
      page: true,
    },
    plugins: recommended.plugins,
    rules: {
      // ...recommended.rules,
      /** Allow to import from dev and peer dependencies */
      'import/no-extraneous-dependencies': [
        'warn',
        {
          devDependencies: true,
          peerDependencies: true,
        },
      ],
    },
    parserOptions: {
      sourceType: 'module',
    },
  },
};
