const pkgDir = require('pkg-dir');
const { getPkg } = require('quickenv');

/** Base webpack rule condition to ignore dependencies that shouldn't be transpiled */
const transpileIgnoreBaseCondition = {
  test: /\.js$/,
  include: [/node_modules/],
  exclude: [
    /node_modules[\\/].+[\\/]node_modules/, // exclude sub dependencies of linked packaged
    /core-js/, // exclude babel polyfills
    /loader|webpack/, // exclude webpack files from being parsed
  ],
};

/**
 * Map to cache dependencies module types.
 * Used to tell webpack and babel what dependencies
 * should be transpiled as commonjs or as es6 modules.
 * */
const MODULE_TYPE_DICT = new Map();

module.exports = {
  isModuleOfType: depType => input => {
    if (!MODULE_TYPE_DICT.has(input)) {
      const pkg = getPkg({ path: pkgDir.sync(input) });
      MODULE_TYPE_DICT.set(
        input,
        pkg.module || pkg.esnext || pkg['jsnext:main'] || !pkg.main
          ? 'es'
          : 'cjs',
      );
    }
    return MODULE_TYPE_DICT.get(input) === depType;
  },
  transpileIgnoreBaseCondition,
};
