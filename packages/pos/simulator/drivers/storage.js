export const NAMESPACE = '$Storage';

export function setup(Storage) {
  /* eslint-disable no-return-assign */
  const STORAGE = window.localStorage || {
    _data: {},
    setItem: (id, val) => (STORAGE._data[id] = val.toString()),
    getItem: (id) => STORAGE._data[id], // eslint-disable-line
    removeItem: (id) => delete STORAGE._data[id],
    clear: () => (STORAGE._data = {}), // eslint-disable-line
  };
  /* eslint-enable no-return-assign */

  /**
   * Stores a key pair value using local storage
   * @param {string} key Key name
   * @param {string} value Value
   * @memberof Storage
   */
  Storage.set = (key, value) => {
    STORAGE.setItem(key, value);
    return true;
  };

  /**
   * Get a value by its key
   * @param {string} key Returns the value associated by its key or an empty string if not found.
   * @memberof Storage
   */
  Storage.get = (key) => STORAGE.getItem(key) || '';

  /**
   * Clear all the values at the local storage.
   * @memberof Storage
   */
  Storage.clear = () => {
    STORAGE.clear();
    return true;
  };
}
