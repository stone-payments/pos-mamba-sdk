import extendDriver from '../drivers/extend.js';
import common from '../drivers/http/common.js';

export default extendDriver(window.$Http, [common]);
