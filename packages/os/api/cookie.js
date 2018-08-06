const { MbCookie } = window;

/** Nullify the original exposed reference */
window.MbCookie = null;

export default MbCookie;
