module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: false,
        loose: true,
        /** Only parse modules if testing. If not, let bundler handle it */
        modules: false,
        debug: !!process.env.DEBUG,
        forceAllTransforms: true,
      },
    ],
  ],
  plugins: [
    /** Add support to import() */
    '@babel/plugin-syntax-dynamic-import',
    /** Add class properties support */
    ['@babel/plugin-proposal-class-properties', { loose: true }],
  ],
  env: {
    test: {
      /** Only for testing (NODE_ENV = 'test') in NodeJS, which needs CJS to work */
      plugins: ['@babel/plugin-transform-modules-commonjs'],
    },
  },
};
