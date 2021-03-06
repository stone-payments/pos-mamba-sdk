import { Store } from 'svelte/store.js';
import { AVAILABLE_SLUGS } from '@mamba/utils';
import { Registry } from '../../index.js';

export const INITIAL_DATA = {
  ACTIVE_MODEL: Registry.persistent.get().$System.model,
};

const store = new Store(INITIAL_DATA);

store.setPosModel = model => {
  Registry.persistent.set(draft => {
    draft.$System.model = model;
  });
  store.set({
    ACTIVE_MODEL: model,
    ACTIVE_MODEL_SLUG: AVAILABLE_SLUGS[model],
  });
};

if (__DEV__) {
  window.__store__ = store;
}

export default store;
