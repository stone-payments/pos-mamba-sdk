import addSharedWrapper from '../drivers/printer/shared.js';

const { Printer } = window;

addSharedWrapper(Printer);

/** Nullify the original exposed reference */
window.Printer = null;

export default Printer;
