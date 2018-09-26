import MambaStore from './MambaStore.js';

export default initialData => {
  const store = new MambaStore(initialData);
  return store;
};
