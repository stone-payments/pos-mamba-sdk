/**
 * @namespace Cookie
 */

export default class Cookie {
  /**
   * Stores a key pair value using local storage
   * @param {string} key Key name
   * @param {string} value Value
   * @memberOf Cookie
   */

  set(key, value) {
    localStorage.setItem(key, value)
    return true
  }

  /**
   * Get a value by its key
   * @param {string} key Returns the value associated by its key or an empty string if not found.
   * @memberOf Cookie
   */

  get(key) {
    return localStorage.getItem(key) || ''
  }

  /**
   * Clear all the values at the local storage.
   * @memberOf Cookie
   */

  clear() {
    localStorage.clear()
    return true
  }
}
