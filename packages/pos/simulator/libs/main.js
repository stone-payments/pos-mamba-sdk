import Signal from './signal.js';
import * as stateDriver from './state.js';
import extendDriver from '../../drivers/extend.js';
import { LOG_PREFIX } from './utils.js';

/**
 * Create the simulator main driver.
 * Used to `get()` and `set()` dynamic configurations
 * and to fire signals for communicating with the simulator view.
 * */
export const State = extendDriver({}, stateDriver.setup, driver =>
  Signal.register(driver, stateDriver.SIGNALS),
);

export function attachDrivers(driverModules) {
  if (__DEV__ && __BROWSER__)
    console.groupCollapsed(`${LOG_PREFIX} Attaching drivers`);

  Object.keys(driverModules).forEach(driverRef => {
    const driverModule = driverModules[driverRef];
    const driver = {};

    /** Overwrite the driverRef with the defined namespace */
    if (driverModule.NAMESPACE) {
      driverRef = driverModule.NAMESPACE;
    }

    if (__DEV__ && __BROWSER__) console.groupCollapsed(driverRef);

    /** Set the simulator default settings for the driver */
    if (driverModule.SETTINGS) {
      if (__DEV__ && __BROWSER__) {
        console.log('Default settings:', driverModule.SETTINGS);
      }
      State.set(driverRef, driverModule.SETTINGS);
    }

    /** Register the driver signals */
    if (driverModule.SIGNALS) {
      if (__DEV__ && __BROWSER__) console.log('Signals:', driverModule.SIGNALS);
      Signal.register(driver, driverModule.SIGNALS);
    }

    /** Setup the driver methods */
    driverModule.setup(driver);

    if (__DEV__ && __BROWSER__) {
      /** List all methods from the driver */
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

    /**
     * Merge the existing native module (if any) for the case of the
     * simulator running on the actual POS.
     */
    if (__POS__ && window[driverRef]) {
      Object.keys(window[driverRef]).forEach(key => {
        /**
         * The enumerated props are their Qt signature 'methodName(...)'
         * and not the actual methods names. So, remove anything from
         * the first '(' onwards.
         * */
        const parenthesisIndex = key.indexOf('(');
        if (parenthesisIndex > -1) {
          key = key.substr(0, parenthesisIndex);
        }
        driver[key] = window[driverRef][key];
      });
    }

    window[driverRef] = driver;

    if (__DEV__ && __BROWSER__) console.groupEnd();
  });

  if (__DEV__ && __BROWSER__) console.groupEnd();
}
