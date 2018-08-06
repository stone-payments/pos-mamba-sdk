import extendDriver from '../drivers/extend.js';
import common from '../drivers/printer/common.js';

const { Printer } = window;

/** Nullify the original exposed reference */
window.Printer = null;

export default extendDriver(Printer, [common]);
