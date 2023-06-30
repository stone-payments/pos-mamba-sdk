import produce, { applyPatches } from 'immer';
import { warn } from '../../../libs/utils.js';

let cachedGet = null;
let cachedParsed = {};

export default (Registry) => {
  if (!localStorage) {
    if (__DEV__) {
      warn('Could not load persistent Registry data because "localStorage" was not found');
    }
    Registry.persistent = { get() {}, set() {} };
  } else {
    Registry.persistent = {
      get() {
        const persistedData = localStorage.getItem('_mamba_persistent_');

        if (persistedData !== cachedGet) {
          cachedGet = persistedData;
          cachedParsed = JSON.parse(cachedGet);
        }

        return cachedParsed || {};
      },
      set(fn) {
        if (typeof fn === 'function') {
          const changes = [];
          const persistentData = Registry.persistent.get();

          produce(persistentData, fn, (patches) => {
            changes.push(...patches);
          });

          localStorage.setItem(
            '_mamba_persistent_',
            JSON.stringify(applyPatches(persistentData, changes)),
          );

          Registry.fire('persistentDataChanged', changes);
        }
      },
    };
  }
};
