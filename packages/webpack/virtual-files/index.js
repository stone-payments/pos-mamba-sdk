/**
 * Mamba App entrypoint.
 * Since this file is barely modified, we include it
 * automatically as a virtual module.
 */
import App from './index.html';

/**
 * This file contain utility methods used by the apps in general.
 * This runs on the simulation AND the POS.
 */
const target = document.getElementById('app-root');

/**
 * If we're inside the simulator context,
 * let it know that an app is opening
 * */
if (__BROWSER__) {
  const { AppManager } = window.MambaWeb;
  /** __MANIFEST__ is replaced with the current app's manifest */
  AppManager.installApp(App, __MANIFEST__);
  AppManager.open(App, target);
} else {
  new App({ target });
}
