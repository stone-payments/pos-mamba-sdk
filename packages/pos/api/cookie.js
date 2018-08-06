import extendDriver from '../drivers/extend.js';

const { MbCookie } = window;

/** Nullify the original exposed reference */
window.MbCookie = null;

export default extendDriver(MbCookie);
