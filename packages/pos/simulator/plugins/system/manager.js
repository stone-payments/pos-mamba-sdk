import EventTarget from '../../libs/EventTarget.js';
import extend from '../../../extend.js';
import initClock from './includes/clock.js';

const System = extend(
  {
    _version: '2.5.3',
  },
  initClock,
  EventTarget(),
);

System.getVersion = () => System._version;

export default System;
