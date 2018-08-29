/** Initial data that overrides local storage */
export const INITIAL_META_DATA = {
  __meta__: {
    /** Define if the user can change the current page (back and home) */
    locked: false,
    /** Define if keyboard shortcuts are active */
    shortcuts: true,
    /** Define if a confirmation dialog should appear when the app is closing */
    askOnClose: false,
    /** Custom callback to be fired before the app closes */
    onCloseFn: null,
  },
};

export default function createStoreMeta(store) {
  const meta = {
    /** Set deep for meta data */
    set: (path = '', value) => {
      if (__DEV__) {
        console.log(`[@mamba/store] Setting meta "${path}" to "${value}"`);
      }
      store.setDeep(`__meta__.${path}`, value);
    },

    /** Get deep for meta data */
    get: (path = '') =>
      store.getDeep(`__meta__${path.length ? `.${path}` : ''}`),

    /** Encapsulate meta:event related calls */
    on: (event, handler) => store.on(`meta:${event}`, handler),
    fire: (event, value) => store.fire(`meta:${event}`, value),

    /** Locking app related methods */
    lockApp: shouldLock => meta.set('locked', !!shouldLock),
    isAppLocked: () => meta.get('locked'),

    /** Closing app related methods */
    closeApp: () => meta.fire('close'),
    askOnClose: value => meta.set('askOnClose', !!value),
    setOnClose: callback => meta.set('onCloseFn', callback),
  };

  store.meta = meta;
}
