import extendDriver from '../drivers/extend.js';
import wrappers from '../drivers/keyboard/wrappers.js';

export default extendDriver(window.$Keyboard, wrappers);
