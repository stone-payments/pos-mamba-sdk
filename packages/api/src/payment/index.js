import mock from './mock.js';
import addSharedTo from './shared.js';

const Payment = window.Payment || {};

/** For development environment */
if (process.env.APP_ENV !== 'pos') {
  addSharedTo(Payment);
  mock(Payment);
}

/** For production environment */
if (process.env.APP_ENV === 'pos') {
  addSharedTo(Payment);
}

/** Nullify the original exposed reference */
window.Payment = null;

export default Payment;
