import extendDriver from '../drivers/extend.js';
import common from '../drivers/payment/common.js';

const { Payment } = window;

/** Nullify the original exposed reference */
window.Payment = null;

export default extendDriver(Payment, [common]);
