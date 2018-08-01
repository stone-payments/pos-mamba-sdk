class SignalHandler {
  constructor(namespace) {
    this.signals = {};
    this.namespace = namespace;
  }

  /** Connect a callback to a slot */
  on(signal, callback) {
    if (typeof callback === 'function') {
      if (!this.signals[signal]) {
        this.signals[signal] = [];
      }
      this.signals[signal].push(callback);
      this.namespace[signal].connect(callback);
    }
    return this;
  }

  isSlotFilled(signal, callback) {
    const callbackList = this.signals[signal];
    return (
      callbackList && callbackList.length && callbackList.indexOf(callback) > -1
    );
  }

  /** Disconnect a callback from a slot */
  off(signal, callback) {
    /** If no callback passed, disconnect all slots from the signal */
    if (typeof callback === 'undefined') {
      this.signals[signal].forEach((slotCallback) => {
        this.namespace[signal].disconnect(slotCallback);
      });
      this.signals[signal] = [];
    } else {
      const slotIndex = this.signals[signal].indexOf(callback);

      if (slotIndex > -1) {
        this.namespace[signal].disconnect(this.signals[signal][slotIndex]);
        this.signals[signal].splice(slotIndex, 1);
      } else if (process.env.NODE_ENV === 'development') {
        console.warn(
          '[SignalHandler] Tried to disconnect a non-connected callback.',
        );
      }
    }
    return this;
  }

  /** Allow only a unique callback on a specific slot */
  unique(signal, callback) {
    if (this.isSlotFilled(signal, callback)) {
      this.off(signal, callback);
    }
    return this.on(signal, callback);
  }

  /** Execute once a callback when the signal is dispatched and disconnect from it */
  once(signal, callback) {
    return this.race([[signal, callback]]);
  }

  /** The first signal dispatched is executed and automatically cancel all others */
  race(entries) {
    const wrappedCallbacks = {};
    entries.forEach(([signal, callback]) => {
      console.log(`Connecting once '${signal}'`);

      /** If the signal's slot is already filled with a callback, disconnect it */
      if (this.isSlotFilled(signal, callback)) {
        this.off(signal, callback);
      }

      /** Wrap the signal callback to disconnect all slots once one of the signals are emitted */
      wrappedCallbacks[signal] = () => {
        callback();
        Object.keys(wrappedCallbacks).forEach((signalName) => {
          console.log(`Removing '${signalName}'`);
          this.off(signalName, wrappedCallbacks[signalName]);
        });
      };

      /** Listen to the signal emission */
      this.on(signal, wrappedCallbacks[signal]);
    });

    return this;
  }

  destroy() {
    Object.keys(this.signals).forEach((signal) => {
      console.log(`Disconnecting all slots from '${signal}'`);
      this.off(signal);
    });
  }
}

export default function (signal) {
  return new SignalHandler(signal);
}
