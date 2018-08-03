import mock from './mock.js';

const PaymentApp = window.PaymentApp || {};

/** For development environment */
if (process.env.APP_ENV !== 'pos') {
  mock(PaymentApp);
}

/** Nullify the original exposed reference */
window.PaymentApp = null;

export default PaymentApp;
