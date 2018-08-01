'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function signalFactory() {
  var slots = [];

  function Signal() {
    slots.forEach(function (slot) {
      return slot();
    });
  }

  Signal.connect = function (callback) {
    return slots.push(callback);
  };

  Signal.disconnect = function (callback) {
    var callbackIndex = slots.indexOf(callback);
    if (callbackIndex < 0) return;
    slots.splice(callbackIndex, 1);
  };

  return Signal;
}

exports.default = signalFactory;
