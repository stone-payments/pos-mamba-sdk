export default function (Cookie) {
  Object.assign(Cookie, {
    /**
     * Stores a key pair value using local storage
     * @param {string} key Key name
     * @param {string} value Value
     * @memberof Cookie
     */
    set: (key, value) => {
      localStorage.setItem(key, value);
      return true;
    },

    /**
     * Get a value by its key
     * @param {string} key Returns the value associated by its key or an empty string if not found.
     * @memberof Cookie
     */
    get: key => localStorage.getItem(key) || '',

    /**
     * Clear all the values at the local storage.
     * @memberof Cookie
     */
    clear: () => {
      localStorage.clear();
      return true;
    },
  });
}
