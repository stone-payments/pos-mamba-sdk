import { log, warn, error } from './libs/utils.js';

const Core = (window.MambaWeb = window.MambaWeb || {}); // eslint-disable-line

Core.log = log;
Core.warn = warn;
Core.error = error;

export default Core;
