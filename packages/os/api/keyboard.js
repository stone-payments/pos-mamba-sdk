import addSharedWrapper from '../drivers/keyboard/shared.js';

const { Keyboard } = window;

addSharedWrapper(Keyboard);

/** Nullify the original exposed reference */
window.Keyboard = null;

export default Keyboard;
