import EventTarget from '../../libs/EventTarget.js';
import Registry from '../registry/manager.js';
import Signal from '../../libs/signal.js';
import { LOG_PREFIX, deepCopy } from '../../libs/utils.js';
import extend from '../../../extend.js';
import { HMAC } from './addons.js';

const DriverManager = extend({}, EventTarget());

DriverManager.drivers = Object.freeze({});

DriverManager.Addons = {
  enable(addon, addonInitializer) {
    if (typeof addon !== 'string' || !addon) return;

    // Inferring HMAC
    const { Addons = {} } = Registry.persistent.get();
    Addons[HMAC] = addon === HMAC;
    Registry.persistent.set((draft) => {
      draft.Addons = { ...Addons };
    });
    if (typeof addonInitializer === 'function') addonInitializer();
  },
};

DriverManager.attachDrivers = (driverModules) => {
  if (__DEBUG_LVL__ >= 1 && __BROWSER__) console.groupCollapsed(`${LOG_PREFIX} Attaching drivers`);

  driverModules.forEach((driverModule) => {
    const driverRef = driverModule.NAMESPACE;
    const driver = window[driverRef] || {};

    if (__DEBUG_LVL__ >= 1 && __BROWSER__) console.groupCollapsed(driverRef);

    /** Set the simulator default settings for the driver */
    if (driverModule.DYNAMIC_SETTINGS || driverModule.SETTINGS) {
      const dynamicDefaults = deepCopy(driverModule.DYNAMIC_SETTINGS || driverModule.SETTINGS);

      if (__DEBUG_LVL__ >= 1 && __BROWSER__) {
        console.log('Dynamic settings:', dynamicDefaults);
      }

      Registry.set((draft) => {
        draft[driverRef] = Object.assign(dynamicDefaults, draft[driverRef] || {});
      });
    }

    if (driverModule.PERSISTENT_SETTINGS) {
      const persistentDefaults = deepCopy(driverModule.PERSISTENT_SETTINGS);
      // const saved = Registry.persistent.get()[driverRef];
      /** Does any persisted data for this driver exist? */
      Registry.persistent.set((draft) => {
        draft[driverRef] = Object.assign(persistentDefaults, draft[driverRef] || {});
      });

      if (__DEBUG_LVL__ >= 1 && __BROWSER__) {
        console.log('Persistent settings:', Registry.persistent.get()[driverRef]);
      }
    }

    /** Register the driver signals */
    if (driverModule.SIGNALS) {
      if (__DEBUG_LVL__ >= 1 && __BROWSER__) console.log('Signals:', driverModule.SIGNALS);
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

    /**
     * Merge the existing native module (if any) for the case of the
     * simulator running on the actual POS.
     */
    if (__POS__ && window[driverRef]) {
      Object.keys(window[driverRef]).forEach((key) => {
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

    /** Export it to the window */
    window[driverRef] = driver;

    /** Export it to the driver manager */
    DriverManager.drivers = Object.freeze({
      ...DriverManager.drivers,
      [driverRef]: driver,
    });

    if (__DEBUG_LVL__ >= 1 && __BROWSER__) console.groupEnd();
  });

  if (__DEBUG_LVL__ >= 1 && __BROWSER__) console.groupEnd();
};

export default DriverManager;
