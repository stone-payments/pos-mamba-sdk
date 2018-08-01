import mock from './mock.js';
import addSharedTo from './shared.js';

const PaymentApp = window.PaymentApp || {};

/** For development environment */
if (process.env.NODE_ENV !== 'production') {
  addSharedTo(PaymentApp);
  mock(PaymentApp);
}

/** For production environment */
if (process.env.NODE_ENV === 'production') {
  addSharedTo(PaymentApp);
}

/** Nullify the original exposed reference */
window.PaymentApp = null;

export default PaymentApp;
