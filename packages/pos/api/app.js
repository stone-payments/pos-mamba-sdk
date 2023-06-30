import extendDriver from '../drivers/extend.js';
import wrappers from '../drivers/app/wrappers.js';

export default extendDriver(window.$App, wrappers);
