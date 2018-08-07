export default function Signal() {
  const slots = [];

  function signal(...args) {
    slots.forEach(slot => slot(...args));
  }

  signal.connect = callback => slots.push(callback);
  signal.disconnect = callback => {
    const callbackIndex = slots.indexOf(callback);
    if (callbackIndex >= 0) {
      slots.splice(callbackIndex, 1);
    }
  };

  return signal;
}

Signal.register = (namespace, signals) => {
  if (!Array.isArray(signals)) {
    namespace[signals] = Signal();
  } else {
    signals.forEach(signalName => {
      namespace[signalName] = Signal();
    });
  }
};
