import extendDriver from '../drivers/extend.js';
import systemWrappers from '../drivers/system/wrappers.js';
import enums from '../drivers/system/enums.js';

export default extendDriver(window.$System, systemWrappers, enums);
