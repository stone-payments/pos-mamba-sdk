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
          'es.string.anchor', // Not used
          'es.string.repeat', // Not used
          'es.regexp.*', // Not used regexp polyfills
          // Already exists on POS webkit
          'es.array.concat',
          'es.array.filter',
          'es.array.for-each',
          'es.array.index-of',
          'es.array.join',
          'es.array.map',
          'es.array.reduce',
          'es.array.splice',
          'es.array.some',
          'es.array.slice',
          'es.object.keys',
          'es.object.freeze',
          'es.date.to-string',
          'es.object.to-string',
          'es.string.split',
          'es.string.replace',
        ],
      },
    ],
  ],
  plugins: [],
};
