const { relative } = require('path');
const pkgDir = require('pkg-dir');
const { getPkg } = require('quickenv');
const { readFileSync } = require('fs');

/** Base webpack rule condition to ignore dependencies that shouldn't be transpiled */
const transpileIgnoreBaseCondition = {
  test: /\.js$/,
  include: [/node_modules/],
  exclude: [
    /core-js/, // exclude babel polyfills
  ],
};

/**
 * Map to cache dependencies module types.
 * Used to tell webpack and babel what dependencies
 * should be transpiled as commonjs or as es6 modules.
 * */
const INPUT_MODULE_TYPE_CACHE = {};

module.exports = {
  transpileIgnoreBaseCondition,
  isOfModuleType: depType => input => {
    if (!(input in INPUT_MODULE_TYPE_CACHE)) {
      const pkgDirectory = pkgDir.sync(input);
      const pkg = getPkg({ path: pkgDirectory });
      let moduleType = 'cjs';

      /**
       * If 'module', 'esnext', 'jsnext:main' or 'svelte'
       * properties are available, assume es6 module
       */
      if (pkg.module || pkg.esnext || pkg['jsnext:main'] || pkg.svelte) {
        moduleType = 'es';
        /** If no main file or the imported file is not the main file... */
      } else if (!pkg.main || relative(pkgDirectory, input) !== pkg.main) {
        /**
         * If there's not a main property, let's read
         * the file content to assume a module type
         * */
        const fileContent = readFileSync(input).toString();
        if (
          fileContent.indexOf('module.exports') === -1 &&
          fileContent.indexOf('exports.') === -1
        ) {
          moduleType = 'es';
        }
      }

      INPUT_MODULE_TYPE_CACHE[input] = moduleType;
    }

    return INPUT_MODULE_TYPE_CACHE[input] === depType;
  },
};
