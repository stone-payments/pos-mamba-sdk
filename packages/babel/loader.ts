/// <reference types="@mamba/configs" />
/**
 * These loaders and this file, is intended to use with Webpack 5 with TypeScript configuration files.
 */
import { IS_DEV } from '@mamba/configs/envModes.cjs';
import babelrc from './template.js';
import extendPresetEnv from './lib/extendPresetEnv.js';
import moduleResolverConfig from './lib/module-resolver-config.js';

const Babel = {
  loader: 'babel-loader',
  options: {
    sourceMaps: IS_DEV,
    cacheDirectory: IS_DEV,
    babelrc: false,
    ...babelrc,
  },
};

const BabelCJS = {
  ...Babel,
  options: extendPresetEnv(Babel.options, {
    modules: 'commonjs',
  }),
};

const BabelSvelte = {
  loader: 'babel-loader',
  options: {
    babelrc: false,
    presets: ['@babel/preset-typescript'],
    plugins: [moduleResolverConfig],
  },
};

export { Babel, BabelCJS, BabelSvelte };
