/**
 * This file creates the simulator core driver.
 * */
import Signal from './signal.js';
import { setup, SIGNALS } from './core.js';
import extendDriver from '../../drivers/extend.js';
import { log } from './utils.js';

if (__DEV__ && __BROWSER__) log('Loading mamba simulated environment');

/**
 * Create the simulator main driver.
 * Used to `get()` and `set()` dynamic configurations
 * and to fire signals for communicating with the simulator view.
 * */
export const Core =
  window.MambaWeb ||
  extendDriver({}, setup, driver => Signal.register(driver, SIGNALS));
window.MambaWeb = Core; // eslint-disable-line
