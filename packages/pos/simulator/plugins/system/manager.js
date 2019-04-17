import EventTarget from '../../libs/EventTarget.js';
import extend from '../../../extend.js';
import initClock from './includes/clock.js';

const System = extend(
  {
    version: '3.0.1',
  },
  initClock,
  EventTarget(),
);

System.getVersion = () => System.version;

export default System;
