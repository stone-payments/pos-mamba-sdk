import { createMainDriver } from './main.js';
import createNativeDrivers from './drivers/createNativeDrivers.js';

/**
 * Simulator main driver
 * Used to `get()` and `set()` dynamic configurations
 * and to fire signals for communicating with the simulator view.
 * */
export const Simulator = {};

if (__BROWSER__) {
  createMainDriver();
  createNativeDrivers();
}
