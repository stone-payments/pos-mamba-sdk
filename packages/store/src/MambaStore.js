import { Store } from 'svelte/store'
import { setDeep, getDeep } from 'svelte-extras'

const LOCAL_STORAGE_KEY = 'MambaStore'

/** Initial data that overrides local storage */
const APP_META_DATA = {
  __meta__: {
    title: 'Mamba App',
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
  promisedSet(promiseProps, transformers) {
    const sets = {}
    for (const prop in promiseProps) {
      sets[prop] = Promise.resolve(promiseProps[prop]).then(data => {
        this.set({
          [prop]:
            typeof transformers[prop] === 'function'
              ? transformers[prop](data)
              : data,
        })
      })
    }
    this.set(sets)
  }

  setTitle(title) {
    this.setDeep('__meta__.title', title)
    this.fire('meta:title', title)
    document.title = title
  }
}

MambaStore.prototype.setDeep = setDeep
MambaStore.prototype.getDeep = getDeep
