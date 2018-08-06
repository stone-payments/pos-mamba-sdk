import extendDriver from '../drivers/extend.js';
import enums from '../drivers/system/enums.js';

const { System } = window;

/** Nullify the original exposed reference */
// window.System = null;
console.log(window.System);
export default extendDriver(System, [enums]);
