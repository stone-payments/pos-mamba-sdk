import extendDriver from '../drivers/extend.js';
import wrappers from '../drivers/printer/wrappers.js';

export default extendDriver(window.$Printer, wrappers);
