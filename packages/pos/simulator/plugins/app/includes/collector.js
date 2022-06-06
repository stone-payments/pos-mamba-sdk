import { log } from '../../../libs/utils.js';

/**
 * This file overrides the default add/remove event listeners to collect possible loose ones
 * when unlisten them when the current app closes.
 */
const eventTarget = typeof window.EventTarget !== 'undefined' ? window.EventTarget : window.Node;

const originalAddEventListener = eventTarget.prototype.addEventListener;
const originalRemoveEventListener = eventTarget.prototype.removeEventListener;

/**
 * Register a global event information in the runtime object of an app
 * Map signature: constructorName -> { eventName -> callbackList }
 * */
const collectEvent = ({ runtime }, [node, type, fn]) => {
  const tName = node.constructor.name;

  if (tName === 'Window' || tName === 'HTMLDocument') {
    const { collectedEvents } = runtime;
    if (!collectedEvents[tName]) {
      collectedEvents[tName] = {};
    }

    if (!collectedEvents[tName][type]) {
      collectedEvents[tName][type] = [];
    }

    collectedEvents[tName][type].push(fn);
  }
};

/**
 * Remove a global event information from an app's runtime object
 * */
const removeCollectedEvent = ({ runtime }, [node, type, fn]) => {
  const tName = node.constructor.name;

  if (tName === 'Window' || tName === 'HTMLDocument') {
    const { collectedEvents } = runtime;
    if (collectedEvents[tName][type]) {
      const fnIndex = collectedEvents[tName][type].indexOf(fn);

      if (fnIndex > -1) {
        collectedEvents[tName][type].splice(fnIndex, 1);
      }

      if (!collectedEvents[tName][type].length) {
        delete collectedEvents[tName][type];
      }
    }
  }
};

/**
 * Helper to get an array of collected events from an app's runtime object
 * */
const getCollectedEvents = ({ runtime }) =>
  Object.keys(runtime.collectedEvents).reduce((acc, targetConstructor) => {
    let node;

    if (targetConstructor === 'Window') node = window;
    else if (targetConstructor === 'HTMLDocument') node = document;
    else return;

    Object.entries(runtime.collectedEvents[targetConstructor]).forEach(([eventType, eventList]) => {
      eventList.forEach((fn) => {
        acc.push([node, eventType, fn]);
      });
    });

    return acc;
  }, []);

export default (AppManager) => {
  /**
   * If an app is closing, remove all global event listeners
   * and unregister them from the app's runtime.
   * If an app is being suspended, remove the listeners and
   * don't unregister them from the app's runtime
   */
  AppManager.unbindGlobalEvents = ({ runtime }) => {
    getCollectedEvents({ runtime }).forEach(([node, eventType, fn]) => {
      node.removeEventListener(eventType, fn);
      if (__DEBUG_LVL__ >= 2) {
        if (runtime.suspended == null) {
          log('Removing collected DOM event listener: ');
        } else {
          log('Suspending collected DOM event listener: ');
        }
        console.log([node, eventType, fn]);
      }
    });
  };

  /** Re-bind the suspended event listeners from a app being resumed */
  AppManager.resumeGlobalEvents = ({ runtime }) => {
    if (!runtime.suspended) {
      throw new Error('Trying to resume global events of a non-suspended app');
    }

    getCollectedEvents({ runtime }).forEach(([node, eventType, fn]) => {
      node.addEventListener(eventType, fn);
      if (__DEBUG_LVL__ >= 2) {
        log('Resuming suspended DOM event listener: ');
        console.log([node, eventType, fn]);
      }
    });
  };

  /** Same as 'unbindGlobalEvents' */
  AppManager.suspendGlobalEvents = ({ runtime }) => {
    if (!runtime.suspended) {
      throw new Error("Trying to suspend global events for an app that's not suspended");
    }
    AppManager.unbindGlobalEvents({ runtime });
  };

  /**
   * Overrides of native 'addEventListener' and
   * 'removeEventListener' to capture and keep a register of event listeners.
   * */
  eventTarget.prototype.addEventListener = function addEventListener(type, fn, capture) {
    originalAddEventListener.call(this, type, fn, capture);

    const currentApp = AppManager.getCurrentApp();

    /** Only collect events if there's an app running */
    if (currentApp && currentApp.runtime) {
      collectEvent(currentApp, [this, type, fn]);
    }
  };

  eventTarget.prototype.removeEventListener = function addEventListener(type, fn) {
    originalRemoveEventListener.call(this, type, fn);

    const currentApp = AppManager.getCurrentApp();

    /** Only remove collected events if an app is opened */
    if (
      currentApp &&
      currentApp.runtime &&
      /** Only remove the saved event reference if the app is closed and not suspended */
      currentApp.runtime.suspended == null
    ) {
      removeCollectedEvent(currentApp, [this, type, fn]);
    }
  };
};
