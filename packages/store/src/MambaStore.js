import { Store } from 'svelte/store.js';
import { setDeep, getDeep } from 'svelte-extras';

const LOCAL_STORAGE_KEY = 'MambaStore';

export default class MambaStore extends Store {
  constructor(data = {}) {
    /** Get persisted data from localStorage if available */
    if (__DEV__ && localStorage) {
      const persistedStore = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (persistedStore != null) {
        /** Get persisted data */
        data = Object.assign({}, JSON.parse(persistedStore), data);
      }
    }

    /** Initialize the actual store */
    super(data);

    /** Persist store changes to localStorage */
    if (__DEV__ && localStorage) {
      this.on('state', ({ current }) => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
      });
    }
  }
}
MambaStore.prototype.setDeep = setDeep;
MambaStore.prototype.getDeep = getDeep;
