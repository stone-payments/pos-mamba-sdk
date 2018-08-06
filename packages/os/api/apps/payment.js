const { PaymentApp } = window;

/** Nullify the original exposed reference */
window.PaymentApp = null;

export default PaymentApp;
