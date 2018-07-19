import mock from './mock.js';
import addSharedTo from './shared.js';

let { System } = window;

/** For development environment */
if (process.env.NODE_ENV !== 'production') {
  System = window.System = {};
  addSharedTo(System);
  mock(System);
}

/** For production environment */
if (process.env.NODE_ENV === 'production') {
  addSharedTo(System);
}

/** Remove the window System reference */
// window.System = undefined

export default System;
