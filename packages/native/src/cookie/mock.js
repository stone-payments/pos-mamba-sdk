export default class Cookie {
  set (key, value) {
    localStorage.setItem(key, value)
    return true
  }

  get (key) {
    return localStorage.getItem(key) || ''
  }

  clear () {
    localStorage.clear()
    return true
  }
}
