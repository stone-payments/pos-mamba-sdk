module.exports = {
  overrides: [
    {
      files: ['**/*.test.js', '**/*.spec.js'],
      env: { jest: true },
      globals: {
        expectPage: true,
        page: true,
      },
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
  ],
};
