import extendDriver from '../drivers/extend.js';
import common from '../drivers/app/common.js';

const { App } = window;

/** Nullify the original exposed reference */
window.App = null;

export default extendDriver(App, [common]);
