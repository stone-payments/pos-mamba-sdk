import Keyboard from '@mamba/native/keyboard'
import MambaStore from './MambaStore'

export default initialData => {
  const store = new MambaStore(initialData)

  /** Store meta data utility helper */
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
    lockApp: shouldLock => store.meta.fire('lock', !!shouldLock),
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

  /** Listener for locking the app (prevent backspace usage)  */
  store.meta.on('lock', shouldLock => {
    if (shouldLock) {
      console.log('Locking App')
      Keyboard.disableBackspace()
    } else {
      console.log('Unlocking App')
      Keyboard.enableBackspace()
    }
    store.meta.set('locked', shouldLock)
  })

  return store
}
