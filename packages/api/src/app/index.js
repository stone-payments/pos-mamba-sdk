import mock from './mock.js';
import addSharedTo from './shared.js';

const App = window.App || {};

if (process.env.APP_ENV !== 'pos') {
  mock(App);
  addSharedTo(App);
}

if (process.env.APP_ENV === 'pos') {
  addSharedTo(App);
}

/** Nullify the original exposed reference */
window.App = null;

export default App;
