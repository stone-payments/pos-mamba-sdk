/**
 * This file initializes every aspect of the simulator (logic and view).
 * */

/**
 * This import order is **extremely** important since the POS.html needs all the
 * default drivers already initialized.
 */
import { Core } from './libs/boot.js';
import './libs/drivers.js';
import './libs/events.js';
import POS from './view/POS.html';

/** Mamba Web simulator global object */
export { Core };

/** Simulator utility methods */
export { log, warn, error, attachDrivers } from './libs/utils.js';

/** Mamba Web simulator pos/hardware instance */
export const getVirtualPOS = store => {
  if (!Core.POS) {
    Core.POS = new POS({ target: document.body, store });
  }
  return Core.POS;
};
