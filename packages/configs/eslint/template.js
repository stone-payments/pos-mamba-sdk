module.exports = {
  overrides: {
    files: ['webpack/**/*.js', '*.config.js', '*rc.js'],
    rules: {
      /** Allow to use require in config files */
      'global-require': 'off',

      /** Allow to reassign 'compilation' property in 'MambaFixesPlugin' */
      'no-param-reassign': [
        'error',
        {
          props: true,
          ignorePropertyModificationsFor: ['compilation', 'acc', 'accumulator'],
        },
      ],
      /** Allow to import dev and peer dependencies */
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
          peerDependencies: true,
        },
      ],
    },
  },
};
