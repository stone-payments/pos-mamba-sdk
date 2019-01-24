import { Store } from 'svelte/store.js';

export default class MambaStore extends Store {
  constructor(data = {}) {
    super(data);
    if (__DEV__) {
      console.warn(
        '@mamba/store is deprecated. Please use the original "svelte/store.js"',
      );
    }
  }
}
