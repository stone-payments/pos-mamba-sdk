import produce, { setAutoFreeze } from 'immer';

import { log } from '../../../libs/utils.js';

setAutoFreeze(false);

export default Registry => {
  /** Data */
  Registry.get = keyPath => {
    if (keyPath === undefined) {
      return Registry._data;
    }

    const keys = keyPath.replace(/\[(\d+)\]/g, '.$1').split('.');
    let value = Registry._data[keys[0]];
    for (let i = 1; i < keys.length; i++) {
      value = value[keys[i]];
    }

    if (typeof value === 'object') {
      return JSON.parse(JSON.stringify(value));
    }

    return value;
  };

  Registry.set = (keyPath, value, fireSignal = true) => {
    if (keyPath === undefined) {
      return;
    }

    if (typeof keyPath === 'function') {
      Registry._data = produce(Registry._data, keyPath);
      return;
    }

    const keys = keyPath.replace(/\[(\d+)\]/g, '.$1').split('.');

    if (__DEBUG_LVL__ >= 2 && __BROWSER__) {
      log(`"${keyPath}" = ${JSON.stringify(value)}`);
    }

    // If not a nested keyPath
    if (keys.length === 1) {
      Registry._data[keyPath] = value;

      if (fireSignal) {
        Registry.fire('shallowChange', { key: keyPath, value });
      }

      return;
    }

    let object = Registry._data[keys[0]];
    for (let i = 1; i < keys.length - 1; i++) {
      object = object[keys[i]];
    }

    object[keys[keys.length - 1]] = value;

    if (fireSignal) {
      Registry.fire('deepChange', { key: keyPath, path: keys, value });
    }
  };
};
