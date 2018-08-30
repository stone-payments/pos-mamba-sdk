export const NAMESPACE = 'MbStorage';

export function setup(Storage) {
  /**
   * Stores a key pair value using local storage
   * @param {string} key Key name
   * @param {string} value Value
   * @memberof Storage
   */
  Storage.set = (key, value) => {
    localStorage.setItem(key, value);
    return true;
  };

  /**
   * Get a value by its key
   * @param {string} key Returns the value associated by its key or an empty string if not found.
   * @memberof Storage
   */
  Storage.get = key => localStorage.getItem(key) || '';

  /**
   * Clear all the values at the local storage.
   * @memberof Storage
   */
  Storage.clear = () => {
    localStorage.clear();
    return true;
  };
}
