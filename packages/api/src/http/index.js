import mock from './mock.js';
import extendNative from './native.js';

const Http = window.$Http || {};

/** For development environment */
if (process.env.APP_ENV !== 'pos') {
  mock(Http);
}

/** For production environment */
if (process.env.APP_ENV === 'pos') {
  extendNative(Http);
}

/** Nullify the original exposed reference */
window.$Http = null;

export default Http;
