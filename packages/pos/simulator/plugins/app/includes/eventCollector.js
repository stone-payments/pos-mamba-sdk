/**
 * This file overrides the default add/remove event listeners to collect possible loose ones
 * when unlisten them when the current app closes.
 */

export default AppManager => {
  const eventTarget =
    typeof window.EventTarget !== 'undefined'
      ? window.EventTarget
      : window.Node;

  const originalAddEventListener = eventTarget.prototype.addEventListener;
  const originalRemoveEventListener = eventTarget.prototype.removeEventListener;

  eventTarget.prototype.addEventListener = function addEventListener(
    type,
    fn,
    capture,
  ) {
    originalAddEventListener.call(this, type, fn, capture);

    const currentApp = AppManager.getCurrentApp();

    /** Only collect events if there's an app running */
    if (currentApp && currentApp.runtime) {
      const targetConstructor = this.constructor.name;

      if (
        targetConstructor === 'Window' ||
        targetConstructor === 'HTMLDocument'
      ) {
        const { collectedEvents } = currentApp.runtime;
        if (!collectedEvents[targetConstructor]) {
          collectedEvents[targetConstructor] = {};
        }

        if (!collectedEvents[targetConstructor][type]) {
          collectedEvents[targetConstructor][type] = [];
        }

        collectedEvents[targetConstructor][type].push(fn);
      }
    }
  };

  eventTarget.prototype.removeEventListener = function addEventListener(
    type,
    fn,
  ) {
    originalRemoveEventListener.call(this, type, fn);

    const currentApp = AppManager.getCurrentApp();

    /** Only remove collected events if an app is opened */
    if (currentApp && currentApp.runtime) {
      const targetConstructor = this.constructor.name;

      if (
        targetConstructor === 'Window' ||
        targetConstructor === 'HTMLDocument'
      ) {
        const { collectedEvents } = currentApp.runtime;
        if (collectedEvents[targetConstructor][type]) {
          const fnIndex = collectedEvents[targetConstructor][type].indexOf(fn);

          if (fnIndex > -1) {
            collectedEvents[targetConstructor][type].splice(fnIndex, 1);
          }

          if (!collectedEvents[targetConstructor][type].length) {
            delete collectedEvents[targetConstructor][type];
          }
        }
      }
    }
  };
};
