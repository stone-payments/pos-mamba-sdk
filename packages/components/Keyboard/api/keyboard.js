import extendDriver from '@mamba/core';
import wrappers from './wrappers.js';

export default extendDriver(window.$Keyboard, wrappers);
