import Signal from './signal.js';
import * as mainDriver from './drivers/private/main.js';

/**
 * Simulator main driver
 * Used to `get()` and `set()` dynamic configurations
 * and to fire signals for communicating with the simulator view.
 * */
export const Simulator = {};

export function createMainDriver() {
  /** Initialize the main simulator driver */
  Signal.register(Simulator, mainDriver.SIGNALS);
  mainDriver.setup(Simulator);
}
