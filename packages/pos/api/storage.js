import extendDriver from '../drivers/extend.js';
import storageWrappers from '../drivers/storage/wrappers.js';

export default extendDriver(window.$Storage, storageWrappers);
