import MambaStore from './MambaStore.js';
import createStoreMeta from './meta.js';

export default initialData => {
  const store = new MambaStore(initialData);

  /** Store meta data utility helper */
  createStoreMeta(store);

  return store;
};
