import extendDriver from '../drivers/extend.js';
import wrappers from '../drivers/http/wrappers.js';

export default extendDriver(window.$Http, wrappers);
