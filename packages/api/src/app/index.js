import mock from './mock.js';
import addSharedTo from './shared.js';

let { App } = window;

if (process.env.NODE_ENV !== 'production') {
  App = window.App = {};
  mock(App);
  addSharedTo(App);
}

if (process.env.NODE_ENV === 'production') {
  addSharedTo(App);
}

export default App;
