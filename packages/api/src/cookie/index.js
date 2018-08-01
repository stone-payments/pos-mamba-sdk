import CookieMock from './mock.js';

let Cookie = window.MbCookie;

if (process.env.NODE_ENV !== 'production') {
  Cookie = window.MbCookie = new CookieMock();
}

if (process.env.NODE_ENV === 'production') {
  if (!Cookie) {
    throw new Error("[@mambasdk/api] 'Cookie' module not found");
  }
}

export default Cookie;
