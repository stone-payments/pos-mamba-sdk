/**
 * This file is a simulation of the QT Signal & Slot
 * */

import { AppManager } from '../index.js';

const getSlotsGroup = () => {
  const currentApp = AppManager.getCurrentApp();
  return currentApp ? currentApp.manifest.slug : 'default';
};

const isSlotGroupSuspended = () => {
  const currentApp = AppManager.getCurrentApp();
  return currentApp ? !!currentApp.runtime.suspended : false;
};

export default function Signal() {
  /** map of appSlug -> calback list */
  const slots = {};

  /**
   * When an app closes, remove it's connected signal slots
   * This logic should not be here but it'd be cumbersome to put it elsewhere for now.
   */
  AppManager.on('closed', (app) => {
    if (slots[app.manifest.slug]) {
      delete slots[app.manifest.slug];
    }
  });

  function signal(...args) {
    const groupName = getSlotsGroup();
    if (slots.default) {
      slots.default.forEach((slot) => slot(...args));
    }

    if (groupName !== 'default' && slots[groupName] && !isSlotGroupSuspended()) {
      slots[groupName].forEach((slot) => slot(...args));
    }
  }

  signal.connect = (callback) => {
    const groupName = getSlotsGroup();

    if (!slots[groupName]) {
      slots[groupName] = [];
    }

    slots[groupName].push(callback);
  };

  signal.disconnect = (callback) => {
    const groupName = getSlotsGroup();

    const callbackIndex = slots[groupName].indexOf(callback);

    if (callbackIndex >= 0) {
      slots[groupName].splice(callbackIndex, 1);

      if (slots[groupName].length === 0) {
        delete slots[groupName];
      }
    }
  };

  return signal;
}

Signal.register = (namespace, signals) => {
  if (!Array.isArray(signals)) {
    namespace[signals] = Signal();
  } else {
    signals.forEach((signalName) => {
      namespace[signalName] = Signal();
    });
  }
};
