import extendDriver from '../drivers/extend.js';
import common from '../drivers/keyboard/common.js';

export default extendDriver(window.Keyboard, [common]);
