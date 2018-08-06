import addNativeWrapper from '../drivers/http/native.js';

const { $Http } = window;

addNativeWrapper($Http);

/** Nullify the original exposed reference */
window.$Http = null;

export default $Http;
