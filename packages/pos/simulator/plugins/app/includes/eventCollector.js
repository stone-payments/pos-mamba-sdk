/**
 * This file overrides the default add/remove event listeners to collect possible loose ones
 * when unlisten them when the current app closes.
 */
const getExternalTargetName = node => {
  if (node === window) return 'window';
  if (node === document) return 'document';
  return null;
};

export default AppManager => {
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  const originalRemoveEventListener = EventTarget.prototype.removeEventListener;

  EventTarget.prototype.addEventListener = function addEventListener(
    type,
    fn,
    capture,
  ) {
    originalAddEventListener.call(this, type, fn, capture);

    const currentApp = AppManager.getCurrentApp();

    /** Only collect events if there's an app running */
    if (currentApp && currentApp.runtime) {
      const targetNode = getExternalTargetName(this);

      if (targetNode) {
        const { collectedEvents } = currentApp.runtime;
        if (!collectedEvents[targetNode]) {
          collectedEvents[targetNode] = {};
        }

        if (!collectedEvents[targetNode][type]) {
          collectedEvents[targetNode][type] = [];
        }

        collectedEvents[targetNode][type].push(fn);
      }
    }
  };

  EventTarget.prototype.removeEventListener = function addEventListener(
    type,
    fn,
  ) {
    originalRemoveEventListener.call(this, type, fn);

    const currentApp = AppManager.getCurrentApp();

    /** Only remove collected events if an app is opened */
    if (currentApp && currentApp.runtime) {
      const targetName = getExternalTargetName(this);

      if (targetName) {
        const { collectedEvents } = currentApp.runtime;
        if (collectedEvents[targetName][type]) {
          const fnIndex = collectedEvents[targetName][type].indexOf(fn);

          if (fnIndex > -1) {
            collectedEvents[targetName][type].splice(fnIndex, 1);
          }

          if (!collectedEvents[targetName][type].length) {
            delete collectedEvents[targetName][type];
          }
        }
      }
    }
  };
};
