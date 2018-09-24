import Signal from './signal.js';
import * as CoreDriver from './core.js';
import extendDriver from '../../drivers/extend.js';

/** Mamba Web simulator global object */

/**
 * Create the simulator main driver.
 * Used to `get()` and `set()` dynamic configurations
 * and to fire signals for communicating with the simulator view.
 * */
export const Core =
  window.MambaWeb ||
  extendDriver({}, CoreDriver.setup, driver =>
    Signal.register(driver, CoreDriver.SIGNALS),
  );
window.MambaWeb = Core; // eslint-disable-line

/** Mamba Web simulator pos/hardware instance */
export let virtualPOS = Core.POS;
export const createPOSInstance = instance => {
  Core.POS = instance;
  virtualPOS = instance;
};
