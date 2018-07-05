import { Store } from 'svelte/store'
import { setDeep, getDeep } from 'svelte-extras'

const LOCAL_STORAGE_KEY = 'MambaStore'

/** Initial data that overrides local storage */
const APP_META_DATA = {
  __meta__: {
    /** Default app title. Used internally by <AppBar/> */
    title: 'Mamba App',
    /** Define if the user can change the current page (back and home) */
    locked: false,
    /** Define if keyboard shortcuts are active */
    shortcuts: true,
    /** Define if a confirmation dialog should appear when the app is closing */
    askOnClose: false,
    /** Custom callback to be fired before the app closes */
    onCloseFn: null,
    /** Define the card current state */
    cardInserted: false,
  },
}

export default class MambaStore extends Store {
  constructor(data = {}) {
    /** Get persisted data from localStorage if available */
    if (localStorage) {
      const persistedStore = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (persistedStore != null) {
        /** Get persisted data */
        data = Object.assign({}, JSON.parse(persistedStore))
      }
    }

    /** Initialize the app meta data */
    Object.assign(data, APP_META_DATA)

    /** Initialize the actual store */
    super(data)

    /** Persist store changes to localStorage */
    if (localStorage) {
      this.on('state', ({ current }) => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current))
      })
    }
  }
}
MambaStore.prototype.setDeep = setDeep
MambaStore.prototype.getDeep = getDeep
