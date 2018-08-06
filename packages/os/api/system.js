import addEnums from '../drivers/system/enums.js';

const { System } = window;

addEnums(System);

/** Nullify the original exposed reference */
window.System = null;

export default System;
