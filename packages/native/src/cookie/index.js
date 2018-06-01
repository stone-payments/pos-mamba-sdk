import CookieMock from './mock.js'

let Cookie = window.MbCookie

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  Cookie = window.MbCookie = new CookieMock()
}

if (process.env.NODE_ENV === 'production') {
  if (!Cookie) {
    throw new Error("[@mamba/native] 'Cookie' module not found")
  }
}

export default Cookie
