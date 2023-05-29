/* eslint-disable @typescript-eslint/no-explicit-any */
import { relative } from 'path';
import { readFileSync } from 'fs';
import { getPackage } from '@mamba/utils';

/** Base webpack rule condition to ignore dependencies that shouldn't be transpiled */
export const transpileIgnoreBaseCondition = {
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

export const isOfModuleType =
  (depType: any) =>
  (input: any): any => {
    if (!(input in INPUT_MODULE_TYPE_CACHE)) {
      const pkg = getPackage({ path: input });
      let moduleType = 'cjs';

      /**
       * If 'module', 'esnext', 'jsnext:main' or 'svelte'
       * properties are available, assume es6 module
       */
      if (pkg && (pkg.module || pkg.esnext || pkg['jsnext:main'] || pkg.svelte)) {
        moduleType = 'es';
        /** If no main file or the imported file is not the main file... */
      } else if (pkg && (!pkg.main || relative(pkg.rootDir, input) !== pkg.main)) {
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
  };
