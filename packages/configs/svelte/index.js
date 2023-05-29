import sveltePreprocess from 'svelte-preprocess';
import defaultConfig from './defaults.json';

export default { preprocess: sveltePreprocess(defaultConfig) };
