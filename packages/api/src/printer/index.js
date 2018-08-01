import mock from './mock.js';
import addSharedTo from './shared.js';

let { Printer } = window;

if (process.env.NODE_ENV !== 'production') {
  Printer = window.Printer = {};
  mock(Printer);
  addSharedTo(Printer);
}

if (process.env.NODE_ENV === 'production') {
  addSharedTo(Printer);
}

export default Printer;
