/* eslint-disable no-underscore-dangle */
import { writable } from 'svelte/store';
import { AVAILABLE_SLUGS, MODELS } from '@mamba/device';
import { Registry } from '../../index.js';

let selectedModel = Registry.persistent.get().$System.model || MODELS.S920;

try {
  if (__PLATFORM__ !== MODELS.GENERIC) {
    selectedModel = MODELS[__PLATFORM__];
  }
} catch (_) {
  //
}

const INITIAL_DATA = {
  ACTIVE_MODEL: selectedModel,
};

const { set, subscribe } = writable(INITIAL_DATA);

const setPosModel = (model) => {
  Registry.persistent.set((draft) => {
    draft.$System.model = model;
  });

  set({
    ACTIVE_MODEL: model,
    ACTIVE_MODEL_SLUG: AVAILABLE_SLUGS[model],
  });
};

if (__DEV__) {
  window.__store__ = {
    subscribe,
    set,
    setPosModel,
  };
}

export const store = {
  subscribe,
  set,
  setPosModel,
};
