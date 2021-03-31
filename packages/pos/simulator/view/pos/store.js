import { Store } from 'svelte/store.js';
import { getPosModel } from '@mamba/utils';
import { Registry } from '../../index.js';
console.log(Registry.persistent.get().$Device.device);

export const INITIAL_DATA = {
  ACTIVE_MODEL: Registry.persistent.get().$System.model,
};

const store = new Store(INITIAL_DATA);

store.setDevice = model => {
  Registry.persistent.set(draft => {
    draft.$System.model = model;
  });
  store.set({ ACTIVE_MODEL: model });
};


if (__DEV__) {
  window.__store__ = store;
}

export default store;
