import mock from './mock.js';

const PaymentApp = window.PaymentApp || {};

/** For development environment */
if (process.env.NODE_ENV !== 'production') {
  mock(PaymentApp);
}

/** Nullify the original exposed reference */
window.PaymentApp = null;

export default PaymentApp;
