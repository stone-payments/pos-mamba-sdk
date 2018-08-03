import mock from './mock.js';
import addSharedTo from './shared.js';

const Printer = window.Printer || {};

if (process.env.APP_ENV !== 'pos') {
  mock(Printer);
  addSharedTo(Printer);
}

if (process.env.APP_ENV === 'pos') {
  addSharedTo(Printer);
}

/** Nullify the original exposed reference */
window.Printer = null;

export default Printer;
