module.exports = {
  overrides: [
    {
      files: ['webpack/**/*.js', '*.config.js', '*rc.js'],
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
      files: ['src/mamba/**/*.js'],
      rules: {
        'no-console': ['off'],
      },
    },
  ],
};
