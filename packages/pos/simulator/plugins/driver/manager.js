import Registry from '../registry/manager.js';
import Signal from '../../libs/signal.js';
import { LOG_PREFIX } from '../../libs/utils.js';
import extendDriver from '../../../drivers/extend.js';

let externalDrivers = [];
let looseDrivers = null;

const DriverManager = extendDriver({});

Signal.register(DriverManager, [
  'externalDriversAttached', // (driverModules)
]);

DriverManager.getExternalDrivers = () => externalDrivers;
DriverManager.getLooseDrivers = () => looseDrivers;
DriverManager.clearLooseDrivers = () => {
  looseDrivers = null;
};

/**
 * Resets a driver state. We use JSON.parse/stringify to deep clone the state object
 */
DriverManager.resetDriverState = driverModule => {
  if (driverModule.SETTINGS) {
    Registry.set(
      driverModule.NAMESPACE,
      JSON.parse(JSON.stringify(driverModule.SETTINGS)),
    );
  }
};

DriverManager.attachDrivers = driverModules => {
  if (__DEBUG_LVL__ >= 1 && __BROWSER__)
    console.groupCollapsed(`${LOG_PREFIX} Attaching drivers`);

  driverModules.forEach(driverModule => {
    const driver = {};
    const driverRef = driverModule.NAMESPACE;

    if (__DEBUG_LVL__ >= 1 && __BROWSER__) console.groupCollapsed(driverRef);

    /** Set the simulator default settings for the driver */
    if (driverModule.SETTINGS) {
      if (__DEBUG_LVL__ >= 1 && __BROWSER__) {
        console.log('Default settings:', driverModule.SETTINGS);
      }
      DriverManager.resetDriverState(driverModule);
    }

    /** Register the driver signals */
    if (driverModule.SIGNALS) {
      if (__DEBUG_LVL__ >= 1 && __BROWSER__)
        console.log('Signals:', driverModule.SIGNALS);
      Signal.register(driver, driverModule.SIGNALS);
    }

    /** Setup the driver methods */
    driverModule.setup(driver);

    if (__DEBUG_LVL__ >= 1 && __BROWSER__) {
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

    if (__DEBUG_LVL__ >= 1 && __BROWSER__) console.groupEnd();
  });

  if (Registry._booted) {
    externalDrivers = [...externalDrivers, ...driverModules];
    looseDrivers = driverModules;
  }

  if (__DEBUG_LVL__ >= 1 && __BROWSER__) console.groupEnd();
};

export default DriverManager;
