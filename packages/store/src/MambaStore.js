import { Store } from 'svelte/store'
import { setDeep, getDeep } from 'svelte-extras'

const LOCAL_STORAGE_KEY = 'MambaStore'

/** Initial data that overrides local storage */
const APP_META_DATA = {
  __meta__: {
    locked: false,
    shortcuts: true,
  },
}

export default class MambaStore extends Store {
  constructor(data) {
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

  /**
   * Set a promise to a property and, when its resolved,
   * set the same property to its resolved value
   *
   * Use transformers to modify the resolved data before setting it to the store.
   * */
  setPromise(promiseProps, transformers) {
    for (const prop in promiseProps) {
      this.set({
        [prop]: Promise.resolve(promiseProps[prop])
          .then(data => {
            if (typeof transformers[prop] === 'function') {
              data = transformers[prop](data)
            }
            this.set({ [prop]: data })
          })
          .catch(e => {
            console.error(`[MambaStore] Promise error: ${e}`)
            this.set({ [prop]: null })
          }),
      })
    }
  }
}

MambaStore.prototype.setDeep = setDeep
MambaStore.prototype.getDeep = getDeep
