import mock from './mock.js';
import addSharedTo from './shared.js';

const System = window.System || {};

/** For development environment */
if (process.env.NODE_ENV !== 'production') {
  addSharedTo(System);
  mock(System);
}

/** For production environment */
if (process.env.NODE_ENV === 'production') {
  addSharedTo(System);
}

/** Nullify the original exposed reference */
window.System = null;

export default System;
