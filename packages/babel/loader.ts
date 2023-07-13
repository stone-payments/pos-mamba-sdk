/// <reference types="@mamba/configs" />
/**
 * These loaders and this file, is intended to use with Webpack 5 with TypeScript configuration files.
 */
import * as envs from '@mamba/configs/envModes.cjs';
import babelrc from './template.cjs';
import extendPresetEnv from './lib/extendPresetEnv.cjs';
import moduleResolverConfig from './lib/module-resolver-config.cjs';

const Babel = {
  loader: 'babel-loader',
  options: {
    sourceMaps: envs.IS_DEV,
    cacheDirectory: envs.IS_DEV,
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
