module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: false,
        loose: true,
        /** Only parse modules if testing. If not, let bundler handle it */
        modules: process.env.NODE_ENV === 'test' ? 'commonjs' : false,
        debug: false,
        forceAllTransforms: true,
        exclude: [
          'es6.string.anchor', // Not used
          'es6.string.repeat', // Not used
          'es6.regexp.*', // Not used regexp polyfills
          'es6.object.keys', // Already exists on POS webkit
          'es6.object.freeze', // Already exists on POS webkit
        ],
      },
    ],
  ],
  plugins: [
    process.env.NODE_ENV === 'test'
      ? /** Add support to import() syntax and transpile it */
      'dynamic-import-node'
      : /** Add support to import() syntax and leave it to bundler */
      '@babel/plugin-syntax-dynamic-import',
    process.env.NODE_ENV === 'test' && '@babel/plugin-transform-runtime',
    /** Add class properties support */
    ['@babel/plugin-proposal-class-properties', { loose: true }],
  ].filter(Boolean),
};
