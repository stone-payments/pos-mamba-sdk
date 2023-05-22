import babelrc from './template';

import env from '../envModes.cjs';
import extendPresetEnv from './lib/extendPresetEnv';
import moduleResolverConfig from './lib/module-resolver-config.cjs';

const { IS_DEV } = env;

export const Babel = {
  loader: 'babel-loader',
  options: {
    sourceMaps: IS_DEV,
    cacheDirectory: IS_DEV,
    babelrc: false,
    ...babelrc,
  },
};

export const BabelCJS = {
  ...Babel,
  options: extendPresetEnv(Babel.options, {
    modules: 'commonjs',
  }),
};

export const BabelSvelte = {
  loader: 'babel-loader',
  options: {
    babelrc: false,
    presets: ['@babel/preset-typescript'],
    plugins: [moduleResolverConfig],
  },
};

export { Babel, BabelCJS, BabelSvelte };
