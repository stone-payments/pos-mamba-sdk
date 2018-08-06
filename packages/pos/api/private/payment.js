import extendDriver from '../../drivers/extend.js';

const { PaymentApp } = window;

/** Nullify the original exposed reference */
window.PaymentApp = null;

export default extendDriver(PaymentApp);
