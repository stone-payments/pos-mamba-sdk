/**
 * Mamba App entrypoint.
 * Since this file is barely modified, we include it
 * automatically as a virtual module.
 */
import { bootstrapApp } from '@mamba/pos/utils.js';
import App from './index.html';

if (__BROWSER__) {
  bootstrapApp(App, __manifest__); // eslint-disable-line
} else {
  bootstrapApp(App);
}
