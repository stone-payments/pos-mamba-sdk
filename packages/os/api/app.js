import addSharedWrapper from '../drivers/app/shared.js';

const { App } = window;

addSharedWrapper(App);

/** Nullify the original exposed reference */
window.App = null;

export default App;
