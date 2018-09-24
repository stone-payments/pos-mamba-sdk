import { log } from './utils.js';

export const SIGNALS = [
  'settingsChanged',
  'print',
  'toggleCard',
  /** Fired when a app is opened */
  'openApp',
  'closeApp',
];

/** Core driver for handling the POS Simulation */
const DATA = {};

export function setup(Core) {
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

  // eslint-disable-next-line
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
}
