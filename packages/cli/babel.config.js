module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '8.9.0',
        },
        modules: false,
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    [
      require.resolve('@babel/plugin-transform-modules-commonjs'),
      {
        lazy: true,
      },
    ],
  ],
};
