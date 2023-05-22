import { existsSync } from 'node:fs';
import * as webpack from 'webpack';
import { IS_BROWSER } from '../../configs/envModes.cjs';
import fromWorkingDir from './fromWorkingDir';

export default function getEntrypoints(): webpack.EntryObject {
  return {
    app: [
      /* Experimental Polyfill for Svelte Animations */
      // fromWorkingDir('./packages/static-polyfills/window.performance.js'),
      // fromWorkingDir('./packages/static-polyfills/requestAnimationFrame.js'),

      /* Experimental Polyfill */
      // fromWorkingDir('./packages/static-polyfills/css-polyfills.min.js'),

      /** Mamba style resetter/normalizer */
      fromWorkingDir(`packages/styles/${IS_BROWSER ? 'desktop' : 'pos'}.pcss`),

      /** Optional generic external styles file */
      existsSync(fromWorkingDir('src', 'app.pcss')) && './app.pcss',

      /** Virtual app entry point */
      fromWorkingDir(`./src/index.${IS_BROWSER ? 'browser' : 'pos'}.ts`),
    ].filter(Boolean) as string[],
  };
}
