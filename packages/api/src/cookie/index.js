import mock from './mock.js';

const Cookie = window.MbCookie || {};

if (process.env.APP_ENV !== 'pos') {
  mock(Cookie);
}

/** Nullify the original exposed reference */
window.MbCookie = null;

export default Cookie;
