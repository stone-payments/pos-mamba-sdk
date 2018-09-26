/**
 * Mamba App entrypoint.
 * Since this file is barely modified, we include it
 * automatically as a virtual module.
 */
import { initApp } from '@mamba/pos/utils.js';
import App from './App.html';

export default initApp(App);
