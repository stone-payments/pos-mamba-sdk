import extendDriver from '../drivers/extend.js';

const { MbMerchant } = window;

/** Nullify the original exposed reference */
window.MbMerchant = null;

export default extendDriver(MbMerchant);
