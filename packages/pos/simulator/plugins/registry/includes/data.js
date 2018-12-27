import produce, { setAutoFreeze } from 'immer';

import { log, deepCopy } from '../../../libs/utils.js';

setAutoFreeze(false);

export default Registry => {
  Registry.save = () => {
    // todo: we can't save everything. some things are dynamic and should be always reseted
    // localStorage.setItem('_mamba_web_', JSON.stringify(Registry._data));
  };

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
      return deepCopy(value);
    }

    return value;
  };

  Registry.set = (keyPath, value, opts) => {
    if (keyPath === undefined) {
      return;
    }

    if (typeof keyPath === 'function') {
      opts = value;
    }

    opts = { dispatch: true, save: true, ...opts };

    const { dispatch, save } = opts;

    if (typeof keyPath === 'function') {
      Registry._data = produce(Registry._data, keyPath);
      if (save) {
        Registry.save();
      }
      return;
    }

    const keys = keyPath.replace(/\[(\d+)\]/g, '.$1').split('.');

    if (__DEBUG_LVL__ >= 2 && __BROWSER__) {
      log(`"${keyPath}" = ${JSON.stringify(value)}`);
    }

    // If not a nested keyPath
    if (keys.length === 1) {
      Registry._data[keyPath] = value;

      if (dispatch) {
        // todo: deprecate in favor of immer
        Registry.fire('shallowChange', { key: keyPath, value });
      }
    } else {
      let object = Registry._data[keys[0]];
      for (let i = 1; i < keys.length - 1; i++) {
        object = object[keys[i]];
      }

      object[keys[keys.length - 1]] = value;

      if (dispatch) {
        // todo: deprecate in favor of immer
        Registry.fire('deepChange', { key: keyPath, path: keys, value });
      }
    }

    if (save) {
      Registry.save();
    }
  };
};
