import mock from './mock.js';
import addSharedTo from './shared.js';

const App = window.App || {};

if (process.env.NODE_ENV !== 'production') {
  mock(App);
  addSharedTo(App);
}

if (process.env.NODE_ENV === 'production') {
  addSharedTo(App);
}

/** Nullify the original exposed reference */
window.App = null;

export default App;
