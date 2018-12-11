import { log } from '../../../libs/utils.js';

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
    return value;
  };

  Registry.set = (keyPath, value, fireSignal = true) => {
    if (keyPath === undefined) {
      return;
    }

    const keys = keyPath.replace(/\[(\d+)\]/g, '.$1').split('.');
    const lastKey = keys.pop();

    if (__DEBUG_LVL__ >= 2 && __BROWSER__) {
      log(`"${keyPath}" = ${JSON.stringify(value)}`);
    }

    // If not a nested keyPath
    if (keys[0] === undefined) {
      Registry._data[lastKey] = value;
    } else {
      let object = Registry._data[keys[0]];
      for (let i = 1; i < keys.length; i++) {
        object = object[keys[i]];
      }
      object[lastKey] = value;
    }

    if (fireSignal) {
      Registry.settingsChanged(Registry._data);
    }
  };
};
