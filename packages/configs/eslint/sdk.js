module.exports = {
  rules: {
    /** Allow to export overriden native objects */
    'import/no-mutable-exports': 'off',
  },
  overrides: [
    {
      files: ['packages/webpack/virtual-files/*.js'],
      env: {
        browser: true,
      },
      rules: {
        'import/no-extraneous-dependencies': ['off'],
      },
    },
    {
      files: ['tools/**/*.js', '*.config.js', '*rc.js'],
      env: {
        browser: false,
        node: true,
        es6: true,
      },
      rules: {
        /** Allow to use require in config files */
        'global-require': 'off',

        /** Allow to import dev and peer dependencies */
        'import/no-extraneous-dependencies': [
          'warn',
          {
            devDependencies: true,
            peerDependencies: true,
          },
        ],
      },
    },
    {
      files: ['tools/jest/setup/*.js'],
      env: {
        browser: true,
      },
    },
  ],
};
