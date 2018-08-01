import mock from './mock.js';
import addSharedTo from './shared.js';

const Payment = window.Payment || {};

/** For development environment */
if (process.env.NODE_ENV !== 'production') {
  addSharedTo(Payment);
  mock(Payment);
}

/** For production environment */
if (process.env.NODE_ENV === 'production') {
  addSharedTo(Payment);
}

/** Nullify the original exposed reference */
window.Payment = null;

export default Payment;
