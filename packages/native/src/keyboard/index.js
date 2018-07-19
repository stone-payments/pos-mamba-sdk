import mock from './mock.js';
import addSharedTo from './shared.js';

let { Keyboard } = window;

/** For development environment */
if (process.env.NODE_ENV !== 'production') {
  Keyboard = window.Keyboard = {};
  mock(Keyboard);
  addSharedTo(Keyboard);
}

/** For production environment */
if (process.env.NODE_ENV === 'production') {
  addSharedTo(Keyboard);
}

/** Remove the window Keyboard reference */
// window.Keyboard = undefined

export default Keyboard;
