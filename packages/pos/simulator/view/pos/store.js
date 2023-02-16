import { Store } from 'svelte/store.js';
import { AVAILABLE_SLUGS, MODELS } from '@mamba/utils/models.js';
import { Registry } from '../../index.js';

let selectedModel = Registry.persistent.get().$System.model || MODELS.S920;

try {
  if (__PLATFORM__ !== MODELS.GENERIC) {
    selectedModel = MODELS[__PLATFORM__];
  }
} catch (_) {
  //
}

export const INITIAL_DATA = {
  ACTIVE_MODEL: selectedModel,
};

const store = new Store(INITIAL_DATA);

store.setPosModel = (model) => {
  Registry.persistent.set((draft) => {
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
