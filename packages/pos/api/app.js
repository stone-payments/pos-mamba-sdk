import extendDriver from '../drivers/extend.js';
import common from '../drivers/app/common.js';

export default extendDriver(window.App, [common]);
