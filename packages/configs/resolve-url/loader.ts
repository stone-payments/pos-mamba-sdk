import env from '../envModes.cjs';

const { IS_DEV } = env;

export default {
  loader: 'resolve-url-loader',
  options: {
    sourceMap: IS_DEV,
    keepQuery: true,
    debug: false,
  },
};
