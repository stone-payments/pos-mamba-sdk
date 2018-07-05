export default store => {
  store.meta = {
    /** Set deep for meta data */
    set: (path = '', value) =>
      store.setDeep(`__meta__${path.length ? '.' + path : ''}`, value),

    /** Get deep for meta data */
    get: (path = '') =>
      store.getDeep(`__meta__${path.length ? '.' + path : ''}`),

    /** Encapsulate meta:event related calls */
    on: (event, handler) => store.on(`meta:${event}`, handler),
    fire: (event, value) => store.fire(`meta:${event}`, value),

    /** Locking app related methods */
    lockApp: shouldLock => store.meta.set('locked', !!shouldLock),
    isAppLocked: () => store.meta.get('locked'),

    /** Closing app related methods */
    closeApp: () => store.meta.fire('close'),
    askOnClose: value => store.meta.set('askOnClose', !!value),
    setOnClose: callback => store.meta.set('onCloseFn', callback),

    /** Method for propagating the app title */
    setTitle: title => {
      store.meta.set('title', title)
      store.meta.fire('title', title)
      document.title = title
    },
  }
}
