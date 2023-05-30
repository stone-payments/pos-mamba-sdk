import sveltePreprocess from 'svelte-preprocess';
import defaultConfig from './defaults.cjs';
import env from '../envModes.cjs';

const { IS_PROD } = env;

export default {
  loader: 'svelte-loader',
  options: {
    compilerOptions: {
      // Dev mode must be enabled for HMR to work!
      dev: !IS_PROD,
    },
    css: false,
    emitCss: true,
    legacy: true,
    immutable: true,
    hotReload: !IS_PROD,

    // Svelte preprocessor
    preprocess: sveltePreprocess(defaultConfig),
  },
};
