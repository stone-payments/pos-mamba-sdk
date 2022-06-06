import extendDriver from '@mamba/core/index.js';
import wrappers from './wrappers.js';

export default extendDriver(window.$Keyboard, wrappers);
