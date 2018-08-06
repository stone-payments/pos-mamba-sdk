export default {
  _listening: {},

  /** Connect a callback to a slot */
  on(signal, callback) {
    if (typeof callback === 'function') {
      if (!this._listening[signal]) {
        this._listening[signal] = [];
      }
      this._listening[signal].push(callback);
      this[signal].connect(callback);
    }
    return this;
  },

  isSlotFilled(signal, callback) {
    const callbackList = this._listening[signal];
    return (
      callbackList && callbackList.length && callbackList.indexOf(callback) > -1
    );
  },

  /** Disconnect a callback from a slot */
  off(signal, callback) {
    /** If no callback passed, disconnect all slots from the signal */
    if (typeof callback === 'undefined') {
      this._listening[signal].forEach(slotCallback => {
        this[signal].disconnect(slotCallback);
      });
      this._listening[signal] = [];
    } else {
      const slotIndex = this._listening[signal].indexOf(callback);

      if (slotIndex > -1) {
        this[signal].disconnect(this._listening[signal][slotIndex]);
        this._listening[signal].splice(slotIndex, 1);
      } else if (__DEBUG__) {
        console.warn(
          '[@mambasdk/pos/driver] Tried to disconnect a non-connected slot.',
        );
      }
    }
    return this;
  },

  /** Allow only a unique callback on a specific slot */
  unique(signal, callback) {
    if (this.isSlotFilled(signal, callback)) {
      this.off(signal, callback);
    }
    return this.on(signal, callback);
  },

  /** Execute once a callback when the signal is dispatched and disconnect from it */
  once(signal, callback) {
    return this.race([[signal, callback]]);
  },

  /** The first signal dispatched is executed and automatically cancel all others */
  race(entries) {
    const wrappedCallbacks = {};
    entries.forEach(([signal, callback]) => {
      if (__DEBUG__) {
        console.log(`Connecting once '${signal}'`);
      }

      /** If the signal's slot is already filled with a callback, disconnect it */
      if (this.isSlotFilled(signal, callback)) {
        this.off(signal, callback);
      }

      /** Wrap the signal callback to disconnect all slots once one of the signals are emitted */
      wrappedCallbacks[signal] = () => {
        callback();
        Object.keys(wrappedCallbacks).forEach(signalName => {
          if (__DEBUG__) {
            console.log(`Removing '${signalName}'`);
          }
          this.off(signalName, wrappedCallbacks[signalName]);
        });
      };

      /** Listen to the signal emission */
      this.on(signal, wrappedCallbacks[signal]);
    });

    return this;
  },

  destroy() {
    Object.keys(this._listening).forEach(signal => {
      if (__DEBUG__) {
        console.log(`Disconnecting all slots from '${signal}'`);
      }
      this.off(signal);
    });
  },
};
