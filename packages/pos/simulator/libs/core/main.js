/**
 * This file is the boilerplate for the simulator core driver;
 * */
import { LOG_PREFIX, log } from '../utils.js';
import Signal from '../signal.js';
import extendDriver from '../../../drivers/extend.js';

const Core = extendDriver({});

Signal.register(Core, [
  'settingsChanged',
  'print',
  'toggleCard',
  'openApp',
  'closeApp',
]);

const DATA = {};

Core.get = keyPath => {
  if (keyPath === undefined) {
    return DATA;
  }

  const keys = keyPath.replace(/\[(\d+)\]/g, '.$1').split('.');
  let value = DATA[keys[0]];
  for (let i = 1; i < keys.length; i++) {
    value = value[keys[i]];
  }
  return value;
};

Core.set = (keyPath, value, fireSignal = true) => {
  if (keyPath === undefined) {
    return;
  }

  const keys = keyPath.replace(/\[(\d+)\]/g, '.$1').split('.');
  const lastKey = keys.pop();

  if (__DEV__ && __BROWSER__) {
    log(`"${keyPath}" = ${JSON.stringify(value)}`);
  }

  // If not a nested keyPath
  if (keys[0] === undefined) {
    DATA[lastKey] = value;
    return;
  }

  let object = DATA[keys[0]];
  for (let i = 1; i < keys.length; i++) {
    object = object[keys[i]];
  }
  object[lastKey] = value;

  if (fireSignal) {
    Core.settingsChanged(DATA);
  }
};

Core.attachDrivers = driverModules => {
  if (__DEV__ && __BROWSER__)
    console.groupCollapsed(`${LOG_PREFIX} Attaching drivers`);

  driverModules.forEach(driverModule => {
    const driver = {};
    const driverRef = driverModule.NAMESPACE;

    if (__DEV__ && __BROWSER__) console.groupCollapsed(driverRef);

    /** Set the simulator default settings for the driver */
    if (driverModule.SETTINGS) {
      if (__DEV__ && __BROWSER__) {
        console.log('Default settings:', driverModule.SETTINGS);
      }
      Core.set(driverRef, driverModule.SETTINGS);
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
};

window.MambaWeb = window.MambaWeb || Core;

export default Core;
