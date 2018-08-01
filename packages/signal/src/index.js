export default function signalFactory() {
  const slots = [];

  function Signal() {
    slots.forEach(slot => slot());
  }

  Signal.connect = callback => slots.push(callback);
  Signal.disconnect = (callback) => {
    const callbackIndex = slots.indexOf(callback);
    if (callbackIndex < 0) return;
    slots.splice(callbackIndex, 1);
  };

  return Signal;
}
