import { log } from '../../../libs/utils.js';

export default AppManager => {
  const originalAddEventListener = EventTarget.prototype.addEventListener;

  EventTarget.prototype.addEventListener = function addEventListener(
    type,
    fn,
    capture,
  ) {
    originalAddEventListener.call(this, type, fn, capture);

    const currentApp = AppManager.getCurrentApp();
    if (currentApp && currentApp.runtime) {
      if (__DEBUG_LVL__ >= 3) {
        log('Collecting DOM event listener: ');
        console.log([this, type, fn]);
      }
      currentApp.runtime.collectedEvents.push([this, type, fn]);
    }
  };
};
