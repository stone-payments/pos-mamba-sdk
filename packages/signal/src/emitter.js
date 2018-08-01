import Signal from './index.js';

function pickProbableSignal(signals) {
  const winner = Math.random();
  for (let i = 0, threshold = 0; i < signals.length; i++) {
    const [, signalProbability] = signals[i];
    threshold += parseFloat(signalProbability);
    if (threshold > winner) {
      return signals[i];
    }
  }
  return null;
}

export default function emitterFactory(
  namespace,
  execFn = undefined,
  timeout = 1500,
) {
  function SignalEmitter(...args) {
    /** Execute the emitter actual code, if there's any */
    if (typeof execFn === 'function') execFn(...args);

    /** If there's no signals to emit, do nothing */
    if (SignalEmitter.signals.length === 0) return;

    if (typeof SignalEmitter.onBefore === 'function') {
      SignalEmitter.onBefore(...args);
    }

    setTimeout(() => {
      const [signal, , transformer] = pickProbableSignal(SignalEmitter.signals);
      console.log(`Picked signal: ${signal}`);

      namespace[signal]();

      if (typeof transformer === 'function') {
        transformer(...args);
      }

      if (typeof SignalEmitter.onAfter === 'function') {
        SignalEmitter.onAfter(...args);
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
  SignalEmitter.add = function add(
    signalName,
    probability = 1,
    transformer = undefined,
  ) {
    if (SignalEmitter.signals.indexOf(signalName) < 0) {
      SignalEmitter.signals.push([signalName, probability, transformer]);
      namespace[signalName] = Signal();
    }
    return SignalEmitter;
  };

  return SignalEmitter;
}
