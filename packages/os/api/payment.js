import addSharedWrapper from '../drivers/payment/shared.js';

const { Payment } = window;

addSharedWrapper(Payment);

/** Nullify the original exposed reference */
window.Payment = null;

export default Payment;
