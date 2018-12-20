import EventTarget from '../../libs/EventTarget.js';
import initClock from './includes/clock.js';
import extend from '../../../extend.js';

const System = extend(
  {
    version: '2.5.3',
  },
  initClock,
  EventTarget(),
);

System.booted = false;
System.on('boot', () => {
  System.booted = true;
});

System.getVersion = () => System.version;

System.loadView = () => {
  if (System.POS) {
    return Promise.resolve(System.POS);
  }

  return new Promise(res => {
    if (System.booted) {
      return res();
    }

    System.once('boot', res);
  }).then(async () => {
    const { default: POS } = await import('./view/POS.html');

    System.POS = new POS({ target: document.body });
    System.fire('viewLoad');

    return System.POS;
  });
};

export default System;
