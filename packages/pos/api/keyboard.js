import extendDriver from '../drivers/extend.js';
import common from '../drivers/keyboard/common.js';

const { Keyboard } = window;

/** Nullify the original exposed reference */
window.Keyboard = null;

export default extendDriver(Keyboard, [common]);
