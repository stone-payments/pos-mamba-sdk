import extendDriver from '../drivers/extend.js';
import common from '../drivers/payment/common.js';

export default extendDriver(window.Payment, [common]);
