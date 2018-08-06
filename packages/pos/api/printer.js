import extendDriver from '../drivers/extend.js';
import common from '../drivers/printer/common.js';

export default extendDriver(window.Printer, [common]);
