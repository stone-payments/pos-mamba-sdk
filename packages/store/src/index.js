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

    /** Locking app related methods */
    lockApp: shouldLock => store.fire('meta:lock', !!shouldLock),
    isAppLocked: () => store.meta.get('locked'),

    /** Closing app related methods */
    closeApp: () => store.fire('meta:close'),
    askOnClose: value => store.meta.set('askOnClose', !!value),
    setOnClose: callback => store.meta.set('onCloseFn', callback),

    /** Method for propagating the app title */
    setTitle: title => {
      store.meta.set('title', title)
      store.fire('meta:title', title)
      document.title = title
    },
  }

  /** Listener for locking the app (prevent backspace usage)  */
  store.on('meta:lock', shouldLock => {
    if (shouldLock) {
      console.log('Locking App')
      Keyboard.disableBackspace()
    } else {
      console.log('Unlocking App')
      Keyboard.enableBackspace()
    }
    store.meta.set('locked', shouldLock)
  })

  /* Listener for Card Insertion */
  store.on('meta:cardInserted', () => {
    store.meta.set('cardInserted', !store.meta.get('cardInserted'))
  })

  return store
}
