import mock from './mock.js';
import addSharedTo from './shared.js';

const Printer = window.Printer || {};

if (process.env.NODE_ENV !== 'production') {
  mock(Printer);
  addSharedTo(Printer);
}

if (process.env.NODE_ENV === 'production') {
  addSharedTo(Printer);
}

/** Nullify the original exposed reference */
window.Printer = null;

export default Printer;
