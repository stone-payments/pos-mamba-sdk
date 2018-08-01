'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var SignalHandler =
/*#__PURE__*/
function () {
  function SignalHandler(namespace) {
    this.signals = {};
    this.namespace = namespace;
  }
  /** Connect a callback to a slot */


  var _proto = SignalHandler.prototype;

  _proto.on = function on(signal, callback) {
    if (typeof callback === 'function') {
      if (!this.signals[signal]) {
        this.signals[signal] = [];
      }

      this.signals[signal].push(callback);
      this.namespace[signal].connect(callback);
    }

    return this;
  };

  _proto.isSlotFilled = function isSlotFilled(signal, callback) {
    var callbackList = this.signals[signal];
    return callbackList && callbackList.length && callbackList.indexOf(callback) > -1;
  };
  /** Disconnect a callback from a slot */


  _proto.off = function off(signal, callback) {
    var _this = this;

    try {
      /** If no callback passed, disconnect all slots from the signal */
      if (typeof callback === 'undefined') {
        this.signals[signal].forEach(function (slotCallback) {
          _this.namespace[signal].disconnect(slotCallback);
        });
        this.signals[signal] = [];
      } else {
        var slotIndex = this.signals[signal].indexOf(callback);

        if (slotIndex > -1) {
          this.namespace[signal].disconnect(this.signals[signal][slotIndex]);
          this.signals[signal].splice(slotIndex, 1);
        } else if (process.env.NODE_ENV === 'development') {
          console.warn('[SignalHandler] Tried to disconnect a non-connected callback.');
        }
      }
    } catch (e) {
      console.error(e);
    }

    return this;
  };
  /** Allow only a unique callback on a specific slot */


  _proto.unique = function unique(signal, callback) {
    if (this.isSlotFilled(signal, callback)) {
      this.off(signal, callback);
    }

    return this.on(signal, callback);
  };
  /** Execute once a callback when the signal is dispatched and disconnect from it */


  _proto.once = function once(signal, callback) {
    return this.race([[signal, callback]]);
  };
  /** The first signal dispatched is executed and automatically cancel all others */


  _proto.race = function race(entries) {
    var _this2 = this;

    var wrappedCallbacks = {};
    entries.forEach(function (_ref) {
      var signal = _ref[0],
          callback = _ref[1];
      console.log("Connecting once '" + signal + "'");
      /** If the signal's slot is already filled with a callback, disconnect it */

      if (_this2.isSlotFilled(signal, callback)) {
        _this2.off(signal, callback);
      }
      /** Wrap the signal callback to disconnect all slots once one of the signals are emitted */


      wrappedCallbacks[signal] = function () {
        callback();
        Object.keys(wrappedCallbacks).forEach(function (signalName) {
          console.log("Removing '" + signalName + "'");

          _this2.off(signalName, wrappedCallbacks[signalName]);
        });
      };
      /** Listen to the signal emission */


      _this2.on(signal, wrappedCallbacks[signal]);
    });
    return this;
  };

  _proto.destroy = function destroy() {
    var _this3 = this;

    Object.keys(this.signals).forEach(function (signal) {
      console.log("Disconnecting all slots from '" + signal + "'");

      _this3.off(signal);
    });
  };

  return SignalHandler;
}();

function handler (signal) {
  return new SignalHandler(signal);
}

exports.default = handler;
