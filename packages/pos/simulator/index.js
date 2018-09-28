/**
 * This file initializes every aspect of the simulator (logic and view).
 * */

/**
 * This import order is **extremely** important since the POS.html needs all the
 * default drivers already initialized.
 */
import Core from './libs/core/main.js';
import './libs/drivers.js';
import './libs/core/events.js';
import POS from './view/POS.html';

/** Mamba Web simulator global object */
export { Core };
export const { attachDrivers } = Core;

/** Simulator utility methods */
export { log, warn, error } from './libs/utils.js';

/** Mamba Web simulator pos/hardware instance */
export const getVirtualPOS = () => {
  if (!Core.POS) {
    Core.POS = new POS({ target: document.body });
  }
  return Core.POS;
};
