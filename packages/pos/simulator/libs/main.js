import Signal from './signal.js';
import * as mainDriver from '../drivers/main.js';
import extendDriver from '../../drivers/extend.js';
import { LOG_PREFIX } from './utils.js';

/**
 * Create the simulator main driver.
 * Used to `get()` and `set()` dynamic configurations
 * and to fire signals for communicating with the simulator view.
 * */
export const Simulator = extendDriver({}, mainDriver.setup, driver =>
  Signal.register(driver, mainDriver.SIGNALS),
);

export function attachDrivers(driverModules) {
  if (__DEBUG__) console.groupCollapsed(`${LOG_PREFIX} Attaching drivers`);

  Object.keys(driverModules).forEach(driverRef => {
    if (__DEBUG__) console.groupCollapsed(driverRef);

    const driverModule = driverModules[driverRef];
    const driver = {};

    /** Overwrite the driverRef with the defined namespace */
    if (driverModule.NAMESPACE) {
      driverRef = driverModule.NAMESPACE;
    }

    /** Set the simulator default settings for the driver */
    if (driverModule.SETTINGS) {
      if (__DEBUG__) console.log('Default settings:', driverModule.SETTINGS);
      Simulator.set(driverRef, driverModule.SETTINGS);
    }

    /** Register the driver signals */
    if (driverModule.SIGNALS) {
      if (__DEBUG__) console.log('Signals:', driverModule.SIGNALS);
      Signal.register(driver, driverModule.SIGNALS);
    }

    /** Setup the driver methods */
    driverModule.setup(driver);

    if (__DEBUG__) {
      console.log(
        'Methods:',
        Object.getOwnPropertyNames(driver).reduce((acc, p) => {
          if (
            typeof driver[p] === 'function' &&
            (!driverModule.SIGNALS || !driverModule.SIGNALS.includes(p))
          ) {
            acc[p] = driver[p];
          }
          return acc;
        }, {}),
      );
    }

    /** Export it to the window */
    window[driverRef] = driver;

    if (__DEBUG__) console.groupEnd();
  });

  if (__DEBUG__) console.groupEnd();
}
