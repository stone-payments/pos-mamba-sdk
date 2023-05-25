import env from '../envModes.cjs';

const { IS_DEV } = env;

export default {
  loader: 'css-loader',
  options: {
    sourceMap: IS_DEV,
    importLoaders: 2,
  },
};
