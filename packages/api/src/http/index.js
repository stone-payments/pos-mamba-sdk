import mock from './mock.js';
import extendNative from './native.js';

const Http = window.$Http || {};

/** For development environment */
if (process.env.NODE_ENV !== 'production') {
  mock(Http);
}

/** For production environment */
if (process.env.NODE_ENV === 'production') {
  extendNative(Http);
}

/** Nullify the original exposed reference */
window.$Http = null;

export default Http;
