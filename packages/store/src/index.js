import MambaStore from './MambaStore.js';
import initAppMeta from './meta.js';

export default (initialData) => {
  const store = new MambaStore(initialData);

  /** Store meta data utility helper */
  initAppMeta(store);

  return store;
};
