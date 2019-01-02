import produce, { setAutoFreeze } from 'immer';

import { log, warn, deepCopy } from '../../../libs/utils.js';

setAutoFreeze(false);

export default Registry => {
  /** Data */
  Registry.get = keyPath => {
    if (keyPath === undefined) {
      return deepCopy(Registry._data);
    }

    if (__DEV__) {
      warn(
        'Registry.get(string) is deprecated. Please use Registry.get().Prop1.Prop2.Prop3...',
      );
    }

    const keys = keyPath.replace(/\[(\d+)\]/g, '.$1').split('.');
    let value = Registry._data[keys[0]];
    for (let i = 1; i < keys.length; i++) {
      value = value[keys[i]];
    }

    if (typeof value === 'object') {
      return deepCopy(value);
    }

    return value;
  };

  Registry.set = (keyPath, value) => {
    if (keyPath === undefined) {
      return;
    }

    if (typeof keyPath === 'function') {
      Registry._data = produce(Registry._data, keyPath);
      return;
    }

    if (__DEV__) {
      warn(
        'Registry.set(string) is deprecated. Please use Registry.set(draft -> newState)',
      );
    }

    const keys = keyPath.replace(/\[(\d+)\]/g, '.$1').split('.');

    if (__DEBUG_LVL__ >= 2 && __BROWSER__) {
      log(`"${keyPath}" = ${JSON.stringify(value)}`);
    }

    // If not a nested keyPath
    if (keys.length === 1) {
      Registry._data[keyPath] = value;
    } else {
      let object = Registry._data[keys[0]];
      for (let i = 1; i < keys.length - 1; i++) {
        object = object[keys[i]];
      }

      object[keys[keys.length - 1]] = value;
    }
  };
};
