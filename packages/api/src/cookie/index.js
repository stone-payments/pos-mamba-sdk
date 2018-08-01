import mock from './mock.js';

const Cookie = window.MbCookie || {};

if (process.env.NODE_ENV !== 'production') {
  mock(Cookie);
}

/** Nullify the original exposed reference */
window.MbCookie = null;

export default Cookie;
