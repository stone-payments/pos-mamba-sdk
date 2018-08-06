import extendDriver from '../drivers/extend.js';
import common from '../drivers/http/common.js';

const { $Http } = window;

/** Nullify the original exposed reference */
window.$Http = null;

export default extendDriver($Http, [common]);
