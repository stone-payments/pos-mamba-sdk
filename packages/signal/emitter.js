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

function pickProbableSignal(signals) {
  var winner = Math.random();

  for (var i = 0, threshold = 0; i < signals.length; i++) {
    var _signals$i = signals[i],
        signalProbability = _signals$i[1];
    threshold += parseFloat(signalProbability);

    if (threshold > winner) {
      return signals[i];
    }
  }

  return null;
}

function emitterFactory(namespace, timeout) {
  if (timeout === void 0) {
    timeout = 1500;
  }

  function SignalEmitter() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    /** If there's no signals to emit, do nothing */
    if (SignalEmitter.signals.length === 0) return;

    if (typeof SignalEmitter.onBefore === 'function') {
      SignalEmitter.onBefore.apply(SignalEmitter, args);
    }

    setTimeout(function () {
      var _pickProbableSignal = pickProbableSignal(SignalEmitter.signals),
          signal = _pickProbableSignal[0],
          transformer = _pickProbableSignal[2];

      console.log("Picked signal: " + signal);
      namespace[signal]();

      if (typeof transformer === 'function') {
        transformer.apply(void 0, args);
      }

      if (typeof SignalEmitter.onAfter === 'function') {
        SignalEmitter.onAfter.apply(SignalEmitter, args);
      }
    }, timeout);
  }

  SignalEmitter.signals = [];

  SignalEmitter.before = function onBefore(callback) {
    SignalEmitter.onBefore = callback;
    return SignalEmitter;
  };

  SignalEmitter.after = function onAfter(callback) {
    SignalEmitter.onAfter = callback;
    return SignalEmitter;
  };

  SignalEmitter.add = function add(signalName, probability, transformer) {
    if (probability === void 0) {
      probability = 1;
    }

    if (transformer === void 0) {
      transformer = undefined;
    }

    if (SignalEmitter.signals.indexOf(signalName) < 0) {
      SignalEmitter.signals.push([signalName, probability, transformer]);
      namespace[signalName] = signalFactory();
    }

    return SignalEmitter;
  };

  return SignalEmitter;
}

exports.default = emitterFactory;
